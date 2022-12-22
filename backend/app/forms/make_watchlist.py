from flask_wtf import FlaskForm
from wtforms.fields import StringField
from wtforms.validators import DataRequired, Length


class WatchlistForm(FlaskForm):
    name = StringField("Watchlist Name", validators=[DataRequired(), Length(min=1, max=25)])
