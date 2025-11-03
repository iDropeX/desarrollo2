import mongoose from "mongoose";
const CategorySchema = new mongoose.Schema({
  nombre: { type: String, unique: true, required: true },
  descripcion: String,
  activo: { type: Boolean, default: true }
});
export default mongoose.model("Category", CategorySchema);