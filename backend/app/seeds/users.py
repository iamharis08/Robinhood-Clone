from app.models import db, User, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        first_name='Demo', last_name='User', username='Demo', email='demo@aa.io', buying_power=10000, password='password')
    marnie = User(
        first_name='Marnie', last_name='Lewinski', username='marnie', email='marnie@aa.io', buying_power=10000, password='password')
    bobbie = User(
        first_name='Bobbie', last_name='Tables', username='bobbie', email='bobbie@aa.io', buying_power=10000, password='password')
    trevor = User(
        first_name='Trevor', last_name='Moore', username='trevorwmoore', email='trevor@aa.io', buying_power=10000, password='password')
    tyler = User(
        first_name='Tyler', last_name='Short', username='cahzm', email='christian@aa.io', buying_power=10000, password='password')
    haris = User(
        first_name='Haris', last_name='Ahmed', username='harisahmed', email='haris@aa.io', buying_power=10000, password='password')
    jacob = User(
        first_name='Jacob', last_name='Lauxman', username='cobe', email='jacob@aa.io', buying_power=10000, password='password')
    ryan = User(
        first_name='Ryan', last_name='Schneider', username='ryan', email='ryan@aa.io', buying_power=10000, password='password')

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.add(trevor)
    db.session.add(tyler)
    db.session.add(haris)
    db.session.add(jacob)
    db.session.add(ryan)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM users")

    db.session.commit()
