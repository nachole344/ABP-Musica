SELECT
    a.artist_id,
    a.artist_name,
    a.country,
    SUM(oi.quantity * oi.price) AS ingresos_totales
FROM artists a
INNER JOIN products   p  ON a.artist_id  = p.artist_id
INNER JOIN order_items oi ON p.product_id = oi.product_id
INNER JOIN orders      o  ON oi.order_id  = o.order_id
WHERE o.status = 'delivered'
GROUP BY a.artist_id, a.artist_name, a.country
HAVING SUM(oi.quantity * oi.price) = (
    -- subconsulta: ingreso máximo entre todos los artistas
    SELECT MAX(ingreso_artista)
    FROM (
        SELECT SUM(oi2.quantity * oi2.price) AS ingreso_artista
        FROM products    p2
        INNER JOIN order_items oi2 ON p2.product_id = oi2.product_id
        INNER JOIN orders      o2  ON oi2.order_id  = o2.order_id
        WHERE o2.status = 'delivered'
        GROUP BY p2.artist_id
    ) AS ingresos
);