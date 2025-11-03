import { Router } from "express";
import { createFromCart, listMine, updateEstado } from "../controllers/order.controller.js";
import { requireAuth } from "../controllers/auth.controller.js";
const r = Router();
r.post("/", requireAuth, createFromCart);
r.get("/", requireAuth, listMine);
r.patch("/:id/estado", requireAuth, updateEstado);
export default r;