"""E2E tests for the homepage. Requires Docker stack running."""
from playwright.sync_api import Page, expect

FRONTEND = 'http://localhost:8000'


def _load(page: Page, width: int = 1280, height: int = 800):
    page.set_viewport_size({'width': width, 'height': height})
    # domcontentloaded avoids waiting for heavy media (home-bg.mp4)
    page.goto(FRONTEND, wait_until='domcontentloaded')
    page.wait_for_timeout(800)


def test_page_loads(page: Page):
    page.goto(FRONTEND, wait_until='domcontentloaded')
    assert page.url == f'{FRONTEND}/'


def test_sidebar_is_visible_on_desktop(page: Page):
    _load(page)
    expect(page.locator('.sidebar')).to_be_visible()


def test_mobile_header_visible_on_small_screen(page: Page):
    _load(page, width=390, height=844)
    expect(page.locator('header.mobile-header')).to_be_visible()


def test_nav_home_link_exists(page: Page):
    _load(page)
    expect(page.locator('#nav-home')).to_be_attached()


def test_artists_section_reachable(page: Page):
    _load(page)
    page.locator('#nav-artists').click()
    page.wait_for_timeout(500)


def test_shop_section_reachable(page: Page):
    _load(page)
    page.locator('#nav-shop').click()
    page.wait_for_timeout(500)
