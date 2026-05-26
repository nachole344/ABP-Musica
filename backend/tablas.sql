CREATE TYPE product_type_enum AS ENUM (
'album', 'vinyl', 'clothing', 'tote_bag', 'pin'
);

CREATE TYPE event_type_enum AS ENUM (
'concert', 'tour', 'festival', 'movie', 'tv_series'
);

CREATE TYPE order_status_enum AS ENUM (
'pending', 'paid', 'shipped', 'delivered', 'cancelled'
);


CREATE TABLE IF NOT EXISTS artists (
artist_id INT GENERATED ALWAYS AS IDENTITY,
real_name VARCHAR(150),
artist_name VARCHAR(150),
birth_date DATE,
debut DATE,
country VARCHAR(150),
social_media TEXT,
image TEXT,
description TEXT,
mb_id UUID,

CONSTRAINT pk_artists_artist_id PRIMARY KEY (artist_id),

CONSTRAINT nn_artists_real_name CHECK (real_name IS NOT NULL),
CONSTRAINT nn_artists_artist_name CHECK (artist_name IS NOT NULL),
CONSTRAINT nn_artists_birth_date CHECK (birth_date IS NOT NULL),
CONSTRAINT nn_artists_debut CHECK (debut IS NOT NULL),
CONSTRAINT nn_artists_country CHECK (country IS NOT NULL),
CONSTRAINT nn_artists_social_media CHECK (social_media IS NOT NULL),
CONSTRAINT nn_artists_image CHECK (image IS NOT NULL),
CONSTRAINT nn_artists_mb_id CHECK (mb_id IS NOT NULL),

CONSTRAINT ck_artists_debut CHECK (debut > birth_date),

CONSTRAINT uk_artists_artist_name_real_name UNIQUE (artist_name, real_name),
CONSTRAINT uk_artists_social_media UNIQUE (social_media),
CONSTRAINT uk_artists_image UNIQUE (image),
CONSTRAINT uk_artists_mb_id UNIQUE (mb_id)
);

CREATE TABLE IF NOT EXISTS albums (
album_id INT GENERATED ALWAYS AS IDENTITY,
artist_id INT,
album_title VARCHAR(100),
release_date DATE,
total_track INT,
cover_album TEXT,
spotify TEXT,
mb_album_id UUID,

CONSTRAINT pk_albums_id PRIMARY KEY (album_id),

CONSTRAINT nn_albums_album_title CHECK (album_title IS NOT NULL),
CONSTRAINT nn_albums_release_date CHECK (release_date IS NOT NULL),
CONSTRAINT nn_albums_total_track CHECK (total_track IS NOT NULL),
CONSTRAINT nn_albums_cover_album CHECK (cover_album IS NOT NULL),
CONSTRAINT nn_albums_spotify CHECK (spotify IS NOT NULL),
CONSTRAINT nn_albums_mb_album_id CHECK (mb_album_id IS NOT NULL),

CONSTRAINT fk_albums_artist_id FOREIGN KEY (artist_id) REFERENCES artists (artist_id),

CONSTRAINT uk_albums_artist_id_album_title UNIQUE (artist_id, album_title),
CONSTRAINT uk_albums_cover_album UNIQUE (cover_album),
CONSTRAINT uk_albums_spotify UNIQUE (spotify),
CONSTRAINT uk_albums_mb_album_id UNIQUE (mb_album_id)
);


CREATE TABLE IF NOT EXISTS songs (
song_id INT GENERATED ALWAYS AS IDENTITY,
album_id INT,
song_title VARCHAR(150),
duration TIME,
video_url TEXT,
cover_song TEXT,
mb_song_id UUID,

CONSTRAINT pk_songs_song_id PRIMARY KEY (song_id),

CONSTRAINT nn_songs_song_title CHECK (song_title IS NOT NULL),
CONSTRAINT nn_songs_duration CHECK (duration IS NOT NULL),
CONSTRAINT nn_songs_cover_song CHECK (cover_song IS NOT NULL),
CONSTRAINT nn_songs_mb_song_id CHECK (mb_song_id IS NOT NULL),

CONSTRAINT ck_songs_duration CHECK (duration > '00:00:00'),

CONSTRAINT fk_songs_album_id FOREIGN KEY (album_id) REFERENCES albums (album_id),

CONSTRAINT uk_songs_album_id_song_title UNIQUE (album_id, song_title),
CONSTRAINT uk_songs_video_url UNIQUE (video_url),
CONSTRAINT uk_songs_cover_song UNIQUE (cover_song),
CONSTRAINT uk_songs_mb_song_id UNIQUE (mb_song_id)
);

CREATE TABLE IF NOT EXISTS products (
product_id INT GENERATED ALWAYS AS IDENTITY,
artist_id INT,
product_name VARCHAR(250),
product_type product_type_enum,
price DECIMAL(10,2),
stock INT,
image_url TEXT,

CONSTRAINT pk_products_product_id PRIMARY KEY (product_id),

CONSTRAINT nn_products_product_name CHECK (product_name IS NOT NULL),
CONSTRAINT nn_products_product_type CHECK (product_type IS NOT NULL),
CONSTRAINT nn_products_price CHECK (price IS NOT NULL),
CONSTRAINT nn_products_stock CHECK (stock IS NOT NULL),
CONSTRAINT nn_products_image_url CHECK (image_url IS NOT NULL),

CONSTRAINT ck_products_price CHECK (price >= 0),
CONSTRAINT ck_products_stock CHECK (stock >= 0),

CONSTRAINT fk_products_artist_id FOREIGN KEY (artist_id) REFERENCES artists (artist_id),

CONSTRAINT uk_products_product_name UNIQUE (product_name),
CONSTRAINT uk_products_image_url UNIQUE (image_url)
);

CREATE TABLE IF NOT EXISTS events (
event_id INT GENERATED ALWAYS AS IDENTITY,
artist_id INT,
event_name VARCHAR(250),
event_type event_type_enum,
event_date DATE,
location VARCHAR(100),
poster TEXT,

CONSTRAINT pk_events_event_id PRIMARY KEY (event_id),

CONSTRAINT nn_events_event_name CHECK (event_name IS NOT NULL),
CONSTRAINT nn_events_event_type CHECK (event_type IS NOT NULL),
CONSTRAINT nn_events_event_date CHECK (event_date IS NOT NULL),
CONSTRAINT nn_events_poster CHECK (poster IS NOT NULL),

CONSTRAINT fk_events_artist_id FOREIGN KEY (artist_id) REFERENCES artists (artist_id),

CONSTRAINT uk_events_artist_id_event_name UNIQUE (artist_id, event_name),
CONSTRAINT uk_events_poster UNIQUE (poster)
);

CREATE TABLE IF NOT EXISTS carts (
cart_id INT GENERATED ALWAYS AS IDENTITY,
product_id INT,
quantity INT,

CONSTRAINT pk_carts_cart_id PRIMARY KEY (cart_id),

CONSTRAINT nn_carts_quantity CHECK (quantity IS NOT NULL),

CONSTRAINT ck_carts_quantity CHECK (quantity > 0),

CONSTRAINT fk_carts_product_id FOREIGN KEY (product_id) REFERENCES products (product_id),

CONSTRAINT uk_cart_product_id UNIQUE (product_id)
);

CREATE TABLE IF NOT EXISTS orders (
order_id INT GENERATED ALWAYS AS IDENTITY,
order_date DATE,
total_price DECIMAL(10, 2),
status order_status_enum,

CONSTRAINT pk_orders_order_id PRIMARY KEY (order_id),

CONSTRAINT nn_orders_order_date CHECK (order_date IS NOT NULL),
CONSTRAINT nn_orders_total_price CHECK (total_price IS NOT NULL),
CONSTRAINT nn_orders_status CHECK (status IS NOT NULL),

CONSTRAINT ck_orders_total_price CHECK (total_price >= 0)
);

CREATE TABLE IF NOT EXISTS order_items (
order_item_id INT GENERATED ALWAYS AS IDENTITY,
order_id INT,
product_id INT,
quantity INT,
price DECIMAL(10, 2),

CONSTRAINT pk_order_items_order_item_id PRIMARY KEY (order_item_id),

CONSTRAINT nn_order_items_quantity CHECK (quantity IS NOT NULL),
CONSTRAINT nn_order_items_price CHECK (price IS NOT NULL),

CONSTRAINT ck_order_items_quantity CHECK (quantity > 0),
CONSTRAINT ck_order_items_price CHECK (price >= 0),

CONSTRAINT fk_order_items_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id),
CONSTRAINT fk_order_items_product_id FOREIGN KEY (product_id) REFERENCES products (product_id)
);

CREATE TABLE IF NOT EXISTS users (
user_id INT GENERATED ALWAYS AS IDENTITY,
username VARCHAR(50),
password VARCHAR(50),

CONSTRAINT pk_users_user_id PRIMARY KEY (user_id),

CONSTRAINT nn_users_username CHECK (username IS NOT NULL),
CONSTRAINT nn_users_password CHECK (password IS NOT NULL),

CONSTRAINT uk_users_username UNIQUE (username)
);
