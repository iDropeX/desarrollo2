import Category from "../models/Category.js";
export const list   = async (_req, res) => res.json(await Category.find().lean());
export const create = async (req, res) => res.json(await Category.create(req.body));
export const update = async (req, res) => res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new:true }));
export const remove = async (req, res) => { await Category.findByIdAndDelete(req.params.id); res.json({ ok:true }); };
