import os
from sqlalchemy import create_engine, text

# Get from env or use default
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/mydatabase")

def check_db():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            # Check if admin_note column exists
            result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='applications' AND column_name='admin_note';"))
            exists = result.fetchone()
            if exists:
                print("Column 'admin_note' exists.")
            else:
                print("Column 'admin_note' is MISSING.")
                # Try to add it
                print("Attempting to add column 'admin_note'...")
                conn.execute(text("ALTER TABLE applications ADD COLUMN admin_note VARCHAR;"))
                conn.commit()
                print("Column 'admin_note' added successfully.")
    except Exception as e:
        print(f"Error connecting to database: {e}")

if __name__ == "__main__":
    check_db()
