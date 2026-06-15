-- Temporarily disable statement timeout for this migration
SET statement_timeout = 0;

-- Update any existing orders with 'CARD' payment method to 'GOOGLE_PAY'
UPDATE "Order" SET "paymentMethod" = 'GOOGLE_PAY' WHERE "paymentMethod" = 'CARD';

-- Alter PaymentMethod enum to remove 'CARD' value
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
CREATE TYPE "PaymentMethod" AS ENUM ('GOOGLE_PAY', 'CASH');
ALTER TABLE "Order" ALTER COLUMN "paymentMethod" TYPE "PaymentMethod" USING "paymentMethod"::text::"PaymentMethod";
DROP TYPE "PaymentMethod_old";
