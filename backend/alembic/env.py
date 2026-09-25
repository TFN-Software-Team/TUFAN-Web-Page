import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
from dotenv import load_dotenv

<<<<<<< HEAD
=======
from dotenv import load_dotenv
import os

>>>>>>> Duru-frontend
# 1. Çevresel değişkenleri (environment variables) sisteme yüklüyoruz
load_dotenv()

# 2. Modellerimizin olduğu Base sınıfını çağırıyoruz
from app.models import Base

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

<<<<<<< HEAD
# 3. Alembic'e modellerimizi tanıtıyoruz (hedef metadata)
=======
# 3. Alembic'e modellerimizi tanıtıyoruz
>>>>>>> Duru-frontend
target_metadata = Base.metadata

# 4. DATABASE_URL'i güvenli bir şekilde .env dosyasından çekiyoruz
database_url = os.getenv("DATABASE_URL")
if not database_url:
    raise ValueError("DATABASE_URL bulunamadı! Lütfen .env dosyanızı kontrol edin.")
<<<<<<< HEAD
=======

# 5. Çekilen URL'i Alembic konfigürasyonuna aktarıyoruz
config.set_main_option("sqlalchemy.url", database_url)

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.
>>>>>>> Duru-frontend

# 5. Çekilen URL'i Alembic konfigürasyonuna aktarıyoruz
config.set_main_option("sqlalchemy.url", database_url)

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()