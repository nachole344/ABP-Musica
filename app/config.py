import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "nuria-secret-key")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "postgresql://nunu:nunu123@localhost:5432/musicdb",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
