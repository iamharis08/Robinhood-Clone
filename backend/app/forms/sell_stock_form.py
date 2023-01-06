from flask_wtf import FlaskForm
from wtforms.fields import StringField, IntegerField, FloatField
from wtforms.validators import DataRequired, Length


class SellStockForm(FlaskForm):
    stock_symbol = StringField("stock", validators=[DataRequired(), Length(min=5)])
    shares_sold = FloatField("stock shares", validators=[DataRequired()])
    add_buying_power = FloatField("add buying power", validators=[DataRequired()])
