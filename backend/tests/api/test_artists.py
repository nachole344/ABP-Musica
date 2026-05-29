"""API tests for /api/artists endpoints."""


class TestGetArtists:
    def test_returns_empty_list(self, client, db):
        r = client.get('/api/artists/')
        assert r.status_code == 200
        assert r.get_json() == []

    def test_returns_artist_list(self, client, sample_artist):
        r = client.get('/api/artists/')
        assert r.status_code == 200
        data = r.get_json()
        assert len(data) == 1
        assert data[0]['artist_name'] == 'JD'

    def test_artist_dict_has_required_keys(self, client, sample_artist):
        r = client.get('/api/artists/')
        artist = r.get_json()[0]
        for key in ('artist_id', 'real_name', 'artist_name', 'albums'):
            assert key in artist

    def test_multiple_artists(self, client, db, sample_artist):
        import uuid
        from datetime import date
        from app.models.artist import Artist
        second = Artist(
            real_name='Jane Smith',
            artist_name='JS',
            birth_date=date(1995, 3, 10),
            debut=date(2015, 8, 1),
            country='UK',
            social_media='https://twitter.com/js',
            image='https://example.com/js.jpg',
            mb_id=uuid.uuid4(),
        )
        db.session.add(second)
        db.session.commit()

        r = client.get('/api/artists/')
        assert len(r.get_json()) == 2


class TestGetArtistById:
    def test_found(self, client, sample_artist):
        r = client.get(f'/api/artists/{sample_artist.artist_id}')
        assert r.status_code == 200
        assert r.get_json()['artist_id'] == sample_artist.artist_id

    def test_not_found(self, client, db):
        r = client.get('/api/artists/9999')
        assert r.status_code == 404
