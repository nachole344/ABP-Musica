from flask import Blueprint, jsonify, request

artists_bp = Blueprint('artists', __name__)

@artists_bp.route('/', methods=['GET'])
def get_artists():
    return jsonify({"message": "List of artists (placeholder)"}), 200

@artists_bp.route('/<int:id>', methods=['GET'])
def get_artist(id):
    return jsonify({"message": f"Artist {id} (placeholder)"}), 200
