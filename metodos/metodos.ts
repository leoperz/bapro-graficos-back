import { Socket } from "socket.io";
import * as jwt from "jwt-simple"; 
import { Usuario } from "../schemas/usuario";
import moment = require("moment");

export const desconectar = ( cliente:Socket)=>{
    cliente.on('disconnect', ()=>{
        console.log("cliente desconectado");
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