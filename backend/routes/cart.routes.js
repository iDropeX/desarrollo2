import { Router } from "express";
import { getMyCart, addItem, removeItem } from "../controllers/cart.controller.js";
import { requireAuth } from "../controllers/auth.controller.js";
const r = Router();
r.get("/", requireAuth, getMyCart);
r.post("/items", requireAuth, addItem);
r.delete("/items/:idx", requireAuth, removeItem);
export default r;