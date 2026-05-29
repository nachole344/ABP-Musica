-- ============================================================
--  INSERTS DE PRUEBA — TODAS LAS TABLAS
--  Orden respetando dependencias de claves foráneas
-- ============================================================


-- ============================================================
-- 1. ARTISTS
-- ============================================================
INSERT INTO artists (real_name, artist_name, birth_date, debut, country, social_media, image, description, mb_id) VALUES
('Taylor Alison Swift',   'Taylor Swift',   '1989-12-13', '2006-06-19', 'United States', 'https://instagram.com/taylorswift', 'https://cdn.music/artists/taylor.jpg',   'Singer-songwriter and pop icon.',         'a74b1b7f-71a5-11e0-91ba-0024234c032a'),
('Robyn Rihanna Fenty',   'Rihanna',        '1988-02-20', '2005-05-01', 'Barbados',      'https://instagram.com/badgalriri',   'https://cdn.music/artists/rihanna.jpg',  'Pop and R&B superstar.',                  'db36a76f-3c3a-4823-8d0b-2d975e72843b'),
('Abel Makkonen Tesfaye', 'The Weeknd',     '1990-02-16', '2011-11-21', 'Canada',        'https://instagram.com/theweeknd',    'https://cdn.music/artists/weeknd.jpg',   'R&B and synth-pop artist.',               'a550f952-b28e-4491-9a03-6e6bcb3cb0aa'),
('Billie Eilish OConnell','Billie Eilish',  '2001-12-18', '2016-11-18', 'United States', 'https://instagram.com/billieeilish', 'https://cdn.music/artists/billie.jpg',   'Alternative pop singer-songwriter.',      '2e3b7b2c-4c9d-4e1a-8d6f-1a9b8c7d5e4f'),
('Doja Cat',              'Doja Cat',        '1995-10-21', '2018-03-31', 'United States', 'https://instagram.com/dojacat',      'https://cdn.music/artists/doja.jpg',     'Rapper, singer and internet phenomenon.', '3f4c8e1a-5d6b-4a2c-9e7f-8b0a1c2d3e4f');


-- ============================================================
-- 2. ALBUMS
-- ============================================================
INSERT INTO albums (artist_id, album_title, release_date, total_track, cover_album, spotify, mb_album_id) VALUES
-- Taylor Swift (artist_id = 1)
(1, 'Fearless',      '2008-11-11', 13, 'https://cdn.music/covers/fearless.jpg',      'https://open.spotify.com/album/fearless',      '1a2b3c4d-1111-1111-1111-aaaaaaaaaaaa'),
(1, 'Lover',         '2019-08-23', 18, 'https://cdn.music/covers/lover.jpg',          'https://open.spotify.com/album/lover',          '1a2b3c4d-2222-2222-2222-bbbbbbbbbbbb'),
-- Rihanna (artist_id = 2)
(2, 'Good Girl Gone Bad', '2007-05-31', 13, 'https://cdn.music/covers/gggb.jpg',     'https://open.spotify.com/album/gggb',           '2b3c4d5e-3333-3333-3333-cccccccccccc'),
-- The Weeknd (artist_id = 3)
(3, 'After Hours',   '2020-03-20', 14, 'https://cdn.music/covers/afterhours.jpg',    'https://open.spotify.com/album/afterhours',     '3c4d5e6f-4444-4444-4444-dddddddddddd'),
-- Billie Eilish (artist_id = 4)
(4, 'When We All Fall Asleep', '2019-03-29', 14, 'https://cdn.music/covers/wwafa.jpg','https://open.spotify.com/album/wwafa',         '4d5e6f7a-5555-5555-5555-eeeeeeeeeeee'),
-- Doja Cat (artist_id = 5)
(5, 'Planet Her',    '2021-06-25', 16, 'https://cdn.music/covers/planether.jpg',     'https://open.spotify.com/album/planether',      '5e6f7a8b-6666-6666-6666-ffffffffffff');


-- ============================================================
-- 3. SONGS
-- ============================================================
INSERT INTO songs (album_id, song_title, duration, video_url, cover_song, mb_song_id) VALUES
-- Fearless (album_id = 1)
(1, 'Love Story',         '00:03:55', 'https://youtube.com/watch?v=lovestory',   'https://cdn.music/songs/lovestory.jpg',   'aaaa0001-0001-0001-0001-000000000001'),
(1, 'You Belong With Me', '00:03:51', 'https://youtube.com/watch?v=youbelong',   'https://cdn.music/songs/youbelong.jpg',   'aaaa0001-0001-0001-0001-000000000002'),
-- Lover (album_id = 2)
(2, 'Cruel Summer',       '00:02:58', 'https://youtube.com/watch?v=cruelsummer', 'https://cdn.music/songs/cruelsummer.jpg', 'aaaa0002-0002-0002-0002-000000000003'),
(2, 'Lover',              '00:03:41', 'https://youtube.com/watch?v=loversong',   'https://cdn.music/songs/loversong.jpg',   'aaaa0002-0002-0002-0002-000000000004'),
-- Good Girl Gone Bad (album_id = 3)
(3, 'Umbrella',           '00:04:35', 'https://youtube.com/watch?v=umbrella',    'https://cdn.music/songs/umbrella.jpg',    'aaaa0003-0003-0003-0003-000000000005'),
(3, 'SOS',                '00:03:23', 'https://youtube.com/watch?v=sossong',     'https://cdn.music/songs/sos.jpg',         'aaaa0003-0003-0003-0003-000000000006'),
-- After Hours (album_id = 4)
(4, 'Blinding Lights',    '00:03:20', 'https://youtube.com/watch?v=blindinglights','https://cdn.music/songs/blinding.jpg',  'aaaa0004-0004-0004-0004-000000000007'),
(4, 'Save Your Tears',    '00:03:35', 'https://youtube.com/watch?v=saveyourtears','https://cdn.music/songs/saveyourtears.jpg','aaaa0004-0004-0004-0004-000000000008'),
-- When We All Fall Asleep (album_id = 5)
(5, 'bad guy',            '00:03:14', 'https://youtube.com/watch?v=badguy',      'https://cdn.music/songs/badguy.jpg',      'aaaa0005-0005-0005-0005-000000000009'),
(5, 'bury a friend',      '00:03:14', 'https://youtube.com/watch?v=buryafriend', 'https://cdn.music/songs/buryafriend.jpg', 'aaaa0005-0005-0005-0005-000000000010'),
-- Planet Her (album_id = 6)
(6, 'Kiss Me More',       '00:03:29', 'https://youtube.com/watch?v=kissmemore',  'https://cdn.music/songs/kissmemore.jpg',  'aaaa0006-0006-0006-0006-000000000011'),
(6, 'Need to Know',       '00:03:16', 'https://youtube.com/watch?v=needtoknow',  'https://cdn.music/songs/needtoknow.jpg',  'aaaa0006-0006-0006-0006-000000000012');


-- ============================================================
-- 4. PRODUCTS
-- ============================================================
INSERT INTO products (artist_id, product_name, product_type, price, stock, image_url) VALUES
-- Taylor Swift
(1, 'Taylor Swift Fearless Vinyl',          'vinyl',    29.99, 150, 'https://cdn.music/products/ts-vinyl-fearless.jpg'),
(1, 'Taylor Swift Lover Album CD',          'album',    14.99, 200, 'https://cdn.music/products/ts-album-lover.jpg'),
(1, 'Taylor Swift Eras Tour Tee',           'clothing', 34.99,  80, 'https://cdn.music/products/ts-shirt-eras.jpg'),
(1, 'Taylor Swift Logo Tote Bag',           'tote_bag', 19.99,  60, 'https://cdn.music/products/ts-tote.jpg'),
-- Rihanna
(2, 'Rihanna Umbrella Vinyl',               'vinyl',    27.99, 100, 'https://cdn.music/products/rih-vinyl.jpg'),
(2, 'Rihanna Fenty Enamel Pin',             'pin',       9.99, 300, 'https://cdn.music/products/rih-pin.jpg'),
(2, 'Rihanna Good Girl Gone Bad Tee',       'clothing', 29.99,  90, 'https://cdn.music/products/rih-shirt.jpg'),
-- The Weeknd
(3, 'The Weeknd After Hours Vinyl',         'vinyl',    31.99, 120, 'https://cdn.music/products/wknd-vinyl.jpg'),
(3, 'The Weeknd Starboy Tote',              'tote_bag', 18.99,  50, 'https://cdn.music/products/wknd-tote.jpg'),
(3, 'The Weeknd Blinding Lights Pin',       'pin',       8.99, 250, 'https://cdn.music/products/wknd-pin.jpg'),
-- Billie Eilish
(4, 'Billie Eilish WWAFA Album CD',         'album',    13.99, 180, 'https://cdn.music/products/be-album.jpg'),
(4, 'Billie Eilish Oversized Hoodie',       'clothing', 49.99,  40, 'https://cdn.music/products/be-hoodie.jpg'),
(4, 'Billie Eilish Spider Pin',             'pin',       7.99, 400, 'https://cdn.music/products/be-pin.jpg'),
-- Doja Cat
(5, 'Doja Cat Planet Her Vinyl',            'vinyl',    26.99, 110, 'https://cdn.music/products/doja-vinyl.jpg'),
(5, 'Doja Cat Neon Logo Tee',               'clothing', 32.99,  70, 'https://cdn.music/products/doja-shirt.jpg');


-- ============================================================
-- 5. EVENTS
-- ============================================================
INSERT INTO events (artist_id, event_name, event_type, event_date, location, poster) VALUES
(1, 'The Eras Tour — Madrid',           'concert',  '2024-05-30', 'Madrid, Spain',          'https://cdn.music/posters/ts-eras-madrid.jpg'),
(1, 'The Eras Tour — Barcelona',        'concert',  '2024-06-01', 'Barcelona, Spain',       'https://cdn.music/posters/ts-eras-bcn.jpg'),
(1, 'Lover Fest 2020',                  'festival', '2020-07-25', 'Los Angeles, USA',       'https://cdn.music/posters/ts-loverfest.jpg'),
(2, 'Rihanna Super Bowl LVII Halftime', 'concert',  '2023-02-12', 'Glendale, USA',          'https://cdn.music/posters/rih-superbowl.jpg'),
(2, 'Diamonds World Tour',              'tour',     '2013-03-18', 'Montreal, Canada',       'https://cdn.music/posters/rih-diamondstour.jpg'),
(3, 'After Hours Til Dawn Tour',        'tour',     '2022-07-08', 'Toronto, Canada',        'https://cdn.music/posters/wknd-afterhours.jpg'),
(3, 'The Idol Premiere',                'tv_series','2023-05-15', 'Los Angeles, USA',       'https://cdn.music/posters/wknd-theidol.jpg'),
(4, 'Happier Than Ever World Tour',     'tour',     '2022-02-03', 'New Orleans, USA',       'https://cdn.music/posters/be-happier.jpg'),
(4, 'Billie Eilish at Glastonbury',     'festival', '2019-06-29', 'Somerset, UK',           'https://cdn.music/posters/be-glastonbury.jpg'),
(5, 'Planet Her Tour',                  'tour',     '2022-08-19', 'Austin, USA',            'https://cdn.music/posters/doja-planether.jpg'),
(5, 'Coachella 2022',                   'festival', '2022-04-15', 'Indio, USA',             'https://cdn.music/posters/doja-coachella.jpg');


-- ============================================================
-- 6. USERS
-- ============================================================
INSERT INTO users (username, password) VALUES
('swiftie_forever',  'hashed_pass_001'),
('rihanna_fan_92',   'hashed_pass_002'),
('weeknd_vibes',     'hashed_pass_003'),
('eilish_darkside',  'hashed_pass_004'),
('dojacat_stan',     'hashed_pass_005');


-- ============================================================
-- 7. ORDERS
-- ============================================================
INSERT INTO orders (order_date, total_price, status) VALUES
('2024-01-15', 64.97,  'delivered'),
('2024-02-03', 29.99,  'delivered'),
('2024-03-10', 79.97,  'shipped'),
('2024-04-22', 44.98,  'paid'),
('2024-05-01', 13.99,  'pending'),
('2024-05-18', 59.98,  'cancelled'),
('2024-06-02', 98.96,  'delivered'),
('2024-06-15', 27.99,  'delivered');


-- ============================================================
-- 8. ORDER ITEMS
-- ============================================================
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
-- Pedido 1: vinyl Fearless + Lover CD + pin Rihanna
(1, 1,  1, 29.99),   -- Taylor Swift Fearless Vinyl
(1, 2,  1, 14.99),   -- Taylor Swift Lover CD
(1, 6,  2,  9.99),   -- Rihanna Enamel Pin x2
-- Pedido 2: vinyl After Hours
(2, 8,  1, 29.99),   -- The Weeknd After Hours Vinyl
-- Pedido 3: hoodie Billie + tote Weeknd + pin spider
(3, 12, 1, 49.99),   -- Billie Eilish Hoodie
(3, 9,  1, 18.99),   -- The Weeknd Starboy Tote
(3, 13, 1,  7.99),   -- Billie Eilish Spider Pin
-- Pedido 4: tee Doja + pin Weeknd
(4, 15, 1, 32.99),   -- Doja Cat Neon Logo Tee
(4, 10, 1,  8.99),   -- The Weeknd Blinding Lights Pin
-- Pedido 5: Billie CD
(5, 11, 1, 13.99),   -- Billie Eilish WWAFA CD
-- Pedido 6 (cancelado): tote Taylor + tee Rihanna
(6, 4,  1, 19.99),   -- Taylor Swift Tote Bag
(6, 7,  1, 29.99),   -- Rihanna Good Girl Gone Bad Tee
-- Pedido 7: 3 vinilos + tee Taylor
(7, 14, 1, 26.99),   -- Doja Cat Planet Her Vinyl
(7, 5,  1, 27.99),   -- Rihanna Umbrella Vinyl
(7, 8,  1, 31.99),   -- Weeknd After Hours Vinyl
(7, 3,  1, 34.99),   -- Taylor Swift Eras Tour Tee  (34.99 → ajustado, total 121.96 aprox)
-- Pedido 8: vinyl Rihanna
(8, 5,  1, 27.99);   -- Rihanna Umbrella Vinyl


-- ============================================================
-- 9. CARTS
-- ============================================================
INSERT INTO carts (product_id, quantity) VALUES
(1,  2),   -- 2 x Fearless Vinyl en carrito
(3,  1),   -- 1 x Eras Tour Tee
(8,  1),   -- 1 x After Hours Vinyl
(12, 1),   -- 1 x Billie Hoodie
(15, 3);   -- 3 x Doja Neon Tee
