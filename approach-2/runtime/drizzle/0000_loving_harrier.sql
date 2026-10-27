CREATE TABLE `choice_events` (
	`id` text PRIMARY KEY NOT NULL,
	`journey_id` text NOT NULL,
	`kind` text NOT NULL,
	`path_id` text,
	`code` text,
	`context_key` text,
	`revision` integer,
	`observed_at` integer NOT NULL,
	`received_at` integer NOT NULL,
	`payload_json` text NOT NULL,
	FOREIGN KEY (`journey_id`) REFERENCES `activity_journeys`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `events_journey_kind` ON `choice_events` (`journey_id`,`kind`);--> statement-breakpoint
CREATE TABLE `suggestion_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`journey_id` text NOT NULL,
	`context_key` text NOT NULL,
	`mode` text NOT NULL,
	`received_at` integer NOT NULL,
	FOREIGN KEY (`journey_id`) REFERENCES `activity_journeys`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `suggestion_items` (
	`set_id` text NOT NULL,
	`path_id` text NOT NULL,
	`rank` integer NOT NULL,
	PRIMARY KEY(`set_id`, `path_id`),
	FOREIGN KEY (`set_id`) REFERENCES `suggestion_sets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `activity_journeys` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`source` text NOT NULL,
	`release` text NOT NULL,
	`created_at` integer NOT NULL,
	`last_at` integer NOT NULL,
	`cleared_revision` integer DEFAULT -1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `selection_states` (
	`journey_id` text NOT NULL,
	`kind` text NOT NULL,
	`path_id` text NOT NULL,
	`code` text DEFAULT '' NOT NULL,
	`active` integer NOT NULL,
	`revision` integer NOT NULL,
	`origin` text NOT NULL,
	PRIMARY KEY(`journey_id`, `kind`, `path_id`, `code`),
	FOREIGN KEY (`journey_id`) REFERENCES `activity_journeys`(`id`) ON UPDATE no action ON DELETE no action
);
