from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

from .init import db
# Import models to register them with SQLAlchemy
from . import models 

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://nunu:nunu123@postgres:5432/musicdb')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-123')
    
    db.init_app(app)
    CORS(app, supports_credentials=True)
    
    # Register blueprints
    from .routes.artists import artists_bp
    from .routes.shop import shop_bp
    from .routes.events import events_bp
    from .routes.auth import auth_bp
    from .routes.orders import orders_bp

    app.register_blueprint(artists_bp, url_prefix='/api/artists')
    app.register_blueprint(shop_bp, url_prefix='/api/shop')
    app.register_blueprint(events_bp, url_prefix='/api/events')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    
    return app
