import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

async function ensureCart(userId) {
  let cart = await Cart.findOne({ usuario_id: userId });
  if (!cart) cart = await Cart.create({ usuario_id: userId, items: [], total: 0 });
  return cart;
}

export const getMyCart = async (req, res) => res.json(await ensureCart(req.user.id));

export const addItem = async (req, res) => {
  const { producto_id, cantidad = 1, notas, configuracion_roll } = req.body;
  const p = await Product.findById(producto_id);
  if (!p) return res.status(404).json({ message: "Producto no existe" });

  const cart = await ensureCart(req.user.id);
  cart.items.push({
    producto_id, nombre_producto: p.nombre, precio_unit: p.precio,
    cantidad, notas, configuracion_roll
  });
  cart.total = cart.items.reduce((s,i)=> s + i.precio_unit*i.cantidad, 0);
  await cart.save();
  res.json(cart);
};

export const removeItem = async (req, res) => {
  const cart = await ensureCart(req.user.id);
  cart.items.splice(parseInt(req.params.idx), 1);
  cart.total = cart.items.reduce((s,i)=> s + i.precio_unit*i.cantidad, 0);
  await cart.save();
  res.json(cart);
};
