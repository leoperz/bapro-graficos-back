"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_1 = __importDefault(require("../schemas/usuario"));
const incidentes_1 = __importDefault(require("../schemas/incidentes"));
const equipos_1 = __importDefault(require("../schemas/equipos"));
const incidentes_rechazados_1 = __importDefault(require("../schemas/incidentes_rechazados"));
const bcrypt = require("bcrypt");
const moment = require("moment");
const metodos = __importStar(require("../metodos/metodos"));
const ensureAuth = __importStar(require("../middleware/authenticated"));
const metodos_1 = require("../metodos/metodos");
//PROBANDO EL SERVICIO DE SUBIDA MULTIPLE DE ARCHIVOS
const multer = require('multer');
const store = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './assets/img');
    },
    filename: function (req, file, cb) {
        cb(null, moment().date() + '-' + moment().month() + '-' + moment().year() + '.' + file.originalname);
    }
});
const upload = multer({ storage: store }).single('file');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './assets/img' });
const fs = require('fs');
const path = require('path');
const incidentes_asignados_1 = __importDefault(require("../schemas/incidentes_asignados"));
const server_1 = __importDefault(require("../clases/server"));
const incidentes_2 = __importDefault(require("../schemas/incidentes"));
const equipos_2 = __importDefault(require("../schemas/equipos"));
const lineChart_1 = require("../clases/lineChart");
exports.router = express_1.Router();
const lineChart = new lineChart_1.LineChart();
exports.router.post('/actualizarUsuario', (req, res) => {
    console.log('entra a actualizar usuario: ', req.body);
    let correo = req.body.correo;
    let updated = req.body;
    // se proteje con token 
    usuario_1.default.findOneAndUpdate({ correo }, updated, (err, data) => {
        if (err) {
            console.log(err);
            res.status(404).send({ messagge: "error en la peticion" });
        }
        if (!data) {
            res.status(404).send({ messagge: "no existe el usuario" });
        }
        else {
            res.status(200).send({
                usuario: data,
                token: metodos.cifrado(data)
            });
        }
    });
});
exports.router.post('/guardarUsuario', (req, res) => {
    console.log("Request que ingresa a guardarUsuario: ", req.body);
    const u = new usuario_1.default();
    let params = req.body;
    u.nombre = params.nombre;
    u.apellido = params.apellido;
    u.numeroLegajo = params.numeroLegajo;
    u.correo = params.correo;
    u.tecnologias = params.tecnologias;
    u.equipo = params.equipo;
    u.imagen = params.imagen;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("entra en el hash");
            u.password = hash;
            u.save((err, data) => {
                if (err) {
                    res.status(404).send({ message: err });
                }
                else {
                    res.json(data);
                }
            });
        }
    });
});
exports.router.post('/loguearUsuario', (req, res) => {
    let correo = req.body.correo;
    let password = req.body.password;
    correo = correo.toLowerCase();
    console.log(correo);
    usuario_1.default.findOne({ correo }, (err, data) => {
        console.log("entra al metodo loginUsuario");
        if (err) {
            res.status(404).send({ messagge: 'Error en la peticion' });
        }
        if (!data) {
            res.status(400).send({ messagge: 'No existe el usuario' });
        }
        else {
            bcrypt.compare(password, data.password, function (err, check) {
                if (check) {
                    res.status(200).send({
                        usuario: data,
                        token: metodos.cifrado(data)
                    });
                }
                else {
                    res.status(400).send({ messagge: 'usuario o contraseña incorrecta' });
                }
            });
        }
    });
});
exports.router.post('/adjuntarArchivoMultiple', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(404).send({ messagge: err });
        }
        else {
            console.log('nombreOriginal:', req.file.originalname, 'nombreSubido:', req.file.filename);
            res.json({ nombreOriginal: req.file.originalname, nombreSubido: req.file.filename });
        }
    });
});
exports.router.post('/adjuntarArchivo', [multipartMiddleware], (req, res) => {
    if (req.files) {
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[2];
        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'doc' || file_ext == 'docx' || file_ext == 'pdf') {
            res.json(file_name);
        }
        else {
            res.status(200).send({ messagge: 'Extension no permitida' });
        }
    }
});
exports.router.post('/subirImagen/:id', [ensureAuth.ensureAuth, multipartMiddleware], (req, res) => {
    let id = req.params.id;
    let file_name = 'Sin Imagen';
    if (req.files) {
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        file_name = file_split[2];
        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gift') {
            usuario_1.default.findByIdAndUpdate(id, { imagen: file_name }, (err, data) => {
                if (err) {
                    res.status(404).send({ messagge: 'Error al subir el archivo' });
                }
                else {
                    res.json({
                        messagge: 'Se ha guardado la imagen correctamente',
                        imagen: file_name
                    });
                }
            });
        }
        console.log(file_path);
    }
    else {
        res.status(200).send({ messagge: 'la imagen no se ha subido' });
    }
});
exports.router.get('/obtenerImagen/:imageFile', (req, res) => {
    console.log("entro a obtener imagen");
    let imageFile = req.params.imageFile;
    let aux = './assets/img/' + imageFile;
    fs.exists(aux, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(aux));
        }
        else {
            res.status(200).send({ messagge: 'No existe la imagen' });
        }
    });
});
exports.router.get('/descargarDocumento/:file', (req, res) => {
    let arch = req.params.file;
    const file = './assets/img/' + arch;
    res.download(file);
});
exports.router.post('/download', (req, res) => {
    res.sendFile(path.resolve('./assets/img/' + req.body.filename));
});
/*
    Metodos REST para la gestion de incidentes
*/
// Da de alta el incidente e informa mediante socket la cantidad total de incidentes
exports.router.post('/altaIncidente', (req, res) => {
    const server = server_1.default.getInstancia();
    var numero = 0;
    let fechaActual = {
        dia: moment().date(),
        mes: moment().month(),
        anio: moment().year()
    };
    const inc = new incidentes_1.default();
    let params = req.body;
    let correo = params.correo;
    inc.titulo = params.titulo;
    inc.descripcion = params.descripcion;
    inc.fechaAlta = fechaActual;
    inc.adjunto = params.adjunto;
    inc.estado = params.estado;
    inc.fechaAparicion = {
        dia: params.fecha_primer_reclamo.day,
        mes: params.fecha_primer_reclamo.month,
        anio: params.fecha_primer_reclamo.year
    };
    inc.numeroSpring = params.numeroSpring;
    inc.trxAsociada = params.trxAsociada;
    usuario_1.default.findOne({ correo }, (error, data) => {
        if (error) {
            res.status(404).send({ messagge: "Error en la peticion" });
        }
        if (data) {
            inc.usuario = data._id;
            inc.save((err, saved) => {
                if (err) {
                    res.status(404).send({ messagge: 'Error al guardar el incidente', data: err });
                }
                else {
                    //se dio de alta el incidente debo informar la cantidad total
                    incidentes_1.default.count((err, data) => {
                        if (err) {
                            console.log("error al consultar la cantidad de incidentes");
                        }
                        else {
                            console.log(data);
                            numero = data;
                            res.json(saved);
                            console.log(numero);
                            server.io.emit('cantidad-incidentes', numero);
                        }
                    });
                }
            });
        }
    });
});
exports.router.get('/cantidadIncidentes', (req, res) => {
    incidentes_2.default.count((err, data) => {
        if (!err) {
            res.json(data);
        }
    });
});
exports.router.get('/cantidadIncidentesPorEstado', (req, res) => {
    incidentes_2.default.aggregate([{
            $group: {
                _id: '$estado',
                count: { $sum: 1 }
            }
        }], (err, result) => {
        if (err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    });
});
exports.router.get('/incidentesNuevos', (req, res) => {
    incidentes_2.default.find({ estado: 'nuevo' }, (err, data) => {
        if (data) {
            res.json(data);
        }
        else {
            res.status(404).send({ messagge: 'Error al ejecutar la transaccion' });
        }
    }).populate('usuario');
});
exports.router.post('/incidentesAsignados', (req, res) => {
});
exports.router.get('/lineChart', (req, res) => {
    res.json(lineChart.getData());
});
exports.router.get('/equipos', (req, res) => {
    equipos_2.default.find((err, data) => {
        if (err) {
            res.json(err);
        }
        else {
            res.json(data);
        }
    });
});
exports.router.get('/generarGraficosMensuales', (req, res) => {
    const server = server_1.default.getInstancia();
    incidentes_1.default.aggregate([
        {
            $match: { estado: "nuevo" }
        },
        {
            $group: {
                _id: '$fechaAlta.mes',
                cantidad: { $sum: 1 }
            }
        },
    ], (error, data) => {
        if (data) {
            res.json(data);
            lineChart.generarGraficoIncidentesMensuales(data);
            server.io.emit('line-chart', lineChart.getData());
        }
        if (error) {
            res.json(error);
        }
    });
});
//logica de Socket!!
exports.router.post('/lineChart', (req, res) => {
    const mes = req.body.mes;
    const unidades = Number(req.body.unidades);
    const server = server_1.default.getInstancia();
    lineChart.cambiarValor(mes, unidades);
    server.io.emit('line-chart', lineChart.getData());
    res.json(lineChart.getData());
});
exports.router.post('/asignarIncidente', (req, res) => {
    const _idEquipo = req.body._idEquipo;
    const _idIncidente = req.body._idIncidente;
    const server = server_1.default.getInstancia();
    const inc_asig = new incidentes_asignados_1.default();
    //cambio el estado del incidente a Asignado antes de persistirlo.
    incidentes_1.default.findByIdAndUpdate(_idIncidente, { estado: "Asignado" }, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data) {
            inc_asig.equipo = _idEquipo;
            inc_asig.incidente = _idIncidente;
            inc_asig.save((err, data) => {
                if (data) {
                    res.json(data);
                    server.io.emit('incidentes-nuevos', data);
                }
                else {
                    res.status(404).send({ message: err });
                }
            });
        }
    });
});
exports.router.post('/mensajeprivado/:id', (req, res) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;
    const server = server_1.default.getInstancia();
    const payload = { de, cuerpo };
    server.io.in(id).emit('mensaje-privado', payload);
    res.json({
        de,
        cuerpo
    });
});
exports.router.get('/usuariosActivos', (req, res) => {
    const server = server_1.default.getInstancia();
    server.io.clients((err, clientes) => {
        if (err) {
            res.json({ err });
        }
        else {
            server.io.emit('usuarios-activos', metodos_1.usuariosConectados.getUsuarios());
            res.json({
                clientes: metodos_1.usuariosConectados.getUsuarios()
            });
        }
    });
});
//Deep Population
exports.router.get('/incidentesAsignados/:ids', (req, res) => {
    let _id = req.params.ids;
    incidentes_asignados_1.default.find({ equipo: { $in: _id } }, (err, data) => {
        if (err) {
            res.status(404).send({ message: 'Error al ejecutar la consulta' });
        }
        else {
            res.json(data);
        }
    }).populate('equipo').populate({
        path: 'incidente',
        model: 'Incidente',
        populate: {
            path: 'usuario',
            model: 'Usuario'
        }
    });
});
exports.router.post('/getEquiposPorId/', (req, res) => {
    equipos_1.default.find().where('_id').in(req.body).exec((err, data) => {
        if (err) {
            res.status(404).send({ err });
            console.log(err);
        }
        else {
            res.json(data);
        }
    });
});
exports.router.post('/cambiarEstadoIncidente/', (req, res) => {
    let id = req.body.id;
    let estado = req.body.estado;
    console.log(id, estado);
    incidentes_1.default.findByIdAndUpdate(id, { estado: estado }, (err, res) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(res);
        }
    });
});
exports.router.post('/guardarRechazados', (req, res) => {
    let recha = new incidentes_rechazados_1.default();
    recha.equipo = req.body.equipo;
    recha.incidente = req.body.incidente;
    recha.motivo = req.body.motivo;
    recha.save((err, data) => {
        if (err) {
            res.status(404).send({ err });
        }
        else {
            res.json(data);
        }
    });
});
