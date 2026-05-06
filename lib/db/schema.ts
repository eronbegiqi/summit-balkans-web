import {
  bigint,
  boolean,
  date,
  datetime,
  decimal,
  index,
  int,
  json,
  longtext,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  tinyint,
  varchar,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// ─── 1. ADMIN USERS ──────────────────────────────────────────────────────────

export const adminUsers = mysqlTable('admin_users', {
  id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  lastLoginAt: datetime('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── 2. DESTINATIONS ─────────────────────────────────────────────────────────

export const destinations = mysqlTable('destinations', {
  id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  country: mysqlEnum('country', ['Albania', 'Montenegro', 'Kosovo']).notNull(),
  description: text('description'),
  geography: text('geography'),
  bestSeason: varchar('best_season', { length: 100 }),
  visaRequirements: text('visa_requirements'),
  currency: varchar('currency', { length: 20 }),
  language: varchar('language', { length: 50 }),
  weatherInfo: text('weather_info'),
  safetyInfo: text('safety_info'),
  heroImageUrl: varchar('hero_image_url', { length: 500 }),
  highlights: json('highlights').$type<string[]>(),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: varchar('seo_description', { length: 500 }),
  published: boolean('published').default(false),
  displayOrder: int('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── 3. GUIDES ───────────────────────────────────────────────────────────────

export const guides = mysqlTable('guides', {
  id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  country: mysqlEnum('country', ['Albania', 'Montenegro', 'Kosovo']).notNull(),
  bio: text('bio'),
  quote: text('quote'),
  photoUrl: varchar('photo_url', { length: 500 }),
  languages: json('languages').$type<string[]>(),
  certifications: json('certifications').$type<string[]>(),
  yearsExperience: int('years_experience'),
  specialties: json('specialties').$type<string[]>(),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  social: json('social').$type<Record<string, string>>(),
  published: boolean('published').default(false),
  displayOrder: int('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── 4. TOURS ────────────────────────────────────────────────────────────────

export const tours = mysqlTable(
  'tours',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
    slug: varchar('slug', { length: 150 }).unique().notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    excerpt: text('excerpt'),
    description: longtext('description'),
    featuredImageUrl: varchar('featured_image_url', { length: 500 }),
    gallery: json('gallery').$type<string[]>(),
    country: varchar('country', { length: 50 }),
    region: varchar('region', { length: 100 }),
    durationDays: int('duration_days').notNull(),
    difficulty: tinyint('difficulty').notNull(),
    pricePerPersonEur: decimal('price_per_person_eur', { precision: 10, scale: 2 }).notNull(),
    groupSizeMin: int('group_size_min').default(2),
    groupSizeMax: int('group_size_max').default(12),
    totalDistanceKm: decimal('total_distance_km', { precision: 6, scale: 2 }),
    maxElevationM: int('max_elevation_m'),
    isFlagship: boolean('is_flagship').default(false),
    itinerary: json('itinerary').$type<Array<{
      day: number;
      title: string;
      description: string;
      distanceKm?: number;
      elevationGainM?: number;
      accommodation?: string;
    }>>(),
    includedItems: json('included_items').$type<string[]>(),
    notIncludedItems: json('not_included_items').$type<string[]>(),
    kitEssential: json('kit_essential').$type<string[]>(),
    kitRecommended: json('kit_recommended').$type<string[]>(),
    kitProvided: json('kit_provided').$type<string[]>(),
    bestSeasonStart: varchar('best_season_start', { length: 20 }),
    bestSeasonEnd: varchar('best_season_end', { length: 20 }),
    meetingPoint: text('meeting_point'),
    endPoint: text('end_point'),
    accommodationType: varchar('accommodation_type', { length: 100 }),
    mealsIncluded: varchar('meals_included', { length: 100 }),
    transportInfo: varchar('transport_info', { length: 255 }),
    assignedGuideId: bigint('assigned_guide_id', { mode: 'number' }),
    faq: json('faq').$type<Array<{ question: string; answer: string }>>(),
    seoTitle: varchar('seo_title', { length: 255 }),
    seoDescription: varchar('seo_description', { length: 500 }),
    published: boolean('published').default(false),
    displayOrder: int('display_order').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => [
    index('idx_tours_country').on(t.country),
    index('idx_tours_difficulty').on(t.difficulty),
    index('idx_tours_published').on(t.published),
  ]
);

// ─── 5. DEPARTURES ───────────────────────────────────────────────────────────

export const departures = mysqlTable(
  'departures',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
    tourId: bigint('tour_id', { mode: 'number' }).notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    capacity: int('capacity').notNull(),
    bookedCount: int('booked_count').default(0),
    pricePerPersonEur: decimal('price_per_person_eur', { precision: 10, scale: 2 }),
    language: varchar('language', { length: 50 }).default('English'),
    guideId: bigint('guide_id', { mode: 'number' }),
    status: mysqlEnum('status', ['AVAILABLE', 'LIMITED', 'SOLD_OUT', 'CANCELLED']).default('AVAILABLE'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => [
    index('idx_departures_tour').on(t.tourId),
    index('idx_departures_date').on(t.startDate),
    index('idx_departures_status').on(t.status),
  ]
);

// ─── 6. GEAR ITEMS (catalog) ─────────────────────────────────────────────────

export const gearItems = mysqlTable('gear_items', {
  id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
  slug: varchar('slug', { length: 150 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: mysqlEnum('category', [
    'Shelter', 'Sleep System', 'Clothing', 'Navigation',
    'Cooking', 'Lighting', 'Safety', 'Other',
  ]).notNull(),
  photoUrl: varchar('photo_url', { length: 500 }),
  gallery: json('gallery').$type<string[]>(),
  dayRateEur: decimal('day_rate_eur', { precision: 8, scale: 2 }).notNull(),
  depositEur: decimal('deposit_eur', { precision: 8, scale: 2 }),
  weightGrams: int('weight_grams'),
  sizes: json('sizes').$type<string[]>(),
  specifications: json('specifications').$type<Record<string, string>>(),
  totalUnits: int('total_units').default(1),
  published: boolean('published').default(false),
  displayOrder: int('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── 7. GEAR UNITS (individual physical items) ────────────────────────────────

export const gearUnits = mysqlTable(
  'gear_units',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
    gearItemId: bigint('gear_item_id', { mode: 'number' }).notNull(),
    unitCode: varchar('unit_code', { length: 50 }).unique().notNull(),
    size: varchar('size', { length: 20 }),
    conditionStatus: mysqlEnum('condition_status', ['NEW', 'GOOD', 'FAIR', 'DAMAGED', 'RETIRED']).default('GOOD'),
    status: mysqlEnum('status', ['AVAILABLE', 'RENTED', 'MAINTENANCE', 'RETIRED']).default('AVAILABLE'),
    purchasedDate: date('purchased_date'),
    notes: text('notes'),
    damageNotes: text('damage_notes'),
    availableFrom: date('available_from'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => [
    index('idx_gear_units_status').on(t.status),
    index('idx_gear_units_item').on(t.gearItemId),
  ]
);

// ─── 8. CUSTOMERS ────────────────────────────────────────────────────────────

export const customers = mysqlTable(
  'customers',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    country: varchar('country', { length: 100 }),
    dateOfBirth: date('date_of_birth'),
    passportNumber: varchar('passport_number', { length: 50 }),
    emergencyContactName: varchar('emergency_contact_name', { length: 255 }),
    emergencyContactPhone: varchar('emergency_contact_phone', { length: 50 }),
    dietaryRequirements: text('dietary_requirements'),
    medicalNotes: text('medical_notes'),
    fitnessLevel: mysqlEnum('fitness_level', ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
    marketingConsent: boolean('marketing_consent').default(false),
    totalBookings: int('total_bookings').default(0),
    totalSpentEur: decimal('total_spent_eur', { precision: 12, scale: 2 }).default('0'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => [
    index('idx_customers_email').on(t.email),
  ]
);

// ─── 9. BOOKINGS ─────────────────────────────────────────────────────────────

export const bookings = mysqlTable(
  'bookings',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
    bookingReference: varchar('booking_reference', { length: 20 }).unique().notNull(),
    customerId: bigint('customer_id', { mode: 'number' }).notNull(),
    tourId: bigint('tour_id', { mode: 'number' }).notNull(),
    departureId: bigint('departure_id', { mode: 'number' }),
    customStartDate: date('custom_start_date'),
    customEndDate: date('custom_end_date'),
    numAdults: int('num_adults').default(1),
    numChildren: int('num_children').default(0),
    travelersData: json('travelers_data').$type<Array<{
      firstName: string;
      lastName: string;
      email?: string;
      phone?: string;
      dietary?: string;
      fitnessLevel?: string;
    }>>(),
    basePriceEur: decimal('base_price_eur', { precision: 10, scale: 2 }).notNull(),
    addonsTotalEur: decimal('addons_total_eur', { precision: 10, scale: 2 }).default('0'),
    gearRentalTotalEur: decimal('gear_rental_total_eur', { precision: 10, scale: 2 }).default('0'),
    totalEur: decimal('total_eur', { precision: 10, scale: 2 }).notNull(),
    paymentType: mysqlEnum('payment_type', ['DEPOSIT', 'FULL']).default('DEPOSIT'),
    depositAmountEur: decimal('deposit_amount_eur', { precision: 10, scale: 2 }),
    paidAmountEur: decimal('paid_amount_eur', { precision: 10, scale: 2 }).default('0'),
    paymentStatus: mysqlEnum('payment_status', [
      'PENDING', 'DEPOSIT_PAID', 'PAID', 'REFUNDED', 'PARTIALLY_REFUNDED', 'FAILED',
    ]).default('PENDING'),
    paymentMethod: mysqlEnum('payment_method', ['NLB', 'STRIPE', 'BANK_TRANSFER', 'CASH', 'OTHER']),
    paymentReference: varchar('payment_reference', { length: 255 }),
    paymentData: json('payment_data').$type<Record<string, unknown>>(),
    bookingSource: mysqlEnum('booking_source', ['DIRECT', 'VIATOR', 'GETYOURGUIDE', 'OTHER']).default('DIRECT'),
    status: mysqlEnum('status', [
      'NEW', 'CONFIRMED', 'PRE_TRIP', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REFUNDED',
    ]).default('NEW'),
    internalNotes: text('internal_notes'),
    termsAcceptedAt: datetime('terms_accepted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => [
    index('idx_bookings_status').on(t.status),
    index('idx_bookings_payment').on(t.paymentStatus),
    index('idx_bookings_customer').on(t.customerId),
    index('idx_bookings_departure').on(t.departureId),
    index('idx_bookings_reference').on(t.bookingReference),
  ]
);

// ─── 10. GEAR RENTALS ────────────────────────────────────────────────────────

export const gearRentals = mysqlTable(
  'gear_rentals',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
    bookingId: bigint('booking_id', { mode: 'number' }).notNull(),
    gearUnitId: bigint('gear_unit_id', { mode: 'number' }).notNull(),
    rentalStartDate: date('rental_start_date').notNull(),
    rentalEndDate: date('rental_end_date').notNull(),
    expectedReturnDate: date('expected_return_date').notNull(),
    actualReturnDate: date('actual_return_date'),
    dailyRateEur: decimal('daily_rate_eur', { precision: 8, scale: 2 }).notNull(),
    totalDays: int('total_days').notNull(),
    totalEur: decimal('total_eur', { precision: 10, scale: 2 }).notNull(),
    depositEur: decimal('deposit_eur', { precision: 8, scale: 2 }),
    depositRefunded: boolean('deposit_refunded').default(false),
    status: mysqlEnum('status', [
      'RESERVED', 'CHECKED_OUT', 'RETURNED', 'LATE', 'DAMAGED', 'LOST',
    ]).default('RESERVED'),
    returnCondition: mysqlEnum('return_condition', ['PERFECT', 'GOOD', 'FAIR', 'DAMAGED', 'LOST']),
    damageNotes: text('damage_notes'),
    damageChargeEur: decimal('damage_charge_eur', { precision: 10, scale: 2 }).default('0'),
    lateChargeEur: decimal('late_charge_eur', { precision: 10, scale: 2 }).default('0'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => [
    index('idx_gear_rentals_dates').on(t.rentalStartDate, t.rentalEndDate),
    index('idx_gear_rentals_status').on(t.status),
  ]
);

// ─── 11. INQUIRIES ───────────────────────────────────────────────────────────

export const inquiries = mysqlTable(
  'inquiries',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
    type: mysqlEnum('type', ['CONTACT', 'PRIVATE_TRIP', 'TRIP_ALERT', 'GEAR_RENTAL', 'PRESS']).notNull(),
    status: mysqlEnum('status', ['NEW', 'IN_PROGRESS', 'REPLIED', 'CLOSED', 'SPAM']).default('NEW'),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    subject: varchar('subject', { length: 255 }),
    message: text('message'),
    preferredDatesStart: date('preferred_dates_start'),
    preferredDatesEnd: date('preferred_dates_end'),
    groupSize: int('group_size'),
    countriesOfInterest: json('countries_of_interest').$type<string[]>(),
    experienceType: varchar('experience_type', { length: 100 }),
    budgetEur: decimal('budget_eur', { precision: 10, scale: 2 }),
    sourcePage: varchar('source_page', { length: 255 }),
    utmData: json('utm_data').$type<Record<string, string>>(),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    assignedToId: bigint('assigned_to_id', { mode: 'number' }),
    replyNotes: text('reply_notes'),
    repliedAt: datetime('replied_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => [
    index('idx_inquiries_type').on(t.type),
    index('idx_inquiries_status').on(t.status),
    index('idx_inquiries_created').on(t.createdAt),
  ]
);

// ─── 12. BLOG POSTS ──────────────────────────────────────────────────────────

export const blogPosts = mysqlTable(
  'blog_posts',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
    slug: varchar('slug', { length: 200 }).unique().notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    excerpt: text('excerpt'),
    content: longtext('content'),
    featuredImageUrl: varchar('featured_image_url', { length: 500 }),
    category: mysqlEnum('category', [
      'TRAVEL_TIPS', 'DESTINATION_GUIDE', 'EQUIPMENT', 'STORIES', 'NEWS',
    ]).notNull(),
    tags: json('tags').$type<string[]>(),
    authorId: bigint('author_id', { mode: 'number' }),
    relatedTourIds: json('related_tour_ids').$type<number[]>(),
    seoTitle: varchar('seo_title', { length: 255 }),
    seoDescription: varchar('seo_description', { length: 500 }),
    published: boolean('published').default(false),
    publishedAt: datetime('published_at'),
    readingTimeMinutes: int('reading_time_minutes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (t) => [
    index('idx_blog_published').on(t.published, t.publishedAt),
    index('idx_blog_category').on(t.category),
  ]
);

// ─── 13. REVIEWS / TESTIMONIALS ──────────────────────────────────────────────

export const reviews = mysqlTable('reviews', {
  id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
  tourId: bigint('tour_id', { mode: 'number' }),
  customerId: bigint('customer_id', { mode: 'number' }),
  guestName: varchar('guest_name', { length: 255 }).notNull(),
  guestCountry: varchar('guest_country', { length: 100 }),
  rating: tinyint('rating').notNull(),
  quote: text('quote').notNull(),
  fullReview: text('full_review'),
  date: date('date').notNull(),
  verified: boolean('verified').default(false),
  featured: boolean('featured').default(false),
  published: boolean('published').default(true),
  source: mysqlEnum('source', ['DIRECT', 'GOOGLE', 'TRIPADVISOR', 'VIATOR', 'OTHER']).default('DIRECT'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── 14. PAYMENT TRANSACTIONS ────────────────────────────────────────────────

export const paymentTransactions = mysqlTable(
  'payment_transactions',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
    bookingId: bigint('booking_id', { mode: 'number' }).notNull(),
    transactionType: mysqlEnum('transaction_type', [
      'PAYMENT', 'REFUND', 'PARTIAL_REFUND', 'CHARGEBACK',
    ]).notNull(),
    paymentMethod: mysqlEnum('payment_method', [
      'NLB', 'STRIPE', 'BANK_TRANSFER', 'CASH', 'OTHER',
    ]).notNull(),
    amountEur: decimal('amount_eur', { precision: 10, scale: 2 }).notNull(),
    status: mysqlEnum('status', ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED']).notNull(),
    externalReference: varchar('external_reference', { length: 255 }),
    rawResponse: json('raw_response').$type<Record<string, unknown>>(),
    notes: text('notes'),
    processedById: bigint('processed_by_id', { mode: 'number' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('idx_payments_booking').on(t.bookingId),
    index('idx_payments_status').on(t.status),
  ]
);

// ─── 15. ACTIVITY LOG ────────────────────────────────────────────────────────

export const activityLog = mysqlTable(
  'activity_log',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
    adminUserId: bigint('admin_user_id', { mode: 'number' }),
    entityType: varchar('entity_type', { length: 50 }).notNull(),
    entityId: bigint('entity_id', { mode: 'number' }).notNull(),
    action: varchar('action', { length: 50 }).notNull(),
    changes: json('changes').$type<Record<string, { from: unknown; to: unknown }>>(),
    ipAddress: varchar('ip_address', { length: 45 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('idx_activity_entity').on(t.entityType, t.entityId),
  ]
);

// ─── 16. SETTINGS ────────────────────────────────────────────────────────────

export const settings = mysqlTable('settings', {
  id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
  settingKey: varchar('setting_key', { length: 100 }).unique().notNull(),
  settingValue: text('setting_value'),
  settingType: mysqlEnum('setting_type', ['STRING', 'NUMBER', 'BOOLEAN', 'JSON']).default('STRING'),
  description: varchar('description', { length: 500 }),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── RELATIONS ────────────────────────────────────────────────────────────────

export const adminUsersRelations = relations(adminUsers, ({ many }) => ({
  inquiries: many(inquiries),
  blogPosts: many(blogPosts),
  paymentTransactions: many(paymentTransactions),
  activityLog: many(activityLog),
}));

export const guidesRelations = relations(guides, ({ many }) => ({
  tours: many(tours),
  departures: many(departures),
}));

export const toursRelations = relations(tours, ({ one, many }) => ({
  guide: one(guides, { fields: [tours.assignedGuideId], references: [guides.id] }),
  departures: many(departures),
  bookings: many(bookings),
  reviews: many(reviews),
}));

export const departuresRelations = relations(departures, ({ one, many }) => ({
  tour: one(tours, { fields: [departures.tourId], references: [tours.id] }),
  guide: one(guides, { fields: [departures.guideId], references: [guides.id] }),
  bookings: many(bookings),
}));

export const gearItemsRelations = relations(gearItems, ({ many }) => ({
  units: many(gearUnits),
}));

export const gearUnitsRelations = relations(gearUnits, ({ one, many }) => ({
  gearItem: one(gearItems, { fields: [gearUnits.gearItemId], references: [gearItems.id] }),
  rentals: many(gearRentals),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  bookings: many(bookings),
  reviews: many(reviews),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  customer: one(customers, { fields: [bookings.customerId], references: [customers.id] }),
  tour: one(tours, { fields: [bookings.tourId], references: [tours.id] }),
  departure: one(departures, { fields: [bookings.departureId], references: [departures.id] }),
  gearRentals: many(gearRentals),
  paymentTransactions: many(paymentTransactions),
}));

export const gearRentalsRelations = relations(gearRentals, ({ one }) => ({
  booking: one(bookings, { fields: [gearRentals.bookingId], references: [bookings.id] }),
  gearUnit: one(gearUnits, { fields: [gearRentals.gearUnitId], references: [gearUnits.id] }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  assignedTo: one(adminUsers, { fields: [inquiries.assignedToId], references: [adminUsers.id] }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(adminUsers, { fields: [blogPosts.authorId], references: [adminUsers.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  tour: one(tours, { fields: [reviews.tourId], references: [tours.id] }),
  customer: one(customers, { fields: [reviews.customerId], references: [customers.id] }),
}));

export const paymentTransactionsRelations = relations(paymentTransactions, ({ one }) => ({
  booking: one(bookings, { fields: [paymentTransactions.bookingId], references: [bookings.id] }),
  processedBy: one(adminUsers, {
    fields: [paymentTransactions.processedById],
    references: [adminUsers.id],
  }),
}));

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  adminUser: one(adminUsers, { fields: [activityLog.adminUserId], references: [adminUsers.id] }),
}));
