"""empty message

Revision ID: a7a013ed78b6
Revises:
Create Date: 2023-01-29 16:24:52.182799

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = 'a7a013ed78b6'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('stocks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('stock_symbol', sa.String(length=255), nullable=False),
    sa.Column('company_name', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=55), nullable=False),
    sa.Column('last_name', sa.String(length=55), nullable=False),
    sa.Column('username', sa.String(length=55), nullable=False),
    sa.Column('email', sa.String(length=55), nullable=False),
    sa.Column('total_investment', sa.Float(), nullable=False),
    sa.Column('buying_power', sa.Float(), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('transactions',
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=False),
    sa.Column('stock_symbol', sa.String(length=255), nullable=False),
    sa.Column('is_buy', sa.Boolean(), nullable=False),
    sa.Column('shares', sa.Float(), nullable=False),
    sa.Column('price_per_share', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_stocks',
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=False),
    sa.Column('stock_symbol', sa.String(length=255), nullable=False),
    sa.Column('total_shares', sa.Float(), nullable=False),
    sa.Column('average_price_per_share', sa.Float(), nullable=False),
    sa.Column('total_invested', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('watchlists',
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('watchlists_stocks',
    sa.Column('watchlist_id', sa.Integer(), nullable=False),
    sa.Column('stocks_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['stocks_id'], ['stocks.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['watchlist_id'], ['watchlists.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('watchlist_id', 'stocks_id'),
    sa.UniqueConstraint('watchlist_id', 'stocks_id', name='unique_watchlist_stock')
    )
    # ### end Alembic commands ###

    if environment == "production":
        op.execute(f"ALTER TABLE stocks SET SCHEMA {SCHEMA};")

    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")

    if environment == "production":
        op.execute(f"ALTER TABLE user_stocks SET SCHEMA {SCHEMA};")

    if environment == "production":
        op.execute(f"ALTER TABLE watchlists SET SCHEMA {SCHEMA};")

    if environment == "production":
        op.execute(f"ALTER TABLE watchlists_stocks SET SCHEMA {SCHEMA};")

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('watchlists_stocks')
    op.drop_table('watchlists')
    op.drop_table('user_stocks')
    op.drop_table('transactions')
    op.drop_table('users')
    op.drop_table('stocks')
    # ### end Alembic commands ###