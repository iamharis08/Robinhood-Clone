from sqlalchemy.orm import validates, relationship
from sqlalchemy.types import Integer, String, Boolean
from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import declarative_mixin
from .watchlist import Watchlist
import json
from datetime import datetime

@declarative_mixin
class TimestampMixin:
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now(), onupdate=datetime.now())

class Transaction(db.Model, TimestampMixin):
    __tablename__ = "transactions"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey((add_prefix_for_prod('users.id')), ondelete='CASCADE'), nullable=False)
    stock_symbol = db.Column(db.String(255), nullable=False)
    is_buy = db.Column(db.Boolean, nullable=False)
    shares = db.Column(db.Float, nullable=False)
    current_total_stock_shares = db.Column(db.Float, nullable=False)
    current_total_stock_investment = db.Column(db.Float, nullable=False)
    price_per_share = db.Column(db.Float, nullable=False)

    owner = relationship("User", back_populates="transactions")


    def to_dict(self):
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'stock_symbol': self.stock_symbol,
            'is_buy': self.is_buy,
            'shares': self.shares,
            'current_total_stock_shares': self.current_total_stock_shares,
            'current_total_stock_investment': self.current_total_stock_investment,
            'price_per_share': self.price_per_share,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        # return {
        #     'id': self.id,
        #     'ownerId': self.owner_id,
        #     'stockSymbol': self.stock_symbol,
        #     'isBuy': self.is_buy,
        #     'shares': self.shares,
        #     'currentTotalStockShares': self.current_total_stock_shares,
        #     'currentTotalStockInvestment': self.current_total_stock_investment,
        #     'pricePerShare': self.price_per_share,
        #     'createdAt': self.created_at,
        #     'updatedAt': self.updated_at
        # }
