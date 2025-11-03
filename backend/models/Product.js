import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  url: String, alt: String, es_portada: { type: Boolean, default: false }
}, { _id: false });

const ProductIngredientSchema = new mongoose.Schema({
  ingrediente_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient", required: true },
  cantidad: Number, unidad: String
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  sku: { type: String, unique: true },
  activo: { type: Boolean, default: true },
  categoria_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  estado: { type: String, default: "activo" },
  imagenes: [ImageSchema],
  ingredientes: [ProductIngredientSchema]
}, { timestamps: true });

ProductSchema.index({ nombre: "text", descripcion: "text" });

export default mongoose.model("Product", ProductSchema);