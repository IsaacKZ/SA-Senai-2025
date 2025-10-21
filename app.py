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

if __name__ == '__main__':
    app.run(debug=True)