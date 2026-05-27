
CREATE OR REPLACE VIEW productos_mas_vendidos AS
SELECT
    p.product_id,
    p.product_name,
    p.product_type,
    p.price,
    COUNT(oi.order_item_id)      AS total_pedidos,
    SUM(oi.quantity)             AS unidades_vendidas,
    SUM(oi.quantity * oi.price)  AS ingresos_totales
FROM products p
INNER JOIN order_items oi ON p.product_id = oi.product_id
INNER JOIN orders o       ON oi.order_id = o.order_id
WHERE o.status NOT IN ('cancelled', 'pending')
GROUP BY p.product_id, p.product_name, p.product_type, p.price
ORDER BY unidades_vendidas DESC;

