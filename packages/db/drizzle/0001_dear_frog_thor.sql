CREATE TABLE "purchasement_item" (
	"purchasement_id" uuid NOT NULL,
	"title_id" uuid NOT NULL,
	CONSTRAINT "purchasement_item_purchasement_id_title_id_pk" PRIMARY KEY("purchasement_id","title_id")
);
--> statement-breakpoint
ALTER TABLE "purchasement_item" ADD CONSTRAINT "purchasement_item_purchasement_id_purchasement_id_fk" FOREIGN KEY ("purchasement_id") REFERENCES "public"."purchasement"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchasement_item" ADD CONSTRAINT "purchasement_item_title_id_title_id_fk" FOREIGN KEY ("title_id") REFERENCES "public"."title"("id") ON DELETE no action ON UPDATE no action;