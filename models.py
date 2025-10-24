from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamento com produtos (se admin)
    produtos = db.relationship('Product', backref='admin', lazy=True, cascade='all, delete-orphan')
    
    def set_senha(self, senha):
        """Gera hash da senha"""
        self.senha_hash = generate_password_hash(senha)
    
    def check_senha(self, senha):
        """Verifica se a senha está correta"""
        return check_password_hash(self.senha_hash, senha)
    
    def __repr__(self):
        return f'<User {self.email}>'


class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    preco = db.Column(db.Float, nullable=False)
    imagem_path = db.Column(db.String(255), nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    estado = db.Column(db.String(50), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='disponivel')  # disponivel ou vendido
    data_publicacao = db.Column(db.DateTime, default=datetime.utcnow)
    admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def eh_novo(self):
        """Produto tem menos de 7 dias (badge NOVO)"""
        dias = (datetime.utcnow() - self.data_publicacao).days
        return dias < 7
    
    def __repr__(self):
        return f'<Product {self.nome}>'