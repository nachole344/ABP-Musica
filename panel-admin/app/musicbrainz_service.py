import requests
import time

MB_BASE   = "https://musicbrainz.org/ws/2"
WIKI_BASE = "https://en.wikipedia.org/api/rest_v1/page/summary"
CAA_BASE  = "https://coverartarchive.org/release"
USER_AGENT = "ArtistApp/1.0 (nikis.tchobanou@gmail.com)"
MB_HEADERS = {"User-Agent": USER_AGENT, "Accept": "application/json"}

SOCIAL_FILTERS = {
    "instagram.com": "instagram",
    "spotify.com":   "spotify",
    "twitter.com":   "twitter",
    "x.com":         "twitter",
    "youtube.com":   "youtube",
}

MB_EVENT_TYPE_MAP = {
    "concert":            "concert",
    "festival":           "festival",
    "tour":               "tour",
    "masterclass/clinic": "concert",
    "launch event":       "concert",
    "open air festival":  "festival",
    "screening":          "movie",
}


def mb_get(path):
    r = requests.get(f"{MB_BASE}{path}", headers=MB_HEADERS)
    r.raise_for_status()
    time.sleep(1.1)
    return r.json()


def get_cover(release_id):
    try:
        r = requests.get(f"{CAA_BASE}/{release_id}", headers=MB_HEADERS, timeout=5)
        if not r.ok:
            return None
        data = r.json()
        images = data.get("images", [])
        front = next((i for i in images if i.get("front")), images[0] if images else None)
        return front["image"] if front else None
    except Exception:
        return None


def ms_to_time(ms):
    if not ms:
        return "00:00:00"
    total = ms // 1000
    h, rem = divmod(total, 3600)
    m, s = divmod(rem, 60)
    return f"{h:02d}:{m:02d}:{s:02d}"


def normalize_date(d):
    if not d:
        return None
    if len(d) == 4:
        return f"{d}-01-01"
    if len(d) == 7:
        return f"{d}-01"
    return d


def search_artist(name=None, mb_id=None):
    if not name and not mb_id:
        raise ValueError("Proporciona name o mb_id")

    if not mb_id:
        data = mb_get(f"/artist/?query={requests.utils.quote(name)}&limit=1&fmt=json")
        artists = data.get("artists", [])
        if not artists:
            raise ValueError(f"Artista no encontrado: {name}")
        mb_id = artists[0]["id"]

    mb = mb_get(f"/artist/{mb_id}?inc=url-rels+tags+artist-rels&fmt=json")

    is_group = mb.get("type", "").lower() in ("group", "orchestra", "choir")

    if is_group:
        real_name = mb["name"]
    else:
        real_name = (
            mb.get("disambiguation", "").replace("born ", "").strip()
            or mb.get("sort-name")
            or mb["name"]
        )

    members = []
    for rel in mb.get("relations", []):
        if rel.get("type") == "member of band" and rel.get("direction") == "backward":
            m = rel.get("artist", {})
            if m.get("name"):
                members.append(m["name"])

    description = None
    try:
        wiki_rel = next(
            (r for r in mb.get("relations", []) if "wikipedia.org" in (r.get("url", {}).get("resource", ""))),
            None,
        )
        title = wiki_rel["url"]["resource"].split("/wiki/")[1] if wiki_rel else mb["name"].replace(" ", "_")
        wr = requests.get(f"{WIKI_BASE}/{title}", headers=MB_HEADERS, timeout=5)
        if wr.ok:
            wiki_data = wr.json()
            description = wiki_data.get("extract", "")
            if is_group and members:
                description += f"\n\nMiembros: {', '.join(members)}."
    except Exception:
        if is_group and members:
            description = f"Miembros: {', '.join(members)}."

    social = {}
    for r in mb.get("relations", []):
        url = r.get("url", {}).get("resource", "")
        for domain, key in SOCIAL_FILTERS.items():
            if domain in url and key not in social:
                social[key] = url
                break

    social_link = None
    for key in ("instagram", "spotify", "twitter", "youtube"):
        if key in social:
            social_link = social[key]
            break

    return {
        "real_name":   real_name,
        "artist_name": mb["name"],
        "birth_date":  normalize_date(mb.get("life-span", {}).get("begin")),
        "debut":       None,
        "country":     mb.get("country") or mb.get("area", {}).get("name"),
        "social_media": social_link,
        "image":       None,
        "description": description,
        "mb_id":       mb["id"],
        "_mb_type":    mb.get("type"),
        "_members":    members,
    }


def search_albums(artist_name=None, mb_artist=None, album_name=None, mb_release=None):
    if not artist_name and not mb_artist and not mb_release:
        raise ValueError("Proporciona artist_name, mb_artist o mb_release")

    resolved_artist_id = mb_artist
    if not resolved_artist_id and not mb_release:
        data = mb_get(f"/artist/?query={requests.utils.quote(artist_name)}&limit=1&fmt=json")
        artists = data.get("artists", [])
        if not artists:
            raise ValueError(f"Artista no encontrado: {artist_name}")
        resolved_artist_id = artists[0]["id"]

    releases = []
    if mb_release:
        rel = mb_get(f"/release/{mb_release}?inc=url-rels&fmt=json")
        releases = [rel]
    elif album_name:
        q = f"release:{requests.utils.quote(album_name)}"
        if resolved_artist_id:
            q += f"%20AND%20artistid:{resolved_artist_id}"
        data = mb_get(f"/release/?query={q}&type=album&status=official&limit=5&fmt=json")
        rels = data.get("releases", [])
        if not rels:
            raise ValueError(f"Álbum no encontrado: {album_name}")
        match = next((r for r in rels if r["title"].lower() == album_name.lower()), rels[0])
        full = mb_get(f"/release/{match['id']}?inc=url-rels&fmt=json")
        releases = [full]
    else:
        data = mb_get(
            f"/release?artist={resolved_artist_id}&type=album&status=official&limit=10&offset=0&fmt=json"
        )
        releases = data.get("releases", [])

    results = []
    for rel in releases:
        full = rel if rel.get("media") else mb_get(f"/release/{rel['id']}?inc=url-rels&fmt=json")
        cover = get_cover(full["id"])
        total = sum(m.get("track-count", 0) for m in full.get("media", []))
        spot = next(
            (r["url"]["resource"] for r in full.get("relations", []) if "spotify.com" in r.get("url", {}).get("resource", "")),
            "",
        )
        results.append({
            "artist_id":     None,
            "album_title":   full["title"],
            "release_date":  normalize_date(full.get("date")),
            "total_track":   total,
            "cover_album":   cover or "",
            "spotify":       spot,
            "mb_album_id":   full["id"],
            "_mb_artist_id": resolved_artist_id,
        })

    return results


def search_songs(artist_name=None, mb_artist=None, album_name=None, mb_release=None, song_name=None):
    if not mb_release and not album_name and not song_name:
        raise ValueError("Proporciona mb_release, album_name o song_name")

    resolved_release_id = mb_release

    if not resolved_release_id:
        resolved_artist_id = mb_artist
        if not resolved_artist_id and artist_name:
            data = mb_get(f"/artist/?query={requests.utils.quote(artist_name)}&limit=1&fmt=json")
            artists = data.get("artists", [])
            if not artists:
                raise ValueError(f"Artista no encontrado: {artist_name}")
            resolved_artist_id = artists[0]["id"]

        if album_name:
            q = f"release:{requests.utils.quote(album_name)}"
            if resolved_artist_id:
                q += f"%20AND%20artistid:{resolved_artist_id}"
            data = mb_get(f"/release/?query={q}&type=album&status=official&limit=5&fmt=json")
            rels = data.get("releases", [])
            if not rels:
                raise ValueError(f"Álbum no encontrado: {album_name}")
            match = next((r for r in rels if r["title"].lower() == album_name.lower()), rels[0])
            resolved_release_id = match["id"]
        elif song_name:
            q = f"recording:{requests.utils.quote(song_name)}"
            if resolved_artist_id:
                q += f"%20AND%20artistid:{resolved_artist_id}"
            data = mb_get(f"/recording/?query={q}&limit=5&fmt=json")
            recs = data.get("recordings", [])
            if not recs:
                raise ValueError(f"Canción no encontrada: {song_name}")
            releases_of_rec = recs[0].get("releases", [])
            if not releases_of_rec:
                raise ValueError("No se encontró álbum para esta canción")
            resolved_release_id = releases_of_rec[0]["id"]

    release = mb_get(f"/release/{resolved_release_id}?inc=recordings&fmt=json")
    cover = get_cover(resolved_release_id)

    all_tracks = [t for m in release.get("media", []) for t in m.get("tracks", [])]

    if song_name:
        filtered = [
            t for t in all_tracks
            if song_name.lower() in (t.get("recording", {}).get("title", t.get("title", ""))).lower()
        ]
        all_tracks = filtered if filtered else all_tracks

    results = []
    for track in all_tracks:
        rec = track.get("recording", {})
        results.append({
            "album_id":       None,
            "song_title":     rec.get("title") or track.get("title"),
            "duration":       ms_to_time(rec.get("length") or track.get("length")),
            "video_url":      None,
            "cover_song":     cover or "",
            "mb_song_id":     rec.get("id"),
            "_mb_release_id": resolved_release_id,
            "_album_title":   release.get("title"),
        })

    return results


def search_events(artist_name=None, mb_artist=None, event_name=None):
    if not artist_name and not mb_artist and not event_name:
        raise ValueError("Proporciona artist_name, mb_artist o event_name")

    resolved_artist_id = mb_artist
    resolved_artist_name = artist_name or ""

    if not resolved_artist_id:
        data = mb_get(f"/artist/?query={requests.utils.quote(artist_name)}&limit=1&fmt=json")
        artists = data.get("artists", [])
        if not artists:
            raise ValueError(f"Artista no encontrado: {artist_name}")
        resolved_artist_id = artists[0]["id"]
        resolved_artist_name = artists[0]["name"]

    artist_data = mb_get(f"/artist/{resolved_artist_id}?inc=event-rels+place-rels&fmt=json")
    event_rels = [r for r in artist_data.get("relations", []) if r.get("target-type") == "event"]
    events = [r["event"] for r in event_rels if r.get("event")]

    if event_name:
        events = [e for e in events if event_name.lower() in e.get("name", "").lower()] or events

    if not events:
        return [{
            "artist_id":     None,
            "event_name":    event_name or f"{resolved_artist_name} Event",
            "event_type":    "concert",
            "event_date":    None,
            "location":      None,
            "poster":        "",
            "_mb_artist_id": resolved_artist_id,
            "_artist_name":  resolved_artist_name,
            "_note": "MusicBrainz no tiene eventos para este artista. Rellena los campos manualmente.",
        }]

    results = []
    for ev in events:
        mb_type = (ev.get("type") or "concert").lower()
        evt_type = MB_EVENT_TYPE_MAP.get(mb_type, "concert")
        life = ev.get("life-span", {})
        raw_date = life.get("begin") or ev.get("time")

        location = None
        try:
            ev_detail = mb_get(f"/event/{ev['id']}?inc=place-rels&fmt=json")
            for rel in ev_detail.get("relations", []):
                if rel.get("target-type") == "place":
                    place = rel.get("place", {})
                    location = place.get("name", "")
                    area = place.get("area", {}).get("name", "")
                    if area:
                        location += f", {area}"
                    break
        except Exception:
            pass

        results.append({
            "artist_id":     None,
            "event_name":    ev.get("name", ""),
            "event_type":    evt_type,
            "event_date":    normalize_date(raw_date),
            "location":      location,
            "poster":        "",
            "_mb_artist_id": resolved_artist_id,
            "_artist_name":  resolved_artist_name,
        })

    return results
