from flask import Blueprint, request, jsonify, session
from ..models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Faltan credenciales"}), 400

    user = User.query.filter_by(username=username).first()

    if user and user.password == password: # Nota: En producción usar hashing (werkzeug.security)
        session['user_id'] = user.user_id
        session['username'] = user.username
        session['is_admin'] = user.is_admin
        return jsonify({"message": "Login exitoso", "user": user.to_dict()}), 200
    
    return jsonify({"error": "Credenciales inválidas"}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logout exitoso"}), 200

@auth_bp.route('/check', methods=['GET'])
def check():
    if 'user_id' in session:
        return jsonify({"logged_in": True, "user": {"username": session['username']}}), 200
    return jsonify({"logged_in": False}), 200
