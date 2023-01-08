from flask_wtf import FlaskForm
from wtforms.fields import StringField, IntegerField, FloatField, FieldList
from wtforms.validators import DataRequired, Length


class HistoricalDataForm(FlaskForm):
    stocks_info = StringField("stock info", validators=[DataRequired(), Length(min=5)])
