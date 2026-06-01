import os

# Patch PostgreSQL ENUM → String BEFORE any model imports so SQLite works
import sqlalchemy.dialects.postgresql as _pg
from sqlalchemy import String

class _FakeEnum(String):
    def __init__(self, *args, **kwargs):
        kwargs.pop('name', None)
        kwargs.pop('create_type', None)
        super().__init__(50)

_pg.ENUM = _FakeEnum

os.environ.setdefault('DATABASE_URL', 'sqlite://')
os.environ.setdefault('SECRET_KEY', 'test-secret-key')

import uuid
from datetime import date

import pytest
from sqlalchemy.pool import StaticPool

from app import create_app
from app.init import db as _db


@pytest.fixture(scope='session')
def app():
    flask_app = create_app()
    flask_app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite://',
        'SQLALCHEMY_ENGINE_OPTIONS': {
            'connect_args': {'check_same_thread': False},
            'poolclass': StaticPool,
        },
    })
    return flask_app


@pytest.fixture()
def db(app):
    with app.app_context():
        _db.create_all()
        yield _db
        _db.session.remove()
        _db.drop_all()


@pytest.fixture()
def client(app, db):
    return app.test_client()


# ── Common data fixtures ────────────────────────────────────────────────────

@pytest.fixture()
def sample_user(db):
    from app.models.user import User
    user = User(username='testuser', password='pass123', role='user')
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture()
def admin_user(db):
    from app.models.user import User
    user = User(username='admin', password='adminpass', role='admin')
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture()
def sample_artist(db):
    from app.models.artist import Artist
    artist = Artist(
        real_name='John Doe',
        artist_name='JD',
        birth_date=date(1990, 1, 1),
        debut=date(2010, 5, 20),
        country='USA',
        social_media='https://twitter.com/jd',
        image='https://example.com/jd.jpg',
        description='A test artist',
        mb_id=uuid.uuid4(),
    )
    db.session.add(artist)
    db.session.commit()
    return artist


@pytest.fixture()
def sample_product(db, sample_artist):
    from app.models.product import Product
    product = Product(
        artist_id=sample_artist.artist_id,
        product_name='Test Album CD',
        product_type='album',
        price=19.99,
        stock=10,
        image_url='https://example.com/album.jpg',
    )
    db.session.add(product)
    db.session.commit()
    return product


@pytest.fixture()
def logged_in_client(app, db):
    from app.models.user import User
    user = User(username='orderuser', password='pass123', role='user')
    db.session.add(user)
    db.session.commit()
    c = app.test_client()
    c.post('/api/auth/login', json={'username': 'orderuser', 'password': 'pass123'})
    return c, user


@pytest.fixture()
def sample_event(db, sample_artist):
    from app.models.event import Event
    event = Event(
        artist_id=sample_artist.artist_id,
        event_name='Summer Concert',
        event_type='concert',
        event_date=date(2026, 7, 15),
        location='Madrid',
        poster='https://example.com/poster.jpg',
    )
    db.session.add(event)
    db.session.commit()
    return event
