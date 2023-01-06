from sqlalchemy.orm import validates, relationship
from sqlalchemy.types import Integer, String, Boolean
from .db import db, environment, SCHEMA, add_prefix_for_prod, watchlists_stocks
from sqlalchemy.orm import declarative_mixin
from .watchlist import Watchlist
import json
from datetime import datetime

@declarative_mixin
class TimestampMixin:
    created_at = db.Column(db.DateTime, default=datetime.now())

class UserStock(db.Model, TimestampMixin):
    __tablename__ = "user_stocks"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey((add_prefix_for_prod('users.id')), ondelete='CASCADE'), nullable=False)
    stock_symbol = db.Column(db.String(255), nullable=False)
    stock_shares = db.Column(db.Float, nullable=False)
    average_price = db.Column(db.Float, nullable=False)
    # buy_type = db.Column(db.String(255), nullable=False)

    owner = relationship("User", back_populates="user_stocks")


    def to_dict(self):
        return {
            'id': self.id,
            'ownerId': self.owner_id,
            'stockSymbol': self.stock_symbol,
            'stockShares': self.stock_shares,
            'averagePrice': self.average_price,
        }
