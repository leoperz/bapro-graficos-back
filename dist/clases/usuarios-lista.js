"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UsuariosLista {
    constructor() {
        this.usuarios = [];
    }
    agregar(usuario) {
        this.usuarios.push(usuario);
        return usuario;
    }
    actualizarNombreySala(id, nombre, sala) {
        for (let item of this.usuarios) {
            if (item.id === id) {
                item.nombre = nombre;
                item.sala = sala;
                break;
            }
        }
    }
    getUsuarios() {
        return this.usuarios;
    }
    getUsuario(id) {
        return this.usuarios.find(usuario => usuario.id === id);
    }
    getUsuariosDeSaLa(sala) {
        return this.usuarios.filter(usuarios => usuarios.sala === sala);
    }
    borrarUsuario(id) {
        const tempUsuario = this.getUsuario(id);
        this.usuarios = this.usuarios.filter(usuarios => usuarios.id !== id);
    }
}
exports.UsuariosLista = UsuariosLista;
