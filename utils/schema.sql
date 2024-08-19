CREATE DATABASE IF NOT EXISTS u342311781_new_database;
USE u342311781_new_database;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_role ENUM('admin', 'moderator') DEFAULT 'moderator',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  en_title VARCHAR(255) NOT NULL,
  ar_title VARCHAR(255),
  img_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  en_item_name VARCHAR(255) NOT NULL,
  ar_item_name VARCHAR(255),

  en_item_description TEXT NOT NULL,
  ar_item_description TEXT,

  item_img_url VARCHAR(255),
  item_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  INDEX (category_id)
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_contact VARCHAR(100),
    customer_address VARCHAR(100),
    order_details TEXT NOT NULL,
    additional_notes TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  en_site_name VARCHAR(255) NOT NULL,
  ar_site_name VARCHAR(255),

  site_logo VARCHAR(255),

  en_site_description TEXT NOT NULL,
  ar_site_description TEXT,

  site_email VARCHAR(255) NOT NULL,
  site_contact VARCHAR(255) NOT NULL,
  site_address TEXT NOT NULL,
  site_url VARCHAR(255),

  site_favicon VARCHAR(255),

  site_keywords TEXT,
  social_facebook VARCHAR(255),
  social_whatsapp VARCHAR(255),
  social_twitter VARCHAR(255),
  social_instagram VARCHAR(255),
  social_linkedin VARCHAR(255),
  social_youtube VARCHAR(255),
  business_contact VARCHAR(255),
  weekdays VARCHAR(255),
  contact_hours VARCHAR(255),
  privacy_policy_url VARCHAR(255),
  terms_of_service_url VARCHAR(255)
);
