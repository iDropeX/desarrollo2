import mongoose from "mongoose";
const IngredientSchema = new mongoose.Schema({
  nombre: { type: String, unique: true, required: true },
  tipo: String, costo: Number,
  activo: { type: Boolean, default: true }
});
export default mongoose.model("Ingredient", IngredientSchema);