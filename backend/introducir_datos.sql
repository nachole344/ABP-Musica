-- =====================
-- ARTISTS
-- =====================
INSERT INTO artists 
(real_name, artist_name, birth_date, debut, country, social_media, image, description)
VALUES
('Rosalía Vila Tobella', 'Rosalía', '1992-09-25', '2017-01-01', 'Spain',
'https://instagram.com/rosalia.vt',
'https://image.rosalia.jpg',
'Spanish singer known for blending flamenco with pop and urban music'),

('Abel Makkonen Tesfaye', 'The Weeknd', '1990-02-16', '2011-01-01', 'Canada',
'https://instagram.com/theweeknd',
'https://image.weeknd.jpg',
'Canadian singer known for R&B and pop music');


-- =====================
-- ALBUMS
-- =====================
INSERT INTO albums
(artist_id, album_title, release_date, total_track, cover_album, spotify)
VALUES
(1, 'Motomami', '2022-03-18', 16,
'https://cover.motomami.jpg',
'https://spotify.com/motomami'),

(2, 'After Hours', '2020-03-20', 14,
'https://cover.afterhours.jpg',
'https://spotify.com/afterhours');


-- =====================
-- SONGS
-- =====================
INSERT INTO songs
(album_id, song_title, duration, video_url, cover_song)
VALUES
(1, 'Saoko', '00:02:17',
'https://youtube.com/saoko',
'https://cover.saoko.jpg'),

(2, 'Blinding Lights', '00:03:20',
'https://youtube.com/blindinglights',
'https://cover.blindinglights.jpg');


-- =====================
-- PRODUCTS
-- =====================
INSERT INTO products
(artist_id, product_name, product_type, price, stock, image_url)
VALUES
(1, 'Motomami Vinyl', 'vinyl', 29.99, 50,
'https://product.motomami.vinyl.jpg'),

(2, 'After Hours Hoodie', 'clothing', 59.99, 30,
'https://product.afterhours.hoodie.jpg');


-- =====================
-- EVENTS
-- =====================
INSERT INTO events
(artist_id, event_name, event_type, event_date, location, poster)
VALUES
(1, 'Motomami World Tour', 'tour', '2022-07-01', 'Barcelona',
'https://poster.motomami.jpg'),

(2, 'After Hours Tour', 'tour', '2022-08-15', 'Los Angeles',
'https://poster.afterhours.jpg');


-- =====================
-- CARTS
-- =====================
INSERT INTO carts
(product_id, quantity)
VALUES
(1, 2),
(2, 1);


-- =====================
-- ORDERS
-- =====================
INSERT INTO orders
(order_date, total_price, status)
VALUES
('2024-01-10', 89.98, 'paid'),
('2024-01-12', 59.99, 'shipped');


-- =====================
-- ORDER ITEMS
-- =====================
INSERT INTO order_items
(order_id, product_id, quantity, price)
VALUES
(1, 1, 2, 29.99),
(2, 2, 1, 59.99);


-- =====================
-- USERS
-- =====================
INSERT INTO users
(username, password)
VALUES
('user1', 'user123'),
('fan_rosalia', 'motomami');