"""API tests for /api/events endpoints."""


class TestGetEvents:
    def test_returns_empty_list(self, client, db):
        r = client.get('/api/events/')
        assert r.status_code == 200
        assert r.get_json() == []

    def test_returns_event_list(self, client, sample_event):
        r = client.get('/api/events/')
        data = r.get_json()
        assert len(data) == 1
        assert data[0]['event_name'] == 'Summer Concert'

    def test_event_has_required_keys(self, client, sample_event):
        event = client.get('/api/events/').get_json()[0]
        for key in ('event_id', 'event_name', 'event_type', 'event_date', 'location'):
            assert key in event

    def test_event_date_is_iso_string(self, client, sample_event):
        event = client.get('/api/events/').get_json()[0]
        assert event['event_date'] == '2026-07-15'


class TestGetEventById:
    def test_found(self, client, sample_event):
        r = client.get(f'/api/events/{sample_event.event_id}')
        assert r.status_code == 200
        assert r.get_json()['event_id'] == sample_event.event_id

    def test_not_found(self, client, db):
        r = client.get('/api/events/9999')
        assert r.status_code == 404
