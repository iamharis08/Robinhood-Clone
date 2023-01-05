from app.models import db, environment, SCHEMA, User, Watchlist, Stock

def seed_watchlists_stocks():

    stock1 = Stock.query.get(1)
    stock2 = Stock.query.get(2)
    stock3 = Stock.query.get(3)
    stock4 = Stock.query.get(4)
    stock5 = Stock.query.get(5)
    # stock1 = Stock.query.get(22)
    # stock2 = Stock.query.get(9685)
    # stock3 = Stock.query.get(416)
    # stock4 = Stock.query.get(475)
    # stock5 = Stock.query.get(45)
    # stock6 = Stock.query.get(4154)
    # stock7 = Stock.query.get(2125)
    # stock8 = Stock.query.get(421)
    # stock9 = Stock.query.get(4148)
    # stock10 = Stock.query.get(4205)

    watchlist1 = Watchlist.query.get(1)
    watchlist2 = Watchlist.query.get(2)
    watchlist3 = Watchlist.query.get(3)
    watchlist4 = Watchlist.query.get(4)
    watchlist5 = Watchlist.query.get(5)

    watchlist1.stocks.append(stock1)
    watchlist1.stocks.append(stock2)
    watchlist1.stocks.append(stock3)
    watchlist1.stocks.append(stock4)
    watchlist1.stocks.append(stock5)

    # watchlist2.stocks.append(stock6)
    # watchlist2.stocks.append(stock7)
    # watchlist2.stocks.append(stock8)
    # watchlist2.stocks.append(stock9)
    # watchlist2.stocks.append(stock10)

    # watchlist3.stocks.append(stock1)
    # watchlist3.stocks.append(stock2)
    # watchlist3.stocks.append(stock3)
    # watchlist3.stocks.append(stock4)
    # watchlist3.stocks.append(stock5)

    # watchlist3.stocks.append(stock6)
    # watchlist3.stocks.append(stock7)
    # watchlist3.stocks.append(stock8)
    # watchlist3.stocks.append(stock9)
    # watchlist3.stocks.append(stock10)

    # watchlist4.stocks.append(stock1)
    # watchlist4.stocks.append(stock2)
    # watchlist4.stocks.append(stock3)
    # watchlist4.stocks.append(stock4)
    # watchlist4.stocks.append(stock5)

    # watchlist4.stocks.append(stock6)
    # watchlist4.stocks.append(stock7)
    # watchlist4.stocks.append(stock8)
    # watchlist4.stocks.append(stock9)
    # watchlist4.stocks.append(stock10)

    # watchlist5.stocks.append(stock1)
    # watchlist5.stocks.append(stock2)
    # watchlist5.stocks.append(stock3)
    # watchlist5.stocks.append(stock4)
    # watchlist5.stocks.append(stock5)

    # watchlist5.stocks.append(stock6)
    # watchlist5.stocks.append(stock7)
    # watchlist5.stocks.append(stock8)
    # watchlist5.stocks.append(stock9)
    # watchlist5.stocks.append(stock10)


    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_watchlists_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlists_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM watchlists_stocks")

    db.session.commit()
