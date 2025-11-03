import mongoose from "mongoose";

const AddressSnap = new mongoose.Schema({
  alias:String, calle:String, numero:String, depto:String, referencia:String,
  comuna:String, region:String, lat:Number, lng:Number
}, { _id:false });

const OrderItem = new mongoose.Schema({
  producto_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  nombre_producto: String, precio_unit: Number, cantidad: Number, subtotal: Number,
  configuracion_roll: {
    ingredientes: [{
      ingrediente_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
      cantidad: Number, unidad: String
    }],
    notas: String
  }
}, { _id:false });

const Payment = new mongoose.Schema({
  metodo: String, estado: { type: String, default: "pendiente" },
  transaccion_id: String, total: Number, fecha: Date
}, { _id:false });

const ETA = new mongoose.Schema({
  minutos: Number, fuente: String, calculado_en: Date
}, { _id:false });

const OrderSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  estado: { type: String, default: "creado" },
  direccion_entrega: AddressSnap,
  items: { type: [OrderItem], default: [] },
  pago: Payment,
  tiempo_estimado: ETA,
  observaciones: String
}, { timestamps: { createdAt: "creado_en", updatedAt: "actualizado_en" } });

export default mongoose.model("Order", OrderSchema);