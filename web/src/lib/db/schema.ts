import { 
  pgTable, 
  text, 
  varchar, 
  boolean, 
  timestamp, 
  integer, 
  decimal,
  json,
  uuid,
  pgEnum,
  bigint as pgBigint
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';


// Enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'retailer', 'super_admin']);
export const productConditionEnum = pgEnum('product_condition', ['excellent', 'good', 'fair', 'poor', 'broken']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'completed']);

// Better Auth required tables - using text IDs as Better Auth expects
export const users = pgTable('user', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  emailVerified: boolean('emailVerified').notNull().default(false),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  // Custom fields for our marketplace
  role: userRoleEnum('role').notNull().default('customer'),
  isRetailerApproved: boolean('isRetailerApproved').notNull().default(false),
  businessName: text('businessName'),
  businessAddress: text('businessAddress'),
  phone: text('phone'),
  location: text('location'),
});

export const accounts = pgTable('account', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  accountId: text('accountId').notNull(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  providerId: text('providerId').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
});

export const sessions = pgTable('session', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  token: text('token').notNull().unique(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expiresAt', { mode: 'date', withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt', { mode: 'date', withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

export const otpCodes = pgTable('otp_codes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull(),
  code: text('code').notNull(),
  expiresAt: timestamp('expiresAt', { mode: 'date', withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

// Legacy marketplace tables (keeping for backward compatibility)
export const categories = pgTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  image: text('image'),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable('products', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  condition: productConditionEnum('condition').notNull(),
  categoryId: text('categoryId').references(() => categories.id, { onDelete: 'cascade' }),
  sellerId: text('sellerId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  images: json('images').$type<string[]>(),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  buyerId: text('buyerId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sellerId: text('sellerId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: text('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  status: orderStatusEnum('status').notNull().default('pending'),
  totalAmount: decimal('totalAmount', { precision: 10, scale: 2 }).notNull(),
  shippingAddress: json('shippingAddress').$type<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>(),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text('orderId').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  reviewerId: text('reviewerId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  revieweeId: text('revieweeId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  senderId: text('senderId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  receiverId: text('receiverId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isRead: boolean('isRead').notNull().default(false),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  products: many(products),
  ordersAsBuyer: many(orders),
  ordersAsSeller: many(orders),
  reviewsAsReviewer: many(reviews),
  reviewsAsReviewee: many(reviews),
  sentMessages: many(messages),
  receivedMessages: many(messages),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  buyer: one(users, {
    fields: [orders.buyerId],
    references: [users.id],
  }),
  seller: one(users, {
    fields: [orders.sellerId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
  }),
  reviewee: one(users, {
    fields: [reviews.revieweeId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
  }),
}));

// Phone Database Tables
export const phoneBrands = pgTable('phone_brands', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

export const phoneModels = pgTable('phone_models', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  brandId: text('brandId').notNull().references(() => phoneBrands.id, { onDelete: 'cascade' }),
  description: text('description'),
  image: text('image'),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

export const phoneVariants = pgTable('phone_variants', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  modelId: text('modelId').notNull().references(() => phoneModels.id, { onDelete: 'cascade' }),
  storage: text('storage'),
  ram: text('ram'),
  color: text('color'),
  price: decimal('price', { precision: 10, scale: 2 }),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

// Leads table for customer phone selling requests
export const leads = pgTable('leads', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  customerId: text('customerId').notNull(),
  retailerId: text('retailerId').notNull(),
  phoneBrand: text('phoneBrand').notNull(),
  phoneModel: text('phoneModel').notNull(),
  phoneVariant: text('phoneVariant'),
  condition: text('condition').notNull(),
  storage: text('storage'),
  color: text('color'),
  purchaseDate: text('purchaseDate'),
  warrantyStatus: text('warrantyStatus'),
  accessories: text('accessories'),
  customerName: text('customerName').notNull(),
  customerEmail: text('customerEmail').notNull(),
  customerPhone: text('customerPhone').notNull(),
  customerLocation: text('customerLocation').notNull(),
  preferredContactMethod: text('preferredContactMethod').notNull(),
  preferredContactTime: text('preferredContactTime'),
  estimatedValue: decimal('estimatedValue', { precision: 10, scale: 2 }),
  status: text('status').notNull().default('new'),
  notes: text('notes'),
  retailerNotes: text('retailerNotes'),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

// Phone table relations
export const phoneBrandsRelations = relations(phoneBrands, ({ many }) => ({
  models: many(phoneModels),
}));

export const phoneModelsRelations = relations(phoneModels, ({ one, many }) => ({
  brand: one(phoneBrands, {
    fields: [phoneModels.brandId],
    references: [phoneBrands.id],
  }),
  variants: many(phoneVariants),
}));

export const phoneVariantsRelations = relations(phoneVariants, ({ one }) => ({
  model: one(phoneModels, {
    fields: [phoneVariants.modelId],
    references: [phoneModels.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  customer: one(users, {
    fields: [leads.customerId],
    references: [users.id],
    relationName: 'customerLeads',
  }),
  retailer: one(users, {
    fields: [leads.retailerId],
    references: [users.id],
    relationName: 'retailerLeads',
  }),
}));


// Export schema for Better Auth
export const schema = {
  users,
  accounts,
  sessions,
  verification,
  otpCodes,
  categories,
  products,
  orders,
  reviews,
  messages,
  phoneBrands,
  phoneModels,
  phoneVariants,
  leads,
  usersRelations,
  accountsRelations,
  sessionsRelations,
  categoriesRelations,
  productsRelations,
  ordersRelations,
  reviewsRelations,
  messagesRelations,
  phoneBrandsRelations,
  phoneModelsRelations,
  phoneVariantsRelations,
  leadsRelations,
};