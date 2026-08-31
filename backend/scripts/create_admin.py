"""One-off CLI to create (or update the password of) an admin login.

There is no public signup endpoint - this is a single-team internal CMS,
so the first (and any later) admin account is provisioned by whoever has
shell access to the API container, not through the API itself.

Usage (inside the api container, or locally with DATABASE_URL pointed at
the right Postgres):

    python -m scripts.create_admin admin@liriu-ks.com "some-strong-password"

    # via docker-compose:
    docker compose exec api python -m scripts.create_admin admin@liriu-ks.com "some-strong-password"
"""

import sys

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.admin_user import AdminUser


def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__)
        raise SystemExit(1)

    email, password = sys.argv[1], sys.argv[2]
    db = SessionLocal()
    try:
        admin = db.query(AdminUser).filter(AdminUser.email == email).first()
        if admin is None:
            admin = AdminUser(email=email, hashed_password=hash_password(password))
            db.add(admin)
            action = "created"
        else:
            admin.hashed_password = hash_password(password)
            action = "password updated"
        db.commit()
        print(f"Admin {email}: {action}.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
