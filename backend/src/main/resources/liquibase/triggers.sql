--liquibase formatted sql
--changeset VariableJack:1-triggers splitStatements:true endDelimiter://
DROP TRIGGER IF EXISTS notification_types_insert; //
DROP TRIGGER IF EXISTS order_items_insert; //
DROP TRIGGER IF EXISTS order_items_delete; //
DROP TRIGGER IF EXISTS orders_insert; //
DROP TRIGGER IF EXISTS orders_update; //
DROP TRIGGER IF EXISTS orders_delete; //
DROP TRIGGER IF EXISTS user_notification_preferences_insert; //
DROP TRIGGER IF EXISTS user_notification_preferences_update; //
DROP TRIGGER IF EXISTS user_notification_preferences_delete; //
DROP TRIGGER IF EXISTS user_subscriptions_insert; //
DROP TRIGGER IF EXISTS user_subscriptions_update; //
DROP TRIGGER IF EXISTS user_subscriptions_delete; //
DROP TRIGGER IF EXISTS users_insert; //
DROP TRIGGER IF EXISTS users_delete; //
CREATE TRIGGER user_notification_preferences_insert
AFTER INSERT ON user_notification_preferences
FOR EACH ROW
BEGIN
  INSERT into user_notification_preferences_cl(user_id,notification_type_id,old_is_enabled,new_is_enabled,change_actiON)
  VALUES (NEW.user_id,NEW.notification_type_id,NULL,NEW.is_enabled,'INSERT');
END;//
CREATE TRIGGER user_notification_preferences_update
AFTER UPDATE ON user_notification_preferences
FOR EACH ROW
BEGIN
  IF OLD.is_enabled <> NEW.is_enabled then
    INSERT into user_notification_preferences_cl(user_id,notification_type_id,old_is_enabled,new_is_enabled,change_actiON)
    VALUES (NEW.user_id,NEW.notification_type_id,OLD.is_enabled,NEW.is_enabled,'UPDATE');
  END IF;
END;//
CREATE TRIGGER user_notification_preferences_delete
AFTER DELETE ON user_notification_preferences
FOR EACH ROW
BEGIN
  INSERT into user_notification_preferences_cl(user_id,notification_type_id,old_is_enabled,new_is_enabled,change_actiON)
  VALUES (OLD.user_id,OLD.notification_type_id,OLD.is_enabled,NULL,'DELETE');
END;//
CREATE TRIGGER user_subscriptions_insert
AFTER INSERT ON user_subscriptions
FOR EACH ROW
BEGIN
  INSERT into user_subscriptions_cl(user_subscription_id,product_id,subscription_start_date,subscription_END_date,billing_period,auto_renewal,change_actiON)
  VALUES (NEW.user_subscription_id,NEW.product_id,NEW.subscription_start_date,NEW.subscription_END_date,NEW.billing_period,NEW.auto_renewal,'INSERT');
END;//
CREATE TRIGGER user_subscriptions_update
AFTER UPDATE ON user_subscriptions
FOR EACH ROW
BEGIN
  INSERT into user_subscriptions_cl(user_subscription_id,product_id,subscription_start_date,subscription_END_date,billing_period,auto_renewal,change_actiON)
  VALUES (NEW.user_subscription_id,NEW.product_id,NEW.subscription_start_date,NEW.subscription_END_date,NEW.billing_period,NEW.auto_renewal,'UPDATE');
END;//
CREATE TRIGGER user_subscriptions_delete
AFTER DELETE ON user_subscriptions
FOR EACH ROW
BEGIN
  INSERT into user_subscriptions_cl(user_subscription_id,product_id,subscription_start_date,subscription_END_date,billing_period,auto_renewal,change_actiON)
  VALUES (OLD.user_subscription_id,OLD.product_id,OLD.subscription_start_date,OLD.subscription_END_date,OLD.billing_period,OLD.auto_renewal,'UPDATE');
END;//
CREATE TRIGGER orders_insert
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
  INSERT into orders_cl(order_id,old_order_status,new_order_status,total_purchase_price,create_time,checkout_time,refund_time,change_actiON)
  VALUES (NEW.order_id,null,NEW.order_status,NEW.total_purchase_price,NEW.create_time,NEW.checkout_time,NEW.refund_time,'INSERT');
END;//
CREATE TRIGGER orders_update
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
  INSERT into orders_cl(order_id,old_order_status,new_order_status,total_purchase_price,create_time,checkout_time,refund_time,change_actiON)
  VALUES (NEW.order_id,OLD.order_status,NEW.order_status,NEW.total_purchase_price,NEW.create_time,NEW.checkout_time,NEW.refund_time,'UPDATE');
END;//
CREATE TRIGGER orders_delete
AFTER DELETE ON orders
FOR EACH ROW
BEGIN
  INSERT into orders_cl(order_id,old_order_status,new_order_status,total_purchase_price,create_time,checkout_time,refund_time,change_actiON)
  VALUES (OLD.order_id,OLD.order_status,NULL,OLD.total_purchase_price,OLD.create_time,OLD.checkout_time,OLD.refund_time,'DELETE');
END;//
CREATE TRIGGER order_items_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
  UPDATE orders SET total_purchase_price = (
    SELECT SUM(purchase_price * quantity) FROM order_items WHERE order_id = NEW.order_id
  ) WHERE order_id = NEW.order_id;
END;//
CREATE TRIGGER order_items_delete
AFTER DELETE ON order_items
FOR EACH ROW
BEGIN
  UPDATE orders SET total_purchase_price = (
    SELECT SUM(purchase_price * quantity) FROM order_items WHERE order_id = OLD.order_id
  ) WHERE order_id = OLD.order_id;
END;//
CREATE TRIGGER users_delete
AFTER DELETE ON users
FOR EACH ROW
BEGIN
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
  
  UPDATE discussiONs
  SET user_id = 1
  WHERE user_id = OLD.user_id;
  
  UPDATE discussion_thread_comments
  SET user_id = 1
  WHERE user_id = OLD.user_id;
  
  UPDATE feedback
  SET user_id = 1
  WHERE user_id = OLD.user_id;
END;//
CREATE TRIGGER users_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT INTO user_notification_preferences(user_id, notification_type_id, is_enabled)
  SELECT NEW.user_id, notification_type_id, FALSE
  FROM notification_types;
END;//
CREATE TRIGGER notification_types_insert
AFTER INSERT ON notification_types
FOR EACH ROW
BEGIN
  INSERT INTO user_notification_preferences(user_id, notification_type_id, is_enabled)
  SELECT user_id, NEW.notification_type_id, FALSE
  FROM users;
END;//
-- rollback DROP TRIGGER IF EXISTS notification_types_insert; DROP TRIGGER IF EXISTS order_items_insert; DROP TRIGGER IF EXISTS order_items_delete; DROP TRIGGER IF EXISTS orders_insert; DROP TRIGGER IF EXISTS orders_update; DROP TRIGGER IF EXISTS orders_delete; DROP TRIGGER IF EXISTS user_notification_preferences_insert; DROP TRIGGER IF EXISTS user_notification_preferences_update; DROP TRIGGER IF EXISTS user_notification_preferences_delete; DROP TRIGGER IF EXISTS user_subscriptions_insert; DROP TRIGGER IF EXISTS user_subscriptions_update; DROP TRIGGER IF EXISTS user_subscriptions_delete; DROP TRIGGER IF EXISTS users_insert; DROP TRIGGER IF EXISTS users_delete;