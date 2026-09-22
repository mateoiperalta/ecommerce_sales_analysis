fetch("../data/ecommerce_sales_analytics_5000.csv")
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not load CSV");
        }

        return response.text();
    })
    .then(csv => {

        const lines = csv.trim().split(/\r?\n/);
        const headers = lines[0].split(",");

        const categoryIndex = headers.indexOf("product_category");
        const regionIndex = headers.indexOf("region");
        const revenueIndex = headers.indexOf("revenue");
        const paymentMethodIndex = headers.indexOf("payment_method");
        const dateIndex = headers.indexOf("order_date");
        const ratingIndex = headers.indexOf("customer_rating");
        const deliveryIndex = headers.indexOf("delivery_days");

        const rows = lines.slice(1).map(line => {

            const values = line.split(",");

            return {
                category: values[categoryIndex],
                region: values[regionIndex],
                paymentMethod: values[paymentMethodIndex],
                date: values[dateIndex],
                revenue: Number(values[revenueIndex]),
                rating: Number(values[ratingIndex]),
                delivery: Number(values[deliveryIndex])
            };
        });

        const yearFilter = document.getElementById("yearFilter");
        const regionFilter = document.getElementById("regionFilter");
        const categoryFilter = document.getElementById("categoryFilter");

        const years = [...new Set(
            rows.map(row => row.date.split("/")[2])
        )].sort();

        const regions = [...new Set(
            rows.map(row => row.region)
        )].sort();

        const categories = [...new Set(
            rows.map(row => row.category)
        )].sort();

        years.forEach(year => {
            yearFilter.innerHTML += `<option value="${year}">${year}</option>`;
        });

        regions.forEach(region => {
            regionFilter.innerHTML += `<option value="${region}">${region}</option>`;
        });

        categories.forEach(category => {
            categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
        });

        let charts = [];

        const formatMillions = value => {
            if (value >= 1000000) {
                return `$${(value / 1000000).toFixed(1)}M`;
            }

            if (value >= 1000) {
                return `$${(value / 1000).toFixed(0)}K`;
            }

            return `$${value}`;
        };

        const baseOptions = {
            responsive: true,
            aspectRatio: 3.3,
            interaction: {
                mode: "index",
                intersect: false
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: context => {
                            return ` Revenue: ${formatMillions(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: "#6b7280",
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    grid: {
                        color: "#eef0f2"
                    },
                    ticks: {
                        color: "#6b7280",
                        font: {
                            size: 10
                        },
                        callback: value => formatMillions(value)
                    }
                }
            }
        };

        function updateDashboard() {

            const selectedYear = yearFilter.value;
            const selectedRegion = regionFilter.value;
            const selectedCategory = categoryFilter.value;

            const filteredRows = rows.filter(row => {

                const year = row.date.split("/")[2];

                return (
                    (selectedYear === "all" || year === selectedYear) &&
                    (selectedRegion === "all" || row.region === selectedRegion) &&
                    (selectedCategory === "all" || row.category === selectedCategory)
                );
            });

            let totalRevenue = 0;
            let totalRating = 0;
            let totalDelivery = 0;

            const salesByCategory = {};
            const salesByRegion = {};
            const salesByPaymentMethod = {};
            const salesOverTime = {};
            const ratingsByCategory = {};
            const ratingCountByCategory = {};
            const deliveryByRegion = {};
            const deliveryCountByRegion = {};

            filteredRows.forEach(row => {

                totalRevenue += row.revenue;
                totalRating += row.rating;
                totalDelivery += row.delivery;

                salesByCategory[row.category] =
                    (salesByCategory[row.category] || 0) + row.revenue;

                salesByRegion[row.region] =
                    (salesByRegion[row.region] || 0) + row.revenue;

                salesByPaymentMethod[row.paymentMethod] =
                    (salesByPaymentMethod[row.paymentMethod] || 0) + row.revenue;

                const dateParts = row.date.split("/");

                if (dateParts.length === 3) {

                    const month =
                        `${dateParts[2]}-${dateParts[0].padStart(2, "0")}`;

                    salesOverTime[month] =
                        (salesOverTime[month] || 0) + row.revenue;
                }

                ratingsByCategory[row.category] =
                    (ratingsByCategory[row.category] || 0) + row.rating;

                ratingCountByCategory[row.category] =
                    (ratingCountByCategory[row.category] || 0) + 1;

                deliveryByRegion[row.region] =
                    (deliveryByRegion[row.region] || 0) + row.delivery;

                deliveryCountByRegion[row.region] =
                    (deliveryCountByRegion[row.region] || 0) + 1;
            });

            const totalSales = filteredRows.length;

            const averageRevenue =
                totalSales > 0 ? totalRevenue / totalSales : 0;

            const averageRating =
                totalSales > 0 ? totalRating / totalSales : 0;

            const averageDelivery =
                totalSales > 0 ? totalDelivery / totalSales : 0;

            document.querySelector(".kpi:nth-child(1) p").textContent =
                `$${(totalRevenue / 1000000).toFixed(1)}M`;

            document.querySelector(".kpi:nth-child(2) p").textContent =
                totalSales.toLocaleString();

            document.querySelector(".kpi:nth-child(3) p").textContent =
                `$${Math.round(averageRevenue / 1000)}K`;

            document.querySelector(".kpi:nth-child(4) p").textContent =
                averageDelivery.toFixed(1);

            document.querySelector(".kpi:nth-child(5) p").textContent =
                averageRating.toFixed(1);

            charts.forEach(chart => chart.destroy());

            charts.push(
                new Chart(document.getElementById("salesByCategory"), {
                    type: "bar",
                    data: {
                        labels: Object.keys(salesByCategory),
                        datasets: [{
                            data: Object.values(salesByCategory),
                            borderRadius: 5,
                            borderSkipped: false
                        }]
                    },
                    options: baseOptions
                })
            );

            charts.push(
                new Chart(document.getElementById("salesByRegion"), {
                    type: "bar",
                    data: {
                        labels: Object.keys(salesByRegion),
                        datasets: [{
                            data: Object.values(salesByRegion),
                            borderRadius: 5,
                            borderSkipped: false
                        }]
                    },
                    options: baseOptions
                })
            );

            charts.push(
                new Chart(document.getElementById("salesByPaymentMethod"), {
                    type: "bar",
                    data: {
                        labels: Object.keys(salesByPaymentMethod),
                        datasets: [{
                            data: Object.values(salesByPaymentMethod),
                            borderRadius: 5,
                            borderSkipped: false
                        }]
                    },
                    options: baseOptions
                })
            );

            const months = Object.keys(salesOverTime).sort();

            charts.push(
                new Chart(document.getElementById("salesOverTime"), {
                    type: "line",
                    data: {
                        labels: months,
                        datasets: [{
                            data: months.map(month => salesOverTime[month]),
                            tension: 0.3,
                            pointRadius: 2,
                            pointHoverRadius: 5,
                            fill: false
                        }]
                    },
                    options: baseOptions
                })
            );

            const categoryLabels = Object.keys(ratingsByCategory);

            charts.push(
                new Chart(document.getElementById("ratingByCategory"), {
                    type: "bar",
                    data: {
                        labels: categoryLabels,
                        datasets: [{
                            data: categoryLabels.map(category =>
                                ratingsByCategory[category] /
                                ratingCountByCategory[category]
                            ),
                            borderRadius: 5,
                            borderSkipped: false
                        }]
                    },
                    options: {
                        ...baseOptions,
                        scales: {
                            ...baseOptions.scales,
                            y: {
                                min: 0,
                                max: 5,
                                grid: {
                                    color: "#eef0f2"
                                },
                                ticks: {
                                    color: "#6b7280",
                                    font: {
                                        size: 10
                                    }
                                }
                            }
                        }
                    }
                })
            );

            const regionLabels = Object.keys(deliveryByRegion);

            charts.push(
                new Chart(document.getElementById("deliveryByRegion"), {
                    type: "bar",
                    data: {
                        labels: regionLabels,
                        datasets: [{
                            data: regionLabels.map(region =>
                                deliveryByRegion[region] /
                                deliveryCountByRegion[region]
                            ),
                            borderRadius: 5,
                            borderSkipped: false
                        }]
                    },
                    options: {
                        ...baseOptions,
                        scales: {
                            ...baseOptions.scales,
                            y: {
                                grid: {
                                    color: "#eef0f2"
                                },
                                ticks: {
                                    color: "#6b7280",
                                    font: {
                                        size: 10
                                    },
                                    callback: value => `${value} days`
                                }
                            }
                        }
                    }
                })
            );
        }

        yearFilter.addEventListener("change", updateDashboard);
        regionFilter.addEventListener("change", updateDashboard);
        categoryFilter.addEventListener("change", updateDashboard);

        updateDashboard();
    })
    .catch(error => {
        console.error("Error loading CSV:", error);
    });