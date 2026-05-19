from flask import jsonify, request
from app import db
from app.models import Song
from app.api import bp


@bp.route("/songs", methods=["GET"])
def get_songs():
    songs = Song.query.order_by(Song.song_title).all()
    return jsonify([s.to_dict() for s in songs])


@bp.route("/songs/<int:song_id>", methods=["GET"])
def get_song(song_id):
    song = Song.query.get_or_404(song_id)
    return jsonify(song.to_dict())


@bp.route("/songs", methods=["POST"])
def create_song():
    data = request.get_json() or {}
    song = Song(
        album_id=data["album_id"],
        song_title=data["song_title"],
        duration=data["duration"],
        video_url=data.get("video_url", ""),
        cover_song=data["cover_song"],
        mb_song_id=data["mb_song_id"],
    )
    db.session.add(song)
    db.session.commit()
    return jsonify(song.to_dict()), 201


@bp.route("/songs/<int:song_id>", methods=["PUT"])
def update_song(song_id):
    song = Song.query.get_or_404(song_id)
    data = request.get_json() or {}
    song.album_id = data.get("album_id", song.album_id)
    song.song_title = data.get("song_title", song.song_title)
    song.duration = data.get("duration", song.duration)
    song.video_url = data.get("video_url", song.video_url)
    song.cover_song = data.get("cover_song", song.cover_song)
    song.mb_song_id = data.get("mb_song_id", song.mb_song_id)
    db.session.commit()
    return jsonify(song.to_dict())


@bp.route("/songs/<int:song_id>", methods=["DELETE"])
def delete_song(song_id):
    song = Song.query.get_or_404(song_id)
    db.session.delete(song)
    db.session.commit()
    return jsonify({"message": "Song deleted"}), 200
