from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from ..init import db
from ..models.artist import Artist
from ..models.album import Album
from ..models.song import Song
from functools import wraps

admin_bp = Blueprint('admin', __name__, template_folder='templates')

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            # En una app real redirigiríamos al login del frontend o una página de error
            return "Acceso denegado. Por favor, inicia sesión desde la web principal.", 403
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/')
@login_required
def index():
    artists = Artist.query.order_by(Artist.artist_name).all()
    albums = Album.query.order_by(Album.release_date.desc()).limit(6).all()
    return render_template("index.html", artists=artists, albums=albums)

@admin_bp.route("/artists")
@login_required
def list_artists():
    artists = Artist.query.order_by(Artist.artist_name).all()
    return render_template("artists/list.html", artists=artists)

@admin_bp.route("/artists/<int:artist_id>")
@login_required
def view_artist(artist_id):
    artist = Artist.query.get_or_404(artist_id)
    return render_template("artists/view.html", artist=artist)

@admin_bp.route("/artists/new", methods=["GET", "POST"])
@login_required
def new_artist():
    if request.method == "POST":
        artist = Artist(
            real_name=request.form["real_name"],
            artist_name=request.form["artist_name"],
            birth_date=request.form["birth_date"],
            debut=request.form["debut"],
            country=request.form["country"],
            social_media=request.form["social_media"],
            image=request.form["image"],
            description=request.form.get("description", ""),
            mb_id=request.form["mb_id"],
        )
        db.session.add(artist)
        db.session.commit()
        flash("Artist created successfully!", "success")
        return redirect(url_for("admin.view_artist", artist_id=artist.artist_id))
    return render_template("artists/form.html")

@admin_bp.route("/artists/<int:artist_id>/edit", methods=["GET", "POST"])
@login_required
def edit_artist(artist_id):
    artist = Artist.query.get_or_404(artist_id)
    if request.method == "POST":
        artist.real_name = request.form["real_name"]
        artist.artist_name = request.form["artist_name"]
        artist.birth_date = request.form["birth_date"]
        artist.debut = request.form["debut"]
        artist.country = request.form["country"]
        artist.social_media = request.form["social_media"]
        artist.image = request.form["image"]
        artist.description = request.form.get("description", "")
        artist.mb_id = request.form["mb_id"]
        db.session.commit()
        flash("Artist updated successfully!", "success")
        return redirect(url_for("admin.view_artist", artist_id=artist.artist_id))
    return render_template("artists/form.html", artist=artist)

@admin_bp.route("/artists/<int:artist_id>/delete", methods=["POST"])
@login_required
def delete_artist(artist_id):
    artist = Artist.query.get_or_404(artist_id)
    db.session.delete(artist)
    db.session.commit()
    flash("Artist deleted!", "success")
    return redirect(url_for("admin.list_artists"))

@admin_bp.route("/albums")
@login_required
def list_albums():
    albums = Album.query.order_by(Album.release_date.desc()).all()
    return render_template("albums/list.html", albums=albums)

@admin_bp.route("/albums/<int:album_id>")
@login_required
def view_album(album_id):
    album = Album.query.get_or_404(album_id)
    return render_template("albums/view.html", album=album)

@admin_bp.route("/albums/new", methods=["GET", "POST"])
@login_required
def new_album():
    artists = Artist.query.order_by(Artist.artist_name).all()
    if request.method == "POST":
        album = Album(
            artist_id=request.form["artist_id"],
            album_title=request.form["album_title"],
            release_date=request.form["release_date"],
            total_track=request.form["total_track"],
            cover_album=request.form["cover_album"],
            spotify=request.form["spotify"],
            mb_album_id=request.form["mb_album_id"],
        )
        db.session.add(album)
        db.session.commit()
        flash("Album created successfully!", "success")
        return redirect(url_for("admin.view_album", album_id=album.album_id))
    return render_template("albums/form.html", artists=artists)

@admin_bp.route("/albums/<int:album_id>/edit", methods=["GET", "POST"])
@login_required
def edit_album(album_id):
    album = Album.query.get_or_404(album_id)
    artists = Artist.query.order_by(Artist.artist_name).all()
    if request.method == "POST":
        album.artist_id = request.form["artist_id"]
        album.album_title = request.form["album_title"]
        album.release_date = request.form["release_date"]
        album.total_track = request.form["total_track"]
        album.cover_album = request.form["cover_album"]
        album.spotify = request.form["spotify"]
        album.mb_album_id = request.form["mb_album_id"]
        db.session.commit()
        flash("Album updated successfully!", "success")
        return redirect(url_for("admin.view_album", album_id=album.album_id))
    return render_template("albums/form.html", album=album, artists=artists)

@admin_bp.route("/albums/<int:album_id>/delete", methods=["POST"])
@login_required
def delete_album(album_id):
    album = Album.query.get_or_404(album_id)
    db.session.delete(album)
    db.session.commit()
    flash("Album deleted!", "success")
    return redirect(url_for("admin.list_albums"))

@admin_bp.route("/songs")
@login_required
def list_songs():
    songs = Song.query.order_by(Song.song_title).all()
    return render_template("songs/list.html", songs=songs)

@admin_bp.route("/songs/<int:song_id>")
@login_required
def view_song(song_id):
    song = Song.query.get_or_404(song_id)
    return render_template("songs/view.html", song=song)

@admin_bp.route("/songs/new", methods=["GET", "POST"])
@login_required
def new_song():
    albums = Album.query.order_by(Album.album_title).all()
    if request.method == "POST":
        song = Song(
            album_id=request.form["album_id"],
            song_title=request.form["song_title"],
            duration=request.form["duration"],
            video_url=request.form.get("video_url", ""),
            cover_song=request.form["cover_song"],
            mb_song_id=request.form["mb_song_id"],
        )
        db.session.add(song)
        db.session.commit()
        flash("Song created successfully!", "success")
        return redirect(url_for("admin.view_song", song_id=song.song_id))
    return render_template("songs/form.html", albums=albums)

@admin_bp.route("/songs/<int:song_id>/edit", methods=["GET", "POST"])
@login_required
def edit_song(song_id):
    song = Song.query.get_or_404(song_id)
    albums = Album.query.order_by(Album.album_title).all()
    if request.method == "POST":
        song.album_id = request.form["album_id"]
        song.song_title = request.form["song_title"]
        song.duration = request.form["duration"]
        song.video_url = request.form.get("video_url", "")
        song.cover_song = request.form["cover_song"]
        song.mb_song_id = request.form["mb_song_id"]
        db.session.commit()
        flash("Song updated successfully!", "success")
        return redirect(url_for("admin.view_song", song_id=song.song_id))
    return render_template("songs/form.html", song=song, albums=albums)

@admin_bp.route("/songs/<int:song_id>/delete", methods=["POST"])
@login_required
def delete_song(song_id):
    song = Song.query.get_or_404(song_id)
    db.session.delete(song)
    db.session.commit()
    flash("Song deleted!", "success")
    return redirect(url_for("admin.list_songs"))
