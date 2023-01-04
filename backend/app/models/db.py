from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import UniqueConstraint

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


db = SQLAlchemy()

# helper function for adding prefix to foreign key column references in production
def add_prefix_for_prod(attr):
    if environment == "production":
        return f"{SCHEMA}.{attr}"
    else:
        return attr


watchlists_stocks = db.Table(
    "watchlists_stocks",
    db.Model.metadata,
    db.Column(
        "watchlist_id", db.Integer, db.ForeignKey(add_prefix_for_prod("watchlists.id"), ondelete='CASCADE'), primary_key=True
    ),
    db.Column(
        "stocks_id", db.Integer, db.ForeignKey(add_prefix_for_prod("stocks.id"), ondelete='CASCADE'), primary_key=True
    ),
    UniqueConstraint("watchlist_id", "stocks_id", name="unique_watchlist_stock")
)

if environment == "production":
    watchlists_stocks.schema = SCHEMA
