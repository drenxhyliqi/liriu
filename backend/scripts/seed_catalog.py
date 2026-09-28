"""Loads the starter catalog (seed/catalog.json) into an empty database.

The fixture is the catalog the site shipped with before it moved to the
database: every category, sign and product image that was in the static
frontend data files. Image paths like /signs/... are served by the Next.js
app's public/ folder.

    docker compose exec api python -m scripts.seed_catalog

Refuses to run when categories or products already exist, so it can't
overwrite edits made in the dashboard. Pass --force to wipe the catalog
(categories, products, links - not orders or messages) and reload it.
"""

import json
import sys
from pathlib import Path

from app.db.session import SessionLocal
from app.models.category import Category
from app.models.product import Product, ProductCategory

FIXTURE = Path(__file__).resolve().parent.parent / "seed" / "catalog.json"


def main() -> None:
    force = "--force" in sys.argv
    data = json.loads(FIXTURE.read_text())
    db = SessionLocal()
    try:
        has_data = db.query(Category.id).first() or db.query(Product.id).first()
        if has_data and not force:
            print("Catalog is not empty - nothing done. Use --force to wipe and reload it.")
            raise SystemExit(1)
        if force:
            db.query(ProductCategory).delete()
            db.query(Product).delete()
            db.query(Category).update({Category.parent_id: None})
            db.query(Category).delete()
            db.flush()

        by_slug: dict[str, Category] = {}
        for row in data["categories"]:  # parents always precede children in the fixture
            category = Category(
                slug=row["slug"],
                name=row["name"],
                description=row["description"],
                image_url=row["imageUrl"],
                image_fit=row["imageFit"],
                sort_order=row["sortOrder"],
                parent=by_slug[row["parent"]] if row["parent"] else None,
            )
            db.add(category)
            by_slug[row["slug"]] = category
        db.flush()

        for row in data["products"]:
            product = Product(
                slug=row["slug"],
                name=row["name"],
                description=row["description"],
                keywords=row["keywords"],
                image_url=row["imageUrl"],
                image_fit=row["imageFit"],
            )
            product.category_links = [
                ProductCategory(category_id=by_slug[p["category"]].id, position=p["position"])
                for p in row["placements"]
            ]
            db.add(product)

        db.commit()
        print(f"Seeded {len(data['categories'])} categories and {len(data['products'])} products.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
