import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const productsTable = sqliteTable(
  "products",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug"),
    title: text("title").notNull(),
    description: text("description").notNull(),
    titleAr: text("title_ar"),
    descriptionAr: text("description_ar"),
    tags: text("tags", { mode: "json" })
      .$type<string[]>()
      .notNull()
      .$defaultFn(() => []),
    priceLabel: text("price_label"),
    imageUrl: text("image_url"),
    requestUrl: text("request_url"),
    template: text("template").notNull().default("standard"),
    purchaseLabel: text("purchase_label"),
    purchaseNote: text("purchase_note"),
    deliveryType: text("delivery_type").notNull().default("digital"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    order: integer("order").notNull().default(0),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
  },
  (table) => [unique("products_slug_unique").on(table.slug)],
);
