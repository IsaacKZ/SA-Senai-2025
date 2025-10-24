from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename
from functools import wraps
import os

from config import Config
from models import db, User, Product

app = Flask(__name__)
app.config.from_object(Config)

# Inicializar extensões
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Faça login para acessar esta página.'

# Criar pasta de uploads se não existir
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# User loader para Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Decorator para rotas admin
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            flash('Acesso negado. Apenas administradores.', 'error')
            return redirect(url_for('inicial'))
        return f(*args, **kwargs)
    return decorated_function

# Helper para validar upload
def arquivo_permitido(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


# ========== ROTAS PÚBLICAS ==========

@app.route('/')
def inicial():
    return render_template('inicial.html')


@app.route('/produtos')
def produtos():
    # Busca e filtros
    busca = request.args.get('busca', '').strip()
    categoria = request.args.get('categoria', '').strip()
    estado = request.args.get('estado', '').strip()
    
    # Query base (apenas disponíveis)
    query = Product.query.filter_by(status='disponivel')
    
    # Aplicar filtros
    if busca:
        query = query.filter(Product.nome.ilike(f'%{busca}%'))
    if categoria:
        query = query.filter_by(categoria=categoria)
    if estado:
        query = query.filter_by(estado=estado)
    
    # Ordenar por mais recente
    produtos = query.order_by(Product.data_publicacao.desc()).all()
    
    return render_template('produtos.html', produtos=produtos)


@app.route('/produto/<int:id>')
def produto_detalhes(id):
    produto = Product.query.get_or_404(id)
    return render_template('produto_detalhes.html', produto=produto)


# ========== AUTENTICAÇÃO ==========

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('perfil'))
    
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        senha = request.form.get('senha', '')
        
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_senha(senha):
            login_user(user)
            flash(f'Bem-vindo, {user.nome}!', 'success')
            
            # Redirecionar admin para painel
            next_page = request.args.get('next')
            if user.is_admin:
                return redirect(next_page or url_for('admin'))
            return redirect(next_page or url_for('produtos'))
        else:
            flash('Email ou senha incorretos.', 'error')
    
    return render_template('login.html')


@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if current_user.is_authenticated:
        return redirect(url_for('perfil'))
    
    if request.method == 'POST':
        nome = request.form.get('nome', '').strip()
        email = request.form.get('email', '').strip().lower()
        senha = request.form.get('senha', '')
        
        # Validações
        if not nome or not email or not senha:
            flash('Preencha todos os campos.', 'error')
            return render_template('cadastro.html')
        
        if User.query.filter_by(email=email).first():
            flash('Email já cadastrado.', 'error')
            return render_template('cadastro.html')
        
        if len(senha) < 8:
            flash('A senha deve ter no mínimo 8 caracteres.', 'error')
            return render_template('cadastro.html')
        
        # Criar usuário
        novo_user = User(nome=nome, email=email)
        novo_user.set_senha(senha)
        
        db.session.add(novo_user)
        db.session.commit()
        
        flash('Conta criada com sucesso! Faça login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('cadastro.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Você saiu da sua conta.', 'info')
    return redirect(url_for('inicial'))


# ========== PERFIL ==========

@app.route('/perfil', methods=['GET', 'POST'])
@login_required
def perfil():
    if request.method == 'POST':
        acao = request.form.get('acao')
        
        if acao == 'editar_nome':
            novo_nome = request.form.get('nome', '').strip()
            if novo_nome:
                current_user.nome = novo_nome
                db.session.commit()
                flash('Nome atualizado!', 'success')
            else:
                flash('Nome não pode ser vazio.', 'error')
        
        elif acao == 'trocar_senha':
            senha_atual = request.form.get('senha_atual', '')
            nova_senha = request.form.get('nova_senha', '')
            
            if not current_user.check_senha(senha_atual):
                flash('Senha atual incorreta.', 'error')
            elif len(nova_senha) < 8:
                flash('Nova senha deve ter no mínimo 8 caracteres.', 'error')
            else:
                current_user.set_senha(nova_senha)
                db.session.commit()
                flash('Senha alterada com sucesso!', 'success')
        
        elif acao == 'excluir_conta':
            db.session.delete(current_user)
            db.session.commit()
            logout_user()
            flash('Conta excluída permanentemente.', 'info')
            return redirect(url_for('inicial'))
    
    return render_template('perfil.html')


# ========== ADMIN ==========

@app.route('/admin', methods=['GET', 'POST'])
@admin_required
def admin():
    if request.method == 'POST':
        # Receber dados do form
        nome = request.form.get('nome', '').strip()
        preco = request.form.get('preco', '').strip()
        categoria = request.form.get('categoria', '').strip()
        estado = request.form.get('estado', '').strip()
        descricao = request.form.get('descricao', '').strip()
        imagem = request.files.get('imagem')
        
        # Validações
        if not all([nome, preco, categoria, estado, descricao, imagem]):
            flash('Preencha todos os campos e selecione uma imagem.', 'error')
            return render_template('admin.html')
        
        try:
            preco_float = float(preco)
            if preco_float <= 0:
                raise ValueError
        except ValueError:
            flash('Preço inválido.', 'error')
            return render_template('admin.html')
        
        if not arquivo_permitido(imagem.filename):
            flash('Formato de imagem inválido. Use PNG, JPG ou WEBP.', 'error')
            return render_template('admin.html')
        
        # Salvar imagem
        filename = secure_filename(imagem.filename)
        # Adicionar timestamp para evitar duplicatas
        from datetime import datetime
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        imagem.save(filepath)
        
        # Criar produto
        novo_produto = Product(
            nome=nome,
            preco=preco_float,
            imagem_path=f'uploads/{filename}',
            categoria=categoria,
            estado=estado,
            descricao=descricao,
            admin_id=current_user.id
        )
        
        db.session.add(novo_produto)
        db.session.commit()
        
        flash('Produto adicionado com sucesso!', 'success')
        return redirect(url_for('admin_produtos'))
    
    return render_template('admin.html')


@app.route('/admin/produtos')
@admin_required
def admin_produtos():
    # Filtros
    categoria = request.args.get('categoria', '').strip()
    estado = request.args.get('estado', '').strip()
    status = request.args.get('status', '').strip()
    
    # Query produtos do admin
    query = Product.query.filter_by(admin_id=current_user.id)
    
    if categoria:
        query = query.filter_by(categoria=categoria)
    if estado:
        query = query.filter_by(estado=estado)
    if status:
        query = query.filter_by(status=status)
    
    produtos = query.order_by(Product.data_publicacao.desc()).all()
    
    return render_template('admin_produtos.html', produtos=produtos)


@app.route('/admin/produto/<int:id>/editar', methods=['POST'])
@admin_required
def editar_produto(id):
    produto = Product.query.get_or_404(id)
    
    # Verificar se é produto do admin
    if produto.admin_id != current_user.id:
        flash('Você não pode editar este produto.', 'error')
        return redirect(url_for('admin_produtos'))
    
    # Atualizar campos
    produto.nome = request.form.get('nome', '').strip()
    preco_str = request.form.get('preco', '').strip()
    produto.categoria = request.form.get('categoria', '').strip()
    produto.estado = request.form.get('estado', '').strip()
    produto.descricao = request.form.get('descricao', '').strip()
    
    try:
        produto.preco = float(preco_str)
    except ValueError:
        flash('Preço inválido.', 'error')
        return redirect(url_for('admin_produtos'))
    
    # Se houver nova imagem
    nova_imagem = request.files.get('imagem')
    if nova_imagem and arquivo_permitido(nova_imagem.filename):
        # Deletar imagem antiga
        imagem_antiga = os.path.join(app.config['BASE_DIR'], 'static', produto.imagem_path)
        if os.path.exists(imagem_antiga):
            os.remove(imagem_antiga)
        
        # Salvar nova
        from datetime import datetime
        filename = secure_filename(nova_imagem.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        nova_imagem.save(filepath)
        produto.imagem_path = f'uploads/{filename}'
    
    db.session.commit()
    flash('Produto atualizado!', 'success')
    return redirect(url_for('admin_produtos'))


@app.route('/admin/produto/<int:id>/vendido', methods=['POST'])
@admin_required
def marcar_vendido(id):
    produto = Product.query.get_or_404(id)
    
    if produto.admin_id != current_user.id:
        flash('Você não pode alterar este produto.', 'error')
        return redirect(url_for('admin_produtos'))
    
    produto.status = 'vendido' if produto.status == 'disponivel' else 'disponivel'
    db.session.commit()
    
    status_texto = 'vendido' if produto.status == 'vendido' else 'disponível'
    flash(f'Produto marcado como {status_texto}!', 'success')
    return redirect(url_for('admin_produtos'))


@app.route('/admin/produto/<int:id>/excluir', methods=['POST'])
@admin_required
def excluir_produto(id):
    produto = Product.query.get_or_404(id)
    
    if produto.admin_id != current_user.id:
        flash('Você não pode excluir este produto.', 'error')
        return redirect(url_for('admin_produtos'))
    
    # Deletar imagem
    imagem_path = os.path.join(app.config['BASE_DIR'], 'static', produto.imagem_path)
    if os.path.exists(imagem_path):
        os.remove(imagem_path)
    
    db.session.delete(produto)
    db.session.commit()
    
    flash('Produto excluído permanentemente!', 'success')
    return redirect(url_for('admin_produtos'))


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Criar tabelas automaticamente
        print("✅ Banco de dados criado!")
    
    app.run(debug=True)