from flask_wtf import FlaskForm
from wtforms.fields import StringField, IntegerField, FloatField
from wtforms.validators import DataRequired, Length


class BuyStockForm(FlaskForm):
    stock_symbol = StringField("stock", validators=[DataRequired(), Length(max=5)])
    stock_shares = FloatField("stock shares", validators=[DataRequired()])
    price_per_share = FloatField("price per share bought", validators=[DataRequired()])
