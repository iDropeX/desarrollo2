import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const createFromCart = async (req, res) => {
  const { direccion_entrega, metodo_pago="efectivo" } = req.body;
  const cart = await Cart.findOne({ usuario_id: req.user.id });
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Carrito vacío" });

  const total = cart.items.reduce((s,i)=> s + i.precio_unit*i.cantidad, 0);
  const order = await Order.create({
    usuario_id: req.user.id,
    estado: "creado",
    direccion_entrega,
    items: cart.items.map(i => ({ ...i.toObject(), subtotal: i.precio_unit*i.cantidad })),
    pago: { metodo: metodo_pago, estado: "pendiente", total, fecha: new Date() },
    tiempo_estimado: { minutos: 30, fuente: "regla base", calculado_en: new Date() }
  });

  cart.items = []; cart.total = 0; await cart.save();
  res.json(order);
};

export const listMine = async (req, res) =>
  res.json(await Order.find({ usuario_id: req.user.id }).sort({ creado_en: -1 }).lean());

export const updateEstado = async (req, res) =>
  res.json(await Order.findByIdAndUpdate(req.params.id, { estado: req.body.estado }, { new: true }));
