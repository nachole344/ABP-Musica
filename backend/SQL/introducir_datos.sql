INSERT INTO artists 
(real_name, artist_name, birth_date, debut, country, social_media, image, mb_id)
VALUES
('Dua Lipa', 'Dua Lipa', '1995-08-22', '2015-01-01', 'UK',
'https://instagram.com/dualipa',
'https://image.dualipa.jpg',
'123e4567-e89b-12d3-a456-426614174000');

INSERT INTO artists 
(real_name, artist_name, birth_date, debut, country, social_media, image, mb_id)
VALUES
('Dua Lipa', 'Dua Lipa', '1995-08-22', '2015-01-01', 'UK',
'https://instagram.com/dualipa',
'https://image.dualipa.jpg',
'123e4567-e89b-12d3-a456-426614174000');


INSERT INTO songs
(album_id, song_title, duration, video_url, cover_song, mb_song_id)
VALUES
(1, 'Levitating', '00:03:23',
'https://youtube.com/levitating',
'https://cover.levitating.jpg',
'323e4567-e89b-12d3-a456-426614174000');



INSERT INTO products
(artist_id, product_name, product_type, price, stock, image_url)
VALUES
(1, 'Future Nostalgia Vinyl', 'vinyl', 24.99, 40,
'https://product.fn.vinyl.jpg');

INSERT INTO events
(artist_id, event_name, event_type, event_date, location, poster)
VALUES
(1, 'Future Nostalgia Tour', 'tour', '2023-06-10', 'London',
'https://poster.fn.jpg');


INSERT INTO carts
(product_id, quantity)
VALUES
(1, 2);

INSERT INTO orders
(order_date, total_price, status)
VALUES
('2024-02-01', 49.98, 'paid');

INSERT INTO order_items
(order_id, product_id, quantity, price)
VALUES
(1, 1, 2, 24.99);

INSERT INTO users
(username, password)
VALUES
('test_user', '123456');


DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM carts;
DELETE FROM products;
DELETE FROM songs;
DELETE FROM albums;
DELETE FROM events;
DELETE FROM artists;
DELETE FROM users;