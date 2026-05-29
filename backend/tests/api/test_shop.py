"""API tests for /api/shop endpoints."""


class TestGetProducts:
    def test_returns_empty_list(self, client, db):
        r = client.get('/api/shop/')
        assert r.status_code == 200
        assert r.get_json() == []

    def test_returns_product_list(self, client, sample_product):
        r = client.get('/api/shop/')
        data = r.get_json()
        assert len(data) == 1
        assert data[0]['product_name'] == 'Test Album CD'

    def test_product_has_required_keys(self, client, sample_product):
        product = client.get('/api/shop/').get_json()[0]
        for key in ('product_id', 'product_name', 'product_type', 'price', 'stock'):
            assert key in product

    def test_price_is_float(self, client, sample_product):
        product = client.get('/api/shop/').get_json()[0]
        assert isinstance(product['price'], float)


class TestGetProductById:
    def test_found(self, client, sample_product):
        r = client.get(f'/api/shop/{sample_product.product_id}')
        assert r.status_code == 200
        assert r.get_json()['product_id'] == sample_product.product_id

    def test_not_found(self, client, db):
        r = client.get('/api/shop/9999')
        assert r.status_code == 404
