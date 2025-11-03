import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AddressSchema = new mongoose.Schema({
  alias: String, calle: String, numero: String, depto: String,
  referencia: String, comuna: String, region: String, lat: Number, lng: Number,
  es_principal: { type: Boolean, default: false }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email:  { type: String, required: true, unique: true },
  telefono: String,
  hash_password: { type: String, required: true },
  roles: { type: [String], default: ["cliente"] },
  estado: { type: String, default: "activo" },
  direcciones: [AddressSchema]
}, { timestamps: { createdAt: "creado_en", updatedAt: "actualizado_en" } });

UserSchema.methods.setPassword = async function (plain) {
  this.hash_password = await bcrypt.hash(plain, 10);
};
UserSchema.methods.validatePassword = function (plain) {
  return bcrypt.compare(plain, this.hash_password);
};

export default mongoose.model("User", UserSchema);
