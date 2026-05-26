from app import db


class Artist(db.Model):
    __tablename__ = "artists"

    artist_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    real_name = db.Column(db.String(150), nullable=False)
    artist_name = db.Column(db.String(150), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    debut = db.Column(db.Date, nullable=False)
    country = db.Column(db.String(150), nullable=False)
    social_media = db.Column(db.Text, nullable=False)
    image = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    mb_id = db.Column(db.Uuid, nullable=False, unique=True)

    albums = db.relationship("Album", backref="artist", lazy="dynamic", cascade="all, delete")
    events = db.relationship("Event", backref="artist", lazy="dynamic", cascade="all, delete")
    products = db.relationship("Product", backref="artist", lazy="dynamic", cascade="all, delete")

    def to_dict(self):
        return {
            "artist_id": self.artist_id,
            "real_name": self.real_name,
            "artist_name": self.artist_name,
            "birth_date": self.birth_date.isoformat() if self.birth_date else None,
            "debut": self.debut.isoformat() if self.debut else None,
            "country": self.country,
            "social_media": self.social_media,
            "image": self.image,
            "description": self.description,
            "mb_id": str(self.mb_id) if self.mb_id else None,
        }


class Album(db.Model):
    __tablename__ = "albums"

    album_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    artist_id = db.Column(db.Integer, db.ForeignKey("artists.artist_id"), nullable=False)
    album_title = db.Column(db.String(100), nullable=False)
    release_date = db.Column(db.Date, nullable=False)
    total_track = db.Column(db.Integer, nullable=False)
    cover_album = db.Column(db.Text, nullable=False, unique=True)
    spotify = db.Column(db.Text, nullable=False, unique=True)
    mb_album_id = db.Column(db.Uuid, nullable=False, unique=True)

    songs = db.relationship("Song", backref="album", lazy="dynamic", cascade="all, delete")

    def to_dict(self):
        return {
            "album_id": self.album_id,
            "artist_id": self.artist_id,
            "album_title": self.album_title,
            "release_date": self.release_date.isoformat() if self.release_date else None,
            "total_track": self.total_track,
            "cover_album": self.cover_album,
            "spotify": self.spotify,
            "mb_album_id": str(self.mb_album_id) if self.mb_album_id else None,
        }


class Song(db.Model):
    __tablename__ = "songs"

    song_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    album_id = db.Column(db.Integer, db.ForeignKey("albums.album_id"), nullable=False)
    song_title = db.Column(db.String(150), nullable=False)
    duration = db.Column(db.Time, nullable=False)
    video_url = db.Column(db.Text, unique=True)
    cover_song = db.Column(db.Text, nullable=False, unique=True)
    mb_song_id = db.Column(db.Uuid, nullable=False, unique=True)

    def to_dict(self):
        return {
            "song_id": self.song_id,
            "album_id": self.album_id,
            "song_title": self.song_title,
            "duration": self.duration.isoformat() if self.duration else None,
            "video_url": self.video_url,
            "cover_song": self.cover_song,
            "mb_song_id": str(self.mb_song_id) if self.mb_song_id else None,
        }


class Product(db.Model):
    __tablename__ = "products"

    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    artist_id = db.Column(db.Integer, db.ForeignKey("artists.artist_id"), nullable=False)
    product_name = db.Column(db.String(250), nullable=False, unique=True)
    product_type = db.Column(
        db.Enum("album", "vinyl", "clothing", "tote_bag", "pin", name="product_type_enum"),
        nullable=False,
    )
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.Text, nullable=False, unique=True)

    def to_dict(self):
        return {
            "product_id": self.product_id,
            "artist_id": self.artist_id,
            "product_name": self.product_name,
            "product_type": self.product_type,
            "price": float(self.price),
            "stock": self.stock,
            "image_url": self.image_url,
        }


class Event(db.Model):
    __tablename__ = "events"

    event_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    artist_id = db.Column(db.Integer, db.ForeignKey("artists.artist_id"), nullable=False)
    event_name = db.Column(db.String(250), nullable=False)
    event_type = db.Column(
        db.Enum("concert", "tour", "festival", "movie", "tv_series", name="event_type_enum"),
        nullable=False,
    )
    event_date = db.Column(db.Date, nullable=False)
    location = db.Column(db.String(100))
    poster = db.Column(db.Text, nullable=False, unique=True)
