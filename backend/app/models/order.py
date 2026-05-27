from sqlalchemy.dialects.postgresql import ENUM
from ..init import db

order_status_enum = ENUM(
    'pending', 'paid', 'shipped', 'delivered', 'cancelled',
    name='order_status_enum', create_type=False
)

class Order(db.Model):
    __tablename__ = 'orders'

    order_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_date = db.Column(db.Date, nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(order_status_enum, nullable=False, default='pending')

    items = db.relationship('OrderItem', backref='order', lazy=True)

    def to_dict(self):
        return {
            "order_id": self.order_id,
            "order_date": self.order_date.isoformat() if self.order_date else None,
            "total_price": float(self.total_price),
            "status": self.status,
        }
