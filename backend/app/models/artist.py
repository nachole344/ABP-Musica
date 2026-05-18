from .init import db
from datetime import date

class Artist(db.Model):
    __tablename__ = 'artists'
    
    artist_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    real_name = db.Column(db.String(100), nullable=False)
    artist_name = db.Column(db.String(150), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    debut = db.Column(db.Date, nullable=False)
    country = db.Column(db.String(50), nullable=False)
    social_media = db.Column(db.Text, nullable=False, unique=True)
    image = db.Column(db.Text, nullable=False, unique=True)
    description = db.Column(db.Text)
    musicbrainz_id = db.Column(db.String(36), unique=True) # UUID as String

    def to_dict(self):
        return {
            "artist_id": self.artist_id,
            "real_name": self.real_name,
            "artist_name": self.artist_name,
            "birth_date": self.birth_date.isoformat(),
            "debut": self.debut.isoformat(),
            "country": self.country,
            "social_media": self.social_media,
            "image": self.image,
            "description": self.description,
            "musicbrainz_id": self.musicbrainz_id
        }
