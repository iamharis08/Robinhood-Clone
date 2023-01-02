from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Watchlist, Stock
from app.forms import WatchlistForm
import yfinance as yf

stocks_routes = Blueprint('stocks', __name__)


## GET all user WatchLists

@stocks_routes.route('/<stock_symbol>')
@login_required
def get_stock(stock_symbol):
    """
    Query for all user watchlists with user_id and returns all watchlsits in a dictionary
    """
    userId = current_user.id
    ticker = yf.Ticker(stock_symbol)
    pe_ratio = ticker.info['regularMarketPrice'] /  ticker.info['trailingEps']
    # get stock info

    dividend_yield = ticker.info['dividendYield'] if ticker.info['dividendYield'] is not None else 0
    formatted_res = {
    'stockDescription': ticker.info['longBusinessSummary'],
    'employees': ticker.info['fullTimeEmployees'],
    'headquarters': f'{ticker.info["city"]}, {ticker.info["state"]}',
    'sector': ticker.info['sector'],
    'marketCap': ticker.info['marketCap'],
    'priceEarningsRatio': format(round(pe_ratio, 2), '.2f'),
    'dividendYield': format(round(dividend_yield*100, 2), '.2f') if dividend_yield is not 0 else '-',
    'averageVolume': ticker.info['averageVolume'],
    'highToday': ticker.info['dayHigh'],
    'lowToday': ticker.info['dayLow'],
    'openPrice': ticker.info['open'],
    'volume': ticker.info['volume'],
    'fiftyTwoWeekHigh': ticker.info['fiftyTwoWeekHigh'],
    'fiftyTwoWeekLow': ticker.info['fiftyTwoWeekLow'],

}


    return formatted_res, 200


# ## GET a specific Watchlist by id

# @watchlists_routes.route('/<int:watchlist_id>')
# @login_required
# def get_one_watchlist(watchlist_id):
#     """
#     Query for a user by id and returns that user in a dictionary
#     """
#     watchlist = Watchlist.query.get(watchlist_id)
#     return {'watchlist': watchlist.to_dict()}, 200


# ##Create Watchlist

# @watchlists_routes.route('/', methods=["POST"])
# @login_required
# def create_watchlist():
#     """
#     Query for a user by id and returns that user in a dictionary
#     """
#     user = current_user
#     form = WatchlistForm()
#     form['csrf_token'].data = request.cookies['csrf_token']
#     if form.validate_on_submit():
#         watchlist = Watchlist(
#             owner_id = user.id,
#             name = form.data['name']
#         )

#         db.session.add(watchlist)
#         db.session.commit()

#         return {'watchlist': watchlist.to_dict()}, 200
#     return {"errors": ["Validation Error: Could not create Watchlist"]}


# ##UPDATE a Watchlist

# @watchlists_routes.route('/<int:watchlist_id>', methods=["PUT"])
# @login_required
# def update_watchlist(watchlist_id):
#     """
#     Update one watchlist and return that watchlist
#     """
#     user = current_user.to_dict()
#     form = WatchlistForm()
#     form['csrf_token'].data = request.cookies['csrf_token']

#     if form.validate_on_submit():
#         watchlist = Watchlist.query.get(watchlist_id)
#         watchlist.name = form.data['name']

#         db.session.add(watchlist)
#         db.session.commit()

#         return {'watchlist': watchlist.to_dict()}, 200
#     return {"errors": ["Validation Error: Could not create Watchlist"]}


# #DELETE Watchlist

# @watchlists_routes.route("/<int:watchlist_id>", methods=["DELETE"])
# @login_required
# def delete_watchlist(watchlist_id):
#     user = current_user.to_dict()
#     watchlist = Watchlist.query.get(watchlist_id)
#     if user['id'] == watchlist.owner_id:

#         db.session.delete(watchlist)
#         db.session.commit()
#         return {"message": "Successfully Deleted"}, 200
#     return 'BAD REQUEST', 404
