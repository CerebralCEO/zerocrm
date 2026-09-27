CREATE TABLE "activities" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"company_id" text NOT NULL,
	"deal_id" text,
	"owner_id" text NOT NULL,
	"at" text NOT NULL,
	"done" boolean NOT NULL,
	"scheduled" boolean DEFAULT false NOT NULL,
	"system" boolean DEFAULT false NOT NULL,
	"actor" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"logo" text,
	"tags" jsonb NOT NULL,
	"owner_id" text NOT NULL,
	"last_interaction_date" text NOT NULL,
	"last_interaction_type" text NOT NULL,
	"score_cards" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"company_id" text NOT NULL,
	"owner_id" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"location" text NOT NULL,
	"personas" jsonb NOT NULL,
	"strength" integer NOT NULL,
	"last_touch_kind" text NOT NULL,
	"last_touch_date" text NOT NULL,
	"starred" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deals" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"title" text NOT NULL,
	"value" integer NOT NULL,
	"stage" text NOT NULL,
	"owner_id" text NOT NULL,
	"probability" integer NOT NULL,
	"close_date" text NOT NULL,
	"next_step" text NOT NULL,
	"last_touch_type" text NOT NULL,
	"last_touch_date" text NOT NULL,
	"site_id" text,
	"notes" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" text PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"deal_id" text NOT NULL,
	"company_id" text NOT NULL,
	"owner_id" text NOT NULL,
	"issue_date" text NOT NULL,
	"terms" integer NOT NULL,
	"status" text NOT NULL,
	"sent_date" text,
	"paid_date" text,
	"items" jsonb NOT NULL,
	"discount" integer NOT NULL,
	"tax_rate" real NOT NULL,
	"tax_label" text NOT NULL,
	"notes" text NOT NULL,
	"template_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"actor" text,
	"company_id" text NOT NULL,
	"company" text NOT NULL,
	"text" text NOT NULL,
	"quote" text,
	"time" text NOT NULL,
	"unread" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "owners" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sequences" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"goal" text NOT NULL,
	"status" text NOT NULL,
	"owner_id" text NOT NULL,
	"meetings" integer NOT NULL,
	"steps" jsonb NOT NULL,
	"enrollments" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slip_pushes" (
	"id" text PRIMARY KEY NOT NULL,
	"deal_id" text NOT NULL,
	"position" integer NOT NULL,
	"from_date" text NOT NULL,
	"to_date" text NOT NULL,
	"on_date" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"accounts_label" text,
	"members" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "activities_company_idx" ON "activities" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "activities_at_idx" ON "activities" USING btree ("at");--> statement-breakpoint
CREATE INDEX "deals_company_idx" ON "deals" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "deals_owner_idx" ON "deals" USING btree ("owner_id");