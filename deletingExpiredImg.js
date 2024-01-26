const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Define a function to delete images older than a specified time
async function deleteOldImages() {
  try {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'shareBackendFiles/', // Adjust based on your folder structure
      max_results: 100, // Set to a number that suits your needs
    });

    const imagesToDelete = result.resources.filter(
      (image) => new Date(image.created_at) < cutoffTime
    );

    for (const image of imagesToDelete) {
      const deleteResult = await cloudinary.uploader.destroy(image.public_id);
      console.log(`Deleted image with public_id: ${image.public_id}`, deleteResult);
    }

    console.log('Deletion process completed.');
  } catch (error) {
    console.error('Error deleting images:', error.message);
  }
}

// Run the deletion function
deleteOldImages();
