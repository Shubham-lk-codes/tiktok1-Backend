import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary (Make sure this is executed first)
cloudinary.config({
  cloud_name: "dqdh5fp3p",
  api_key: "868873783526282",
  api_secret: "IZNg6kI3NOvejThkGnbznp4H_Jo",
});

console.log(cloudinary.config());  // To check if the config is applied correctly


// Cloudinary storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'videos',
    resource_type: 'video',
    format: async () => 'mp4', // Optional: Convert videos to mp4 format
    public_id: (req, file) => `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
  },
});

// Cloudinary storage for profile images
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profileImages',
    resource_type: 'image',
    format: async () => 'png', // Optional: Convert images to png format
    public_id: (req, file) => `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
  },
});

// Multer for videos
export const upload = multer({
  storage: videoStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mkv'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only videos are allowed.'));
    }
    cb(null, true);
  },
});

// Multer for profile images
export const uploadUserProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'posts',
    resource_type: 'image',
    format: async () => 'jpeg',
    public_id: (req, file) => {
      console.log("File received in CloudinaryStorage:", file);
      return `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    },
  },
});

// Multer for post images
export const uploadPostImage = multer({
  storage: postStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    console.log("File received by multer:", file); // Log file details
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      console.log("Rejected file type:", file.mimetype);
      return cb(new Error("Invalid file type. Only images are allowed."));
    }
    cb(null, true);
  },
});

export default { upload, uploadUserProfile,uploadPostImage };
