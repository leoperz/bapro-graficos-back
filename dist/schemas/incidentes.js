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
const IncidenteSchema = new mongoose_1.Schema({
    titulo: { required: true, type: String },
    descripcion: { required: true, type: String },
    fechaAlta: { required: false, type: Object },
    fechaAparicion: { required: false, type: Object },
    adjunto: { required: false, type: String },
    numeroSpring: { required: false, type: String },
    trxAsociada: { required: false, type: String },
    estado: { required: true, type: String }
});
exports.default = mongoose_1.default.model('Incidente', IncidenteSchema);
