SELECT
    product_category,
    SUM(revenue) AS total_revenue
FROM sales
GROUP BY product_category
ORDER BY total_revenue DESC;

SELECT
    region,
    SUM(revenue) AS total_revenue
FROM sales
GROUP BY region
ORDER BY total_revenue DESC;

SELECT
    payment_method,
    SUM(revenue) AS total_revenue
FROM sales
GROUP BY payment_method
ORDER BY total_revenue DESC;

SELECT
    DATE_TRUNC('month', order_date) AS month,
    SUM(revenue) AS total_revenue
FROM sales
GROUP BY month
ORDER BY month;

SELECT
    product_category,
    SUM(quantity) AS total_quantity
FROM sales
GROUP BY product_category
ORDER BY total_quantity DESC;

SELECT
    product_category,
    AVG(revenue) AS average_revenue
FROM sales
GROUP BY product_category
ORDER BY average_revenue DESC;

SELECT
    region,
    AVG(delivery_days) AS average_delivery_days
FROM sales
GROUP BY region
ORDER BY average_delivery_days;

SELECT
    product_category,
    AVG(customer_rating) AS average_rating
FROM sales
GROUP BY product_category
ORDER BY average_rating DESC;