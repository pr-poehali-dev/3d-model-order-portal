INSERT INTO t_p37631411_3d_model_order_porta.users (name, email, password_hash, role)
SELECT 'Администратор', 'admin@reufer.studio', 'admin123', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM t_p37631411_3d_model_order_porta.users WHERE email = 'admin@reufer.studio');

INSERT INTO t_p37631411_3d_model_order_porta.products (name, category, price, complexity, formats, delivery_time, color, rating, reviews_count)
SELECT * FROM (VALUES
  ('Архитектурный фасад', 'Архитектура', 12500, 'Высокая', 'STL / OBJ / FBX', '5–7 дней', '#C4A35A', 4.9::NUMERIC, 24),
  ('Промышленная деталь', 'Промышленность', 8900, 'Средняя', 'STEP / STL', '3–5 дней', '#7A8B99', 4.7::NUMERIC, 18),
  ('Ювелирное кольцо', 'Ювелирные', 5400, 'Высокая', 'STL / 3DM', '2–4 дня', '#E8C97A', 5.0::NUMERIC, 31),
  ('Игровой персонаж', 'Персонажи', 18700, 'Очень высокая', 'FBX / OBJ', '7–14 дней', '#8B5CF6', 4.8::NUMERIC, 12),
  ('Интерьерная ваза', 'Интерьер', 3200, 'Низкая', 'STL / OBJ', '1–2 дня', '#5C8A7A', 4.6::NUMERIC, 47),
  ('Кузов автомобиля', 'Авто', 24000, 'Очень высокая', 'STEP / IGES / STL', '10–14 дней', '#C0392B', 4.9::NUMERIC, 8)
) AS v(name, category, price, complexity, formats, delivery_time, color, rating, reviews_count)
WHERE NOT EXISTS (SELECT 1 FROM t_p37631411_3d_model_order_porta.products LIMIT 1);

INSERT INTO t_p37631411_3d_model_order_porta.reviews (author_name, city, rating, text, product_name, status, helpful_count)
SELECT * FROM (VALUES
  ('Анна К.', 'Москва', 5, 'Потрясающая детализация! Модель кольца получилась именно такой, как я хотела.', 'Ювелирное кольцо', 'approved', 12),
  ('Дмитрий Р.', 'Санкт-Петербург', 5, 'Заказывал для архитектурного бюро. Качество на высоте.', 'Архитектурный фасад', 'approved', 8),
  ('Сергей П.', 'Екатеринбург', 4, 'Хорошая работа, всё точно по чертежу. Небольшая задержка со сроком — 1 день.', 'Промышленная деталь', 'approved', 5),
  ('Мария В.', 'Краснодар', 5, 'Быстро, качественно и недорого. Модель идеально подошла для печати.', 'Интерьерная ваза', 'approved', 15)
) AS v(author_name, city, rating, text, product_name, status, helpful_count)
WHERE NOT EXISTS (SELECT 1 FROM t_p37631411_3d_model_order_porta.reviews LIMIT 1);
