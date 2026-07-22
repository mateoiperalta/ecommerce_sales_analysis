import numpy as np
import pandas as pd

def show_dimensions(df):
    print(f"Rows: {df.shape[0]}")
    print(f"Columns: {df.shape[1]}")

def display_info(df):
    df.info()

def show_missing_values(df):
    print(df.isna().sum())

def show_duplicated_rows(df):
    print(f"Duplicated rows: {df.duplicated().sum()}")

def analyze_discounts(df):
    print(df["discount"].describe())
    print((df["discount"]>1).sum())

def analyze_ratings(df):
    print(df["customer_rating"].describe())

def convert_order_date(df):
    df["order_date"] = pd.to_datetime(df["order_date"])

df = pd.read_csv("ecommerce_sales_analytics_5000.csv")

#analysis:
show_dimensions(df)
display_info(df)
show_missing_values(df)
show_duplicated_rows(df)
analyze_discounts(df)
analyze_ratings(df)

#cleaning:
convert_order_date(df)