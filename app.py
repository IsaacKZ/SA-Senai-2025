from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def landing():
    return render_template('inicial.html')

@app.route('/produtos')
def produtos():
    return render_template('produtos.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template("login.html")

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    return render_template("cadastro.html")

@app.route('/produto/<int:id>')
def produto_detalhes(id):
    # Por enquanto, produto fake
    produto_exemplo = {
        'id': id,
        'nome': 'iPhone 13 Pro Max',
        'preco': 3500.00,
        'imagem': '/static/produto-exemplo.jpg',
        'categoria': 'Eletrônicos',
        'estado': 'Seminovo',
        'descricao': 'iPhone 13 Pro Max em excelente estado, apenas 6 meses de uso. Sem arranhões na tela, bateria com 98% de capacidade. Acompanha carregador original e capinha. Motivo da venda: upgrade para novo modelo.'
    }
    return render_template('produto_detalhes.html', produto=produto_exemplo)

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    return render_template("admin.html")

@app.route('/admin/produtos')
def admin_produtos():
    # Por enquanto, produtos fake (depois vem do banco)
    produtos_exemplo = [
        {
            'id': 1,
            'nome': 'iPhone 13 Pro Max',
            'preco': 3500.00,
            'categoria': 'Eletrônicos',
            'estado': 'Seminovo',
            'status': 'disponivel',  # disponivel ou vendido
            'data': '20/10/2025'
        },
        {
            'id': 2,
            'nome': 'Notebook Dell',
            'preco': 2200.00,
            'categoria': 'Eletrônicos',
            'estado': 'Usado',
            'status': 'disponivel',
            'data': '19/10/2025'
        },
        {
            'id': 3,
            'nome': 'Camiseta Nike',
            'preco': 80.00,
            'categoria': 'Roupas',
            'estado': 'Novo',
            'status': 'vendido',
            'data': '18/10/2025'
        }
    ]
    return render_template('admin_produtos.html', produtos=produtos_exemplo)

@app.route('/perfil')
def perfil():
    # Por enquanto, usuário fake (depois vem da sessão/banco)
    usuario_exemplo = {
        'nome': 'João Silva',
        'email': 'joao@email.com',
        'data_cadastro': '15/10/2025'
    }
    return render_template('perfil.html', usuario=usuario_exemplo)

if __name__ == '__main__':
    app.run(debug=True)