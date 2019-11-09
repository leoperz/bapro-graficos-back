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
const usuarios_lista_1 = require("../clases/usuarios-lista");
const moment = require("moment");
const usuario_1 = require("../clases/usuario");
exports.usuariosConectados = new usuarios_lista_1.UsuariosLista();
exports.desconectar = (cliente, io) => {
    cliente.on('disconnect', () => {
        console.log("cliente desconectado");
        exports.usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos', exports.usuariosConectados.getUsuarios());
    });
};
exports.conectarCliente = (cliente) => {
    const u = new usuario_1.claseUsuario(cliente.id);
    exports.usuariosConectados.agregar(u);
};
exports.getMensaje = (cliente, io) => {
    cliente.on('mensaje', (data) => {
        console.log('mensaje recibido: ', data);
        io.emit('mensaje-general', data); //-> una vez recibido lo emito de forma general
        io.to(data.id).emit('mensaje-privado', data); //=> una vez recibido lo emito de forma privada
        io.emit('incidente-asignado', { room: data.sala, msg: data.mensaje }); //=> una vez recibido lo emito a los id de la sala.
    });
};
exports.configurarUsuario = (cliente, io) => {
    cliente.on('configurar-usuario', (payload) => {
        exports.usuariosConectados.actualizarNombreySala(cliente.id, payload.correo, payload.equipo);
        cliente.join(payload.equipo);
        io.emit('usuarios-activos', exports.usuariosConectados.getUsuarios());
    });
};
exports.mensajesDeSala = (cliente, io) => {
    cliente.on('mensaje-sala', data => {
        io.to(data.sala).emit('mensaje-sala-srv', data);
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
