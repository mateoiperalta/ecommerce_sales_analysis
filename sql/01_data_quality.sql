SELECT COUNT(*) AS total_records
FROM sales;

SELECT
    COUNT(*) AS total_records,
    COUNT(order_id) AS order_ids,
    COUNT(order_date) AS order_dates,
    COUNT(customer_id) AS customer_ids,
    COUNT(product_category) AS product_categories,
    COUNT(region) AS regions,
    COUNT(quantity) AS quantities,
    COUNT(unit_price) AS unit_prices,
    COUNT(discount) AS discounts,
    COUNT(payment_method) AS payment_methods,
    COUNT(delivery_days) AS delivery_days,
    COUNT(customer_rating) AS customer_ratings,
    COUNT(revenue) AS revenues
FROM sales;

SELECT
    COUNT(*) AS duplicate_records
FROM (
    SELECT
        order_id,
        COUNT(*) AS occurrences
    FROM sales
    GROUP BY order_id
    HAVING COUNT(*) > 1
) AS duplicates;

SELECT
    MIN(order_date) AS first_order,
    MAX(order_date) AS last_order
FROM sales;

SELECT
    MIN(revenue) AS min_revenue,
    MAX(revenue) AS max_revenue,
    AVG(revenue) AS avg_revenue
FROM sales;