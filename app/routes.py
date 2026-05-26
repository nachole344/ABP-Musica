import uuid
from datetime import date, time

from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from app import db
from app.models import Artist, Album, Song, Event, Product
from app.musicbrainz_service import search_artist, search_albums, search_songs, search_events

bp = Blueprint("main", __name__)


def parse_date(val):
    if not val:
        return None
    if isinstance(val, date):
        return val
    try:
        return date.fromisoformat(val)
    except (TypeError, ValueError):
        return None


# ── Pages ────────────────────────────────────────────────────────────────────

@bp.route("/")
def index():
    artists = Artist.query.order_by(Artist.artist_name).all()
    albums = Album.query.order_by(Album.release_date.desc()).limit(6).all()
    return render_template("index.html", artists=artists, albums=albums)


@bp.route("/import")
def musicbrainz_import():
    return render_template("musicbrainz/import.html")


# ── MusicBrainz Search ───────────────────────────────────────────────────────

@bp.route("/api/musicbrainz/search/artist", methods=["GET"])
def mb_search_artist():
    name  = request.args.get("name",  "").strip()
    mb_id = request.args.get("mb_id", "").strip()
    try:
        result = search_artist(name=name or None, mb_id=mb_id or None)
        return jsonify(result)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/api/musicbrainz/search/albums", methods=["GET"])
def mb_search_albums():
    artist_name = request.args.get("artist_name", "").strip()
    mb_artist   = request.args.get("mb_artist",   "").strip()
    album_name  = request.args.get("album_name",  "").strip()
    mb_release  = request.args.get("mb_release",  "").strip()
    try:
        results = search_albums(
            artist_name=artist_name or None,
            mb_artist=mb_artist or None,
            album_name=album_name or None,
            mb_release=mb_release or None,
        )
        return jsonify(results)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/api/musicbrainz/search/songs", methods=["GET"])
def mb_search_songs():
    artist_name = request.args.get("artist_name", "").strip()
    mb_artist   = request.args.get("mb_artist",   "").strip()
    album_name  = request.args.get("album_name",  "").strip()
    mb_release  = request.args.get("mb_release",  "").strip()
    song_name   = request.args.get("song_name",   "").strip()
    try:
        results = search_songs(
            artist_name=artist_name or None,
            mb_artist=mb_artist or None,
            album_name=album_name or None,
            mb_release=mb_release or None,
            song_name=song_name or None,
        )
        return jsonify(results)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/api/musicbrainz/search/events", methods=["GET"])
def mb_search_events():
    artist_name = request.args.get("artist_name", "").strip()
    mb_artist   = request.args.get("mb_artist",   "").strip()
    event_name  = request.args.get("event_name",  "").strip()
    try:
        results = search_events(
            artist_name=artist_name or None,
            mb_artist=mb_artist or None,
            event_name=event_name or None,
        )
        return jsonify(results)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── MusicBrainz Save ─────────────────────────────────────────────────────────

@bp.route("/api/musicbrainz/artists", methods=["POST"])
def mb_save_artist():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data"}), 400

    mb_id_val = data.get("mb_id")
    if mb_id_val:
        try:
            mb_id_val = uuid.UUID(mb_id_val)
        except ValueError:
            return jsonify({"error": "Invalid mb_id UUID"}), 400

    birth_date = parse_date(data.get("birth_date"))
    debut = parse_date(data.get("debut"))
    fallback_id = str(mb_id_val or uuid.uuid4())

    existing = Artist.query.filter_by(mb_id=mb_id_val).first() if mb_id_val else None
    if existing:
        existing.real_name   = data.get("real_name",   existing.real_name)
        existing.artist_name = data.get("artist_name", existing.artist_name)
        existing.birth_date  = birth_date or existing.birth_date
        existing.debut       = debut or existing.debut
        existing.country     = data.get("country", existing.country)
        existing.social_media = data.get("social_media") or existing.social_media
        existing.image       = data.get("image") or existing.image
        existing.description = data.get("description", existing.description)
        db.session.commit()
        artist = existing
    else:
        artist = Artist(
            real_name   = data.get("real_name", ""),
            artist_name = data.get("artist_name", ""),
            birth_date  = birth_date or date.today(),
            debut       = debut or date.today(),
            country     = data.get("country", ""),
            social_media = data.get("social_media") or f"no-social-{fallback_id}",
            image       = data.get("image") or f"no-image-{fallback_id}",
            description = data.get("description", ""),
            mb_id       = mb_id_val or uuid.uuid4(),
        )
        db.session.add(artist)
        db.session.commit()

    return jsonify({"ok": True, "artist_id": artist.artist_id, "artist_name": artist.artist_name}), 201


@bp.route("/api/musicbrainz/albums", methods=["POST"])
def mb_save_album():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data"}), 400

    artist_id = data.get("artist_id")
    if not artist_id:
        _mb_artist_id = data.get("_mb_artist_id")
        if _mb_artist_id:
            try:
                artist = Artist.query.filter_by(mb_id=uuid.UUID(_mb_artist_id)).first()
                if artist:
                    artist_id = artist.artist_id
            except ValueError:
                pass
    if not artist_id:
        return jsonify({"error": "Artist not found. Save the artist first."}), 400

    mb_album_id_val = data.get("mb_album_id")
    if mb_album_id_val:
        try:
            mb_album_id_val = uuid.UUID(mb_album_id_val)
        except ValueError:
            return jsonify({"error": "Invalid mb_album_id UUID"}), 400

    release_date = parse_date(data.get("release_date"))
    fallback_id = str(mb_album_id_val or uuid.uuid4())

    existing = Album.query.filter_by(mb_album_id=mb_album_id_val).first() if mb_album_id_val else None
    if existing:
        existing.artist_id   = artist_id
        existing.album_title = data.get("album_title", existing.album_title)
        existing.release_date = release_date or existing.release_date
        existing.total_track = int(data.get("total_track") or 0)
        existing.cover_album = data.get("cover_album") or existing.cover_album
        existing.spotify     = data.get("spotify") or existing.spotify
        db.session.commit()
        album = existing
    else:
        album = Album(
            artist_id   = artist_id,
            album_title = data.get("album_title", ""),
            release_date = release_date or date.today(),
            total_track = int(data.get("total_track") or 0),
            cover_album = data.get("cover_album") or f"no-cover-{fallback_id}",
            spotify     = data.get("spotify") or f"no-spotify-{fallback_id}",
            mb_album_id = mb_album_id_val or uuid.uuid4(),
        )
        db.session.add(album)
        db.session.commit()

    return jsonify({"ok": True, "album_id": album.album_id, "album_title": album.album_title}), 201


@bp.route("/api/musicbrainz/songs", methods=["POST"])
def mb_save_song():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data"}), 400

    album_id = data.get("album_id")
    if not album_id:
        _mb_release_id = data.get("_mb_release_id")
        if _mb_release_id:
            try:
                album = Album.query.filter_by(mb_album_id=uuid.UUID(_mb_release_id)).first()
                if album:
                    album_id = album.album_id
            except ValueError:
                pass
    if not album_id:
        return jsonify({"error": "Album not found. Save the album first."}), 400

    mb_song_id_val = data.get("mb_song_id")
    if mb_song_id_val:
        try:
            mb_song_id_val = uuid.UUID(mb_song_id_val)
        except ValueError:
            return jsonify({"error": "Invalid mb_song_id UUID"}), 400

    duration_str = data.get("duration", "00:00:00") or "00:00:00"
    try:
        parts = duration_str.split(":")
        duration = time(int(parts[0]), int(parts[1]), int(parts[2])) if len(parts) == 3 else time(0, 0, 0)
    except (ValueError, IndexError):
        duration = time(0, 0, 0)

    fallback_id = str(mb_song_id_val or uuid.uuid4())

    existing = Song.query.filter_by(mb_song_id=mb_song_id_val).first() if mb_song_id_val else None
    if existing:
        existing.album_id  = album_id
        existing.song_title = data.get("song_title", existing.song_title)
        existing.duration  = duration
        existing.video_url = data.get("video_url") or None
        existing.cover_song = data.get("cover_song") or existing.cover_song
        db.session.commit()
        song = existing
    else:
        song = Song(
            album_id  = album_id,
            song_title = data.get("song_title", ""),
            duration  = duration,
            video_url = data.get("video_url") or None,
            cover_song = data.get("cover_song") or f"no-cover-{fallback_id}",
            mb_song_id = mb_song_id_val or uuid.uuid4(),
        )
        db.session.add(song)
        db.session.commit()

    return jsonify({"ok": True, "song_id": song.song_id, "song_title": song.song_title}), 201


@bp.route("/api/musicbrainz/events", methods=["POST"])
def mb_save_event():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data"}), 400

    artist_id = data.get("artist_id")
    if not artist_id:
        _mb_artist_id = data.get("_mb_artist_id")
        if _mb_artist_id:
            try:
                artist = Artist.query.filter_by(mb_id=uuid.UUID(_mb_artist_id)).first()
                if artist:
                    artist_id = artist.artist_id
            except ValueError:
                pass
    if not artist_id:
        return jsonify({"error": "Artist not found. Save the artist first."}), 400

    event_date = parse_date(data.get("event_date"))
    if not event_date:
        return jsonify({"error": "event_date is required (YYYY-MM-DD)"}), 400

    event_type = (data.get("event_type") or "concert").strip()
    valid_types = ("concert", "tour", "festival", "movie", "tv_series")
    if event_type not in valid_types:
        return jsonify({"error": f"event_type inválido: '{event_type}'"}), 400

    event = Event(
        artist_id  = artist_id,
        event_name = data.get("event_name", ""),
        event_type = event_type,
        event_date = event_date,
        location   = data.get("location") or None,
        poster     = data.get("poster") or f"no-poster-{uuid.uuid4()}",
    )
    db.session.add(event)
    db.session.commit()

    return jsonify({"ok": True, "event_id": event.event_id, "event_name": event.event_name}), 201


# ── Artists CRUD ─────────────────────────────────────────────────────────────

@bp.route("/artists")
def list_artists():
    artists = Artist.query.order_by(Artist.artist_name).all()
    return render_template("artists/list.html", artists=artists)


@bp.route("/artists/<int:artist_id>")
def view_artist(artist_id):
    artist = Artist.query.get_or_404(artist_id)
    return render_template("artists/view.html", artist=artist)


@bp.route("/artists/new", methods=["GET", "POST"])
def new_artist():
    if request.method == "POST":
        try:
            mb_id = uuid.UUID(request.form["mb_id"])
        except ValueError:
            flash("MusicBrainz ID inválido (debe ser un UUID válido)", "danger")
            return render_template("artists/form.html")
        artist = Artist(
            real_name   = request.form["real_name"],
            artist_name = request.form["artist_name"],
            birth_date  = request.form["birth_date"],
            debut       = request.form["debut"],
            country     = request.form["country"],
            social_media = request.form["social_media"],
            image       = request.form["image"],
            description = request.form.get("description", ""),
            mb_id       = mb_id,
        )
        db.session.add(artist)
        db.session.commit()
        flash("Artista creado correctamente", "success")
        return redirect(url_for("main.view_artist", artist_id=artist.artist_id))
    return render_template("artists/form.html")


@bp.route("/artists/<int:artist_id>/edit", methods=["GET", "POST"])
def edit_artist(artist_id):
    artist = Artist.query.get_or_404(artist_id)
    if request.method == "POST":
        try:
            artist.mb_id = uuid.UUID(request.form["mb_id"])
        except ValueError:
            flash("MusicBrainz ID inválido", "danger")
            return render_template("artists/form.html", artist=artist)
        artist.real_name   = request.form["real_name"]
        artist.artist_name = request.form["artist_name"]
        artist.birth_date  = request.form["birth_date"]
        artist.debut       = request.form["debut"]
        artist.country     = request.form["country"]
        artist.social_media = request.form["social_media"]
        artist.image       = request.form["image"]
        artist.description = request.form.get("description", "")
        db.session.commit()
        flash("Artista actualizado", "success")
        return redirect(url_for("main.view_artist", artist_id=artist.artist_id))
    return render_template("artists/form.html", artist=artist)


@bp.route("/artists/<int:artist_id>/delete", methods=["POST"])
def delete_artist(artist_id):
    artist = Artist.query.get_or_404(artist_id)
    db.session.delete(artist)
    db.session.commit()
    flash("Artista eliminado", "success")
    return redirect(url_for("main.list_artists"))


# ── Albums CRUD ──────────────────────────────────────────────────────────────

@bp.route("/albums")
def list_albums():
    albums = Album.query.order_by(Album.release_date.desc()).all()
    return render_template("albums/list.html", albums=albums)


@bp.route("/albums/<int:album_id>")
def view_album(album_id):
    album = Album.query.get_or_404(album_id)
    return render_template("albums/view.html", album=album)


@bp.route("/albums/new", methods=["GET", "POST"])
def new_album():
    artists = Artist.query.order_by(Artist.artist_name).all()
    if request.method == "POST":
        try:
            mb_album_id = uuid.UUID(request.form["mb_album_id"])
        except ValueError:
            flash("MusicBrainz Album ID inválido", "danger")
            return render_template("albums/form.html", artists=artists)
        album = Album(
            artist_id   = request.form["artist_id"],
            album_title = request.form["album_title"],
            release_date = request.form["release_date"],
            total_track = request.form["total_track"],
            cover_album = request.form["cover_album"],
            spotify     = request.form["spotify"],
            mb_album_id = mb_album_id,
        )
        db.session.add(album)
        db.session.commit()
        flash("Álbum creado correctamente", "success")
        return redirect(url_for("main.view_album", album_id=album.album_id))
    return render_template("albums/form.html", artists=artists)


@bp.route("/albums/<int:album_id>/edit", methods=["GET", "POST"])
def edit_album(album_id):
    album = Album.query.get_or_404(album_id)
    artists = Artist.query.order_by(Artist.artist_name).all()
    if request.method == "POST":
        try:
            album.mb_album_id = uuid.UUID(request.form["mb_album_id"])
        except ValueError:
            flash("MusicBrainz Album ID inválido", "danger")
            return render_template("albums/form.html", album=album, artists=artists)
        album.artist_id   = request.form["artist_id"]
        album.album_title = request.form["album_title"]
        album.release_date = request.form["release_date"]
        album.total_track = request.form["total_track"]
        album.cover_album = request.form["cover_album"]
        album.spotify     = request.form["spotify"]
        db.session.commit()
        flash("Álbum actualizado", "success")
        return redirect(url_for("main.view_album", album_id=album.album_id))
    return render_template("albums/form.html", album=album, artists=artists)


@bp.route("/albums/<int:album_id>/delete", methods=["POST"])
def delete_album(album_id):
    album = Album.query.get_or_404(album_id)
    db.session.delete(album)
    db.session.commit()
    flash("Álbum eliminado", "success")
    return redirect(url_for("main.list_albums"))


# ── Songs CRUD ───────────────────────────────────────────────────────────────

@bp.route("/songs")
def list_songs():
    songs = Song.query.order_by(Song.song_title).all()
    return render_template("songs/list.html", songs=songs)


@bp.route("/songs/<int:song_id>")
def view_song(song_id):
    song = Song.query.get_or_404(song_id)
    return render_template("songs/view.html", song=song)


@bp.route("/songs/new", methods=["GET", "POST"])
def new_song():
    albums = Album.query.order_by(Album.album_title).all()
    if request.method == "POST":
        try:
            mb_song_id = uuid.UUID(request.form["mb_song_id"])
        except ValueError:
            flash("MusicBrainz Song ID inválido", "danger")
            return render_template("songs/form.html", albums=albums)
        song = Song(
            album_id  = request.form["album_id"],
            song_title = request.form["song_title"],
            duration  = request.form["duration"],
            video_url = request.form.get("video_url") or None,
            cover_song = request.form["cover_song"],
            mb_song_id = mb_song_id,
        )
        db.session.add(song)
        db.session.commit()
        flash("Canción creada correctamente", "success")
        return redirect(url_for("main.view_song", song_id=song.song_id))
    return render_template("songs/form.html", albums=albums)


@bp.route("/songs/<int:song_id>/edit", methods=["GET", "POST"])
def edit_song(song_id):
    song = Song.query.get_or_404(song_id)
    albums = Album.query.order_by(Album.album_title).all()
    if request.method == "POST":
        try:
            song.mb_song_id = uuid.UUID(request.form["mb_song_id"])
        except ValueError:
            flash("MusicBrainz Song ID inválido", "danger")
            return render_template("songs/form.html", song=song, albums=albums)
        song.album_id  = request.form["album_id"]
        song.song_title = request.form["song_title"]
        song.duration  = request.form["duration"]
        song.video_url = request.form.get("video_url") or None
        song.cover_song = request.form["cover_song"]
        db.session.commit()
        flash("Canción actualizada", "success")
        return redirect(url_for("main.view_song", song_id=song.song_id))
    return render_template("songs/form.html", song=song, albums=albums)


@bp.route("/songs/<int:song_id>/delete", methods=["POST"])
def delete_song(song_id):
    song = Song.query.get_or_404(song_id)
    db.session.delete(song)
    db.session.commit()
    flash("Canción eliminada", "success")
    return redirect(url_for("main.list_songs"))


# ── Products CRUD ────────────────────────────────────────────────────────────

PRODUCT_TYPES = ("album", "vinyl", "clothing", "tote_bag", "pin")


@bp.route("/products")
def list_products():
    type_filter = request.args.get("type", "").strip()
    query = Product.query
    if type_filter and type_filter in PRODUCT_TYPES:
        query = query.filter_by(product_type=type_filter)
    products = query.order_by(Product.product_name).all()
    return render_template("products/list.html", products=products, product_types=PRODUCT_TYPES, type_filter=type_filter)


@bp.route("/products/<int:product_id>")
def view_product(product_id):
    product = Product.query.get_or_404(product_id)
    return render_template("products/view.html", product=product)


@bp.route("/products/new", methods=["GET", "POST"])
def new_product():
    artists = Artist.query.order_by(Artist.artist_name).all()
    if request.method == "POST":
        product = Product(
            artist_id    = request.form["artist_id"],
            product_name = request.form["product_name"],
            product_type = request.form["product_type"],
            price        = request.form["price"],
            stock        = request.form["stock"],
            image_url    = request.form["image_url"],
        )
        db.session.add(product)
        db.session.commit()
        flash("Producto creado correctamente", "success")
        return redirect(url_for("main.view_product", product_id=product.product_id))
    return render_template("products/form.html", artists=artists, product_types=PRODUCT_TYPES)


@bp.route("/products/<int:product_id>/edit", methods=["GET", "POST"])
def edit_product(product_id):
    product = Product.query.get_or_404(product_id)
    artists = Artist.query.order_by(Artist.artist_name).all()
    if request.method == "POST":
        product.artist_id    = request.form["artist_id"]
        product.product_name = request.form["product_name"]
        product.product_type = request.form["product_type"]
        product.price        = request.form["price"]
        product.stock        = request.form["stock"]
        product.image_url    = request.form["image_url"]
        db.session.commit()
        flash("Producto actualizado", "success")
        return redirect(url_for("main.view_product", product_id=product.product_id))
    return render_template("products/form.html", product=product, artists=artists, product_types=PRODUCT_TYPES)


@bp.route("/products/<int:product_id>/delete", methods=["POST"])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    flash("Producto eliminado", "success")
    return redirect(url_for("main.list_products"))


# ── Events ────────────────────────────────────────────────────────────────────

EVENT_TYPES = ["concert", "tour", "festival", "movie", "tv_series"]


@bp.route("/events")
def list_events():
    type_filter = request.args.get("type", "").strip()
    query = Event.query
    if type_filter and type_filter in EVENT_TYPES:
        query = query.filter_by(event_type=type_filter)
    events = query.order_by(Event.event_date.desc()).all()
    return render_template("events/list.html", events=events, event_types=EVENT_TYPES, type_filter=type_filter)


@bp.route("/events/<int:event_id>")
def view_event(event_id):
    event = Event.query.get_or_404(event_id)
    return render_template("events/view.html", event=event)


@bp.route("/events/new", methods=["GET", "POST"])
def new_event():
    artists = Artist.query.order_by(Artist.artist_name).all()
    if request.method == "POST":
        import uuid as _uuid
        poster = request.form.get("poster", "").strip() or f"no-poster-{_uuid.uuid4()}"
        event = Event(
            artist_id  = request.form["artist_id"],
            event_name = request.form["event_name"],
            event_type = request.form["event_type"],
            event_date = parse_date(request.form["event_date"]),
            location   = request.form.get("location", "").strip() or None,
            poster     = poster,
        )
        db.session.add(event)
        db.session.commit()
        flash("Evento creado correctamente", "success")
        return redirect(url_for("main.view_event", event_id=event.event_id))
    return render_template("events/form.html", artists=artists, event_types=EVENT_TYPES)


@bp.route("/events/<int:event_id>/edit", methods=["GET", "POST"])
def edit_event(event_id):
    event = Event.query.get_or_404(event_id)
    artists = Artist.query.order_by(Artist.artist_name).all()
    if request.method == "POST":
        import uuid as _uuid
        poster = request.form.get("poster", "").strip() or event.poster
        event.artist_id  = request.form["artist_id"]
        event.event_name = request.form["event_name"]
        event.event_type = request.form["event_type"]
        event.event_date = parse_date(request.form["event_date"])
        event.location   = request.form.get("location", "").strip() or None
        event.poster     = poster
        db.session.commit()
        flash("Evento actualizado", "success")
        return redirect(url_for("main.view_event", event_id=event.event_id))
    return render_template("events/form.html", event=event, artists=artists, event_types=EVENT_TYPES)


@bp.route("/events/<int:event_id>/delete", methods=["POST"])
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    flash("Evento eliminado", "success")
    return redirect(url_for("main.list_events"))
