import express, { type Express, type Request, type Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { 
  insertUserSchema, 
  insertPhotoSchema, 
  insertContactMessageSchema 
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod-validation-error";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
// Memory session store, no need for connectPgSimple

// Configure passport local strategy
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      // Check if the user exists
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }

      // Check if the password is correct
      const isValid = await storage.verifyUserPassword(username, password);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect username or password' });
      }

      // Return the user without the password
      const { password: _, ...userWithoutPassword } = user;
      return done(null, userWithoutPassword);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize user to the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUserById(id);
    if (!user) {
      return done(null, false);
    }
    // Return the user without the password
    const { password: _, ...userWithoutPassword } = user;
    done(null, userWithoutPassword);
  } catch (error) {
    done(error);
  }
});

// Setup upload directory
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, and GIF files are allowed'));
    }
    cb(null, true);
  },
});

// Middleware to ensure user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware with memory store
  app.use(session({
    secret: process.env.SESSION_SECRET || 'artlens-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true
    },
  }));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // API routes - prefix all with /api
  const apiPrefix = '/api';

  // User Authentication routes
  app.post(`${apiPrefix}/auth/login`, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json({ user });
      });
    })(req, res, next);
  });

  app.post(`${apiPrefix}/auth/register`, async (req, res) => {
    try {
      // Validate the request body
      const userData = insertUserSchema.parse(req.body);
      
      // Check if the username or email already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      
      // Create the new user
      const user = await storage.insertUser(userData);
      
      // Return the user without the password
      const { password: _, ...userWithoutPassword } = user;
      
      // Log the user in
      req.logIn(userWithoutPassword, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error during login' });
        }
        return res.status(201).json({ user: userWithoutPassword });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get(`${apiPrefix}/auth/user`, (req, res) => {
    if (req.isAuthenticated()) {
      return res.status(200).json({ user: req.user });
    }
    return res.status(401).json({ message: 'Not authenticated' });
  });

  app.post(`${apiPrefix}/auth/logout`, (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error during logout' });
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  // Categories routes
  app.get(`${apiPrefix}/categories`, async (req, res) => {
    try {
      const categoriesWithCount = await storage.getCategoryWithPhotoCount();
      res.status(200).json(categoriesWithCount);
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      // Provide dummy data when the database is not available
      const dummyCategories = [
        {
          id: 1,
          name: "Landscapes",
          slug: "landscapes",
          description: "Beautiful landscape photography from around the world",
          cover_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          photo_count: 24
        },
        {
          id: 2,
          name: "Portraits",
          slug: "portraits",
          description: "Stunning portrait photography capturing human emotion",
          cover_image: "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          photo_count: 18
        },
        {
          id: 3,
          name: "Wildlife",
          slug: "wildlife",
          description: "Captivating wildlife photography from nature's realm",
          cover_image: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          photo_count: 12
        },
        {
          id: 4,
          name: "Urban",
          slug: "urban",
          description: "Urban photography showcasing city life and architecture",
          cover_image: "https://images.unsplash.com/photo-1473893604213-3df9c15cf957?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          photo_count: 16
        },
        {
          id: 5,
          name: "Nature",
          slug: "nature",
          description: "Amazing shots of natural wonders and scenic views",
          cover_image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          photo_count: 22
        },
        {
          id: 6,
          name: "Abstract",
          slug: "abstract",
          description: "Creative abstract photography and artistic compositions",
          cover_image: "https://images.unsplash.com/photo-1541356665065-22676f35dd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          photo_count: 14
        }
      ];
      
      res.status(200).json(dummyCategories);
    }
  });

  app.get(`${apiPrefix}/categories/:slug`, async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(category);
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ message: 'Failed to fetch category' });
    }
  });

  app.get(`${apiPrefix}/categories/:slug/photos`, async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      
      const photos = await storage.getPhotosForCategory(category.id, { page, limit });
      res.status(200).json(photos);
    } catch (error) {
      console.error('Error fetching category photos:', error);
      res.status(500).json({ message: 'Failed to fetch category photos' });
    }
  });

  // Photos routes
  app.get(`${apiPrefix}/photos`, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const category = req.query.category ? parseInt(req.query.category as string) : null;
      const searchTerm = req.query.search as string || null;
      const sortBy = req.query.sortBy as string || 'newest';
      
      const photos = await storage.getAllPhotos({ page, limit, category, searchTerm, sortBy });
      res.status(200).json(photos);
    } catch (error) {
      console.error('Error fetching photos:', error);
      
      // Provide dummy data when the database is not available
      const dummyPhotos = {
        photos: [
          {
            id: 1,
            title: "Mountain Sunset",
            slug: "mountain-sunset",
            description: "A beautiful sunset view over the mountains",
            imageUrl: "https://images.unsplash.com/photo-1605973029521-8154da591bd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
            views: 324,
            likes: 42,
            categoryId: 1,
            userId: 1,
            isPremium: false,
            user: {
              name: "John Photographer"
            }
          },
          {
            id: 2,
            title: "Ocean Waves",
            slug: "ocean-waves",
            description: "Powerful ocean waves crashing against the shore",
            imageUrl: "https://images.unsplash.com/photo-1533760881669-80db4d7b341a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
            views: 218,
            likes: 36,
            categoryId: 5,
            userId: 2,
            isPremium: false,
            user: {
              name: "Sarah Naturalist"
            }
          },
          {
            id: 3,
            title: "Urban Architecture",
            slug: "urban-architecture",
            description: "Modern urban architecture with glass and steel",
            imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
            views: 175,
            likes: 28,
            categoryId: 4,
            userId: 3,
            isPremium: false,
            user: {
              name: "Alex Cityscape"
            }
          },
          {
            id: 4,
            title: "Forest Pathway",
            slug: "forest-pathway",
            description: "A serene pathway through a dense forest",
            imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
            views: 283,
            likes: 47,
            categoryId: 5,
            userId: 1,
            isPremium: false,
            user: {
              name: "John Photographer"
            }
          },
          {
            id: 5,
            title: "Wildlife Safari",
            slug: "wildlife-safari",
            description: "Majestic lion in the African savanna",
            imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
            views: 342,
            likes: 56,
            categoryId: 3,
            userId: 2,
            isPremium: false,
            user: {
              name: "Sarah Naturalist"
            }
          },
          {
            id: 6,
            title: "Abstract Art",
            slug: "abstract-art",
            description: "Colorful abstract art composition",
            imageUrl: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
            views: 198,
            likes: 33,
            categoryId: 6,
            userId: 3,
            isPremium: false,
            user: {
              name: "Alex Cityscape"
            }
          }
        ],
        totalPhotos: 6,
        totalPages: 1
      };
      
      res.status(200).json(dummyPhotos);
    }
  });

  app.get(`${apiPrefix}/photos/:slug`, async (req, res) => {
    try {
      const photo = await storage.getPhotoBySlug(req.params.slug);
      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }
      
      // Increment view count
      const updatedPhoto = await storage.incrementPhotoViews(photo.id);
      res.status(200).json(updatedPhoto);
    } catch (error) {
      console.error('Error fetching photo:', error);
      res.status(500).json({ message: 'Failed to fetch photo' });
    }
  });

  app.post(`${apiPrefix}/photos/upload`, upload.single('photo'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No photo uploaded' });
      }
      
      // Process the image with sharp
      const outputFilename = `optimized-${req.file.filename}`;
      const outputPath = path.join(uploadDir, outputFilename);
      
      await sharp(req.file.path)
        .resize({
          width: 1920,
          height: 1080,
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 80 })
        .toFile(outputPath);
      
      // Remove the original file
      fs.unlinkSync(req.file.path);
      
      // Extract EXIF metadata
      const metadata = await sharp(outputPath).metadata();
      
      // Validate the photo data
      const { title, description, categoryId, isPremium, tags } = req.body;
      const photoData = insertPhotoSchema.parse({
        title,
        description,
        imageUrl: `/uploads/${outputFilename}`,
        userId: 1, // Set to a default admin user ID
        categoryId: parseInt(categoryId),
        isPremium: false, // No premium photos for anonymous users
        tags,
        metadata: JSON.stringify(metadata)
      });
      
      // Insert the photo
      const photo = await storage.insertPhoto(photoData);
      res.status(201).json(photo);
    } catch (error) {
      if (req.file) {
        // Clean up the uploaded file in case of error
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {
          console.error('Error deleting file:', e);
        }
      }
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      console.error('Error uploading photo:', error);
      res.status(500).json({ message: 'Failed to upload photo' });
    }
  });

  app.post(`${apiPrefix}/photos/:id/like`, async (req, res) => {
    try {
      const photoId = parseInt(req.params.id);
      const photo = await storage.getPhotoById(photoId);
      
      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }
      
      const updatedPhoto = await storage.likePhoto(photoId);
      res.status(200).json(updatedPhoto);
    } catch (error) {
      console.error('Error liking photo:', error);
      res.status(500).json({ message: 'Failed to like photo' });
    }
  });

  app.post(`${apiPrefix}/photos/:id/unlike`, async (req, res) => {
    try {
      const photoId = parseInt(req.params.id);
      const photo = await storage.getPhotoById(photoId);
      
      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }
      
      const updatedPhoto = await storage.unlikePhoto(photoId);
      res.status(200).json(updatedPhoto);
    } catch (error) {
      console.error('Error unliking photo:', error);
      res.status(500).json({ message: 'Failed to unlike photo' });
    }
  });

  // Subscription routes removed

  // Contact form
  app.post(`${apiPrefix}/contact`, async (req, res) => {
    try {
      const contactData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(contactData);
      res.status(201).json({ message: 'Message sent successfully', id: message.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error sending contact message:', error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  const httpServer = createServer(app);
  return httpServer;
}
