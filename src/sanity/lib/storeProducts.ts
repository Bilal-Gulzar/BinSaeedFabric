
import { client } from "./client";


const fetchProducts = async () => {
  const response = await fetch('https://677d93bc4496848554cb2350.mockapi.io/productsDetails/productDetails'); 
  const products = await response.json();
  return products;
};

const storeProductsInSanity = async (products: any) => {
  for (const product of products) {
    try {
      const result = await client.create({
        _type: 'product',
        title: product.title,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
      });
      console.log('Stored product:', result);
    } catch (error) {
      console.error('Error storing product:', error);
    }
  }
};

const syncProducts = async () => {
  const products = await fetchProducts();
  await storeProductsInSanity(products);
  console.log('Products synced to Sanity!');
};

syncProducts();
