"""
Главный API для маркетплейса Reufer Studio 3D.
Обрабатывает запросы: товары, заказы, пользователи, отзывы.
"""
import json
import os
import psycopg2
from datetime import datetime

SCHEMA = "t_p37631411_3d_model_order_porta"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token",
    "Content-Type": "application/json",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data):
    return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, code=400):
    return {"statusCode": code, "headers": CORS_HEADERS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    params = event.get("queryStringParameters") or {}
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # Роутинг
    if path == "/" or path == "":
        return ok({"status": "ok", "service": "Reufer Studio API"})

    # ── PRODUCTS ──────────────────────────────────────
    if path == "/products" and method == "GET":
        return get_products(params)

    if path == "/products" and method == "POST":
        return create_product(body)

    if path.startswith("/products/") and method == "PUT":
        pid = path.split("/")[-1]
        return update_product(pid, body)

    if path.startswith("/products/") and method == "DELETE":
        pid = path.split("/")[-1]
        return delete_product(pid)

    # ── ORDERS ────────────────────────────────────────
    if path == "/orders" and method == "GET":
        return get_orders(params)

    if path == "/orders" and method == "POST":
        return create_order(body)

    if path.startswith("/orders/") and method == "PUT":
        oid = path.split("/")[-1]
        return update_order(oid, body)

    # ── USERS ─────────────────────────────────────────
    if path == "/auth/login" and method == "POST":
        return login(body)

    if path == "/auth/register" and method == "POST":
        return register(body)

    if path == "/users" and method == "GET":
        return get_users()

    # ── REVIEWS ───────────────────────────────────────
    if path == "/reviews" and method == "GET":
        return get_reviews(params)

    if path == "/reviews" and method == "POST":
        return create_review(body)

    if path.startswith("/reviews/") and method == "PUT":
        rid = path.split("/")[-1]
        return update_review(rid, body)

    return err("Not found", 404)


# ── PRODUCTS ──────────────────────────────────────────────────────────────────

def get_products(params):
    category = params.get("category")
    conn = get_conn()
    cur = conn.cursor()
    if category and category != "Все":
        cur.execute(
            f"SELECT id, name, category, price, complexity, formats, delivery_time, color, in_stock, rating, reviews_count FROM {SCHEMA}.products WHERE in_stock = TRUE AND category = %s ORDER BY id",
            (category,)
        )
    else:
        cur.execute(
            f"SELECT id, name, category, price, complexity, formats, delivery_time, color, in_stock, rating, reviews_count FROM {SCHEMA}.products WHERE in_stock = TRUE ORDER BY id"
        )
    rows = cur.fetchall()
    cols = ["id", "name", "category", "price", "complexity", "format", "time", "color", "in_stock", "rating", "reviews"]
    products = [dict(zip(cols, r)) for r in rows]
    for p in products:
        p["rating"] = float(p["rating"])
    cur.close()
    conn.close()
    return ok(products)


def create_product(body):
    name = body.get("name", "").strip()
    category = body.get("category", "").strip()
    price = body.get("price")
    if not name or not category or not price:
        return err("Заполните name, category, price")
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"""INSERT INTO {SCHEMA}.products (name, category, price, complexity, formats, delivery_time, color, description, in_stock)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
        (name, category, int(price),
         body.get("complexity", "Средняя"),
         body.get("formats", "STL"),
         body.get("delivery_time", "3–5 дней"),
         body.get("color", "#C4A35A"),
         body.get("description", ""),
         body.get("in_stock", True))
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return ok({"id": new_id, "message": "Товар добавлен"})


def update_product(pid, body):
    conn = get_conn()
    cur = conn.cursor()
    fields = []
    vals = []
    allowed = ["name", "category", "price", "complexity", "formats", "delivery_time", "color", "description", "in_stock"]
    for k in allowed:
        if k in body:
            fields.append(f"{k} = %s")
            vals.append(body[k])
    if not fields:
        return err("Нет данных для обновления")
    vals.append(pid)
    cur.execute(f"UPDATE {SCHEMA}.products SET {', '.join(fields)} WHERE id = %s", vals)
    conn.commit()
    cur.close()
    conn.close()
    return ok({"message": "Товар обновлён"})


def delete_product(pid):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(f"UPDATE {SCHEMA}.products SET in_stock = FALSE WHERE id = %s", (pid,))
    conn.commit()
    cur.close()
    conn.close()
    return ok({"message": "Товар снят с продажи"})


# ── ORDERS ────────────────────────────────────────────────────────────────────

def get_orders(params):
    user_id = params.get("user_id")
    conn = get_conn()
    cur = conn.cursor()
    if user_id:
        cur.execute(
            f"SELECT id, order_number, status, delivery_service, total, client_name, tracking_number, created_at FROM {SCHEMA}.orders WHERE user_id = %s ORDER BY created_at DESC",
            (user_id,)
        )
    else:
        cur.execute(
            f"SELECT id, order_number, status, delivery_service, total, client_name, tracking_number, created_at FROM {SCHEMA}.orders ORDER BY created_at DESC LIMIT 100"
        )
    rows = cur.fetchall()
    cols = ["id", "order_number", "status", "delivery_service", "total", "client_name", "tracking_number", "created_at"]
    orders = [dict(zip(cols, r)) for r in rows]

    for order in orders:
        cur.execute(
            f"SELECT product_name, quantity, price FROM {SCHEMA}.order_items WHERE order_id = %s",
            (order["id"],)
        )
        items = cur.fetchall()
        order["items"] = [{"name": i[0], "qty": i[1], "price": i[2]} for i in items]

    cur.close()
    conn.close()
    return ok(orders)


def create_order(body):
    items = body.get("items", [])
    if not items:
        return err("Корзина пуста")
    subtotal = body.get("subtotal", 0)
    total = body.get("total", 0)
    order_num = "РС-" + datetime.now().strftime("%y%m%d%H%M%S")
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"""INSERT INTO {SCHEMA}.orders (order_number, user_id, status, delivery_service, delivery_price, subtotal, total, client_name, client_email, promo_discount)
            VALUES (%s, %s, 'pending', %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
        (order_num,
         body.get("user_id"),
         body.get("delivery_service", "СДЭК"),
         body.get("delivery_price", 0),
         subtotal, total,
         body.get("client_name", ""),
         body.get("client_email", ""),
         body.get("promo_discount", 0))
    )
    order_id = cur.fetchone()[0]
    for item in items:
        cur.execute(
            f"INSERT INTO {SCHEMA}.order_items (order_id, product_id, product_name, quantity, price) VALUES (%s, %s, %s, %s, %s)",
            (order_id, item.get("product_id"), item.get("name", ""), item.get("qty", 1), item.get("price", 0))
        )
    conn.commit()
    cur.close()
    conn.close()
    return ok({"order_number": order_num, "id": order_id})


def update_order(oid, body):
    conn = get_conn()
    cur = conn.cursor()
    fields = []
    vals = []
    if "status" in body:
        fields.append("status = %s")
        vals.append(body["status"])
    if "tracking_number" in body:
        fields.append("tracking_number = %s")
        vals.append(body["tracking_number"])
    fields.append("updated_at = NOW()")
    vals.append(oid)
    cur.execute(f"UPDATE {SCHEMA}.orders SET {', '.join(fields)} WHERE id = %s", vals)
    conn.commit()
    cur.close()
    conn.close()
    return ok({"message": "Заказ обновлён"})


# ── AUTH ──────────────────────────────────────────────────────────────────────

def login(body):
    email = body.get("email", "").strip().lower()
    password = body.get("password", "")
    if not email or not password:
        return err("Введите email и пароль")
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"SELECT id, name, email, role FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s",
        (email, password)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        return err("Неверный email или пароль", 401)
    return ok({"id": row[0], "name": row[1], "email": row[2], "role": row[3]})


def register(body):
    name = body.get("name", "").strip()
    email = body.get("email", "").strip().lower()
    password = body.get("password", "")
    if not name or not email or not password:
        return err("Заполните все поля")
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return err("Пользователь с таким email уже существует")
    cur.execute(
        f"INSERT INTO {SCHEMA}.users (name, email, password_hash, role) VALUES (%s, %s, %s, 'client') RETURNING id",
        (name, email, password)
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return ok({"id": new_id, "name": name, "email": email, "role": "client"})


def get_users():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(f"SELECT id, name, email, role, phone, city, company, created_at FROM {SCHEMA}.users ORDER BY id")
    rows = cur.fetchall()
    cols = ["id", "name", "email", "role", "phone", "city", "company", "created_at"]
    users = [dict(zip(cols, r)) for r in rows]
    cur.close()
    conn.close()
    return ok(users)


# ── REVIEWS ───────────────────────────────────────────────────────────────────

def get_reviews(params):
    status = params.get("status", "approved")
    conn = get_conn()
    cur = conn.cursor()
    if status == "all":
        cur.execute(
            f"SELECT id, author_name, city, rating, text, product_name, status, helpful_count, created_at FROM {SCHEMA}.reviews ORDER BY created_at DESC"
        )
    else:
        cur.execute(
            f"SELECT id, author_name, city, rating, text, product_name, status, helpful_count, created_at FROM {SCHEMA}.reviews WHERE status = %s ORDER BY created_at DESC",
            (status,)
        )
    rows = cur.fetchall()
    cols = ["id", "author", "city", "rating", "text", "product", "status", "helpful", "date"]
    reviews = [dict(zip(cols, r)) for r in rows]
    cur.close()
    conn.close()
    return ok(reviews)


def create_review(body):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {SCHEMA}.reviews (author_name, city, rating, text, product_name, user_id, status) VALUES (%s, %s, %s, %s, %s, %s, 'pending') RETURNING id",
        (body.get("name", "Аноним"),
         body.get("city", ""),
         body.get("rating", 5),
         body.get("text", ""),
         body.get("product", ""),
         body.get("user_id"))
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return ok({"id": new_id, "message": "Отзыв отправлен на модерацию"})


def update_review(rid, body):
    conn = get_conn()
    cur = conn.cursor()
    new_status = body.get("status")
    if new_status not in ("approved", "rejected", "pending"):
        return err("Неверный статус")
    cur.execute(f"UPDATE {SCHEMA}.reviews SET status = %s WHERE id = %s", (new_status, rid))
    conn.commit()
    cur.close()
    conn.close()
    return ok({"message": "Отзыв обновлён"})
