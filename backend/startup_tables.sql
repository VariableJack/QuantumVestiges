drop database quantumvestiges;
create database quantumvestiges;
use quantumvestiges;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(64) Not null UNIQUE,
  stripe_customer_id VARCHAR(255) UNIQUE
);

create table notification_types (
  notification_type_id int primary key auto_increment,
  notification_type VARCHAR(64) Not null UNIQUE,
  frequency enum('WEEKLY', 'CUSTOM') not null,
  email_template VARCHAR(64) Not null UNIQUE
);
create table user_notification_preferences (
  user_id BIGINT UNSIGNED Not null references users.user_id ON DELETE CASCADE,
  notification_type_id int Not null references notification_types.notification_type_id ON DELETE RESTRICT,
  is_enabled boolean not null default false,
  last_update_time timestamp not null default CURRENT_TIMESTAMP
);
create table user_notification_preferences_cl (
  change_log_id SERIAL not null primary key,
  user_id BIGINT UNSIGNED Not null,
  notification_type_id int Not null,
  old_is_enabled boolean,
  new_is_enabled boolean,
  change_action enum('INSERT', 'UPDATE', 'DELETE') not null,
  change_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX user_id_index (user_id),
  INDEX notification_type_id_index (notification_type_id)
);
create table franchises (
  franchise_id SERIAL primary key,
  franchise_name VARCHAR(32) Not null unique
);
create table products (
  product_id SERIAL primary key,
  product_name VARCHAR(64) Not null unique,
  parent_product_id BIGINT UNSIGNED default null references product_id ON DELETE RESTRICT,
  product_type VARCHAR(16) Not null,
  franchise_id INT Not null references franchises.franchise_id ON DELETE RESTRICT,
  franchise_name VARCHAR(32) Not null references franchises.franchise_name ON DELETE RESTRICT,
  price INT Not null check (price > 0),
  INDEX parent_product_id_index (parent_product_id)
);
create table user_subscriptions (
  user_subscription_id SERIAL primary key,
  user_id BIGINT UNSIGNED Not null references users.user_id ON DELETE RESTRICT,
  product_id BIGINT UNSIGNED Not null references products.product_id ON DELETE RESTRICT,
  subscription_start_date timestamp not null,
  subscription_end_date timestamp not null,
  billing_period enum('1-MONTH', '3-MONTH', '6-MONTH', '12-MONTH') not null,
  auto_renewal boolean not null,
  INDEX user_id_index (user_id),
  INDEX product_id_index (product_id)
);
create table user_subscriptions_cl (
  change_log_id SERIAL not null primary key,
  user_subscription_id BIGINT UNSIGNED not null,
  product_id BIGINT UNSIGNED not null,
  subscription_start_date timestamp not null,
  subscription_end_date timestamp not null,
  billing_period enum('1-MONTH', '3-MONTH', '6-MONTH', '12-MONTH') not null,
  auto_renewal boolean not null,
  change_action enum('INSERT', 'UPDATE', 'DELETE') not null,
  change_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX user_subscription_id_index (user_subscription_id),
  INDEX product_id_index (product_id)
);
create table orders (
  order_id SERIAL primary key,
  user_id BIGINT UNSIGNED Not null references users.user_id ON DELETE RESTRICT,
  order_status ENUM ('PENDING', 'COMPLETED', 'REFUNDED') not null default 'PENDING',
  total_purchase_price INT,
  create_time TIMESTAMP Not null default current_timestamp,
  checkout_time TIMESTAMP,
  refund_time TIMESTAMP,
  INDEX user_id_index (user_id),
  INDEX order_status_index (order_status)
);
create table orders_cl (
  change_log_id SERIAL not null primary key,
  order_id BIGINT UNSIGNED Not null,
  old_order_status ENUM ('PENDING', 'COMPLETED', 'REFUNDED'),
  new_order_status ENUM ('PENDING', 'COMPLETED', 'REFUNDED'),
  total_purchase_price INT,
  create_time TIMESTAMP Not null default current_timestamp,
  checkout_time TIMESTAMP,
  refund_time TIMESTAMP,
  change_action enum('INSERT', 'UPDATE', 'DELETE') not null,
  change_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX order_id_index (order_id)
);

create table order_items (
  order_item_id SERIAL primary key,
  order_id INT Not null references orders.order_id ON DELETE CASCADE,
  product_id INT Not null references products.product_id ON DELETE RESTRICT,
  purchase_price INT Not null check (purchase_price > 0),
  quantity INT Not null Default 1,
  INDEX order_id_index (order_id)
);
create table support_requests (
  thread_id SERIAL primary key,
  title VARCHAR(64) Not null,
  description VARCHAR(1024) Not null,
  user_id BIGINT UNSIGNED Not null references users.user_id ON DELETE RESTRICT,
  create_time TIMESTAMP Not null default current_timestamp,
  last_update_time TIMESTAMP default NULL,
  last_update_by BIGINT UNSIGNED references users.user_id ON DELETE RESTRICT,
  status ENUM ('OPEN', 'CLOSE') default 'OPEN',
  INDEX user_id_index (user_id),
  INDEX last_update_by_index (last_update_by)
);
create table support_request_comments (
  comment_id INT Not null primary key auto_increment,
  thread_id BIGINT UNSIGNED Not null references support_requests.thread_id ON DELETE RESTRICT,
  comment VARCHAR(256) Not null,
  user_id BIGINT UNSIGNED Not null references users.user_id ON DELETE RESTRICT,
  create_time TIMESTAMP Not null default current_timestamp,
  INDEX user_id_index (user_id),
  INDEX thread_id_index (thread_id)
);
create table bug_reports (
  thread_id SERIAL primary key,
  title VARCHAR(64) Not null,
  description VARCHAR(1024) Not null,
  user_id BIGINT UNSIGNED Not null references users.user_id ON DELETE RESTRICT,
  create_time TIMESTAMP Not null default current_timestamp,
  last_update_time TIMESTAMP default NULL,
  last_update_by BIGINT UNSIGNED references users.user_id ON DELETE RESTRICT,
  status ENUM ('OPEN', 'CLOSE') default 'OPEN',
  INDEX user_id_index (user_id),
  INDEX last_update_by_index (last_update_by)
);
create table bug_report_comments (
  comment_id INT Not null primary key auto_increment,
  thread_id BIGINT UNSIGNED Not null references bug_reports.thread_id ON DELETE RESTRICT,
  comment VARCHAR(256) Not null,
  user_id BIGINT UNSIGNED Not null references users.user_id ON DELETE RESTRICT,
  create_time TIMESTAMP Not null default current_timestamp,
  INDEX user_id_index (user_id),
  INDEX thread_id_index (thread_id)
);
create table discussions (
  thread_id SERIAL primary key,
  title VARCHAR(64) Not null,
  description VARCHAR(1024) Not null,
  user_id BIGINT UNSIGNED Not null references users.user_id ON DELETE RESTRICT,
  create_time TIMESTAMP Not null default current_timestamp,
  last_update_time TIMESTAMP default NULL,
  last_update_by BIGINT UNSIGNED references users.user_id ON DELETE RESTRICT,
  status ENUM ('OPEN', 'CLOSE') default 'OPEN',
  INDEX user_id_index (user_id),
  INDEX last_update_by_index (last_update_by)
);
create table discussion_thread_comments (
  comment_id INT Not null primary key auto_increment,
  thread_id BIGINT UNSIGNED Not null references discussion_threads.thread_id ON DELETE RESTRICT, 
  comment VARCHAR(256) Not null,
  user_id BIGINT UNSIGNED Not null references users.user_id ON DELETE RESTRICT,
  create_time TIMESTAMP Not null default current_timestamp,
  INDEX user_id_index (user_id),
  INDEX thread_id_index (thread_id)
);
create table feedback (
  feedback_id INT Not null primary key auto_increment,
  product_id INT Not null references products.product_id ON DELETE RESTRICT,
  title VARCHAR(64) Not null,
  description VARCHAR(1024) Not null,
  user_id BIGINT UNSIGNED Not null references users.user_id ON DELETE RESTRICT,
  create_time TIMESTAMP Not null default current_timestamp,
  INDEX user_id_index (user_id),
  INDEX product_id_index (product_id)
);
create table purchased_items (
  user_id BIGINT UNSIGNED Not null references users.user_id ON DELETE RESTRICT,
  product_id BIGINT UNSIGNED Not null references product.product_id ON DELETE RESTRICT,
  INDEX user_id_index (user_id),
  INDEX product_id_index (product_id)
);
--
DROP TRIGGER IF EXISTS user_notification_preferences_insert;
DROP TRIGGER IF EXISTS user_notification_preferences_update;
DROP TRIGGER IF EXISTS user_notification_preferences_delete;
DROP TRIGGER IF EXISTS user_subscriptions_insert;
DROP TRIGGER IF EXISTS user_subscriptions_update;
DROP TRIGGER IF EXISTS user_subscriptions_delete;
DROP TRIGGER IF EXISTS orders_insert;
DROP TRIGGER IF EXISTS orders_update;
DROP TRIGGER IF EXISTS orders_delete;
DROP TRIGGER IF EXISTS order_items_insert;
DROP TRIGGER IF EXISTS order_items_delete;
DROP TRIGGER IF EXISTS users_delete;
DROP TRIGGER IF EXISTS users_insert;
DROP TRIGGER IF EXISTS notification_types_insert;

delimiter //
create trigger user_notification_preferences_insert
after insert on user_notification_preferences
for each row
begin
  insert into user_notification_preferences_cl(user_id,notification_type_id,old_is_enabled,new_is_enabled,change_action)
  VALUES (NEW.user_id,NEW.notification_type_id,NULL,NEW.is_enabled,'INSERT');
end;//
create trigger user_notification_preferences_update
after update on user_notification_preferences
for each row
begin
  if OLD.is_enabled <> NEW.is_enabled then
    insert into user_notification_preferences_cl(user_id,notification_type_id,old_is_enabled,new_is_enabled,change_action)
    VALUES (NEW.user_id,NEW.notification_type_id,OLD.is_enabled,NEW.is_enabled,'UPDATE');
  end if;
end;//
create trigger user_notification_preferences_delete
after delete on user_notification_preferences
for each row
begin
  insert into user_notification_preferences_cl(user_id,notification_type_id,old_is_enabled,new_is_enabled,change_action)
  VALUES (OLD.user_id,OLD.notification_type_id,OLD.is_enabled,NULL,'DELETE');
end;//
create trigger user_subscriptions_insert
after insert on user_subscriptions
for each row
begin
  insert into user_subscriptions_cl(user_subscription_id,product_id,subscription_start_date,subscription_end_date,billing_period,auto_renewal,change_action)
  VALUES (NEW.user_subscription_id,NEW.product_id,NEW.subscription_start_date,NEW.subscription_end_date,NEW.billing_period,NEW.auto_renewal,'INSERT');
end;//
create trigger user_subscriptions_update
after update on user_subscriptions
for each row
begin
  insert into user_subscriptions_cl(user_subscription_id,product_id,subscription_start_date,subscription_end_date,billing_period,auto_renewal,change_action)
  VALUES (NEW.user_subscription_id,NEW.product_id,NEW.subscription_start_date,NEW.subscription_end_date,NEW.billing_period,NEW.auto_renewal,'UPDATE');
end;//
create trigger user_subscriptions_delete
after delete on user_subscriptions
for each row
begin
  insert into user_subscriptions_cl(user_subscription_id,product_id,subscription_start_date,subscription_end_date,billing_period,auto_renewal,change_action)
  VALUES (OLD.user_subscription_id,OLD.product_id,OLD.subscription_start_date,OLD.subscription_end_date,OLD.billing_period,OLD.auto_renewal,'UPDATE');
end;//
create trigger orders_insert
after insert on orders
for each row
begin
  insert into orders_cl(order_id,old_order_status,new_order_status,total_purchase_price,create_time,checkout_time,refund_time,change_action)
  VALUES (NEW.order_id,null,NEW.order_status,NEW.total_purchase_price,NEW.create_time,NEW.checkout_time,NEW.refund_time,'INSERT');
end;//
create trigger orders_update
after update on orders
for each row
begin
  insert into orders_cl(order_id,old_order_status,new_order_status,total_purchase_price,create_time,checkout_time,refund_time,change_action)
  VALUES (NEW.order_id,OLD.order_status,NEW.order_status,NEW.total_purchase_price,NEW.create_time,NEW.checkout_time,NEW.refund_time,'UPDATE');
end;//
create trigger orders_delete
after delete on orders
for each row
begin
  insert into orders_cl(order_id,old_order_status,new_order_status,total_purchase_price,create_time,checkout_time,refund_time,change_action)
  VALUES (OLD.order_id,OLD.order_status,NULL,OLD.total_purchase_price,OLD.create_time,OLD.checkout_time,OLD.refund_time,'DELETE');
end;//
create trigger order_items_insert
after insert on order_items
for each row
begin
  UPDATE orders SET total_purchase_price = (
    SELECT SUM(purchase_price * quantity) FROM order_items WHERE order_id = NEW.order_id
  ) WHERE order_id = NEW.order_id;
end;//
create trigger order_items_delete
after delete on order_items
for each row
begin
  UPDATE orders SET total_purchase_price = (
    SELECT SUM(purchase_price * quantity) FROM order_items WHERE order_id = OLD.order_id
  ) WHERE order_id = OLD.order_id;
end;//
create trigger users_delete
after delete on users
for each row
begin
  UPDATE orders 
  SET user_id = 1 
  WHERE user_id = OLD.user_id;
  
  UPDATE user_subscriptions
  SET user_id = 1
  WHERE user_id = OLD.user_id;
  
  UPDATE support_requests
  SET user_id = 1
  WHERE user_id = OLD.user_id;
  
  UPDATE support_request_comments
  SET user_id = 1
  WHERE user_id = OLD.user_id;
  
  UPDATE bug_reports
  SET user_id = 1
  WHERE user_id = OLD.user_id;
  
  UPDATE bug_report_comments
  SET user_id = 1
  WHERE user_id = OLD.user_id;
  
  UPDATE discussions
  SET user_id = 1
  WHERE user_id = OLD.user_id;
  
  UPDATE discussion_thread_comments
  SET user_id = 1
  WHERE user_id = OLD.user_id;
  
  UPDATE feedback
  SET user_id = 1
  WHERE user_id = OLD.user_id;
end;//
create trigger users_insert
after insert on users
for each row
begin
  INSERT INTO user_notification_preferences(user_id, notification_type_id, is_enabled)
  SELECT NEW.user_id, notification_type_id, FALSE
  FROM notification_types;
end;//
create trigger notification_types_insert
after insert on notification_types
for each row
begin
  INSERT INTO user_notification_preferences(user_id, notification_type_id, is_enabled)
  SELECT user_id, NEW.notification_type_id, FALSE
  FROM users;
end;//
delimiter ;

INSERT INTO users (username) VALUES ('Ghost User');
INSERT INTO notification_types (
  notification_type,
  frequency,
  email_template
) VALUES ('Newsletter', 'WEEKLY', 'WeeklyNewsletter');