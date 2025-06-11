import { createClient } from "@sanity/client";
import axios from "axios";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { v4 as uuidv4 } from "uuid";


// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  apiVersion: "2021-08-31",
});

async function uploadImageToSanity(imageUrl) {
  try {
    console.log(`Uploading image: ${imageUrl}`);
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
    const asset = await client.assets.upload("image", buffer, {
      filename: imageUrl.split("/").pop(),
    });
    console.log(`Image uploaded successfully: ${asset._id}`);
    return asset._id;
  } catch (error) {
    console.error("Failed to upload image:", imageUrl, error);
    return null;
  }
}

async function importData() {
  try {
    console.log("migrating data please wait...");

    // API endpoint containing car data
    const response = await axios.get("https://dummyjson.com/products?limit=0");
     const products = response.data.products
    console.log("products ==>> ", products);

    for (const product of products) {
      let productImagesRefs = [];
      let imageRef = null;

      if (product.thumbnail) {
        imageRef = await uploadImageToSanity(product.thumbnail);
      }
      // If image field is an array of image URLs
      if (Array.isArray(product.images)) {
        for (const imgUrl of product.images) {
          const imageRef = await uploadImageToSanity(imgUrl);
          if (imageRef) {
            productImagesRefs.push({
              _key: uuidv4(),
              _type: "image",
              asset: {
                _type: "reference",
                _ref: imageRef,
              },
            });
          }
        }
      }
      //  else if (typeof product.images === "string") {
      //   // Fallback: single image as string
      //   const imageRef = await uploadImageToSanity(product.images);
      //   if (imageRef) {
      //     productImagesRefs.push({
      //       _key: uuidv4(),
      //       _type: "image",
      //       asset: {
      //         _type: "reference",
      //         _ref: imageRef,
      //       },
      //     });
      //   }
      // }

      const sanityProduct = {
        _type: "product",
        title: product.title,
        price: parseInt(product.price),
        tags: product.tags || [],
        discountPercentage: product.discountPercentage,
        qty: product.stock,
        thumbnail: imageRef
          ? {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: imageRef,
              },
            }
          : undefined,
        description: product.description,
        productImages: productImagesRefs,
      };

      await client.create(sanityProduct);
    }

    console.log("Data migrated successfully!");
  } catch (error) {
    console.error("Error in migrating data ==>> ", error);
  }
}

importData();


// async function deleteAllProducts() {
//   try {
//     console.log("Fetching all products...");

//     // Query all documents of type 'product'
//     const products = await client.fetch(`*[_type == "product"]{_id}`);

//     if (products.length === 0) {
//       console.log("No products found.");
//       return;
//     }

//     console.log(`Found ${products.length} products. Deleting...`);

//     // Delete each product by _id
//     for (const product of products) {
//       await client.delete(product._id);
//       console.log(`Deleted product with ID: ${product._id}`);
//     }

//     console.log("✅ All products deleted.");
//   } catch (error) {
//     console.error("❌ Error deleting products:", error);
//   }
// }

// deleteAllProducts();
  