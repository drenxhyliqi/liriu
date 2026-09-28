"""Creates an owner login, or resets the password of an existing one.

There is no public signup. The first owner is created from a shell; after
that, owners can add more admins from the dashboard (Përdoruesit).

    docker compose exec api python -m scripts.create_admin admin@liriu-ks.com "strong-password" "Emri Mbiemri"
"""

import sys

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.admin_user import AdminRole, AdminUser


def main() -> None:
    if len(sys.argv) not in (3, 4):
        print(__doc__)
        raise SystemExit(1)

    email, password = sys.argv[1].lower(), sys.argv[2]
    full_name = sys.argv[3] if len(sys.argv) == 4 else ""
    if len(password) < 8:
        print("Password must be at least 8 characters.")
        raise SystemExit(1)

    db = SessionLocal()
    try:
        admin = db.query(AdminUser).filter(AdminUser.email == email).first()
        if admin is None:
            admin = AdminUser(email=email, full_name=full_name, role=AdminRole.OWNER, hashed_password="")
            db.add(admin)
            action = "created as owner"
        else:
            action = "password reset"
            if full_name:
                admin.full_name = full_name
        admin.hashed_password = hash_password(password)
        admin.is_active = True
        db.commit()
        print(f"Admin {email}: {action}.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
