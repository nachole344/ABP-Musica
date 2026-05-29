from datetime import date
from flask import Blueprint, request, jsonify, session
from ..init import db
from ..models.product import Product

orders_bp = Blueprint('orders', __name__)

# Lazy imports to avoid circular imports at module load time
def _get_models():
    from ..models.order import Order
    from ..models.order_item import OrderItem
    return Order, OrderItem


@orders_bp.route('/', methods=['GET'])
def get_orders():
    if 'user_id' not in session:
        return jsonify({"error": "No autenticado"}), 401
    Order, _ = _get_models()
    orders = Order.query.filter_by(user_id=session['user_id']).order_by(Order.order_date.desc()).all()
    return jsonify([o.to_dict() for o in orders]), 200


@orders_bp.route('/items/', methods=['GET'])
def get_order_items():
    _, OrderItem = _get_models()
    items = OrderItem.query.all()
    return jsonify([i.to_dict() for i in items]), 200


@orders_bp.route('/', methods=['POST'])
def create_order():
    if 'user_id' not in session:
        return jsonify({"error": "No autenticado"}), 401
    Order, OrderItem = _get_models()
    data = request.get_json()
    items = data.get('items', [])

    if not items:
        return jsonify({"error": "El pedido no tiene productos"}), 400

    total = 0.0
    validated = []
    for item in items:
        product = Product.query.get(item.get('product_id'))
        if not product:
            return jsonify({"error": f"Producto {item.get('product_id')} no encontrado"}), 404
        qty = int(item.get('quantity', 1))
        if qty < 1:
            return jsonify({"error": "Cantidad inválida"}), 400
        if product.stock < qty:
            return jsonify({"error": f"Stock insuficiente para '{product.product_name}'"}), 409
        total += float(product.price) * qty
        validated.append((product, qty))

    order = Order(order_date=date.today(), total_price=total, status='pending', user_id=session['user_id'])
    db.session.add(order)
    db.session.flush()

    for product, qty in validated:
        order_item = OrderItem(
            order_id=order.order_id,
            product_id=product.product_id,
            quantity=qty,
            price=product.price,
        )
        db.session.add(order_item)
        product.stock -= qty

    db.session.commit()
    return jsonify({"message": "Pedido creado", "order_id": order.order_id, "total": total}), 201
