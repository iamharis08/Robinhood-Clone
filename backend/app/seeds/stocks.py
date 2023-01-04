from app.models import db, Stock, environment, SCHEMA
# import os

# def seed_stocks():

#     with open(f'{os.path.dirname(__file__)}/stocks_list.csv', 'r') as csv_file:
#         for row in csv_file.readlines()[1:]:
#             stock_symbol, company_name = row.split(',')[:2]
#             db.session.add(Stock(stock_symbol=stock_symbol, company_name=company_name))

#     db.session.commit()
def seed_stocks():
    stock1 = Stock(
        stock_symbol='TSLA')
    stock2 = Stock(
        stock_symbol='AAPL')
    stock3 = Stock(
        stock_symbol='AMC')
    stock4 = Stock(
        stock_symbol='GME')
    stock5 = Stock(
        stock_symbol='AMD')
    stock6 = Stock(
        stock_symbol='CPRX')
    stock7 = Stock(
        stock_symbol='CRSR')
    stock8 = Stock(
        stock_symbol='ABNB')
    stock9 = Stock(
        stock_symbol='AMZN')
    stock10 = Stock(
        stock_symbol='NVDA')

    all_stocks=[stock1, stock2, stock3, stock4, stock5, stock6, stock7, stock8, stock9, stock10]
    add_stocks=[db.session.add(stock) for stock in all_stocks]
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM stocks")

    db.session.commit()
