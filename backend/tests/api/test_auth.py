"""API tests for /api/auth endpoints."""
import json


class TestLogin:
    def test_login_success(self, client, sample_user):
        r = client.post('/api/auth/login', json={
            'username': 'testuser', 'password': 'pass123'
        })
        assert r.status_code == 200
        data = r.get_json()
        assert data['user']['username'] == 'testuser'
        assert 'password' not in data['user']

    def test_login_wrong_password(self, client, sample_user):
        r = client.post('/api/auth/login', json={
            'username': 'testuser', 'password': 'wrong'
        })
        assert r.status_code == 401

    def test_login_unknown_user(self, client, db):
        r = client.post('/api/auth/login', json={
            'username': 'nobody', 'password': 'x'
        })
        assert r.status_code == 401

    def test_login_missing_username(self, client, db):
        r = client.post('/api/auth/login', json={'password': 'x'})
        assert r.status_code == 400

    def test_login_missing_password(self, client, db):
        r = client.post('/api/auth/login', json={'username': 'testuser'})
        assert r.status_code == 400

    def test_login_empty_body(self, client, db):
        r = client.post('/api/auth/login', json={})
        assert r.status_code == 400


class TestRegister:
    def test_register_success(self, client, db):
        r = client.post('/api/auth/register', json={
            'username': 'newuser', 'password': 'newpass'
        })
        assert r.status_code == 201
        data = r.get_json()
        assert data['user']['username'] == 'newuser'

    def test_register_duplicate_username(self, client, sample_user):
        r = client.post('/api/auth/register', json={
            'username': 'testuser', 'password': 'anypass'
        })
        assert r.status_code == 409

    def test_register_missing_fields(self, client, db):
        r = client.post('/api/auth/register', json={'username': 'only'})
        assert r.status_code == 400

    def test_register_username_too_long(self, client, db):
        r = client.post('/api/auth/register', json={
            'username': 'a' * 51, 'password': 'pass'
        })
        assert r.status_code == 400

    def test_register_password_too_long(self, client, db):
        r = client.post('/api/auth/register', json={
            'username': 'user', 'password': 'p' * 51
        })
        assert r.status_code == 400

    def test_register_whitespace_only_username(self, client, db):
        r = client.post('/api/auth/register', json={
            'username': '   ', 'password': 'pass'
        })
        assert r.status_code == 400


class TestLogout:
    def test_logout_returns_200(self, client, db):
        r = client.post('/api/auth/logout')
        assert r.status_code == 200

    def test_logout_clears_session(self, client, sample_user):
        client.post('/api/auth/login', json={
            'username': 'testuser', 'password': 'pass123'
        })
        client.post('/api/auth/logout')
        r = client.get('/api/auth/check')
        assert r.get_json()['logged_in'] is False


class TestCheck:
    def test_check_not_logged_in(self, client, db):
        r = client.get('/api/auth/check')
        assert r.status_code == 200
        assert r.get_json()['logged_in'] is False

    def test_check_logged_in(self, client, sample_user):
        client.post('/api/auth/login', json={
            'username': 'testuser', 'password': 'pass123'
        })
        r = client.get('/api/auth/check')
        data = r.get_json()
        assert data['logged_in'] is True
        assert data['user']['username'] == 'testuser'
