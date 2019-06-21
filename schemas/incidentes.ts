import mongoose, {Schema, Document} from 'mongoose';



export interface Incidente extends Document{
    titulo: string,
    descripcion: string,
    fechaAlta:{
        dia:number,
        mes:number,
        año:number
    }
    fechaAparicion:{
        dia:number,
        mes:number,
        año:number
    }
    adjunto:string,
    numeroSpring:string,
    trxAsociada: string,
    estado:string,
    usuario : string
   

}
const IncidenteSchema : Schema = new Schema({
    titulo:{required: true, type: String},
    descripcion:{required: true, type: String},
    fechaAlta: {required: false, type: Object},
    fechaAparicion:{required: false, type: Object},
    adjunto: {required: false, type: String},
    numeroSpring: {required: false, type: String},
    trxAsociada:{required: false, type: String},
    estado: {required:true, type:String},
    usuario: {required:true, type: Schema.Types.ObjectId, ref:"Usuario" }
});

export default mongoose.model<Incidente>('Incidente', IncidenteSchema);