import { Socket } from "socket.io";
import * as jwt from "jwt-simple"; 
import { Usuario } from "../schemas/usuario";
import {UsuariosLista} from '../clases/usuarios-lista';
import moment = require("moment");
import {claseUsuario} from '../clases/usuario';

export const usuariosConectados = new UsuariosLista();


export const desconectar = ( cliente:Socket, io:SocketIO.Server)=>{
    cliente.on('disconnect', ()=>{
        console.log("cliente desconectado");
        usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos', usuariosConectados.getUsuarios());
        

    });
}

export const conectarCliente = (cliente:Socket)=>{
  const  u = new claseUsuario(cliente.id);
    
    usuariosConectados.agregar(u);

}

export const getMensaje = (cliente:Socket, io:SocketIO.Server)=>{
    cliente.on('mensaje', (data)=>{
        console.log('mensaje recibido: ', data);
        io.emit('mensaje-general',data);//-> una vez recibido lo emito de forma general
        io.to(data.id).emit('mensaje-privado', data); //=> una vez recibido lo emito de forma privada
        io.emit('incidente-asignado',{room: data.sala, msg: data.mensaje}); //=> una vez recibido lo emito a los id de la sala.
    });
}

export const configurarUsuario = (cliente: Socket, io: SocketIO.Server)=>{
    
    
    cliente.on('configurar-usuario' , (payload)=>{
        
        
        usuariosConectados.actualizarNombreySala(cliente.id, payload.correo, payload.equipo);
        cliente.join(payload.equipo); 
        

        io.emit('usuarios-activos', usuariosConectados.getUsuarios());
        
        
    } );
}

export const mensajesDeSala = (cliente: Socket, io:SocketIO.Server)=>{
    cliente.on('mensaje-sala', data=>{
        console.log('mensaje-sala', data);
        io.to(data.sala).emit('mensaje-sala-srv', data);
    });
}




export const cifrado = (usuario: Usuario)=>{
    
    let payload = {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        numeroLegajo: usuario.numeroLegajo,
        correo: usuario.correo,
        password: usuario.password,
        tecnologias:usuario.tecnologias,
        equipo: usuario.equipo,
        iat: moment().unix(),
        exp : moment().add(30,'days').unix
        
    };
    
    return jwt.encode(payload, 'BancoProvincia');

        

    
    
   
}