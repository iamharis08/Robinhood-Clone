from app.models import db, Watchlist, environment, SCHEMA

def seed_watchlists():
    watchlist1 = Watchlist(
        owner_id=1, name='My Watchlist')
    watchlist2 = Watchlist(
        owner_id=1, name='Buy the Dip')
    watchlist3 = Watchlist(
        owner_id=3, name='Stock Watchlist')
    watchlist4 = Watchlist(
        owner_id=4, name='Stock Watchlist')
    watchlist5 = Watchlist(
        owner_id=5, name='Stock Watchlist')

    all_watchlists=[watchlist1, watchlist2, watchlist3, watchlist4, watchlist5]
    add_watchlists=[db.session.add(watchlist) for watchlist in all_watchlists]
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_watchlists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM watchlists")

    db.session.commit()
