SELECT
    customer_id,
    SUM(revenue) AS total_revenue
FROM sales
GROUP BY customer_id
ORDER BY total_revenue DESC
LIMIT 10;

SELECT
    customer_id,
    COUNT(*) AS total_orders
FROM sales
GROUP BY customer_id
ORDER BY total_orders DESC
LIMIT 10;

SELECT
    customer_id,
    AVG(customer_rating) AS average_rating
FROM sales
GROUP BY customer_id
ORDER BY average_rating DESC
LIMIT 10;

SELECT
    customer_id,
    AVG(discount) AS average_discount
FROM sales
GROUP BY customer_id
ORDER BY average_discount DESC
LIMIT 10;

SELECT
    customer_id,
    SUM(revenue) AS total_revenue,
    RANK() OVER (ORDER BY SUM(revenue) DESC) AS revenue_rank
FROM sales
GROUP BY customer_id
ORDER BY total_revenue DESC
LIMIT 10;