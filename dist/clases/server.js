"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
class Server {
    constructor() {
        this.port = 5500;
        this.app = express_1.default();
        this.http = new http_1.default.Server(this.app);
        this.io = socket_io_1.default(this.http);
        this.clientesConectados();
    }
    static getInstancia() {
        if (this.instancia == null) {
            this.instancia = new this();
        }
        return this.instancia;
    }
    start() {
        this.http.listen(this.port, () => {
            console.log("servidor corriendo en el puerto:", this.port);
        });
    }
    //chequeamos clientes conectados
    clientesConectados() {
        this.io.on('connection', cliente => {
            console.log("nuevo client conectado: ", cliente.id);
        });
    }
}
exports.default = Server;
