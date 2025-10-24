import os

class Config:
    # Caminho do banco de dados
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(BASE_DIR, "desapego.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Chave secreta para sessões (gere uma aleatória em produção)
    SECRET_KEY = 'sua-chave-secreta-super-segura-mude-em-producao'
    
    # Upload de imagens
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}