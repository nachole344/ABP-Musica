from ..init import db

class Album(db.Model):
    __tablename__ = 'albums'
    
    album_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.artist_id'), nullable=False)
    album_title = db.Column(db.String(100), nullable=False)
    release_date = db.Column(db.Date, nullable=False)
    total_track = db.Column(db.Integer, nullable=False)
    cover_album = db.Column(db.Text, nullable=False, unique=True)
    spotify = db.Column(db.Text, nullable=False, unique=True)
    mb_album_id = db.Column(db.Text, unique=True)

    # Relationships
    songs = db.relationship('Song', backref='album', lazy=True)

    def to_dict(self):
        return {
            "album_id": self.album_id,
            "artist_id": self.artist_id,
            "album_title": self.album_title,
            "release_date": self.release_date.isoformat() if self.release_date else None,
            "total_track": self.total_track,
            "cover_album": self.cover_album,
            "spotify": self.spotify,
            "mb_album_id": self.mb_album_id,
            "songs": [song.to_dict() for song in self.songs]
        }
