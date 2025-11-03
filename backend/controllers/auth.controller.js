import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Token requerido" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
};
export const requireAdmin = (req, res, next) =>
  req.user?.roles?.includes("admin") ? next() : res.status(403).json({ message: "Solo admin" });

export async function register(req, res) {
  try {
    const { nombre, email, password } = req.body;
    const u = new User({ nombre, email, roles: ["cliente"] });
    await u.setPassword(password);
    await u.save();
    res.json({ message: "Usuario creado" });
  } catch (e) { res.status(400).json({ message: e.message }); }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u || !(await u.validatePassword(password)))
    return res.status(401).json({ message: "Credenciales inválidas" });

  const token = jwt.sign({ id: u._id, roles: u.roles }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: u._id, nombre: u.nombre, roles: u.roles } });
}
