from app import create_app
from app.init import db
from app.models import Artist

app = create_app()
with app.app_context():
    try:
        artists = Artist.query.all()
        print(f"DEBUG_START")
        print(f"TOTAL_ARTISTS: {len(artists)}")
        for a in artists:
            print(f"ARTIST: {a.artist_name} (ID: {a.artist_id})")
        print(f"DEBUG_END")
    except Exception as e:
        print(f"ERROR: {e}")
