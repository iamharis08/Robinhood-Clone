from flask import Blueprint, jsonify, request, session
from flask_login import login_required, current_user
from app.models import db, User, UserStock, Stock, Transaction
from app.forms import BuyStockForm, SellStockForm, UpdateStockForm
from sqlalchemy import and_

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

@user_routes.route('/current')
@login_required
def current_users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    user = User.query.get(current_user.id)
    return {"user": user.to_dict()}, 200


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/<int:id>/stocks')
@login_required
def user_stocks(id):
    """
    Query for all stocks in current user's portfolio
    """
    user = current_user
    if user.user_stocks == None:
        return {
            'userStocks': [],
            'message': 'user has no stocks in portfolio'
        }
    else: return {'userStocks': [stock.to_dict() for stock in user.user_stocks]}, 200



@user_routes.route('/<int:user_id>/stocks/<symbol>', methods=['POST'])
@login_required
def buy_user_stocks(user_id, symbol):
    """
    Query for a user to buy new stocks in portfolio

    """
    form = BuyStockForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    stock_symbol = form.data['stock_symbol'].upper()
    shares_bought = form.data['stock_shares']
    price_per_share = form.data['price_per_share']

    user = current_user
    # user_stocks = [stock.to_dict() for stock in user.user_stocks]
    user_stock = UserStock.query.filter(UserStock.stock_symbol == stock_symbol).first()

    if user_stock:
        return {'error': "user already has stock"}, 400

    isStock = Stock.query.filter(Stock.stock_symbol == stock_symbol).first()
    if isStock == None:
        return {'error': "stock not found"}, 404

    if form.data['stock_shares'] is not None and form.data['stock_shares'] <= 0:
        return {'error': "Shares or amount must be greater than 0"}, 400



    if form.validate_on_submit():

        subtract_buying_power = shares_bought * price_per_share

        if subtract_buying_power > user.buying_power:
            return {'error': "Not enough buying power"}, 403

        new_transaction = Transaction(
            owner_id = user.id,
            stock_symbol = stock_symbol,
            is_buy = True,
            shares = shares_bought,
            price_per_share = price_per_share
        )
        new_user_stock = UserStock(
            owner_id = user.id,
            stock_symbol = stock_symbol,
            total_shares = shares_bought,
            average_price_per_share = price_per_share,
            total_invested = price_per_share * shares_bought
        )


        new_buying_power = user.buying_power - subtract_buying_power
        user.buying_power = float(format(new_buying_power, '.2f'))

        db.session.add(new_transaction)
        db.session.add(new_user_stock)
        db.session.commit()

        return {
            'userStock': new_user_stock.to_dict(),
            'message': "Shares bought successfully"
            }, 200
    return {'error': "transaction failed please enter valid inputs"}, 404




@user_routes.route('/<int:user_id>/stocks/<int:stock_id>', methods=['PUT'])
@login_required
def update_user_stocks(user_id, stock_id):
    """
    Query for a user to buy or sell already existing stocks in portfolio
    """
    form = UpdateStockForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    user = current_user
    stock_symbol = form.data['stock_symbol'].upper()

    isStock = Stock.query.filter(Stock.stock_symbol == stock_symbol).first()
    if isStock == None:
        return {'error': "stock not found"}, 404

    # user_stock = UserStock.query.filter(and_(UserStock.owner_id == user.id, UserStock.stock_symbol == stock_symbol)).first()
    user_stock = UserStock.query.filter(UserStock.id == stock_id).first()

    if form.validate_on_submit():

        stock_shares_bought = form.data['stock_shares_bought']
        stock_shares_sold = form.data['stock_shares_sold']
        price_per_share = form.data['price_per_share']

        #check if stock shares bought or sold is more than 0
        if stock_shares_bought is not None and stock_shares_bought <= 0:
            return {'error': "Shares or amount must be greater than 0"}, 400
        if stock_shares_sold is not None and stock_shares_sold <= 0:
            return {'error': "Shares or amount must be greater than 0"}, 400


        #add the stock shares bought to total shares and update user buying power
        if stock_shares_bought:
            subtract_buying_power = stock_shares_bought * price_per_share
            if subtract_buying_power > user.buying_power:
                return {'error': "Not enough buying power"}, 403
            added_total_shares = user_stock.total_shares + stock_shares_bought
            user_stock.total_shares = added_total_shares

            #change average price per share
            total_invested = (user_stock.total_invested + (price_per_share * stock_shares_bought))
            user_stock.total_invested = total_invested
            user_stock.average_price_per_share = total_invested / added_total_shares

            #change user buying power
            new_buying_power = user.buying_power - subtract_buying_power
            user.buying_power = float(format(new_buying_power, '.2f'))

            new_transaction = Transaction(
            owner_id = user.id,
            stock_symbol = stock_symbol,
            is_buy = True,
            shares = stock_shares_bought,
            price_per_share = price_per_share
        )
            db.session.add(new_transaction)
            db.session.commit()

            return {
                'message': "Shares bought successfully",
                'userStock': user_stock.to_dict()
                }, 200

        #subtract the stock shares sold and update user buying power
        if stock_shares_sold:

            #subtract sold shares number form total shares of stock
            subtracted_total_shares = user_stock.total_shares - stock_shares_sold
            if subtracted_total_shares <= 0:
                subtracted_total_shares = user_stock.total_shares
                db.session.delete(user_stock)

                new_transaction = Transaction(
                owner_id = user.id,
                stock_symbol = stock_symbol,
                is_buy = False,
                shares = subtracted_total_shares,
                price_per_share = price_per_share
                )

                db.session.add(new_transaction)
                db.session.commit()
                return {'message': "All shares sold successfully",
                        'stockSymbol': stock_symbol}, 200
            else: user_stock.total_shares = subtracted_total_shares

            #change average price per share
            total_invested = (user_stock.total_invested - (price_per_share * stock_shares_sold))
            user_stock.total_invested = total_invested
            user_stock.average_price_per_share = total_invested / subtracted_total_shares

            add_buying_power = stock_shares_sold * price_per_share
            new_buying_power = user.buying_power + add_buying_power

            user.buying_power = float(format(new_buying_power, '.2f'))

            new_transaction = Transaction(
            owner_id = user.id,
            stock_symbol = stock_symbol,
            is_buy = False,
            shares = stock_shares_sold,
            price_per_share = price_per_share
            )

            db.session.add(new_transaction)
            db.session.commit()


            return {
                'message': "Shares sold successfully",
                'userStock': user_stock.to_dict()
                }, 200

    return {'error': "transaction failed please enter valid inputs"}, 400






@user_routes.route('/<int:user_id>/stocks/<int:stock_id>', methods=['DELETE'])
@login_required
def sell_user_stocks(user_id, stock_id):
    """
    Query for selling all stock shares
    """
    form = SellStockForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    user = current_user

    stock_symbol = form.data['stock_symbol'].upper()

    #check to see if stock exists/ is in database
    isStock = Stock.query.filter(Stock.stock_symbol == stock_symbol).first()
    if isStock == None:
        return {'error': "stock not found"}, 404

    user_stock = UserStock.query.filter(UserStock.id == stock_id).first()

    if user_stock == None:
        return {'error': "stock is not owned"}, 404

    if form.validate_on_submit():
        price_per_share_sold = form.data["price_per_share_sold"]

        add_buying_power = user_stock.total_shares * price_per_share_sold
        new_buying_power = user.buying_power + add_buying_power
        user.buying_power = float(format(new_buying_power, '.2f'))

        new_transaction = Transaction(
        owner_id = user.id,
        stock_symbol = stock_symbol,
        is_buy = False,
        shares = user_stock.total_shares,
        price_per_share = price_per_share_sold
        )

        db.session.add(new_transaction)
        db.session.delete(user_stock)
        db.session.commit()

        return {'message': "All shares sold successfully", 'soldStock': user_stock.to_dict()}, 200
    return {"error": "transaction failed please enter valid inputs"}


