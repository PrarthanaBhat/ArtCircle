import { db } from "@db";
import { photos, users, categories, subscriptionPlans, subscriptions, contactMessages } from "@shared/schema";
import { eq, and, desc, like, sql, asc, gte, lte, or } from "drizzle-orm";
import type { InsertPhoto, InsertUser, InsertContactMessage, InsertSubscription } from "@shared/schema";
import { createId } from "@paralleldrive/cuid2";
import { hash, compare } from "bcrypt";

// User related functions
export const storage = {
  // User functions
  async getUserById(id: number) {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    });
  },

  async getUserByUsername(username: string) {
    return await db.query.users.findFirst({
      where: eq(users.username, username),
    });
  },

  async getUserByEmail(email: string) {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  },

  async insertUser(user: InsertUser) {
    // Hash the password
    const hashedPassword = await hash(user.password, 10);
    
    const newUser = {
      ...user,
      password: hashedPassword
    };
    
    const [insertedUser] = await db.insert(users).values(newUser).returning();
    return insertedUser;
  },

  async verifyUserPassword(username: string, password: string) {
    const user = await this.getUserByUsername(username);
    if (!user) return false;
    
    return compare(password, user.password);
  },

  // Category functions
  async getAllCategories() {
    return await db.query.categories.findMany({
      orderBy: asc(categories.name),
    });
  },

  async getCategoryById(id: number) {
    return await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });
  },

  async getCategoryBySlug(slug: string) {
    return await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    });
  },

  async getCategoryWithPhotoCount() {
    const result = await db.execute(sql`
      SELECT 
        c.id, 
        c.name, 
        c.slug, 
        c.description, 
        c.cover_image, 
        COUNT(p.id) AS photo_count
      FROM 
        categories c
      LEFT JOIN 
        photos p ON c.id = p.category_id
      GROUP BY 
        c.id
      ORDER BY 
        c.name ASC
    `);
    
    return result.rows;
  },

  // Photo functions
  async getAllPhotos({ page = 1, limit = 12, category = null, searchTerm = null, sortBy = "newest" }) {
    let query = db.select().from(photos)
      .limit(limit)
      .offset((page - 1) * limit)
      .innerJoin(users, eq(photos.userId, users.id))
      .innerJoin(categories, eq(photos.categoryId, categories.id));
  
    // Apply category filter
    if (category) {
      query = query.where(eq(photos.categoryId, category));
    }
  
    // Apply search term filter
    if (searchTerm) {
      query = query.where(
        or(
          like(photos.title, `%${searchTerm}%`),
          like(photos.description, `%${searchTerm}%`),
          like(photos.tags, `%${searchTerm}%`)
        )
      );
    }
  
    // Apply sorting
    if (sortBy === "newest") {
      query = query.orderBy(desc(photos.createdAt));
    } else if (sortBy === "popular") {
      query = query.orderBy(desc(photos.likes));
    } else if (sortBy === "views") {
      query = query.orderBy(desc(photos.views));
    }
  
    const photosData = await query;
  
    // Count total photos for pagination
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(photos);
    
    // Apply the same filters
    if (category) {
      countQuery.where(eq(photos.categoryId, category));
    }
    
    if (searchTerm) {
      countQuery.where(
        or(
          like(photos.title, `%${searchTerm}%`),
          like(photos.description, `%${searchTerm}%`),
          like(photos.tags, `%${searchTerm}%`)
        )
      );
    }
    
    const [count] = await countQuery;
    
    return {
      photos: photosData,
      total: count.count,
      pages: Math.ceil(count.count / limit)
    };
  },

  async getPhotoById(id: number) {
    return await db.query.photos.findFirst({
      where: eq(photos.id, id),
      with: {
        user: true,
        category: true,
      },
    });
  },

  async getPhotoBySlug(slug: string) {
    return await db.query.photos.findFirst({
      where: eq(photos.slug, slug),
      with: {
        user: true,
        category: true,
      },
    });
  },

  async insertPhoto(photo: InsertPhoto) {
    // Create slug from title
    const slug = `${photo.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${createId().slice(0, 8)}`;
    
    const [insertedPhoto] = await db.insert(photos)
      .values({
        ...photo,
        slug,
      })
      .returning();
    
    return insertedPhoto;
  },

  async incrementPhotoViews(id: number) {
    await db.update(photos)
      .set({ views: sql`${photos.views} + 1` })
      .where(eq(photos.id, id));
      
    return await this.getPhotoById(id);
  },

  async likePhoto(id: number) {
    await db.update(photos)
      .set({ likes: sql`${photos.likes} + 1` })
      .where(eq(photos.id, id));
      
    return await this.getPhotoById(id);
  },

  async unlikePhoto(id: number) {
    await db.update(photos)
      .set({ likes: sql`${photos.likes} - 1` })
      .where(eq(photos.id, id));
      
    return await this.getPhotoById(id);
  },

  async getPhotosForCategory(categoryId: number, { page = 1, limit = 12 }) {
    const photosData = await db.select()
      .from(photos)
      .where(eq(photos.categoryId, categoryId))
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(desc(photos.createdAt))
      .innerJoin(users, eq(photos.userId, users.id))
      .innerJoin(categories, eq(photos.categoryId, categories.id));
    
    const [count] = await db.select({ count: sql<number>`count(*)` })
      .from(photos)
      .where(eq(photos.categoryId, categoryId));
    
    return {
      photos: photosData,
      total: count.count,
      pages: Math.ceil(count.count / limit)
    };
  },

  async getUserPhotos(userId: number, { page = 1, limit = 12 }) {
    const photosData = await db.select()
      .from(photos)
      .where(eq(photos.userId, userId))
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(desc(photos.createdAt))
      .innerJoin(categories, eq(photos.categoryId, categories.id));
    
    const [count] = await db.select({ count: sql<number>`count(*)` })
      .from(photos)
      .where(eq(photos.userId, userId));
    
    return {
      photos: photosData,
      total: count.count,
      pages: Math.ceil(count.count / limit)
    };
  },

  // Subscription Plans
  async getAllSubscriptionPlans() {
    return await db.query.subscriptionPlans.findMany({
      orderBy: asc(subscriptionPlans.monthlyPrice),
    });
  },

  async getSubscriptionPlanById(id: number) {
    return await db.query.subscriptionPlans.findFirst({
      where: eq(subscriptionPlans.id, id),
    });
  },

  // Subscriptions
  async getUserSubscription(userId: number) {
    return await db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, 'active'),
        gte(subscriptions.endDate, new Date())
      ),
      with: {
        plan: true,
      },
    });
  },

  async createSubscription(subscription: InsertSubscription) {
    const [insertedSubscription] = await db.insert(subscriptions)
      .values(subscription)
      .returning();
    
    return insertedSubscription;
  },

  async cancelSubscription(id: number) {
    await db.update(subscriptions)
      .set({ 
        status: 'cancelled',
        updatedAt: new Date()
      })
      .where(eq(subscriptions.id, id));
    
    return await db.query.subscriptions.findFirst({
      where: eq(subscriptions.id, id),
      with: {
        plan: true,
      },
    });
  },

  // Contact Messages
  async createContactMessage(message: InsertContactMessage) {
    const [insertedMessage] = await db.insert(contactMessages)
      .values(message)
      .returning();
    
    return insertedMessage;
  },

  async getAllContactMessages({ page = 1, limit = 20, status = null }) {
    let query = db.select().from(contactMessages)
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(desc(contactMessages.createdAt));
    
    if (status) {
      query = query.where(eq(contactMessages.status, status));
    }
    
    const messages = await query;
    
    // Count total messages
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(contactMessages);
    
    if (status) {
      countQuery = countQuery.where(eq(contactMessages.status, status));
    }
    
    const [count] = await countQuery;
    
    return {
      messages,
      total: count.count,
      pages: Math.ceil(count.count / limit)
    };
  },

  async updateContactMessageStatus(id: number, status: string) {
    await db.update(contactMessages)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(contactMessages.id, id));
    
    return await db.query.contactMessages.findFirst({
      where: eq(contactMessages.id, id),
    });
  }
};
