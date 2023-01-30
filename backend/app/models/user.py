from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.orm import declarative_mixin
from .watchlist import Watchlist
from datetime import datetime

@declarative_mixin
class TimestampMixin:
    created_at = db.Column(db.DateTime, default=datetime.now())

class User(db.Model, UserMixin, TimestampMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(55), nullable=False, unique=False)
    last_name = db.Column(db.String(55), nullable=False, unique=False)
    username = db.Column(db.String(55), nullable=False, unique=True)
    email = db.Column(db.String(55), nullable=False, unique=True)
    total_investment = db.Column(db.Float, nullable=False, unique=False)
    buying_power = db.Column(db.Float, nullable=False, unique=False)
    hashed_password = db.Column(db.String(255), nullable=False)

    watchlists = db.relationship("Watchlist", cascade="all, delete", back_populates="owner")
    user_stocks = db.relationship("UserStock", back_populates="owner", cascade="all, delete")
    transactions = db.relationship("Transaction", back_populates="owner", cascade="all, delete")


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'username': self.username,
            'email': self.email,
            'total_investment': self.total_investment,
            'buying_power': self.buying_power,
            'createdAt': self.created_at
        }
