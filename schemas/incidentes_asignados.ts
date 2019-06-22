import mongoose, {Schema, Document} from 'mongoose';

export interface Incidentes_Asignados extends Document{

    equipo:string,
    incidente:string
}

const Incidentes_Asignados_Schema : Schema = new Schema({

    equipo : {required: true, type: Schema.Types.ObjectId, ref:"Equipo"},
    incidente: {required: true, type: Schema.Types.ObjectId, ref:"Incidente"}

   
});

export default mongoose.model<Incidentes_Asignados>('Incidentes_Asignados', Incidentes_Asignados_Schema);