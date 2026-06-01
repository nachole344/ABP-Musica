from flask import Blueprint, jsonify
from ..models.artist import Artist

artists_bp = Blueprint('artists', __name__)

@artists_bp.route('/', methods=['GET'])
def get_artists():
    artists = Artist.query.all()
    return jsonify([artist.to_dict() for artist in artists]), 200

@artists_bp.route('/<int:id>', methods=['GET'])
def get_artist(id):
    artist = Artist.query.get_or_404(id)
    return jsonify(artist.to_dict()), 200
