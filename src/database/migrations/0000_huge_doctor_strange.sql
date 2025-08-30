CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE INDEX `categories_name_idx` ON `categories` (`name`);--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`address` text,
	`total_credit_limit` real DEFAULT 0,
	`current_balance` real DEFAULT 0 NOT NULL,
	`notes` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `customers_name_idx` ON `customers` (`name`);--> statement-breakpoint
CREATE INDEX `customers_phone_idx` ON `customers` (`phone`);--> statement-breakpoint
CREATE INDEX `customers_balance_idx` ON `customers` (`current_balance`);--> statement-breakpoint
CREATE INDEX `customers_active_idx` ON `customers` (`is_active`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`barcode` text,
	`price` real NOT NULL,
	`discounted_price` real DEFAULT 0 NOT NULL,
	`category_id` text,
	`stock_quantity` integer DEFAULT 0 NOT NULL,
	`unit` text DEFAULT 'pcs',
	`description` text,
	`image_filename` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_barcode_unique` ON `products` (`barcode`);--> statement-breakpoint
CREATE INDEX `products_name_idx` ON `products` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `products_barcode_idx` ON `products` (`barcode`);--> statement-breakpoint
CREATE INDEX `products_category_idx` ON `products` (`category_id`);--> statement-breakpoint
CREATE INDEX `products_stock_idx` ON `products` (`stock_quantity`);--> statement-breakpoint
CREATE INDEX `products_active_idx` ON `products` (`is_active`);--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`category` text DEFAULT 'general' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settings_key_unique` ON `settings` (`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `settings_key_idx` ON `settings` (`key`);--> statement-breakpoint
CREATE INDEX `settings_category_idx` ON `settings` (`category`);--> statement-breakpoint
CREATE TABLE `transaction_items` (
	`id` text PRIMARY KEY NOT NULL,
	`transaction_id` text NOT NULL,
	`product_id` text,
	`product_name` text NOT NULL,
	`product_barcode` text,
	`unit_price` real NOT NULL,
	`quantity` real NOT NULL,
	`total_amount` real NOT NULL,
	`discount_amount` real DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `transaction_items_transaction_idx` ON `transaction_items` (`transaction_id`);--> statement-breakpoint
CREATE INDEX `transaction_items_product_idx` ON `transaction_items` (`product_id`);--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`transaction_number` text NOT NULL,
	`customer_id` text,
	`subtotal_amount` real NOT NULL,
	`discount_amount` real DEFAULT 0 NOT NULL,
	`tax_amount` real DEFAULT 0 NOT NULL,
	`total_amount` real NOT NULL,
	`payment_method` text NOT NULL,
	`cash_received` real,
	`change_given` real,
	`status` text DEFAULT 'completed' NOT NULL,
	`notes` text,
	`receipt_printed` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_transaction_number_unique` ON `transactions` (`transaction_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_number_idx` ON `transactions` (`transaction_number`);--> statement-breakpoint
CREATE INDEX `transactions_customer_idx` ON `transactions` (`customer_id`);--> statement-breakpoint
CREATE INDEX `transactions_payment_method_idx` ON `transactions` (`payment_method`);--> statement-breakpoint
CREATE INDEX `transactions_status_idx` ON `transactions` (`status`);--> statement-breakpoint
CREATE INDEX `transactions_date_idx` ON `transactions` (`created_at`);