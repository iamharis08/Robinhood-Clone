from app.models import db, UserStock, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_user_stocks():
    user_stocks1 = UserStock(
        owner_id= 1, stock_symbol='AAPL', stock_shares=1, average_price=124.24)

    db.session.add(user_stocks1)


    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_user_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.user_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM user_stocks")

    db.session.commit()
