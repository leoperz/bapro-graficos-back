"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const rest_routes_1 = require("./rest/rest.routes");
const mongoose_1 = __importDefault(require("mongoose"));
const server = server_1.default.getInstancia();
//conexion a la base de datos no relacional
mongoose_1.default.connect('mongodb://localhost:27017/stackMean', (err) => {
    if (err) {
        throw err;
    }
    else {
        console.log('conexion a la base de datos correcta');
    }
});
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
server.app.use(cors_1.default({ origin: true, credentials: true }));
server.app.use('/', rest_routes_1.router);
server.start();
