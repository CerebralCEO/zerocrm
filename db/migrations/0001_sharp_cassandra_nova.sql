CREATE TABLE "tombstones" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" text NOT NULL,
	"row_id" text NOT NULL,
	"deleted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"image_url" text,
	"job_title" text NOT NULL,
	"team" text NOT NULL,
	"region" text NOT NULL,
	"phone" text,
	"timezone" text NOT NULL,
	"bio" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "tombstones_deleted_idx" ON "tombstones" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "activities_updated_idx" ON "activities" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "deals_updated_idx" ON "deals" USING btree ("updated_at");