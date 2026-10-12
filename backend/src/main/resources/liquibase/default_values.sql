--liquibase formatted sql
--changeset VariableJack:1-default-values splitStatements:true endDelimiter:;
INSERT INTO users (username) VALUES ('Ghost User');
INSERT INTO notification_types (
  notification_type,
  frequency,
  email_template
) VALUES ('Newsletter', 'WEEKLY', 'WeeklyNewsletter');