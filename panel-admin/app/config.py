import os
from dotenv import load_dotenv

# Intentar cargar desde el .env del backend si existe
load_dotenv(os.path.join(os.path.dirname(__file__), '../../backend/.env'))

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-123")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "postgresql://nunu:nunu123@postgres:5432/musicdb",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
