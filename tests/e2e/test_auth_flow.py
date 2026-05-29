"""E2E tests for login / logout flow. Requires Docker stack running."""
import requests
from playwright.sync_api import Page, expect

FRONTEND = 'http://localhost:8000'
API = 'http://localhost:5000'

TEST_USER = 'e2euser'
TEST_PASS = 'e2epass123'


def _load(page: Page):
    page.set_viewport_size({'width': 1280, 'height': 800})
    page.goto(FRONTEND, wait_until='domcontentloaded')
    page.wait_for_timeout(800)


def _ensure_user():
    requests.post(f'{API}/api/auth/register', json={
        'username': TEST_USER, 'password': TEST_PASS
    })


def test_login_link_exists_in_sidebar(page: Page):
    _load(page)
    expect(page.locator('#nav-login')).to_be_attached()


def test_login_link_has_text(page: Page):
    _load(page)
    expect(page.locator('#login-label')).to_contain_text('Iniciar')


def test_successful_login(page: Page):
    _ensure_user()
    _load(page)

    page.locator('#nav-login').click()
    page.wait_for_timeout(400)

    page.locator('#login-username').fill(TEST_USER)
    page.locator('#login-password').fill(TEST_PASS)
    page.locator('#login-form button[type="submit"]').click()
    page.wait_for_timeout(800)

    label = page.locator('#login-label').inner_text()
    assert 'Iniciar' not in label, f'Login no actualizó el label: "{label}"'


def test_wrong_credentials_shows_error(page: Page):
    _load(page)

    page.locator('#nav-login').click()
    page.wait_for_timeout(400)

    page.locator('#login-username').fill('nadiesabe')
    page.locator('#login-password').fill('malpass')
    page.locator('#login-form button[type="submit"]').click()
    page.wait_for_timeout(800)

    # Error message appears
    expect(page.locator('#login-error')).to_be_visible()
