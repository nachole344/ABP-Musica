"""E2E test configuration. Requires the Docker stack running on localhost."""
import pytest

FRONTEND_URL = 'http://localhost:8000'
API_URL = 'http://localhost:5000'


@pytest.fixture(scope='session')
def base_url():
    return FRONTEND_URL


@pytest.fixture(scope='session')
def api_url():
    return API_URL
