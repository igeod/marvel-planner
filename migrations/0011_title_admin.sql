CREATE TABLE `title_release_override` (
	`title_id` text PRIMARY KEY NOT NULL,
	`release_date` text NOT NULL,
	`tmdb_date_at_override` text,
	`set_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `title_review` (
	`title_id` text NOT NULL,
	`topic` text NOT NULL,
	`checked_at` integer NOT NULL,
	PRIMARY KEY(`title_id`, `topic`)
);
