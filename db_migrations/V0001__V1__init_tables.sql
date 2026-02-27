CREATE TABLE IF NOT EXISTS t_p37631411_3d_model_order_porta.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  phone VARCHAR(50),
  city VARCHAR(100),
  company VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p37631411_3d_model_order_porta.products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  complexity VARCHAR(100),
  formats VARCHAR(255),
  delivery_time VARCHAR(100),
  description TEXT,
  color VARCHAR(20) DEFAULT '#C4A35A',
  in_stock BOOLEAN DEFAULT TRUE,
  rating NUMERIC(3,1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p37631411_3d_model_order_porta.orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(30) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES t_p37631411_3d_model_order_porta.users(id),
  status VARCHAR(50) DEFAULT 'pending',
  delivery_service VARCHAR(100),
  delivery_price INTEGER DEFAULT 0,
  subtotal INTEGER NOT NULL,
  total INTEGER NOT NULL,
  tracking_number VARCHAR(100),
  client_name VARCHAR(255),
  client_email VARCHAR(255),
  promo_discount INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p37631411_3d_model_order_porta.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES t_p37631411_3d_model_order_porta.orders(id),
  product_id INTEGER REFERENCES t_p37631411_3d_model_order_porta.products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS t_p37631411_3d_model_order_porta.reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p37631411_3d_model_order_porta.users(id),
  product_id INTEGER REFERENCES t_p37631411_3d_model_order_porta.products(id),
  author_name VARCHAR(255),
  city VARCHAR(100),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  product_name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
