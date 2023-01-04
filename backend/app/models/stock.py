from sqlalchemy.orm import validates, relationship
from sqlalchemy.types import Integer, String, Boolean
from .db import db, environment, SCHEMA, add_prefix_for_prod, watchlists_stocks
from sqlalchemy.orm import declarative_mixin
from .watchlist import Watchlist
import json



class Stock(db.Model):
    __tablename__ = "stocks"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    stock_symbol = db.Column(db.String(5), nullable=False,)
    company_name = db.Column(db.String(255), nullable=False)

    watchlists = relationship("Watchlist", secondary=watchlists_stocks, back_populates="stocks", cascade="all, delete")

    def to_dict(self):
        return {
            'id': self.id,
            'stockSymbol': self.stock_symbol,
            'companyName': self.company_name
        }
