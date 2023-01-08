from flask_wtf import FlaskForm
from wtforms.fields import StringField, IntegerField, FloatField, FieldList
from wtforms.validators import DataRequired, Length

class TickerPricesForm(FlaskForm):
    stock_symbols = StringField("stock symbol", validators=[DataRequired(), Length(min=5)])
