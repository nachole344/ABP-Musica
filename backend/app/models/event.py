from ..init import db

class Event(db.Model):
    __tablename__ = 'events'
    
    event_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.artist_id'), nullable=True)
    event_name = db.Column(db.String(250), nullable=False)
    event_type = db.Column(db.String(50), nullable=False) # Enum handled as String
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
