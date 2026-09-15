import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

// Validate environment variables before configuring Cloudinary
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error(
    "Missing Cloudinary environment variables. " +
      "Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET",
  );
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  // No file path supplied
  if (!localFilePath) {
    console.error("Cloudinary upload failed: No local file path provided");
    return null;
  }

  try {
    // Check whether local file exists
    try {
      await fs.access(localFilePath);
    } catch {
      console.error(
        `Cloudinary upload failed: Local file does not exist: ${localFilePath}`,
      );
      return null;
    }

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(
      `File uploaded successfully to Cloudinary: ${response.public_id}`,
    );

    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", {
      message: error?.message,
      http_code: error?.http_code,
      name: error?.name,
    });

    return null;
  } finally {
    // Always remove temporary local file
    try {
      await fs.unlink(localFilePath);
      console.log(`Temporary file deleted: ${localFilePath}`);
    } catch (error) {
      // Don't hide the actual Cloudinary error if cleanup fails
      if (error.code !== "ENOENT") {
        console.error(
          `Failed to delete temporary file: ${localFilePath}`,
          error,
        );
      }
    }
  }
};

export default uploadOnCloudinary;
