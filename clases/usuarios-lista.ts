import { claseUsuario } from "./usuario";


export class UsuariosLista{

    private usuarios: claseUsuario[] = [];

    constructor(){

    }

    public agregar(usuario:claseUsuario){
        this.usuarios.push(usuario);
        
        return usuario;
    }

    public actualizarNombreySala(id:string, nombre:string, sala:string){
        for( let item of this.usuarios){
            if(item.id === id){
                item.nombre = nombre;
                item.sala = sala;
                break;
            }
        }
    }

  

    public getUsuarios(){
        
        return this.usuarios;
    }

    public getUsuario(id:string){
        return this.usuarios.find( usuario => usuario.id === id );
    }

    public getUsuariosDeSaLa(sala:String){
        return  this.usuarios.filter(usuarios => usuarios.sala === sala);

    }

    public borrarUsuario(id:string){
        const tempUsuario = this.getUsuario(id);
        this.usuarios = this.usuarios.filter(usuarios => usuarios.id !== id);
        

    }
}