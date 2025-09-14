ALTER TABLE `transaction_items` ADD `unit_amount` integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE `transaction_items` ADD `unit` text DEFAULT 'pcs';