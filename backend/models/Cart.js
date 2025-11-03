import mongoose from "mongoose";

const RollConfigSchema = new mongoose.Schema({
  ingredientes: [{
    ingrediente_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient", required: true },
    cantidad: Number, unidad: String
  }],
  notas: String
}, { _id: false });

const CartItemSchema = new mongoose.Schema({
  producto_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  nombre_producto: String,
  precio_unit: Number,
  cantidad: { type: Number, default: 1 },
  notas: String,
  configuracion_roll: RollConfigSchema
}, { _id: false });

const CartSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  estado: { type: String, default: "activo" }, // activo|cerrado
  items: [CartItemSchema],
  total: { type: Number, default: 0 }
}, { timestamps: { createdAt: "creado_en", updatedAt: "actualizado_en" } });

export default mongoose.model("Cart", CartSchema);