import axios from "axios";

const TOKEN = process.env.HARAVAN_TOKEN;

export const getProducts = async () => {
  try {
    const response = await axios.get(
      "https://ruoumung.myharavan.com/admin/products.json",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    const products = response.data.products.map((p) => ({
      id: p.id,
      title: p.title,
      body_html: p.body_html, 
      images: p.images, 
      price: p.variants[0]?.price, 
    }));

    return { products };
  } catch (err) {
    console.error("Haravan API error:", err.message);
    throw err;
  }
};
