-- Consulta que da solo los pedidos que su importe supera la media total
SELECT
    o.order_id,
    o.order_date,
    o.status,

    -- COUNT: cantidad de productos que tiene un pedido
    COUNT(oi.order_item_id)      AS lineas_pedido,

    -- SUM: importe real  cantidad * precio unitario
    SUM(oi.quantity * oi.price)  AS total_calculado,

    -- total_price: importe guardado al comprar/pagar
    o.total_price                AS total_registrado

FROM orders o

    -- JOIN: lineas del pedido para el calculo
    INNER JOIN order_items oi ON o.order_id = oi.order_id

-- GROUP BY: agrupamos por pedido 
GROUP BY o.order_id, o.order_date, o.status, o.total_price

-- HAVING filtra despues de agrupar
HAVING SUM(oi.quantity * oi.price) > (

    -- SUBCONSULTA ESCALAR: devuelve la media de total_price
    -- se compara con el SUM de cada grupo
    SELECT AVG(total_price)
    FROM   orders
    -- Excluimos cancelados
    WHERE  status NOT IN ('cancelled')
)

-- Los pedidos de mayor importe primero
ORDER BY total_calculado DESC;