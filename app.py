from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])  # ← CORRIGIDO
def login():
    return render_template("login.html")

@app.route('/cadastro', methods=['GET', 'POST'])  # ← NOVA ROTA
def cadastro():
    return render_template("cadastro.html")

if __name__ == '__main__':
    app.run(debug=True)