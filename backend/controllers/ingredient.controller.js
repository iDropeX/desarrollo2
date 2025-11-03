import Ingredient from "../models/Ingredient.js";
export const list   = async (_req, res) => res.json(await Ingredient.find().lean());
export const create = async (req, res) => res.json(await Ingredient.create(req.body));
export const update = async (req, res) => res.json(await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new:true }));
export const remove = async (req, res) => { await Ingredient.findByIdAndDelete(req.params.id); res.json({ ok:true }); };
