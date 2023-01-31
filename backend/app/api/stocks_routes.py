from flask import Blueprint, jsonify, request, json
from flask_login import login_required, current_user
from app.models import db, User, Watchlist, Stock, Transaction
from app.forms import WatchlistForm, StocksSearchForm, TickerPricesForm, HistoricalDataForm
from app.utils import companyInfo, keyStatistics
from sqlalchemy import or_
import yfinance as yf
from yahoo_fin import stock_info as si
from bs4 import BeautifulSoup, SoupStrainer
import threading
import requests
from datetime import datetime, timedelta

stocks_routes = Blueprint('stocks', __name__)


## GET all user WatchLists

@stocks_routes.route('/<stock_symbol>')
@login_required
def get_stock_info(stock_symbol):
    """
    Query for all user watchlists with user_id and returns all watchlsits in a dictionary
    """

    symbol = stock_symbol.upper()
    session = requests.Session()
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'}

    stock= Stock.query.filter(Stock.stock_symbol == symbol).first()

    x = threading.Thread(target=keyStatistics, args=(symbol, session))
    x.start()
    # y = threading.Thread(target=funcTwo, args=(symbol, session, headers))
    # y.start()
    company_info_dict = companyInfo(symbol, session, headers)

    formatted_res = {
        'id': stock.id,
        'stockDescription': company_info_dict["stockDescription"] if company_info_dict["stockDescription"] != None else '_',
        'employees': company_info_dict["employees"] if company_info_dict["employees"] != None else '_',
        'headquarters': company_info_dict["headquarters"] if company_info_dict["headquarters"] != None else '_',
        'Sector': company_info_dict["sector"] if company_info_dict["sector"] != None else '_',
        'marketCap': company_info_dict["Market Cap"] if company_info_dict["Market Cap"] != None else '_',
        'priceEarningsRatio': company_info_dict["PE Ratio (TTM)"],
        'dividendYield': company_info_dict["Forward Dividend & Yield"].split(" ")[0] if company_info_dict["Forward Dividend & Yield"].split(" ")[0] != 0 else '_',
        'averageVolume': company_info_dict["Avg. Volume"] if company_info_dict["Avg. Volume"] != None else '_',
        'highToday': company_info_dict["Day's Range"].split(" - ")[1] if company_info_dict["Day's Range"] != None else '_',
        'lowToday': company_info_dict["Day's Range"].split(" - ")[0] if company_info_dict["Day's Range"] != None else '_',
        'openPrice': company_info_dict["Open"] if company_info_dict["Open"] != None else '_',
        'volume': company_info_dict["Volume"] if company_info_dict["Volume"] != None else '_',
        'fiftyTwoWeekHigh': company_info_dict["52 Week Range"].split(" - ")[1] if company_info_dict["52 Week Range"] != None else '_',
        'fiftyTwoWeekLow': company_info_dict["52 Week Range"].split(" - ")[0] if company_info_dict["52 Week Range"] != None else '_',
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
        price = si.get_live_price(stock)
        prices[stock]=price
    print(prices, "PRICESSSSSSSSSSSSSSSS")
    return {"liveStockPrices": prices}, 200

@stocks_routes.route('/historical', methods=['POST'])
@login_required
def get_stocks_historical_data():


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
    # print(stocks_info, "SYMBOLSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")

    # print(stock_symbols, "STOCKKKKKSYMBOLLLLLSSSSSSSSSSSSSSSSSSSSSSS")

    # if form.validate_on_submit():
    #     print(form.data["stocks_info"], "FOMRDATAAAAAAAAAAAAAAAA")
    #     print(data, "daaaaaaaaataaaa")
    #     print(stocks_info_json, "STOCKINFOJSONN")
        # print(stocks_info, "STOCKINFOOO")
        # print(stock_symbols, "STOCKSYMBOLSSSSS")
    #     return {'messsage': "idk failed"}

    # ticker = yf.Ticker('AAPL')
    # from datetime import datetime, timedelta

    now = datetime.now()
    one_week_ago = now - timedelta(days=1)
    date_string = one_week_ago.strftime('%m/%d/%Y')
    print(date_string)

    # symbols = ['AAPL', "TSLA"]
    start_date = one_week_ago
    end_date = now

    new_data = {}
    if 'tickers' in data:
        ticker_data = {}
        tickers = data["tickers"]

        removed_duplicates =[]




        print(removed_duplicates, "TICKERSSSSSCOMON MATEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
        if (len(tickers) == 1) or ((len(tickers) == 2) and (tickers[0] == tickers[1])):
            historical_data = yf.download(tickers=tickers[0], period='1wk', interval='30m')
            close_prices = historical_data['Close']
            ticker_data[tickers[0]] = json.loads(close_prices.to_json())
            print(ticker_data, "PLEASEEEEEEEEETICKERDATAAAAAAAAAAAAAAAA")
            return ticker_data, 200

        historical_data = yf.download(tickers=tickers, period='1wk', interval='30m', threads=True)
        close_prices = historical_data['Close']



        # ticker_data[symbol]=json.loads(close_prices.to_json())

        print(close_prices.to_json(), "STOCKSYMBOLSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
        return close_prices.to_json(), 200



    print(stock_symbols, "FINALLLLSTOCKSUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU")
    for stock in stock_symbols:
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


            # new_data.update(json.loads(close_prices.to_json()))
        else:
            historical_data = yf.download(tickers=symbol, start=start_date, end=end_date, interval=interval)
            close_prices = historical_data['Close']


            # new_data.update(json.loads(close_prices.to_json()))
        new_data[symbol]=json.loads(close_prices.to_json())

    print(new_data)

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


@stocks_routes.route('/portfolio-chart-data/current-user')
@login_required
def user_portfolio_historical_data(id):
    """
    Query for all user portfolio chart data
    """
    user = current_user
    date_now = datetime.now()
    date_points_array = [user.created_at]
    total_investment_data_array = []
    current_total = user.total_investment
    transactions = Transaction.query.filter(Transaction.owner_id == user.id)
    symbols = []
    current_date = date_points_array[0]
    transactions_array_index = 0

    symbolSet = {}

    for transaction in len(list(transactions)):
        stock_symbol = transaction.stock_symbol
        if not symbolSet.has(stock_symbol):
            symbolSet.add(stock_symbol)

    historical_data = yf.download(tickers=symbols, start=user.created_at, end = date_now, interval='1h')
    historical_close_prices = historical_data['Close']


    while current_date <= date_now:
        transactions_array_element = transactions[transactions_array_index]
        # next_transaction_array_element = transactions[transactions_array_index + 1]
        if current_date >= transactions_array_element.created_at:
            # if transactions_array_element.is_buy == True:
                # tickers.append(transactions_array_element.stock_symbol)
            current_total = current_total + ()

            current_total += transactions_array_element
            total_investment_data_array.append(current_total)

            date_points_array.extend(list(historical_data))
            date_points_array.append(transactions_array_element.created_at)
            transactions_array_index += 1
        else:
            current_date = current_date + timedelta(hours=1)
            total_investment_data_array.append(current_total)
            date_points_array.append(current_date)

    return {'userStocks': [stock.to_dict() for stock in user.user_stocks]}, 200
