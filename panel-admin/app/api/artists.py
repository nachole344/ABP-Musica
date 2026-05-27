from flask import jsonify
from app.models import Artist
from app.api import bp


@bp.route("/artists", methods=["GET"])
def get_artists():
    artists = Artist.query.order_by(Artist.artist_name).all()
    return jsonify([a.to_dict() for a in artists])


@bp.route("/artists/<int:artist_id>", methods=["GET"])
def get_artist(artist_id):
    artist = Artist.query.get_or_404(artist_id)
    return jsonify(artist.to_dict())
