from sqlalchemy.dialects.postgresql import ENUM
from ..init import db

product_type_enum = ENUM(
    'album', 'vinyl', 'clothing', 'tote_bag', 'pin',
    name='product_type_enum', create_type=False
)

class Product(db.Model):
    __tablename__ = 'products'
    
    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.artist_id', ondelete='CASCADE'), nullable=True)
    product_name = db.Column(db.String(250), nullable=False, unique=True)
    product_type = db.Column(product_type_enum, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.Text, nullable=False, unique=True)

    def to_dict(self):
        return {
            "product_id": self.product_id,
            "artist_id": self.artist_id,
            "product_name": self.product_name,
            "product_type": self.product_type,
            "price": float(self.price),
            "stock": self.stock,
            "image_url": self.image_url
        }
