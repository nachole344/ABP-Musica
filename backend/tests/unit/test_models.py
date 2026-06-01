"""Unit tests for model methods (no HTTP layer)."""
import uuid
from datetime import date

import pytest


class TestUserModel:
    def test_to_dict_keys(self, db):
        from app.models.user import User
        user = User(username='alice', password='secret', role='user')
        db.session.add(user)
        db.session.commit()

        d = user.to_dict()
        assert set(d.keys()) == {'user_id', 'username', 'role', 'date'}

    def test_to_dict_excludes_password(self, db):
        from app.models.user import User
        user = User(username='bob', password='secret', role='user')
        db.session.add(user)
        db.session.commit()

        assert 'password' not in user.to_dict()

    def test_to_dict_role(self, db):
        from app.models.user import User
        user = User(username='carol', password='x', role='admin')
        db.session.add(user)
        db.session.commit()

        assert user.to_dict()['role'] == 'admin'

    def test_repr(self, db):
        from app.models.user import User
        user = User(username='dave', password='x', role='user')
        db.session.add(user)
        db.session.commit()

        assert 'dave' in repr(user)


class TestArtistModel:
    def test_to_dict_keys(self, sample_artist):
        d = sample_artist.to_dict()
        expected = {
            'artist_id', 'real_name', 'artist_name', 'birth_date',
            'debut', 'country', 'social_media', 'image', 'description',
            'mb_id', 'video_url', 'albums',
        }
        assert set(d.keys()) == expected

    def test_to_dict_dates_are_strings(self, sample_artist):
        d = sample_artist.to_dict()
        assert isinstance(d['birth_date'], str)
        assert isinstance(d['debut'], str)

    def test_to_dict_albums_empty_by_default(self, sample_artist):
        assert sample_artist.to_dict()['albums'] == []

    def test_to_dict_video_url_none_when_no_songs(self, sample_artist):
        assert sample_artist.to_dict()['video_url'] is None


class TestProductModel:
    def test_to_dict_keys(self, sample_product):
        d = sample_product.to_dict()
        assert set(d.keys()) == {
            'product_id', 'artist_id', 'product_name',
            'product_type', 'price', 'stock', 'image_url',
        }

    def test_price_is_float(self, sample_product):
        assert isinstance(sample_product.to_dict()['price'], float)

    def test_stock_value(self, sample_product):
        assert sample_product.to_dict()['stock'] == 10


class TestOrderModel:
    def test_to_dict_keys(self, db, sample_user):
        from app.models.order import Order
        order = Order(order_date=date.today(), total_price=29.99, status='pending', user_id=sample_user.user_id)
        db.session.add(order)
        db.session.commit()

        d = order.to_dict()
        assert set(d.keys()) == {'order_id', 'user_id', 'order_date', 'total_price', 'status'}

    def test_total_price_is_float(self, db, sample_user):
        from app.models.order import Order
        order = Order(order_date=date.today(), total_price=9.50, status='paid', user_id=sample_user.user_id)
        db.session.add(order)
        db.session.commit()

        assert isinstance(order.to_dict()['total_price'], float)

    def test_order_date_is_string(self, db, sample_user):
        from app.models.order import Order
        order = Order(order_date=date(2026, 1, 1), total_price=5.0, status='pending', user_id=sample_user.user_id)
        db.session.add(order)
        db.session.commit()

        assert order.to_dict()['order_date'] == '2026-01-01'


class TestOrderItemModel:
    def test_to_dict_keys(self, db, sample_product, sample_user):
        from app.models.order import Order
        from app.models.order_item import OrderItem
        order = Order(order_date=date.today(), total_price=19.99, status='pending', user_id=sample_user.user_id)
        db.session.add(order)
        db.session.flush()

        item = OrderItem(
            order_id=order.order_id,
            product_id=sample_product.product_id,
            quantity=1,
            price=19.99,
        )
        db.session.add(item)
        db.session.commit()

        d = item.to_dict()
        assert set(d.keys()) == {
            'order_item_id', 'order_id', 'product_id', 'quantity', 'price'
        }

    def test_price_is_float(self, db, sample_product, sample_user):
        from app.models.order import Order
        from app.models.order_item import OrderItem
        order = Order(order_date=date.today(), total_price=19.99, status='pending', user_id=sample_user.user_id)
        db.session.add(order)
        db.session.flush()

        item = OrderItem(
            order_id=order.order_id,
            product_id=sample_product.product_id,
            quantity=2,
            price=9.99,
        )
        db.session.add(item)
        db.session.commit()

        assert isinstance(item.to_dict()['price'], float)


class TestEventModel:
    def test_to_dict_keys(self, sample_event):
        d = sample_event.to_dict()
        assert set(d.keys()) == {
            'event_id', 'artist_id', 'event_name', 'event_type',
            'event_date', 'location', 'poster',
        }

    def test_event_date_is_string(self, sample_event):
        assert isinstance(sample_event.to_dict()['event_date'], str)

    def test_event_type_value(self, sample_event):
        assert sample_event.to_dict()['event_type'] == 'concert'
