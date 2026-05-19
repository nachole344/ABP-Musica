from app import create_app, db
from dotenv import load_dotenv
load_dotenv()
app = create_app()

@app.cli.command("init-db")
def init_db():
    with app.app_context():
        from app import models
        db.create_all()
    print("Tables created successfully!")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
