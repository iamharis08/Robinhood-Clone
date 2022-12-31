from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Watchlist, Stock
from app.forms import WatchlistForm

watchlists_routes = Blueprint('watchlists', __name__)


## GET all user WatchLists

@watchlists_routes.route('/')
@login_required
def get_all_watchlist():
    """
    Query for all user watchlists with user_id and returns all watchlsits in a dictionary
    """
    userId = current_user.id
    watchlists = Watchlist.query.filter_by(owner_id=userId).all()

    ## nested for loops are used because user most likely wont have very large number of watchlists
    res=[]
    for w in watchlists:
        stocks_list = []
        for stock in w.stocks:
            formatted_stock = {
                'id': stock.id,
                'stock_symbol': stock.stock_symbol
            }
            stocks_list.append(formatted_stock)
        formatted_watchlist = w.to_dict()
        formatted_watchlist.update({'stocks': stocks_list})
        res.append(formatted_watchlist)


    return {'watchlists': res}, 200


## GET a specific Watchlist by id

@watchlists_routes.route('/<int:watchlist_id>')
@login_required
def get_one_watchlist(watchlist_id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    watchlist = Watchlist.query.get(watchlist_id)
    return {'watchlist': watchlist.to_dict()}, 200


##Create Watchlist

@watchlists_routes.route('/', methods=["POST"])
@login_required
def create_watchlist():
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = current_user
    form = WatchlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        watchlist = Watchlist(
            owner_id = user.id,
            name = form.data['name']
        )

        db.session.add(watchlist)
        db.session.commit()

        return {'watchlist': watchlist.to_dict()}, 200
    return {"errors": ["Validation Error: Could not create Watchlist"]}


##UPDATE a Watchlist

@watchlists_routes.route('/<int:watchlist_id>', methods=["PUT"])
@login_required
def update_watchlist(watchlist_id):
    """
    Update one watchlist and return that watchlist
    """
    user = current_user.to_dict()
    form = WatchlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        watchlist = Watchlist.query.get(watchlist_id)
        watchlist.name = form.data['name']

        db.session.add(watchlist)
        db.session.commit()

        return {'watchlist': watchlist.to_dict()}, 200
    return {"errors": ["Validation Error: Could not create Watchlist"]}


#DELETE Watchlist

@watchlists_routes.route("/<int:watchlist_id>", methods=["DELETE"])
@login_required
def delete_watchlist(watchlist_id):
    user = current_user.to_dict()
    watchlist = Watchlist.query.get(watchlist_id)
    if user['id'] == watchlist.owner_id:

        db.session.delete(watchlist)
        db.session.commit()
        return {"message": "Successfully Deleted"}, 200
    return 'BAD REQUEST', 404
