import mongoose, {Schema, Document} from 'mongoose';
import { ObjectID } from 'bson';

export interface Notificacion extends Document{
    mensaje: string,
    equipo:String,
    fecha:string,
    leido: boolean;
    usuario:string;

    
}

const NotificacionSchema: Schema = new Schema({
    mensaje:{type: String, required:true},
    equipo:{type:String, required:true},
    fecha:{type:String, required:true},
    leido:{type:Boolean, required:true},
    usuario:{type:String, required:true}
});

export default mongoose.model<Notificacion>('Notificacion', NotificacionSchema);