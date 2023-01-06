from flask_wtf import FlaskForm
from wtforms.fields import StringField, IntegerField, FloatField
from wtforms.validators import DataRequired, Length, Optional




class UpdateStockForm(FlaskForm):
    stock_symbol = StringField("stock", validators=[Length(max=5)])
    stock_shares_bought = FloatField("stock shares", validators=[Optional()])
    stock_shares_sold = FloatField("stock shares", validators=[Optional()])
    price_per_share = FloatField("price per share bought", validators=[Optional()])
