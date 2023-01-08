from flask import Blueprint, jsonify, request, json
from flask_login import login_required, current_user
from app.models import db, User, Watchlist, Stock
from app.forms import WatchlistForm, StocksSearchForm, TickerPricesForm, HistoricalDataForm
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
    print(form.data['stock_symbols'], "STOCKKKKKSYMBOLLLLLS")
    stocks = json.loads(form.data['stock_symbols'])
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

    form = HistoricalDataForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    print(form.data["stocks_info"], "FOMRDATAAAAAAAAAAAAAAAA")
    data=json.loads(form.data['stocks_info'])
    # print(data, "daaaaaaaaataaaa")
    # stocks_info_json = data["stock_symbols"]
    stock_symbols = data["stock_symbols"]
    # time_intervals = data["time_intervals"]
    # print(stocks_info_json, "STOCKINFOJSONN")
    # stocks_info = json.loads(stocks_info_json)
    # print(stock_symbols, "STOCKSYMBOLSSSSS")
    # stock_symbols = stocks_info["stock_symbols"]
    print(stock_symbols, "STOCKSYMBOLSSSSS")
    # print(stocks_info, "SYMBOLSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")

    # print(stock_symbols, "STOCKKKKKSYMBOLLLLLSSSSSSSSSSSSSSSSSSSSSSS")

    # if form.validate_on_submit():
    #     print(form.data["stocks_info"], "FOMRDATAAAAAAAAAAAAAAAA")
    #     print(data, "daaaaaaaaataaaa")
    #     print(stocks_info_json, "STOCKINFOJSONN")
        # print(stocks_info, "STOCKINFOOO")
        # print(stock_symbols, "STOCKSYMBOLSSSSS")
    #     return {'messsage': "idk failed"}

    ticker = yf.Ticker('AAPL')
    from datetime import datetime, timedelta
    now = datetime.now()
    one_week_ago = now - timedelta(days=1)
    date_string = one_week_ago.strftime('%m/%d/%Y')
    print(date_string)

    # symbols = ['AAPL', "TSLA"]
    start_date = one_week_ago
    end_date = now

    new_data = {}

    for stock in stock_symbols:
        from datetime import datetime, timedelta
        now = datetime.now()
        symbol = stock[0]
        interval = stock[1]
        period = stock[2]
        time_period = None
        # date_string = None
        if period == '1wk':
            time_period = now - timedelta(weeks=1)
            # date_string = time_period.strftime('%m/%d/%Y')
        elif period == '1d':
            time_period = now - timedelta(days=1)
            # date_string = time_period.strftime('%m/%d/%Y')
        elif period == '1mo':
            time_period = now - timedelta(weeks=4)
            # date_string = time_period.strftime('%m/%d/%Y')
        elif period == '3mo':
            time_period = now - timedelta(weeks=12)
            # date_string = time_period.strftime('%m/%d/%Y')
        elif period == '1y':
            time_period = now - timedelta(days=365)
            # date_string = time_period.strftime('%m/%d/%Y')
        elif period == '5y':
            time_period = now - timedelta(days=1825)
            # date_string = time_period.strftime('%m/%d/%Y')



        print(time_period, "TIME PERIODDDDDDDDDDDDDDDDDDDDDDD")

        # symbols = ['AAPL', "TSLA"]
        start_date = time_period
        end_date = now
        if period == '1d':
            historical_data = yf.download(tickers=symbol, period=period, interval=interval)
            close_prices = historical_data['Close']

            new_data.update(json.loads(close_prices.to_json()))
        else:
            historical_data = yf.download(tickers=symbol, start=start_date, end=end_date, interval=interval)
            close_prices = historical_data['Close']

            new_data.update(json.loads(close_prices.to_json()))



    # print(new_data, "NEWWWWDATTTTTTTTAAAA")
    # for stock in stocks:
    # new_data = {}
    # for symbol in symbols:
    #     data[symbol] = json.loads(data[symbol])
    # print(historical_data, "PRICESSSSSSSSSSSSSSSS")
    return new_data, 200



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
