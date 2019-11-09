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
const Incidentes_rechazados_Schema = new mongoose_1.Schema({
    equipo: { required: true, type: mongoose_1.Schema.Types.ObjectId, ref: "Equipo" },
    incidente: { required: true, type: mongoose_1.Schema.Types.ObjectId, ref: "Incidente" },
    motivo: { required: true, type: String }
});
exports.default = mongoose_1.default.model('Incidentes_rechazados', Incidentes_rechazados_Schema);
