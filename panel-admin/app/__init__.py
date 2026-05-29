from flask import Flask, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

from app.config import Config

db = SQLAlchemy()
migrate = Migrate()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, supports_credentials=True)

    from app.routes import bp as main_bp
    app.register_blueprint(main_bp, url_prefix="/admin")

    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    @app.route("/")
    def root_redirect():
        from flask import session as flask_session
        if 'user_id' in flask_session:
            return redirect(url_for("main.index"))
        return redirect("/")

    return app
