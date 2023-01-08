from flask import Blueprint, jsonify, request, json
from flask_login import login_required, current_user
from app.models import db, User, Watchlist, Stock
from app.forms import WatchlistForm, StocksSearchForm, TickerPricesForm
from sqlalchemy import or_
import yfinance as yf
from yahoo_fin import stock_info as si


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
    # pe_ratio = ticker.info['regularMarketPrice'] /  ticker.info['trailingEps']
    # # get stock info

    # dividend_yield = ticker.info['dividendYield'] if ticker.info['dividendYield'] is not None else 0
    # formatted_res = {
    # 'stockDescription': ticker.info['longBusinessSummary'],
    # 'employees': ticker.info['fullTimeEmployees'],
    # 'headquarters': f'{ticker.info["city"]}, {ticker.info["state"]}',
    # 'sector': ticker.info['sector'],
    # 'marketCap': ticker.info['marketCap'],
    # 'priceEarningsRatio': format(round(pe_ratio, 2), '.2f'),
    # 'dividendYield': format(round(dividend_yield*100, 2), '.2f') if dividend_yield is not 0 else '-',
    # 'averageVolume': ticker.info['averageVolume'],
    # 'highToday': ticker.info['dayHigh'],
    # 'lowToday': ticker.info['dayLow'],
    # 'openPrice': ticker.info['open'],
    # 'volume': ticker.info['volume'],
    # 'fiftyTwoWeekHigh': ticker.info['fiftyTwoWeekHigh'],
    # 'fiftyTwoWeekLow': ticker.info['fiftyTwoWeekLow'],
    # }
    if ticker.info['trailingEps'] is not None:
        pe_ratio = ticker.info['regularMarketPrice'] /  (ticker.info['trailingEps'] )
    else: pe_ratio = 0
# get stock info


    dividend_yield = ticker.info['dividendYield'] if ticker.info['dividendYield'] != None else 0
    longBusinessSummary = ticker.info['longBusinessSummary'] if 'longBusinessSummary' in ticker.info else 'Not Available'
    fullTimeEmployees = ticker.info['fullTimeEmployees'] if 'fullTimeEmployees' in ticker.info else '-'
    city = ticker.info["city"] if 'city' in ticker.info else '-'
    state = ticker.info["state"] if 'state' in ticker.info else '-'
    formatted_headquarters = f'{city}, {state}' if city and state != '-' else '-'
    sector = ticker.info["sector"] if 'sector' in ticker.info else '-'
    marketCap = ticker.info["marketCap"] if 'marketCap' in ticker.info else '-'
    averageVolume = ticker.info["averageVolume"] if 'averageVolume' in ticker.info else '-'
    highToday = ticker.info["dayHigh"] if 'dayHigh' in ticker.info else '-'
    lowToday = ticker.info["dayLow"] if 'dayLow' in ticker.info else '-'
    openPrice = ticker.info["open"] if 'open' in ticker.info else '-'
    volume = ticker.info["volume"] if 'volume' in ticker.info else '-'
    fiftyTwoWeekHigh = ticker.info["fiftyTwoWeekHigh"] if 'fiftyTwoWeekHigh' in ticker.info else '-'
    fiftyTwoWeekLow = ticker.info["fiftyTwoWeekLow"] if 'fiftyTwoWeekLow' in ticker.info else '-'

    formatted_res = {
        'stockDescription': longBusinessSummary if longBusinessSummary != None else '-',
        'employees': fullTimeEmployees if fullTimeEmployees != None else '-',
        'headquarters': formatted_headquarters if formatted_headquarters != None else '-',
        'Sector': sector if sector != None else '-',
        'marketCap': marketCap if marketCap != None else '-',
        'priceEarningsRatio': format(round(pe_ratio, 2), '.2f'),
        'dividendYield': format(round(dividend_yield*100, 2), '.2f') if dividend_yield != 0 else '-',
        'averageVolume': averageVolume if averageVolume != None else '-',
        'highToday': highToday if highToday != None else '-',
        'lowToday': lowToday if lowToday != None else '-',
        'openPrice': openPrice if openPrice != None else '-',
        'volume': volume if volume != None else '-',
        'fiftyTwoWeekHigh': fiftyTwoWeekHigh if fiftyTwoWeekHigh != None else '-',
        'fiftyTwoWeekLow': fiftyTwoWeekLow if fiftyTwoWeekLow != None else '-',
    }



    return formatted_res, 200

@stocks_routes.route('/price/<stock_symbol>')
@login_required
def get_stock_price(stock_symbol):
    """
    Query for all user watchlists with user_id and returns all watchlsits in a dictionary
    """
    price = si.get_live_price(stock_symbol)

    return {"liveStockPrice": price}, 200

@stocks_routes.route('/prices', methods=['POST'])
@login_required
def get_stocks_prices():
    """
    Query for all user watchlists with user_id and returns all watchlsits in a dictionary
    """
    form = TickerPricesForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    # stock_symbols=form.data["stock_symbols"]
    stocks = json.loads(form.data['stock_symbols'])
    print(stocks, "STOCKKKKKSYMBOLLLLLS")
    prices = {}
    for stock in stocks:
        price = si.get_live_price(stock["stockSymbol"])
        prices[stock["stockSymbol"]]=price
    print(prices, "PRICESSSSSSSSSSSSSSSS")
    return {"liveStockPrices": prices}, 200

@stocks_routes.route('/historical', methods=['POST'])
@login_required
def get_stocks_historical_data():
    """
    Query for all user watchlists with user_id and returns all watchlsits in a dictionary
    """

    form = TickerPricesForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    # stock_symbols=form.data["stock_symbols"]
    # stocks = json.loads(form.data['stock_symbols'])
    # print(stocks, "STOCKKKKKSYMBOLLLLLS")
    data = {}

    ticker = yf.Ticker('AAPL')
    from datetime import datetime, timedelta
    now = datetime.now()
    one_week_ago = now - timedelta(weeks=1)
    date_string = one_week_ago.strftime('%m/%d/%Y')
    print(date_string)
    symbol = 'AAPL'
    start_date = one_week_ago
    end_date = now
    interval = '5m'

    historical_data = yf.download(tickers=symbol, start=start_date, end=end_date, interval=interval)
    close_prices = historical_data['Close']

    print(close_prices.to_json())
    # for stock in stocks:
    data[symbol] = json.loads(close_prices.to_json(orient="index"))
    # print(historical_data, "PRICESSSSSSSSSSSSSSSS")
    return data, 200


## GET a specific Watchlist by id

@stocks_routes.route('/', methods=["POST"])
@login_required
def find_stocks():
    """
    Query for a user by id and returns that user in a dictionary
    """
    form = StocksSearchForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    stocks = Stock.query.filter(or_(Stock.company_name.ilike(f'%{form.data["name"]}%'), Stock.stock_symbol.ilike(f'{form.data["name"]}%'))).order_by(Stock.company_name).limit(6)
    if len(list(stocks)) > 0:
        return {'stocks': [stock.to_dict() for stock in stocks]}, 200
    else: return {"errors": "could not find stocks"}



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
