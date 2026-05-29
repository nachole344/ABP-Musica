"""E2E tests for shop / cart flow. Requires Docker stack running."""
from playwright.sync_api import Page, expect

FRONTEND = 'http://localhost:8000'
API = 'http://localhost:5000'


def _load(page: Page):
    page.set_viewport_size({'width': 1280, 'height': 800})
    page.goto(FRONTEND, wait_until='domcontentloaded')
    page.wait_for_timeout(800)


def test_api_shop_returns_products(page: Page):
    r = page.request.get(f'{API}/api/shop/')
    assert r.ok
    assert isinstance(r.json(), list)


def test_api_artists_returns_list(page: Page):
    r = page.request.get(f'{API}/api/artists/')
    assert r.ok
    assert isinstance(r.json(), list)


def test_api_events_returns_list(page: Page):
    r = page.request.get(f'{API}/api/events/')
    assert r.ok
    assert isinstance(r.json(), list)


def test_nav_shop_link_exists(page: Page):
    _load(page)
    expect(page.locator('#nav-shop')).to_be_attached()


def test_shop_section_renders_after_click(page: Page):
    _load(page)
    page.locator('#nav-shop').click()
    page.wait_for_timeout(800)
    expect(page.locator('#shop-section')).to_be_attached()


def test_cart_sidebar_exists_in_dom(page: Page):
    _load(page)
    expect(page.locator('#cartSidebar')).to_be_attached()


def test_cart_count_starts_at_zero(page: Page):
    _load(page)
    count = page.locator('#cart-count').inner_text()
    assert count.strip() == '0'
