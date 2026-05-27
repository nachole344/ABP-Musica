from flask import Blueprint, request, jsonify, session
from ..models.user import User
from ..init import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Faltan credenciales"}), 400

    user = User.query.filter_by(username=username).first()

    if user and user.password == password:
        session['user_id'] = user.user_id
        session['username'] = user.username
        session['role'] = user.role
        return jsonify({"message": "Login exitoso", "user": user.to_dict()}), 200

    return jsonify({"error": "Credenciales inválidas"}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({"error": "Faltan credenciales"}), 400
    if len(username) > 50 or len(password) > 50:
        return jsonify({"error": "Usuario o contraseña demasiado largos"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "El nombre de usuario ya existe"}), 409

    user = User(username=username, password=password, role='user')
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Registro exitoso", "user": user.to_dict()}), 201

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logout exitoso"}), 200

@auth_bp.route('/check', methods=['GET'])
def check():
    if 'user_id' in session:
        return jsonify({
            "logged_in": True,
            "user": {"username": session['username'], "role": session.get('role', 'user')}
        }), 200
    return jsonify({"logged_in": False}), 200
