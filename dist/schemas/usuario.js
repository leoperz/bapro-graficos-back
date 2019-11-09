"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UsuarioSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    numeroLegajo: { type: String, required: true },
    correo: { type: String, required: false, unique: true },
    tecnologias: { type: Array, required: true },
    equipo: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Equipo", required: true }],
    password: { type: String, required: true },
    imagen: { type: String }
});
exports.default = mongoose_1.default.model('Usuario', UsuarioSchema);
