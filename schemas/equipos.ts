import mongoose, {Schema, Document} from 'mongoose';

export interface Equipo extends Document{
    nombre: string;
}

const EquipoSchema: Schema = new Schema({
    nombre:{required: true, type: String}
});


export default mongoose.model<Equipo>('Equipo', EquipoSchema);