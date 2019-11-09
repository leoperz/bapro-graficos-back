import mongoose, {Schema, Document} from 'mongoose';

export interface Incidentes_rechazados extends Document{

    equipo: string,
    incidente:string,
    motivo:string
}

const Incidentes_rechazados_Schema: Schema = new Schema({
    equipo: {required: true, type: Schema.Types.ObjectId, ref:"Equipo"},
    incidente:{required: true, type: Schema.Types.ObjectId, ref:"Incidente"},
    motivo:{required:true, type: String}
});

export default mongoose.model<Incidentes_rechazados>('Incidentes_rechazados', Incidentes_rechazados_Schema);
