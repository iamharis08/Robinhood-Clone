from sqlalchemy.orm import validates, relationship
from sqlalchemy.types import Integer, String
from .db import db, environment, watchlists_stocks, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import declarative_mixin
# from .user import User
# from .stock import Stock
import json

from datetime import datetime

@declarative_mixin
class TimestampMixin:
    created_at = db.Column(db.DateTime, default=datetime.now())

class Watchlist(db.Model, TimestampMixin):
    __tablename__ = "watchlists"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey((add_prefix_for_prod('users.id')), ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String, nullable=False,)
    # stock_id = db.Column(db.Integer, db.ForeignKey((add_prefix_for_prod('stocks.id'))), nullable=False)
    # stock_symbol = db.Column(db.String(5), nullable=False,)

    owner = relationship("User", back_populates="watchlists")
    stocks = relationship("Stock", secondary=watchlists_stocks, back_populates="watchlists" )

    def to_dict(self):
        return {
            'id': self.id,
            'ownerId': self.owner_id,
            'watchlistName': self.name
        }
