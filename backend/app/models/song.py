from ..init import db

class Song(db.Model):
    __tablename__ = 'songs'
    
    song_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    album_id = db.Column(db.Integer, db.ForeignKey('albums.album_id'), nullable=False)
    song_title = db.Column(db.String(150), nullable=False)
    duration = db.Column(db.Time, nullable=False)
    video_url = db.Column(db.Text, unique=True)
    cover_song = db.Column(db.Text, nullable=False, unique=True)
    mb_song_id = db.Column(db.Text, unique=True)

    def to_dict(self):
        return {
            "song_id": self.song_id,
            "album_id": self.album_id,
            "song_title": self.song_title,
            "duration": self.duration.strftime('%H:%M:%S') if self.duration else None,
            "video_url": self.video_url,
            "cover_song": self.cover_song,
            "mb_song_id": self.mb_song_id
        }
