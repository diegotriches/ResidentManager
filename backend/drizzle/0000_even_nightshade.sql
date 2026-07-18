CREATE TABLE `apartments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`apartment` text NOT NULL,
	`owner_name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `apartments_apartment_unique` ON `apartments` (`apartment`);--> statement-breakpoint
CREATE TABLE `bills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	`bill` text NOT NULL,
	`total_value` real NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `meters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	`apartment_id` integer NOT NULL,
	`water` real NOT NULL,
	`gas` real NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`apartment_id`) REFERENCES `apartments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `meters_apartment_month_year_unique` ON `meters` (`apartment_id`,`month`,`year`);--> statement-breakpoint
CREATE TABLE `utility-bills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	`total_consumption` real,
	`consumption_value` real,
	`taxes_value` real,
	`cylinder_type` text,
	`unit_price` real,
	`multiplier_factor` real DEFAULT 2.25,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_utility_bill` ON `utility-bills` (`type`,`month`,`year`);--> statement-breakpoint
CREATE TABLE `vouchers` (
	`apartment_id` integer NOT NULL,
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	`is_paid` integer DEFAULT false,
	PRIMARY KEY(`apartment_id`, `month`, `year`),
	FOREIGN KEY (`apartment_id`) REFERENCES `apartments`(`id`) ON UPDATE no action ON DELETE cascade
);
