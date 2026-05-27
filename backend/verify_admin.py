from app import create_app, db
from app.models.user import User

def setup_admin():
    app = create_app()
    with app.app_context():
        # Crear un usuario admin para pruebas si no existe
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(username='admin', password='admin123', role='admin')
            db.session.add(admin)
            db.session.commit()
            print("Usuario 'admin' creado con éxito (password: admin123)")
        else:
            admin.role = 'admin'
            db.session.commit()
            print("Usuario 'admin' ya existía, se ha asegurado que sea administrador.")

if __name__ == "__main__":
    setup_admin()
