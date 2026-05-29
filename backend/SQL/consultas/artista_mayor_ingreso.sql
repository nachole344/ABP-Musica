-- Consulta  al artista que mas dinero ha generado en pedidos entregados
SELECT
    a.artist_id,
    a.artist_name,
    a.country,

    -- SUM: suma de (unidades * precio) para todos los productos del artista
    SUM(oi.quantity * oi.price) AS ingresos_totales

FROM artists a

    -- JOIN 1: conectamos artistas con sus productos
    INNER JOIN products    p  ON a.artist_id  = p.artist_id

    -- JOIN 2: conectamos productos con las lineas de pedido donde se vendieron
    INNER JOIN order_items oi ON p.product_id = oi.product_id

    -- JOIN 3: conectamos pedidos para poder filtrar por estado
    INNER JOIN orders      o  ON oi.order_id  = o.order_id

-- Solo contamos pedidos que ya han sido entregados 
WHERE o.status = 'delivered'

-- GROUP BY: agrupamos por artista para obtener el total de cada uno
GROUP BY a.artist_id, a.artist_name, a.country

-- HAVING con subconsulta de dos niveles:
-- Solo mostramos el artista cuyo SUM coincide con el maximo de todos
HAVING SUM(oi.quantity * oi.price) = (

    -- SUBCONSULTA EXTERNA: obtiene el ingreso maximo entre todos los artistas
    SELECT MAX(ingreso_artista)
    FROM (

        -- SUBCONSULTA INTERNA: calcula el ingreso total de cada artista
        SELECT SUM(oi2.quantity * oi2.price) AS ingreso_artista
        FROM   products    p2
        INNER JOIN order_items oi2 ON p2.product_id = oi2.product_id
        INNER JOIN orders      o2  ON oi2.order_id  = o2.order_id
        WHERE  o2.status = 'delivered'
        -- Agrupamos por artista para tener un ingreso por cada uno
        GROUP BY p2.artist_id

    ) AS ingresos -- alias obligatorio para la subconsulta
);