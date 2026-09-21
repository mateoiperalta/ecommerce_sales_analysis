import numpy as np
import pandas as pd
from pathlib import Path

def show_dimensions(df):
    print("===Dimensions===".center(60))
    print(f"Rows: {df.shape[0]}")
    print(f"Columns: {df.shape[1]}")

def display_info(df):
    print("===Display Info===".center(60))
    df.info()

def show_missing_values(df):
    print("===Missing Values by Column=== ".center(60))
    print(df.isna().sum())

def show_duplicated_rows(df):
    print("===Duplicated Rows ===".center(60))
    print(f"Duplicated rows: {df.duplicated().sum()}")

def analyze_discounts(df):
    print("===Analyze Discounts===".center(60))
    print(df["discount"].describe())
    print((df["discount"]>1).sum())

def analyze_ratings(df):
    print("===Analyze Ratings===".center(60))
    print(df["customer_rating"].describe())

def convert_order_date(df):
    print("===Convert Order Date===".center(60))
    df["order_date"] = pd.to_datetime(df["order_date"])
    print("order_date converted to datatime")


def sales_by_category(df):
    print("===Sales By Category===".center(60))
    print(df.groupby("product_category")["revenue"].sum().sort_values(ascending = False))

def sales_by_region(df):
    print("===Sales By Region===".center(60))
    print(df.groupby("region")["revenue"].sum().sort_values(ascending=False))

def payment_methods(df):
    print("===Payment Methods===".center(60))
    print(df["payment_method"].value_counts())

def rating_by_category(df):
    print("===Rating By Category===".center(60))
    print(df.groupby("product_category")["customer_rating"].mean())

def delivery_by_region(df):
    print("===Delivery By Region===".center(60))
    print(df.groupby("region")["delivery_days"].mean())

def top_customers(df):
    print("===Top Customers===".center(60))
    print(
        df.groupby("customer_id")["revenue"]
        .sum()
        .sort_values(ascending=False)
        .head(10)
    )

def monthly_sales(df):
    print("===Monthly Sales===".center(60))
    print(
        df.groupby(df["order_date"].dt.month)["revenue"]
        .sum()
    )

def discount_by_category(df):
    print("===Discount By Category===".center(60))
    print(df.groupby("product_category")["discount"].mean())

def quantity_by_category(df):
    print("===Quantity By Category===".center(60))
    print(
        df.groupby("product_category")["quantity"]
        .sum()
        .sort_values(ascending=False)
    )

def average_revenue(df):
    print("===Average Revenue===".center(60))
    print(df["revenue"].mean())

def classify_revenue(df):
    print("=== Revenue Classification ===".center(60))

    average = df["revenue"].mean()

    df["revenue_level"] = np.where(
        df["revenue"] >= average,
        "High Revenue",
        "Low Revenue"
    )

    print(df[["revenue", "revenue_level"]].head())

    return df

def classify_delivery(df):
    print("=== Delivery Classification ===".center(60))

    conditions = [
        df["delivery_days"] <= 3,
        df["delivery_days"] <= 7,
        df["delivery_days"] > 7
    ]

    choices = [
        "Fast",
        "Normal",
        "Slow"
    ]

    df["delivery_type"] = np.select(
        conditions,
        choices,
        default="Unknown"
    )

    print(df[["delivery_days", "delivery_type"]].head())

    return df


BASE_DIR = Path(__file__).resolve().parent.parent
df = pd.read_csv(BASE_DIR / "data" / "ecommerce_sales_analytics_5000.csv")

#analysis:
show_dimensions(df)
display_info(df)
show_missing_values(df)
show_duplicated_rows(df)
analyze_discounts(df)
analyze_ratings(df)

#cleaning:
convert_order_date(df)

#eda:
sales_by_category(df)
sales_by_region(df)
payment_methods(df)
rating_by_category(df)
delivery_by_region(df)
top_customers(df)
monthly_sales(df)
discount_by_category(df)
quantity_by_category(df)
average_revenue(df)
df = classify_revenue(df)
df = classify_delivery(df)

# Export cleaned dataset for Power BI
df.to_csv("ecommerce_sales_clean.csv", index=False)