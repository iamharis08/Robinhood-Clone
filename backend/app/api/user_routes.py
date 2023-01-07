from flask import Blueprint, jsonify, request, session
from flask_login import login_required, current_user
from app.models import db, User, UserStock, Stock
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


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/stocks')
@login_required
def user_stocks():
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = current_user

    return {'userStocks': [stock.to_dict() for stock in user.user_stocks]}, 200



@user_routes.route('/stocks', methods=['POST'])
@login_required
def buy_user_stocks():
    """
    Query for a user by id and returns that user in a dictionary
    """
    form = BuyStockForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    user = current_user
    user_stocks = [stock.to_dict() for stock in user.user_stocks]
    isStock = Stock.query.filter(Stock.stock_symbol == form.data['stock_symbol'].upper()).first()
    if isStock == None:
        return {'error': "stock not found"}, 404

    print(isStock, "ISTOCKKKKKKKKKKKKK")
    print(user_stocks, form.data['stock_symbol'] == user_stocks[0]['stockSymbol'])

    if form.validate_on_submit():
        for stock in user_stocks:
            if form.data['stock_symbol'].upper() == stock['stockSymbol']:
                return {'error': "user already has stock"}, 400

        subtract_buying_power = form.data['stock_shares'] * form.data['price_per_share']
        if subtract_buying_power > user.buying_power:
            return {'error': "Not enough buying power"}, 403

        new_user_stock = UserStock(
            owner_id = user.id,
            stock_symbol = form.data['stock_symbol'].upper(),
            stock_shares = form.data['stock_shares'],
            total_invested = form.data['price_per_share'] * form.data['stock_shares']
        )


        new_buying_power = user.buying_power - subtract_buying_power
        user.buying_power = new_buying_power
        print(user.buying_power, "NEWWWWWWWW")
        db.session.add(new_user_stock)
        db.session.commit()

        return {'userStock': new_user_stock.to_dict()}, 200


@user_routes.route('/stocks', methods=['PUT'])
@login_required
def update_user_stocks():
    """
    Query for a user by id and returns that user in a dictionary
    """
    form = UpdateStockForm()


    form['csrf_token'].data = request.cookies['csrf_token']
    user = current_user
    isStock = Stock.query.filter(Stock.stock_symbol == form.data['stock_symbol'].upper()).first()
    if isStock == None:
        return {'error': "stock not found"}, 404
    user_stock = UserStock.query.filter(and_(UserStock.owner_id == user.id, UserStock.stock_symbol == form.data['stock_symbol'].upper())).first()


    # print(isStock, "ISTOCKKKKKKKKKKKKK")
    # print(user_stocks, form.data['stock_symbol'] == user_stocks[0]['stockSymbol'])

    if form.validate_on_submit():
        #add the stock shares bought to shares
        if form.data['stock_shares_bought']:
            subtract_buying_power = form.data['stock_shares_bought'] * form.data['price_per_share']
            if subtract_buying_power > user.buying_power:
                return {'error': "Not enough buying power"}, 403
            added_total_shares = user_stock.stock_shares + form.data['stock_shares_bought']
            user_stock.stock_shares = added_total_shares
            #change average price per share
            user_stock.total_invested = (user_stock.total_invested + (form.data['price_per_share'] * form.data['stock_shares_bought']))
            new_buying_power = user.buying_power - subtract_buying_power
            user.buying_power = new_buying_power
            print(user.buying_power, "NEWWWWWWWW")
            db.session.commit()

            return {'userStock': user_stock.to_dict()}, 200

        if form.data['stock_shares_sold']:
            subtracted_total_shares = user_stock.stock_shares - form.data['stock_shares_sold']
            user_stock.stock_shares = subtracted_total_shares
            #change average price per share
            # user_stock.average_price = (user_stock.average_price + form.data['price_per_share']) / (added_total_shares)
            user_stock.total_invested = (user_stock.total_invested - (form.data['price_per_share'] * form.data['stock_shares_sold']))

            if user_stock.stock_shares <= 0:
                db.session.delete(user_stock)
                user_stock = None

            add_buying_power = form.data['stock_shares_sold'] * form.data['price_per_share']
            new_buying_power = user.buying_power + add_buying_power
            user.buying_power = new_buying_power
            print(user.buying_power,"NEWWWWWWWW")

            db.session.commit()

            if user_stock == None:
                return {'Message': "Stock Sold Successfully"}, 200
            else:
                return {'userStock': user_stock.to_dict()}, 200

    return {'userStock': "transaction failed enter correct data"}, 404






@user_routes.route('/stocks', methods=['DELETE'])
@login_required
def sell_user_stocks():
    """
    Query for a user by id and returns that user in a dictionary
    """
    form = SellStockForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    user = current_user
    sell_user_stock = UserStock.query.filter(and_(UserStock.owner_id == user.id, UserStock.stock_symbol == form.data['stock_symbol'].upper())).first()
    isStock = Stock.query.filter(Stock.stock_symbol == form.data['stock_symbol'].upper()).first()
    if isStock == None:
        return {'error': "stock not found"}, 404

    # print(isStock, "ISTOCKKKKKKKKKKKKK")

    if form.validate_on_submit():

        add_buying_power = sell_user_stock.stock_shares * form.data["price_per_share_sold"]
        new_buying_power = user.buying_power + add_buying_power
        user.buying_power = new_buying_power
        # print(user.buying_power, "NEWWWWWWWWSELLLLL")

        db.session.delete(sell_user_stock)
        db.session.commit()

        return {'message': "Stock Sold Successfully", 'soldStock': sell_user_stock.to_dict()}, 200
    return {"message": "Invalid transaction input"}
