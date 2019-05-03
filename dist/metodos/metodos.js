"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jwt-simple"));
const moment = require("moment");
exports.desconectar = (cliente) => {
    cliente.on('disconnect', () => {
        console.log("cliente desconectado");
    });
};
exports.cifrado = (usuario) => {
    let payload = {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        numeroLegajo: usuario.numeroLegajo,
        correo: usuario.correo,
        password: usuario.password,
        tecnologias: usuario.tecnologias,
        equipo: usuario.equipo,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };
    return jwt.encode(payload, 'BancoProvincia');
};
