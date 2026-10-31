INSERT OR IGNORE INTO `site_setting` (`key`, `value`, `updated_at`)
VALUES ('password_policy', '{"minLength":8}', unixepoch() * 1000);
