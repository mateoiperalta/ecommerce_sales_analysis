SELECT
    product_category,
    SUM(revenue) AS total_revenue,
    AVG(discount) AS average_discount,
    AVG(customer_rating) AS average_rating
FROM sales
GROUP BY product_category
ORDER BY total_revenue DESC;

SELECT
    region,
    SUM(revenue) AS total_revenue,
    AVG(delivery_days) AS average_delivery_days,
    AVG(customer_rating) AS average_rating
FROM sales
GROUP BY region
ORDER BY total_revenue DESC;

SELECT
    customer_id,
    SUM(revenue) AS total_revenue,
    COUNT(*) AS total_orders,
    AVG(revenue) AS average_order_value
FROM sales
GROUP BY customer_id
HAVING SUM(revenue) > 100000
ORDER BY total_revenue DESC;

SELECT
    CASE
        WHEN discount >= 0.20 THEN 'High Discount'
        WHEN discount >= 0.10 THEN 'Medium Discount'
        ELSE 'Low Discount'
    END AS discount_category,
    COUNT(*) AS total_orders,
    SUM(revenue) AS total_revenue,
    AVG(customer_rating) AS average_rating
FROM sales
GROUP BY discount_category
ORDER BY total_revenue DESC;

WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', order_date) AS month,
        SUM(revenue) AS total_revenue
    FROM sales
    GROUP BY month
)
SELECT
    month,
    total_revenue,
    LAG(total_revenue) OVER (ORDER BY month) AS previous_month_revenue,
    total_revenue - LAG(total_revenue) OVER (ORDER BY month) AS revenue_change
FROM monthly_sales
ORDER BY month;

WITH category_sales AS (
    SELECT
        product_category,
        SUM(revenue) AS total_revenue
    FROM sales
    GROUP BY product_category
)
SELECT
    product_category,
    total_revenue,
    ROUND(
        total_revenue * 100.0 / SUM(total_revenue) OVER (),
        2
    ) AS revenue_percentage
FROM category_sales
ORDER BY total_revenue DESC;