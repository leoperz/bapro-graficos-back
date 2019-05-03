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
exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ messagge: 'La peticion no tiene la cabecera de autenticacion' });
    }
    else {
        let token = req.headers.authorization;
        //por si vienen comillas
        token.replace(/['¨]+/g, '');
        try {
            let payload = jwt.decode(token, 'BancoProvincia');
            if (payload.exp <= moment().unix()) {
                return res.status(403).send({ messagge: 'El token ha expirado' });
            }
            req.usuario = payload;
        }
        catch (error) {
            return res.status(404).send({ message: 'El token no es válido' });
        }
        next();
    }
};
