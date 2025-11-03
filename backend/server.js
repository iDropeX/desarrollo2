import "dotenv/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import ingredientRoutes from "./routes/ingredient.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// rutas
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
const URI  = process.env.MONGODB_URI || "mongodb://localhost:27017/aircry_sushi";
mongoose.set("strictQuery", true);
mongoose.connect(URI).then(() => {
  console.log("✅ Mongo conectado");
  app.listen(PORT, () => console.log(`🚀 API http://localhost:${PORT}`));
}).catch(err => {
  console.error("❌ Mongo error:", err.message);
  process.exit(1);
});