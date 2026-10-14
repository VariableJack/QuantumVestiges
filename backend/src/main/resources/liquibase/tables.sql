--liquibase formatted sql
--changeset VariableJack:1-tables splitStatements:true endDelimiter:;
CREATE TABLE IF NOT EXISTS users (
  user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  stripe_customer_id VARCHAR(255) UNIQUE
);
CREATE TABLE IF NOT EXISTS notification_types (
  notification_type_id INT AUTO_INCREMENT PRIMARY KEY,
  notification_type VARCHAR(64) NOT NULL UNIQUE,
  frequency enum('WEEKLY', 'CUSTOM') NOT NULL,
  email_template VARCHAR(64) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  user_id BIGINT UNSIGNED NOT NULL REFERENCES users.user_id ON DELETE CASCADE,
  notification_type_id INT NOT NULL REFERENCES notification_types.notification_type_id ON DELETE RESTRICT,
  is_enabled boolean NOT NULL DEFAULT false,
  last_update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS user_notification_preferences_cl (
  change_log_id BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  notification_type_id INT NOT NULL,
  old_is_enabled boolean,
  new_is_enabled boolean,
  change_action enum('INSERT', 'UPDATE', 'DELETE') NOT NULL,
  change_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX user_id_index (user_id),
  INDEX notification_type_id_index (notification_type_id)
);
CREATE TABLE IF NOT EXISTS franchises (
  franchise_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  franchise_name VARCHAR(32) NOT NULL unique
);
CREATE TABLE IF NOT EXISTS products (
  product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(64) NOT NULL unique,
  parent_product_id BIGINT UNSIGNED DEFAULT null REFERENCES product_id ON DELETE RESTRICT,
  product_type VARCHAR(16) NOT NULL,
  franchise_id INT NOT NULL REFERENCES franchises.franchise_id ON DELETE RESTRICT,
  franchise_name VARCHAR(32) NOT NULL REFERENCES franchises.franchise_name ON DELETE RESTRICT,
  description VARCHAR(4096) NOT NULL DEFAULT '',
  thumbnail VARCHAR(64) NOT NULL DEFAULT '',
  assets VARCHAR(1024) NOT NULL DEFAULT '',
  price INT NOT NULL check (price > 0),
  INDEX parent_product_id_index (parent_product_id)
);
CREATE TABLE IF NOT EXISTS user_subscriptions (
  user_subscription_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL REFERENCES users.user_id ON DELETE RESTRICT,
  product_id BIGINT UNSIGNED NOT NULL REFERENCES products.product_id ON DELETE RESTRICT,
  subscription_start_date timestamp NOT NULL,
  subscription_end_date timestamp NOT NULL,
  billing_period enum('1-MONTH', '3-MONTH', '6-MONTH', '12-MONTH') NOT NULL,
  auto_renewal boolean NOT NULL,
  INDEX user_id_index (user_id),
  INDEX product_id_index (product_id)
);
CREATE TABLE IF NOT EXISTS user_subscriptions_cl (
  change_log_id BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  user_subscription_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  subscription_start_date timestamp NOT NULL,
  subscription_end_date timestamp NOT NULL,
  billing_period enum('1-MONTH', '3-MONTH', '6-MONTH', '12-MONTH') NOT NULL,
  auto_renewal boolean NOT NULL,
  change_action enum('INSERT', 'UPDATE', 'DELETE') NOT NULL,
  change_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX user_subscription_id_index (user_subscription_id),
  INDEX product_id_index (product_id)
);
CREATE TABLE IF NOT EXISTS orders (
  order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL REFERENCES users.user_id ON DELETE RESTRICT,
  order_status ENUM ('PENDING', 'COMPLETED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  total_purchase_price INT,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  checkout_time TIMESTAMP,
  refund_time TIMESTAMP,
  INDEX user_id_index (user_id),
  INDEX order_status_index (order_status)
);
CREATE TABLE IF NOT EXISTS orders_cl (
  change_log_id BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  old_order_status ENUM ('PENDING', 'COMPLETED', 'REFUNDED'),
  new_order_status ENUM ('PENDING', 'COMPLETED', 'REFUNDED'),
  total_purchase_price INT,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  checkout_time TIMESTAMP,
  refund_time TIMESTAMP,
  change_action enum('INSERT', 'UPDATE', 'DELETE') NOT NULL,
  change_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX order_id_index (order_id)
);
CREATE TABLE IF NOT EXISTS order_items (
  order_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders.order_id ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products.product_id ON DELETE RESTRICT,
  purchase_price INT NOT NULL check (purchase_price > 0),
  quantity INT NOT NULL DEFAULT 1,
  INDEX order_id_index (order_id)
);
CREATE TABLE IF NOT EXISTS support_requests (
  thread_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(64) NOT NULL,
  description VARCHAR(1024) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL REFERENCES users.user_id ON DELETE RESTRICT,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_time TIMESTAMP DEFAULT NULL,
  last_update_by BIGINT UNSIGNED REFERENCES users.user_id ON DELETE RESTRICT,
  status ENUM ('OPEN', 'CLOSED') DEFAULT 'OPEN',
  INDEX user_id_index (user_id),
  INDEX last_update_by_index (last_update_by)
);
CREATE TABLE IF NOT EXISTS support_request_comments (
  comment_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  thread_id BIGINT UNSIGNED NOT NULL REFERENCES support_requests.thread_id ON DELETE RESTRICT,
  comment VARCHAR(256) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL REFERENCES users.user_id ON DELETE RESTRICT,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX user_id_index (user_id),
  INDEX thread_id_index (thread_id)
);
CREATE TABLE IF NOT EXISTS bug_reports (
  thread_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(64) NOT NULL,
  description VARCHAR(1024) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL REFERENCES users.user_id ON DELETE RESTRICT,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_time TIMESTAMP DEFAULT NULL,
  last_update_by BIGINT UNSIGNED REFERENCES users.user_id ON DELETE RESTRICT,
  status ENUM ('OPEN', 'CLOSED') DEFAULT 'OPEN',
  INDEX user_id_index (user_id),
  INDEX last_update_by_index (last_update_by)
);
CREATE TABLE IF NOT EXISTS bug_report_comments (
  comment_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  thread_id BIGINT UNSIGNED NOT NULL REFERENCES bug_reports.thread_id ON DELETE RESTRICT,
  comment VARCHAR(256) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL REFERENCES users.user_id ON DELETE RESTRICT,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX user_id_index (user_id),
  INDEX thread_id_index (thread_id)
);
CREATE TABLE IF NOT EXISTS discussions (
  thread_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(64) NOT NULL,
  description VARCHAR(1024) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL REFERENCES users.user_id ON DELETE RESTRICT,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_time TIMESTAMP DEFAULT NULL,
  last_update_by BIGINT UNSIGNED REFERENCES users.user_id ON DELETE RESTRICT,
  status ENUM ('OPEN', 'CLOSED') DEFAULT 'OPEN',
  INDEX user_id_index (user_id),
  INDEX last_update_by_index (last_update_by)
);
CREATE TABLE IF NOT EXISTS discussion_thread_comments (
  comment_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  thread_id BIGINT UNSIGNED NOT NULL REFERENCES discussion_threads.thread_id ON DELETE RESTRICT, 
  comment VARCHAR(256) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL REFERENCES users.user_id ON DELETE RESTRICT,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX user_id_index (user_id),
  INDEX thread_id_index (thread_id)
);
CREATE TABLE IF NOT EXISTS feedback (
  feedback_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products.product_id ON DELETE RESTRICT,
  title VARCHAR(64) NOT NULL,
  description VARCHAR(1024) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL REFERENCES users.user_id ON DELETE RESTRICT,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX user_id_index (user_id),
  INDEX product_id_index (product_id)
);
CREATE TABLE IF NOT EXISTS purchased_items (
  user_id BIGINT UNSIGNED NOT NULL REFERENCES users.user_id ON DELETE RESTRICT,
  product_id BIGINT UNSIGNED NOT NULL REFERENCES product.product_id ON DELETE RESTRICT,
  INDEX user_id_index (user_id),
  INDEX product_id_index (product_id)
);
--rollback DROP TABLE users; DROP TABLE notification_types; DROP TABLE user_notification_preferences; DROP TABLE user_notification_preferences_cl; DROP TABLE franchises; DROP TABLE products; DROP TABLE user_subscriptions; DROP TABLE user_subscriptions_cl; DROP TABLE orders; DROP TABLE orders_cl; DROP TABLE order_items; DROP TABLE support_requests; DROP TABLE support_request_comments; DROP TABLE bug_reports; DROP TABLE bug_report_comments; DROP TABLE discussions; DROP TABLE discussion_thread_comments; DROP TABLE feedback; DROP TABLE purchased_items;