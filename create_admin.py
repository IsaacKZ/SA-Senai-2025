from app import app, db
from models import User

with app.app_context():
    # Verificar se já existe admin
    admin = User.query.filter_by(email='admin@desapego.com').first()
    
    if not admin:
        admin = User(
            nome='Administrador',
            email='admin@desapego.com',
            is_admin=True
        )
        admin.set_senha('admin123')  # MUDE ISSO EM PRODUÇÃO!
        
        db.session.add(admin)
        db.session.commit()
        
        print("✅ Admin criado!")
        print("Email: admin@desapego.com")
        print("Senha: admin123")
    else:
        print("⚠️ Admin já existe!")