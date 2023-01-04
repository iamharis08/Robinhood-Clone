from flask_wtf import FlaskForm
from wtforms.fields import StringField
from wtforms.validators import DataRequired, Length


class WatchlistStocksForm(FlaskForm):
    array = StringField("Stock Id Array", validators=[DataRequired(), Length(min=1)])
