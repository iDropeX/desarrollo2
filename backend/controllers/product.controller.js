import Product from "../models/Product.js";

export async function list(req, res) {
  const { q, categoria_id, estado, page=1, limit=12 } = req.query;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (categoria_id) filter.categoria_id = categoria_id;
  if (estado) filter.estado = estado;
  const data = await Product.find(filter).skip((+page-1)*+limit).limit(+limit).lean();
  res.json(data);
}
export const get    = async (req, res) => res.json(await Product.findById(req.params.id).lean());
export const create = async (req, res) => res.json(await Product.create(req.body));
export const update = async (req, res) => res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new:true }));
export const remove = async (req, res) => { await Product.findByIdAndDelete(req.params.id); res.json({ ok:true }); };
