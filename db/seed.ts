import { db } from "./index";
import * as schema from "@shared/schema";
import { hash } from "bcrypt";

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Seed categories
    console.log("Seeding categories...");
    const existingCategories = await db.query.categories.findMany();
    
    if (existingCategories.length === 0) {
      const categories = [
        {
          name: "Landscapes",
          slug: "landscapes",
          description: "Beautiful landscape photography from around the world",
          coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Portraits",
          slug: "portraits",
          description: "Stunning portrait photography capturing human emotion",
          coverImage: "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Urban",
          slug: "urban",
          description: "Urban photography showcasing city life and architecture",
          coverImage: "https://images.unsplash.com/photo-1473893604213-3df9c15cf957?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Wildlife",
          slug: "wildlife",
          description: "Captivating wildlife photography from nature's realm",
          coverImage: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Food",
          slug: "food",
          description: "Delicious food photography that makes your mouth water",
          coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Architecture",
          slug: "architecture",
          description: "Striking architectural photography from around the globe",
          coverImage: "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        }
      ];
      
      await db.insert(schema.categories).values(categories);
      console.log(`Added ${categories.length} categories`);
    } else {
      console.log(`Categories already exist, skipping...`);
    }

    // Seed users
    console.log("Seeding users...");
    const existingUsers = await db.query.users.findMany();
    
    if (existingUsers.length === 0) {
      // Create admin user
      const hashedPassword = await hash("admin123", 10);
      
      await db.insert(schema.users).values({
        username: "admin",
        password: hashedPassword,
        email: "admin@artlens.com",
        name: "Admin User",
        role: "admin",
        bio: "Site administrator and photography enthusiast"
      });
      
      // Create photographers
      const photographers = [
        {
          username: "thomas_werner",
          password: await hash("password123", 10),
          email: "thomas@example.com",
          name: "Thomas Werner",
          bio: "Landscape photographer with a passion for mountain views"
        },
        {
          username: "samantha_lee",
          password: await hash("password123", 10),
          email: "samantha@example.com",
          name: "Samantha Lee",
          bio: "Equipment specialist and photography instructor"
        },
        {
          username: "marcus_johnson",
          password: await hash("password123", 10),
          email: "marcus@example.com",
          name: "Marcus Johnson",
          bio: "Portrait specialist focusing on natural light photography"
        },
        {
          username: "elena_chen",
          password: await hash("password123", 10),
          email: "elena@example.com",
          name: "Elena Chen",
          bio: "Urban landscape photographer capturing city nightlife"
        },
        {
          username: "david_miller",
          password: await hash("password123", 10),
          email: "david@example.com",
          name: "David Miller",
          bio: "Vintage equipment enthusiast and film photographer"
        },
        {
          username: "maria_lopez",
          password: await hash("password123", 10),
          email: "maria@example.com",
          name: "Maria Lopez",
          bio: "Food photographer and culinary artist"
        }
      ];
      
      await db.insert(schema.users).values(photographers);
      console.log(`Added ${photographers.length + 1} users`);
    } else {
      console.log(`Users already exist, skipping...`);
    }

    // Seed photos
    console.log("Seeding photos...");
    const existingPhotos = await db.query.photos.findMany();
    
    if (existingPhotos.length === 0) {
      // Get users and categories
      const users = await db.query.users.findMany();
      const categories = await db.query.categories.findMany();
      
      if (users.length === 0 || categories.length === 0) {
        console.log("Unable to seed photos: missing users or categories");
        return;
      }
      
      // Create a user and category lookup
      const userMap = users.reduce((map, user) => {
        map[user.username] = user.id;
        return map;
      }, {} as Record<string, number>);
      
      const categoryMap = categories.reduce((map, category) => {
        map[category.slug] = category.id;
        return map;
      }, {} as Record<string, number>);
      
      // Define photos
      const photos = [
        {
          title: "Mountain Reflections",
          slug: "mountain-reflections",
          description: "Beautiful mountain lake with perfect reflections at sunset",
          imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
          isPremium: true,
          userId: userMap["thomas_werner"],
          categoryId: categoryMap["landscapes"],
          likes: 243,
          views: 1205,
          tags: "mountains,lake,reflection,sunset,nature"
        },
        {
          title: "Photographer's Tools",
          slug: "photographers-tools",
          description: "Essential camera equipment for professional photographers",
          imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
          isPremium: false,
          userId: userMap["samantha_lee"],
          categoryId: categoryMap["urban"],
          likes: 187,
          views: 892,
          tags: "camera,equipment,photography,gear,lens"
        },
        {
          title: "Natural Portraiture",
          slug: "natural-portraiture",
          description: "Portrait photography using natural lighting techniques",
          imageUrl: "https://images.unsplash.com/photo-1539651044670-315229da9d2f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
          isPremium: true,
          userId: userMap["marcus_johnson"],
          categoryId: categoryMap["portraits"],
          likes: 312,
          views: 1423,
          tags: "portrait,woman,natural light,soft,beauty"
        },
        {
          title: "Urban Nightscapes",
          slug: "urban-nightscapes",
          description: "City architecture captured during the blue hour",
          imageUrl: "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
          isPremium: true,
          userId: userMap["elena_chen"],
          categoryId: categoryMap["architecture"],
          likes: 197,
          views: 954,
          tags: "urban,night,city,architecture,blue hour"
        },
        {
          title: "Vintage Equipment",
          slug: "vintage-equipment",
          description: "Collection of vintage photography equipment on wooden table",
          imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
          isPremium: false,
          userId: userMap["david_miller"],
          categoryId: categoryMap["urban"],
          likes: 145,
          views: 731,
          tags: "camera,vintage,retro,equipment,analog"
        },
        {
          title: "Culinary Arts",
          slug: "culinary-arts",
          description: "Artistic food photography showcasing culinary masterpieces",
          imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
          isPremium: true,
          userId: userMap["maria_lopez"],
          categoryId: categoryMap["food"],
          likes: 276,
          views: 1092,
          tags: "food,gourmet,culinary,restaurant,delicious"
        },
        {
          title: "Wildlife in Action",
          slug: "wildlife-in-action",
          description: "Capturing wildlife in their natural habitat",
          imageUrl: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
          isPremium: true,
          userId: userMap["thomas_werner"],
          categoryId: categoryMap["wildlife"],
          likes: 328,
          views: 1562,
          tags: "wildlife,animals,nature,action,photography"
        },
        {
          title: "Modern Architecture",
          slug: "modern-architecture",
          description: "Clean lines and patterns in modern architectural design",
          imageUrl: "https://images.unsplash.com/photo-1473893604213-3df9c15cf957?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
          isPremium: false,
          userId: userMap["elena_chen"],
          categoryId: categoryMap["urban"],
          likes: 193,
          views: 842,
          tags: "architecture,modern,design,building,urban"
        }
      ];
      
      await db.insert(schema.photos).values(photos);
      console.log(`Added ${photos.length} photos`);
    } else {
      console.log(`Photos already exist, skipping...`);
    }

    // Seed subscription plans
    console.log("Seeding subscription plans...");
    const existingPlans = await db.query.subscriptionPlans.findMany();
    
    if (existingPlans.length === 0) {
      // We need to use valid enum values from planEnum
      const plans = [
        {
          name: "Basic",
          type: schema.planEnum.enumValues[0], // "basic"
          monthlyPrice: 999, // $9.99
          yearlyPrice: 9900, // $99.00
          description: "A starter plan for casual photography enthusiasts",
          features: JSON.stringify([
            "Access to 100+ premium photos",
            "Download up to 10 photos/month",
            "Basic photo metadata",
            "Standard image resolution"
          ])
        },
        {
          name: "Pro",
          type: schema.planEnum.enumValues[1], // "pro"
          monthlyPrice: 1999, // $19.99
          yearlyPrice: 19900, // $199.00
          description: "The perfect plan for photography lovers",
          features: JSON.stringify([
            "Access to 500+ premium photos",
            "Download up to 50 photos/month",
            "Full photo metadata and EXIF data",
            "High-resolution images",
            "Priority customer support"
          ])
        },
        {
          name: "Elite",
          type: schema.planEnum.enumValues[2], // "elite"
          monthlyPrice: 3999, // $39.99
          yearlyPrice: 39900, // $399.00
          description: "Our premium plan for serious photography professionals",
          features: JSON.stringify([
            "Unlimited access to all premium photos",
            "Unlimited downloads",
            "Complete metadata and photographer notes",
            "Ultra high-resolution RAW images",
            "Commercial usage rights",
            "24/7 dedicated support"
          ])
        }
      ];
      
      await db.insert(schema.subscriptionPlans).values(plans);
      console.log(`Added ${plans.length} subscription plans`);
    } else {
      console.log(`Subscription plans already exist, skipping...`);
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during database seeding:", error);
    process.exit(1);
  }
}

seed();
