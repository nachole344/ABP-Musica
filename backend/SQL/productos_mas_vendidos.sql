-- vista para consultar los productos mas vendidos
CREATE OR REPLACE VIEW productos_mas_vendidos AS

SELECT
    p.product_id,
    p.product_name,
    p.product_type,
    p.price,

    -- COUNT: cuenta en cuantos pedios esta cada producto
    COUNT(oi.order_item_id)      AS total_pedidos,

    -- SUM: suma todas la cantdad que fue vendido
    SUM(oi.quantity)             AS unidades_vendidas,

    -- SUM: multiplica cantidad * precio 
    SUM(oi.quantity * oi.price)  AS ingresos_totales

FROM products p

    -- INNER JOIN: une products con order_items (solo productos que han sido pedidos)
    INNER JOIN order_items oi ON p.product_id = oi.product_id

    -- Segundo JOIN: lleva hasta la tabla orders para poder filtrar por estado
    INNER JOIN orders o       ON oi.order_id  = o.order_id

-- WHERE: para excluir pedidos cancelados o pendientes pq no llegan a ser ventas reales
WHERE o.status NOT IN ('cancelled', 'pending')

-- GROUP BY: agrupa los resultados por producto
GROUP BY p.product_id, p.product_name, p.product_type, p.price

-- ORDER BY: lo mas vendido aparece primero
ORDER BY unidades_vendidas DESC;