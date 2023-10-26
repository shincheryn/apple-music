"""create tables

Revision ID: 5a48a5db817f
Revises:
Create Date: 2023-08-28 20:13:13.092930

"""
import os
from alembic import op
import sqlalchemy as sa

environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")
# revision identifiers, used by Alembic.
revision = '5a48a5db817f'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('firstName', sa.String(length=40), nullable=False),
    sa.Column('lastName', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('playlists',
    sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
    sa.Column('userId', sa.Integer(), nullable=False),
    sa.Column('playlist_name', sa.String(length=255), nullable=False),
    sa.Column('playlist_image_url', sa.String(length=255), nullable=False),
    sa.Column('createdAt', sa.DateTime, server_default=sa.func.now()),
    sa.Column('updatedAt', sa.DateTime, server_default=sa.func.now(), server_onupdate=sa.func.now()),
    sa.PrimaryKeyConstraint('id'),
    )
    op.create_table('songs',
    sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
    sa.Column('song_name', sa.String(length=30), nullable=False),
    sa.Column('userId', sa.Integer(), nullable=False),
    sa.Column('genre', sa.String(length=20), nullable=False),
    sa.Column('createdAt', sa.DateTime(), server_default=sa.func.current_timestamp(), nullable=False),
    sa.Column('updatedAt', sa.DateTime(), server_default=sa.func.current_timestamp(), nullable=False),
    sa.Column('image_url', sa.String(length=255)),
    sa.Column('song_url', sa.String(length=255)),
    sa.PrimaryKeyConstraint('id'),
    )
    op.create_table('albums',
    sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
    sa.Column('album_name', sa.String(length=255), nullable=False),
    sa.Column('userId', sa.Integer(), nullable=False),
    sa.Column('release_year', sa.Integer(), nullable=False),
    sa.Column('genre', sa.String(length=255), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=False),
    sa.Column('album_image_url', sa.String(length=255), nullable=False),
    # sa.Column('createdAt', sa.DateTime(), nullable=False),
    # sa.Column('updatedAt', sa.DateTime(), nullable=False),
    sa.Column('createdAt', sa.DateTime, server_default=sa.func.now()),
    sa.Column('updatedAt', sa.DateTime, server_default=sa.func.now(), server_onupdate=sa.func.now()),
    sa.PrimaryKeyConstraint('id'),
    )
    op.create_table('album_songs',
    sa.Column("albumId", sa.Integer(), primary_key=True),
    sa.Column("songId", sa.Integer(), primary_key=True),
    sa.ForeignKeyConstraint(["albumId"], ['albums.id']),
    sa.ForeignKeyConstraint(["songId"], ['songs.id'])
    )
    op.create_table('play_songs',
    sa.Column("playlistId", sa.Integer(), primary_key=True),
    sa.Column("songId", sa.Integer(), primary_key=True),
    sa.ForeignKeyConstraint(["playlistId"], ['playlists.id']),
    sa.ForeignKeyConstraint(["songId"], ['songs.id'])
    )
    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE songs SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE playlists SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE albums SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE album_songs SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE play_songs SET SCHEMA {SCHEMA};")


def downgrade() -> None:
    op.drop_table('users', 'playlists', 'albums', 'songs', 'play_songs', 'album_songs')
