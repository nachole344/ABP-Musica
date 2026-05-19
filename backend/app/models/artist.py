from ..init import db

class Artist(db.Model):
    __tablename__ = 'artists'
    
    artist_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    real_name = db.Column(db.String(150), nullable=False)
    artist_name = db.Column(db.String(150), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    debut = db.Column(db.Date, nullable=False)
    country = db.Column(db.String(150), nullable=False)
    social_media = db.Column(db.Text, nullable=False, unique=True)
    image = db.Column(db.Text, nullable=False, unique=True)
    description = db.Column(db.Text)
    mb_id = db.Column(db.Text, unique=True) # UUID stored as Text for compatibility

    # Relationships
    albums = db.relationship('Album', backref='artist', lazy=True)
    products = db.relationship('Product', backref='artist', lazy=True)
    events = db.relationship('Event', backref='artist', lazy=True)

    def to_dict(self):
        # Intenta obtener una video_url de alguna de sus canciones para el carousel
        video_url = None
        for album in self.albums:
            for song in album.songs:
                if song.video_url:
                    video_url = song.video_url
                    break
            if video_url:
                break

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
            "mb_id": self.mb_id,
            "video_url": video_url,
            "albums": [album.to_dict() for album in self.albums]
        }
