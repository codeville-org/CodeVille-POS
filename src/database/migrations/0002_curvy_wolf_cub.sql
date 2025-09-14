ALTER TABLE `products` RENAME COLUMN "price" TO "unit_price";--> statement-breakpoint
ALTER TABLE `products` ADD `unit_amount` integer DEFAULT 1;