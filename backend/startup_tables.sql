drop database quantumvestiges;
create database quantumvestiges;
use quantumvestiges;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(64) Not null,
    cognito_sub_id VARCHAR(36) UNIQUE NOT NULL,
    stripe_customer_id VARCHAR(255) UNIQUE NOT NULL
);
create table franchises (
  franchise_id SERIAL primary key,
  franchise_name VARCHAR(32) Not null unique
);
create table products (
  product_id SERIAL primary key,
  product_name VARCHAR(64) Not null unique,
  parent_product_id BIGINT UNSIGNED Not null references product_id,
  product_type VARCHAR(16) Not null,
  franchise_id INT Not null references franchises.franchise_id,
  franchise_name VARCHAR(32) Not null references franchises.franchise_name,
  price INT Not null check (price > 0)
);
create table orders (
  order_id SERIAL primary key,
  user_id BIGINT UNSIGNED Not null references users.user_id,
  order_status ENUM ('PENDING', 'COMPLETED', 'FAILED')  default 'PENDING',
  total_purchase_price INT ,
  create_time TIMESTAMP Not null default current_timestamp
);
create table order_items (
  order_item_id SERIAL primary key,
  order_id INT Not null references orders.order_id,
  product_id INT Not null references products.product_id,
  purchase_price INT Not null check (purchase_price > 0),
  quantity INT Not null Default 1
);
create table support_requests (
  thread_id SERIAL primary key,
  title VARCHAR(64) Not null,
  description VARCHAR(1024) Not null,
  user_id BIGINT UNSIGNED Not null references users.user_id,
  create_time TIMESTAMP Not null default current_timestamp,
  last_update_time TIMESTAMP  default NULL,
  last_update_by VARCHAR(64) ,
  status ENUM ('OPEN', 'CLOSE')  default 'OPEN'
);
create table support_request_comments (
  comment_id INT Not null primary key auto_increment,
  thread_id BIGINT UNSIGNED Not null references support_requests.thread_id,
  comment VARCHAR(256) Not null,
  user_id BIGINT UNSIGNED Not null,
  create_time TIMESTAMP Not null default current_timestamp
);
create table bug_reports (
  thread_id SERIAL primary key,
  title VARCHAR(64) Not null,
  description VARCHAR(1024) Not null,
  user_id BIGINT UNSIGNED Not null references users.user_id,
  create_time TIMESTAMP Not null default current_timestamp,
  last_update_time TIMESTAMP default NULL,
  last_update_by VARCHAR(64) ,
  status ENUM ('OPEN', 'CLOSE')  default 'OPEN'
);
create table bug_report_comments (
  comment_id INT Not null primary key auto_increment,
  thread_id BIGINT UNSIGNED Not null references bug_reports.thread_id,
  comment VARCHAR(256) Not null,
  user_id BIGINT UNSIGNED Not null,
  create_time TIMESTAMP Not null default current_timestamp
);
create table discussion_threads (
  thread_id SERIAL primary key,
  title VARCHAR(64) Not null,
  description VARCHAR(1024) Not null,
  user_id BIGINT UNSIGNED Not null references users.user_id,
  create_time TIMESTAMP Not null default current_timestamp,
  last_update_time TIMESTAMP default NUlL,
  last_update_by VARCHAR(64),
  status ENUM ('OPEN', 'CLOSE') default 'OPEN'
);
create table discussion_thread_comments (
  comment_id INT Not null primary key auto_increment,
  thread_id BIGINT UNSIGNED Not null references discussion_threads.thread_id, 
  comment VARCHAR(256) Not null,
  user_id BIGINT UNSIGNED Not null,
  create_time TIMESTAMP Not null default current_timestamp
);
create table feedback (
  feedback_id INT Not null primary key auto_increment,
  product_id INT Not null references products.product_id,
  title VARCHAR(64) Not null,
  description VARCHAR(1024) Not null,
  user_id BIGINT UNSIGNED Not null references users.user_id,
  create_time TIMESTAMP Not null default current_timestamp
);
create table purchased_items (
  user_id  BIGINT UNSIGNED  Not null references users.user_id,
  product_id  BIGINT UNSIGNED  Not null references product.product_id
);
show tables;
select * from users;