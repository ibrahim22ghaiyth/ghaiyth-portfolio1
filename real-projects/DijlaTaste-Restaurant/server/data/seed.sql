-- Dijla & Tanoor — full schema + seed data
-- Auto-generated from the working database. Safe to re-run via reset-db.js
PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  restaurant_name_ar TEXT NOT NULL,
  restaurant_name_en TEXT NOT NULL,
  slogan_ar TEXT NOT NULL,
  slogan_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  logo_text TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  address_ar TEXT NOT NULL,
  address_en TEXT NOT NULL,
  open_hours_ar TEXT NOT NULL,
  open_hours_en TEXT NOT NULL,
  currency TEXT NOT NULL,
  delivery_fee INTEGER NOT NULL DEFAULT 0,
  tax_percent REAL NOT NULL DEFAULT 0,
  instagram TEXT,
  facebook TEXT,
  accepting_orders INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  icon TEXT DEFAULT '🍽️',
  sort_order INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  available INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  vegetarian INTEGER DEFAULT 0,
  spicy_level INTEGER DEFAULT 0,
  calories INTEGER DEFAULT 0,
  prep_time_ar TEXT,
  prep_time_en TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  notes TEXT,
  order_type TEXT NOT NULL CHECK(order_type IN ('delivery','pickup')),
  payment_method TEXT NOT NULL DEFAULT 'cash',
  status TEXT NOT NULL DEFAULT 'new',
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL DEFAULT 0,
  tax INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER,
  product_name_ar TEXT NOT NULL,
  product_name_en TEXT NOT NULL,
  qty INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  line_total INTEGER NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- data: settings (1 rows)
INSERT INTO settings (id,restaurant_name_ar,restaurant_name_en,slogan_ar,slogan_en,description_ar,description_en,logo_text,phone,whatsapp,email,address_ar,address_en,open_hours_ar,open_hours_en,currency,delivery_fee,tax_percent,instagram,facebook,accepting_orders,updated_at) VALUES (1,'مطعم دجلة وتنور','Dijla & Tanoor Restaurant','مذاق عراقي أصيل بلمسة عصرية','Authentic Iraqi taste with a modern dining touch','منيو مطعم عراقي حديث يقدم المشاوي، الدولمة، البرياني، المقبلات، المشروبات والحلويات مع تجربة طلب إلكترونية كاملة.','A modern Iraqi restaurant menu featuring grills, dolma, biryani, starters, drinks, and desserts with a complete digital ordering experience.','DT','+964 770 421 2026','+9647704212026','orders@dijlatanoor.example','بغداد، الكرادة، قرب شارع 62','Baghdad, Karrada, near Street 62','يومياً من 11:00 صباحاً إلى 12:30 ليلاً','Daily from 11:00 AM to 12:30 AM','IQD',3000,0.0,'https://instagram.com/','https://facebook.com/',1,'2026-06-11 02:50:28');

-- data: categories (6 rows)
INSERT INTO categories (id,name_ar,name_en,description_ar,description_en,icon,sort_order,active,created_at,updated_at) VALUES (1,'المقبلات','Starters','أطباق خفيفة وطازجة قبل الوجبة','Fresh small plates before the meal','🥗',1,1,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO categories (id,name_ar,name_en,description_ar,description_en,icon,sort_order,active,created_at,updated_at) VALUES (2,'الأطباق العراقية','Iraqi Classics','وصفات عراقية تقليدية بطعم بيتوتي','Traditional Iraqi recipes with a home-style taste','🍲',2,1,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO categories (id,name_ar,name_en,description_ar,description_en,icon,sort_order,active,created_at,updated_at) VALUES (3,'المشاوي','Charcoal Grills','لحم ودجاج مشوي على الفحم','Meat and chicken grilled over charcoal','🔥',3,1,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO categories (id,name_ar,name_en,description_ar,description_en,icon,sort_order,active,created_at,updated_at) VALUES (4,'الساندويش','Sandwiches','وجبات سريعة وغنية','Fast and rich handheld meals','🥙',4,1,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO categories (id,name_ar,name_en,description_ar,description_en,icon,sort_order,active,created_at,updated_at) VALUES (5,'المشروبات','Drinks','مشروبات باردة وساخنة','Cold and hot drinks','🥤',5,1,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO categories (id,name_ar,name_en,description_ar,description_en,icon,sort_order,active,created_at,updated_at) VALUES (6,'الحلويات','Desserts','حلويات شرقية بنهاية مميزة','Middle Eastern sweets for a perfect finish','🍮',6,1,'2026-06-11 02:50:28','2026-06-11 02:50:28');

-- data: products (16 rows)
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (1,1,'حمص دجلة','Dijla Hummus','حمص بالطحينة مع زيت زيتون وسماق','Hummus with tahini, olive oil, and sumac',5000,'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=900&q=80',1,1,1,0,230,'7 دقائق','7 min',1,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (2,1,'تبولة رمان','Pomegranate Tabbouleh','تبولة طازجة مع دبس رمان خفيف','Fresh tabbouleh with a light pomegranate glaze',4500,'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',1,0,1,0,160,'6 دقائق','6 min',2,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (3,1,'متبل باذنجان','Smoked Eggplant Mutabbal','باذنجان مشوي، طحينة، ليمون وثوم','Smoked eggplant, tahini, lemon, and garlic',5500,'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=900&q=80',1,0,1,0,190,'8 دقائق','8 min',3,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (4,2,'دولمة عراقية','Iraqi Dolma','دولمة ورق عنب وخضار بحامض حلو','Stuffed vine leaves and vegetables with sweet-sour flavor',14000,'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',1,1,0,0,620,'18 دقيقة','18 min',1,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (5,2,'برياني دجاج','Chicken Biryani','رز بهارات مع دجاج، خضار ومكسرات','Spiced rice with chicken, vegetables, and nuts',12000,'https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=80',1,1,0,1,680,'16 دقيقة','16 min',2,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (6,2,'قوزي لحم','Lamb Quzi','لحم غنم مع رز ومكسرات وصلصة دبس','Tender lamb with rice, nuts, and date-molasses sauce',22000,'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',1,1,0,0,890,'25 دقيقة','25 min',3,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (7,3,'كباب عراقي','Iraqi Kebab','كباب لحم مشوي مع خبز تنور وطماطة','Charcoal beef kebab with tanoor bread and tomato',16000,'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80',1,1,0,1,720,'20 دقيقة','20 min',1,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (8,3,'تكة دجاج','Chicken Tikka','دجاج متبل باللبن والبهارات ومشوي على الفحم','Yogurt-spiced chicken grilled over charcoal',13000,'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=900&q=80',1,0,0,1,560,'18 دقيقة','18 min',2,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (9,3,'مشاوي مشكلة','Mixed Grill Platter','كباب، تكة، شيش، خضار مشوية وخبز','Kebab, tikka, shish, grilled vegetables, and bread',28000,'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=80',1,1,0,2,1100,'28 دقيقة','28 min',3,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (10,4,'ساندويش كباب','Kebab Sandwich','كباب عراقي داخل خبز صمون مع سلطة وطرشي','Iraqi kebab in samoon bread with salad and pickles',8000,'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',1,0,0,1,520,'10 دقائق','10 min',1,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (11,4,'ساندويش دجاج تنور','Tanoor Chicken Sandwich','دجاج مشوي، صلصة ثوم، خس وخيار مخلل','Grilled chicken, garlic sauce, lettuce, and pickles',7500,'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80',1,0,0,1,480,'9 دقائق','9 min',2,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (12,5,'ليمون نعناع','Mint Lemonade','عصير ليمون بارد مع نعناع طازج','Cold lemonade with fresh mint',3500,'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80',1,1,1,0,120,'4 دقائق','4 min',1,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (13,5,'لبن أربيل','Erbil Ayran','لبن بارد مالح بنكهة خفيفة','Cold salted yogurt drink with a mild flavor',3000,'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=900&q=80',1,0,1,0,90,'3 دقائق','3 min',2,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (14,5,'شاي هيل','Cardamom Tea','شاي عراقي ثقيل مع هيل','Strong Iraqi tea with cardamom',2000,'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80',1,0,1,0,45,'5 دقائق','5 min',3,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (15,6,'كنافة قشطة','Cream Kunafa','كنافة ساخنة مع قشطة وقطر','Warm kunafa with cream and syrup',7000,'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',1,1,0,0,430,'10 دقائق','10 min',1,'2026-06-11 02:50:28','2026-06-11 02:50:28');
INSERT INTO products (id,category_id,name_ar,name_en,description_ar,description_en,price,image_url,available,featured,vegetarian,spicy_level,calories,prep_time_ar,prep_time_en,sort_order,created_at,updated_at) VALUES (16,6,'محلبية ورد','Rose Muhallabia','محلبية بالحليب وماء الورد وفستق','Milk pudding with rose water and pistachio',5000,'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80',1,0,1,0,260,'5 دقائق','5 min',2,'2026-06-11 02:50:28','2026-06-11 02:50:28');

-- data: orders (1 rows)
INSERT INTO orders (id,customer_name,phone,address,notes,order_type,status,subtotal,delivery_fee,tax,total,created_at,updated_at) VALUES (1,'طلب تجريبي','+9647704212026','Baghdad - Karrada','بدون بصل','delivery','new',35500,3000,0,38500,'2026-06-11 02:50:28','2026-06-11 02:50:28');

-- data: order_items (2 rows)
INSERT INTO order_items (id,order_id,product_id,product_name_ar,product_name_en,qty,unit_price,line_total) VALUES (1,1,7,'كباب عراقي','Iraqi Kebab',2,16000,32000);
INSERT INTO order_items (id,order_id,product_id,product_name_ar,product_name_en,qty,unit_price,line_total) VALUES (2,1,12,'ليمون نعناع','Mint Lemonade',1,3500,3500);

COMMIT;
PRAGMA foreign_keys = ON;
