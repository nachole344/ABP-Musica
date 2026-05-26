from flask import jsonify, request
from app import db
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


@bp.route("/artists", methods=["POST"])
def create_artist():
    data = request.get_json() or {}
    artist = Artist(
        real_name=data["real_name"],
        artist_name=data["artist_name"],
        birth_date=data["birth_date"],
        debut=data["debut"],
        country=data["country"],
        social_media=data["social_media"],
        image=data["image"],
        description=data.get("description", ""),
        mb_id=data["mb_id"],
    )
    db.session.add(artist)
    db.session.commit()
    return jsonify(artist.to_dict()), 201


@bp.route("/artists/<int:artist_id>", methods=["PUT"])
def update_artist(artist_id):
    artist = Artist.query.get_or_404(artist_id)
    data = request.get_json() or {}
    artist.real_name = data.get("real_name", artist.real_name)
    artist.artist_name = data.get("artist_name", artist.artist_name)
    artist.birth_date = data.get("birth_date", artist.birth_date)
    artist.debut = data.get("debut", artist.debut)
    artist.country = data.get("country", artist.country)
    artist.social_media = data.get("social_media", artist.social_media)
    artist.image = data.get("image", artist.image)
    artist.description = data.get("description", artist.description)
    artist.mb_id = data.get("mb_id", artist.mb_id)
    db.session.commit()
    return jsonify(artist.to_dict())


@bp.route("/artists/<int:artist_id>", methods=["DELETE"])
def delete_artist(artist_id):
    artist = Artist.query.get_or_404(artist_id)
    db.session.delete(artist)
    db.session.commit()
    return jsonify({"message": "Artist deleted"}), 200
