-- Use the database
USE u342311781_new_database;

-- Insert initial users
INSERT INTO users (user_name, user_password, user_email, user_role)
VALUES
('admin_user', 'admin_password', 'admin@example.com', 'admin'),
('moderator_user', 'moderator_password', 'moderator@example.com', 'moderator');

-- Insert initial categories
INSERT INTO categories (en_title, ar_title, img_url)
VALUES
('Starters', 'المقبلات', 'starters.jpg'),
('Main Courses', 'الأطباق الرئيسية', 'main_courses.jpg'),
('Desserts', 'الحلويات', 'desserts.jpg');

-- Insert initial items
INSERT INTO items (category_id, en_item_name, ar_item_name, en_item_description, ar_item_description, item_img_url, item_price)
VALUES
(1, 'Spring Rolls', 'لفات الربيع', 'Delicious vegetable spring rolls', 'لفات الربيع بالخضار اللذيذة', 'spring_rolls.jpg', 5.99),
(1, 'Garlic Bread', 'خبز بالثوم', 'Toasted bread with garlic and herbs', 'خبز محمص بالثوم والأعشاب', 'garlic_bread.jpg', 3.99),
(2, 'Grilled Chicken', 'دجاج مشوي', 'Tender grilled chicken with spices', 'دجاج مشوي طري بالتوابل', 'grilled_chicken.jpg', 12.99),
(2, 'Beef Steak', 'شريحة لحم', 'Juicy beef steak with sauce', 'شريحة لحم عصارية مع صلصة', 'beef_steak.jpg', 15.99),
(3, 'Chocolate Cake', 'كعكة الشوكولاتة', 'Rich chocolate cake with frosting', 'كعكة الشوكولاتة الغنية مع التزيين', 'chocolate_cake.jpg', 6.99),
(3, 'Ice Cream Sundae', 'مثلجات', 'Ice cream with toppings', 'مثلجات مع الطبقة العلوية', 'ice_cream_sundae.jpg', 4.99);

-- Insert initial orders
INSERT INTO orders (customer_name, customer_email, customer_contact, customer_address, order_details, additional_notes, total_amount)
VALUES
('John Doe', 'johndoe@example.com', '1234567890', '123 Main St', '1x Grilled Chicken, 2x Chocolate Cake', 'Please deliver before 8 PM', 32.97),
('Jane Smith', 'janesmith@example.com', '0987654321', '456 Oak St', '2x Beef Steak, 1x Ice Cream Sundae', 'No onions please', 36.97);

-- Insert initial settings
INSERT INTO settings (
  en_site_name, ar_site_name, site_logo, en_site_description, ar_site_description,
  site_email, site_contact, site_address, site_url, site_favicon, site_keywords,
  social_facebook, social_whatsapp, social_twitter, social_instagram, social_linkedin,
  social_youtube, business_contact, weekdays, contact_hours, privacy_policy_url,
  terms_of_service_url)
VALUES
(
  'My Restaurant', 'مطعمي', 'logo.png',
  'Welcome to My Restaurant', 'مرحبا بكم في مطعمي',
  'contact@myrestaurant.com', '1234567890', '789 Elm St',
  'https://www.myrestaurant.com', 'favicon.ico', 'restaurant, food, dining',
  'https://www.facebook.com/myrestaurant', 'https://wa.me/1234567890', 'https://twitter.com/myrestaurant',
  'https://www.instagram.com/myrestaurant', 'https://www.linkedin.com/company/myrestaurant',
  'https://www.youtube.com/myrestaurant', '9876543210', 'Mon-Fri', '9 AM - 9 PM',
  'https://www.myrestaurant.com/privacy-policy', 'https://www.myrestaurant.com/terms-of-service'
);
