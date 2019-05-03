import mongoose, {Schema, Document} from 'mongoose';

export interface Usuario extends Document{
    nombre: string,
    apellido: string,
    numeroLegajo: string,
    correo: string,
    tecnologias:string[],
    equipo:string,
    password:string,
    imagen:string,
    
}

const UsuarioSchema: Schema = new Schema({
    nombre: {type: String, required: true},
    apellido: {type: String, required:true},
    numeroLegajo: {type:String, required: true},
    correo: {type:String, required:false , unique: true},
    tecnologias:{type:Array, required: true},
    equipo:{type:String, required: true},
    password:{type: String, required: true},
    imagen:{type:String }
    
});

export default mongoose.model<Usuario>('Usuario', UsuarioSchema);