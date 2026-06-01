"""API tests for /api/orders endpoints."""
import pytest


class TestGetOrders:
    def test_unauthenticated_returns_401(self, client, db):
        r = client.get('/api/orders/')
        assert r.status_code == 401

    def test_returns_empty_list(self, logged_in_client):
        client, _ = logged_in_client
        r = client.get('/api/orders/')
        assert r.status_code == 200
        assert r.get_json() == []


class TestGetOrderItems:
    def test_returns_empty_list(self, client, db):
        r = client.get('/api/orders/items/')
        assert r.status_code == 200
        assert r.get_json() == []


class TestCreateOrder:
    def test_unauthenticated_returns_401(self, client, db):
        r = client.post('/api/orders/', json={'items': []})
        assert r.status_code == 401

    def test_empty_items_returns_400(self, logged_in_client):
        client, _ = logged_in_client
        r = client.post('/api/orders/', json={'items': []})
        assert r.status_code == 400

    def test_missing_items_key_returns_400(self, logged_in_client):
        client, _ = logged_in_client
        r = client.post('/api/orders/', json={})
        assert r.status_code == 400

    def test_product_not_found_returns_404(self, logged_in_client):
        client, _ = logged_in_client
        r = client.post('/api/orders/', json={
            'items': [{'product_id': 9999, 'quantity': 1}]
        })
        assert r.status_code == 404

    def test_success_creates_order(self, logged_in_client, sample_product):
        client, _ = logged_in_client
        r = client.post('/api/orders/', json={
            'items': [{'product_id': sample_product.product_id, 'quantity': 2}]
        })
        assert r.status_code == 201
        data = r.get_json()
        assert 'order_id' in data
        assert data['total'] == pytest.approx(39.98, rel=1e-3)

    def test_success_decrements_stock(self, logged_in_client, sample_product, db):
        client, _ = logged_in_client
        initial_stock = sample_product.stock
        client.post('/api/orders/', json={
            'items': [{'product_id': sample_product.product_id, 'quantity': 3}]
        })
        db.session.refresh(sample_product)
        assert sample_product.stock == initial_stock - 3

    def test_insufficient_stock_returns_409(self, logged_in_client, sample_product):
        client, _ = logged_in_client
        r = client.post('/api/orders/', json={
            'items': [{'product_id': sample_product.product_id, 'quantity': 999}]
        })
        assert r.status_code == 409

    def test_invalid_quantity_returns_400(self, logged_in_client, sample_product):
        client, _ = logged_in_client
        r = client.post('/api/orders/', json={
            'items': [{'product_id': sample_product.product_id, 'quantity': 0}]
        })
        assert r.status_code == 400

    def test_order_appears_in_get_orders(self, logged_in_client, sample_product):
        client, _ = logged_in_client
        client.post('/api/orders/', json={
            'items': [{'product_id': sample_product.product_id, 'quantity': 1}]
        })
        orders = client.get('/api/orders/').get_json()
        assert len(orders) == 1
        assert orders[0]['status'] == 'pending'
