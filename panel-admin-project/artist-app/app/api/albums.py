from flask import jsonify, request
from app import db
from app.models import Album
from app.api import bp


@bp.route("/albums", methods=["GET"])
def get_albums():
    albums = Album.query.order_by(Album.release_date.desc()).all()
    return jsonify([a.to_dict() for a in albums])


@bp.route("/albums/<int:album_id>", methods=["GET"])
def get_album(album_id):
    album = Album.query.get_or_404(album_id)
    return jsonify(album.to_dict())


@bp.route("/albums", methods=["POST"])
def create_album():
    data = request.get_json() or {}
    album = Album(
        artist_id=data["artist_id"],
        album_title=data["album_title"],
        release_date=data["release_date"],
        total_track=data["total_track"],
        cover_album=data["cover_album"],
        spotify=data["spotify"],
        mb_album_id=data["mb_album_id"],
    )
    db.session.add(album)
    db.session.commit()
    return jsonify(album.to_dict()), 201


@bp.route("/albums/<int:album_id>", methods=["PUT"])
def update_album(album_id):
    album = Album.query.get_or_404(album_id)
    data = request.get_json() or {}
    album.artist_id = data.get("artist_id", album.artist_id)
    album.album_title = data.get("album_title", album.album_title)
    album.release_date = data.get("release_date", album.release_date)
    album.total_track = data.get("total_track", album.total_track)
    album.cover_album = data.get("cover_album", album.cover_album)
    album.spotify = data.get("spotify", album.spotify)
    album.mb_album_id = data.get("mb_album_id", album.mb_album_id)
    db.session.commit()
    return jsonify(album.to_dict())


@bp.route("/albums/<int:album_id>", methods=["DELETE"])
def delete_album(album_id):
    album = Album.query.get_or_404(album_id)
    db.session.delete(album)
    db.session.commit()
    return jsonify({"message": "Album deleted"}), 200
