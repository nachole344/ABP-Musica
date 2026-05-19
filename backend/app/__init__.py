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
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://user:password@localhost:5432/artists_db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    CORS(app)
    
    # Register blueprints
    from .routes.artists import artists_bp
    from .routes.shop import shop_bp
    from .routes.events import events_bp
    
    app.register_blueprint(artists_bp, url_prefix='/api/artists')
    app.register_blueprint(shop_bp, url_prefix='/api/shop')
    app.register_blueprint(events_bp, url_prefix='/api/events')
    
    return app
