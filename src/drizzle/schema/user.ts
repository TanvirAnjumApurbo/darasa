import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
// import { relations } from "drizzle-orm/relations";
// import { JobInfoTable } from "./jobinfo";

export const UserTable = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  imageUrl: varchar("imageUrl", { length: 1000 }), // Nullable and longer for image URLs
  createdAt,
  updatedAt,
});

// export const userRelations = relations(UserTable, ({ many }) => ({
//   jobInfos: many(JobInfoTable),
// }))
