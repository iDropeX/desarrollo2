import { Router } from "express";
import { list, create, update, remove } from "../controllers/category.controller.js";
import { requireAuth, requireAdmin } from "../controllers/auth.controller.js";
const r = Router();
r.get("/", list);
r.post("/", requireAuth, requireAdmin, create);
r.put("/:id", requireAuth, requireAdmin, update);
r.delete("/:id", requireAuth, requireAdmin, remove);
export default r;