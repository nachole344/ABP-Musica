from sqlalchemy.dialects.postgresql import ENUM
from ..init import db

event_type_enum = ENUM(
    'concert', 'tour', 'festival', 'movie', 'tv_series',
    name='event_type_enum', create_type=False
)

class Event(db.Model):
    __tablename__ = 'events'
    
    event_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.artist_id', ondelete='CASCADE'), nullable=True)
    event_name = db.Column(db.String(250), nullable=False)
    event_type = db.Column(event_type_enum, nullable=False)
    event_date = db.Column(db.Date, nullable=False)
    location = db.Column(db.String(100))
    poster = db.Column(db.Text, nullable=False, unique=True)

    def to_dict(self):
        return {
            "event_id": self.event_id,
            "artist_id": self.artist_id,
            "event_name": self.event_name,
            "event_type": self.event_type,
            "event_date": self.event_date.isoformat() if self.event_date else None,
            "location": self.location,
            "poster": self.poster
        }
