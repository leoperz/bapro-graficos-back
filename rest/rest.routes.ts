import {Request, Response, Router} from 'express';
import  usuario from '../schemas/usuario';
import incidente from '../schemas/incidentes';
import equipo from '../schemas/equipos';
import rechazados from '../schemas/incidentes_rechazados';
import bcrypt = require("bcrypt");
import moment = require("moment");
import * as metodos from '../metodos/metodos';
import * as ensureAuth from '../middleware/authenticated';
import {usuariosConectados} from '../metodos/metodos';

//PROBANDO EL SERVICIO DE SUBIDA MULTIPLE DE ARCHIVOS
const multer = require('multer');

const store = multer.diskStorage({
    destination:function(req: any,file:any, cb:any){
        cb(null, './assets/img');
    },
    filename:function(req:any, file:any,cb:any ){
        cb(null, moment().date() +'-'+ moment().month()+ '-' + moment().year() +'.'+file.originalname);
    }
});

const upload = multer({storage:store}).single('file');



const multipart = require('connect-multiparty');
const multipartMiddleware = multipart( {uploadDir: './assets/img'});
const fs = require('fs');
const path = require('path');

import incidentes_asignados from '../schemas/incidentes_asignados'

import Server from '../clases/server';
import incidentes from '../schemas/incidentes';
import equipos from '../schemas/equipos'
import { LineChart } from '../clases/lineChart';








export const router = Router();
const lineChart = new LineChart(); 

router.post('/actualizarUsuario', (req:Request, res:Response)=>{
console.log('entra a actualizar usuario: ', req.body);
let correo = req.body.correo;
let updated = req.body;

// se proteje con token 

usuario.findOneAndUpdate({correo}, updated , (err, data)=>{
    if(err){
        console.log(err);
        res.status(404).send({messagge:"error en la peticion"});
    }
    if(!data){
        res.status(404).send({messagge:"no existe el usuario"});
    }
    else{
            res.status(200).send({
            usuario: data,
            token: metodos.cifrado(data)
        });
    }   
} );
 
});


router.post('/guardarUsuario', (req:Request, res:Response)=>{
    console.log("Request que ingresa a guardarUsuario: ", req.body);
    
    
    
    const u = new usuario();
    let params = req.body;
    u.nombre = params.nombre;
    u.apellido = params.apellido;
    u.numeroLegajo = params.numeroLegajo;
    u.correo = params.correo;
    u.tecnologias = params.tecnologias;
    u.equipo = params.equipo;
    u.imagen = params.imagen;


    bcrypt.hash(req.body.password, 10,(err, hash)=>{
       if(err){
           console.log(err);
       }else{
           console.log("entra en el hash")
           u.password = hash;

           u.save((err, data)=>{
            if(err){
                res.status(404).send({message:err});
            }else{
                res.json(data);
            }
        });
       }
    });
   
});

router.post('/loguearUsuario', (req:Request, res:Response)=>{
    
   let correo = req.body.correo;
   let password = req.body.password;
   correo = correo.toLowerCase();
   console.log(correo);
   usuario.findOne({correo}, (err, data)=>{
       console.log("entra al metodo loginUsuario");
       if(err){
           res.status(404).send({messagge:'Error en la peticion'});
       }
       if(!data){
           res.status(400).send({messagge: 'No existe el usuario'});
       }else{
           bcrypt.compare(password, data.password, function(err, check){
                if(check){
                  
                    res.status(200).send({
                        usuario:data,
                        token: metodos.cifrado(data)
                    });
                }else{
                    res.status(400).send({messagge:'usuario o contraseña incorrecta'})
                }
           });
       }
   });
   
    });

    router.post('/adjuntarArchivoMultiple',(req:any, res:Response)=>{
      upload(req, res, (err:any)=>{
          if(err){
            return res.status(404).send({messagge: err});
          }else{
              console.log('nombreOriginal:', req.file.originalname, 'nombreSubido:', req.file.filename)
              res.json({nombreOriginal:req.file.originalname, nombreSubido:req.file.filename});
          }

      })
    });


    



    router.post('/adjuntarArchivo',[multipartMiddleware],(req:any, res:Response)=>{
        if(req.files){
            let file_path = req.files.image.path;
            let file_split = file_path.split('\\');
            let file_name = file_split[2];
            let ext_split =     file_name.split('\.');
            let file_ext = ext_split[1];

            if(file_ext =='png'|| file_ext =='jpg'|| file_ext =='jpeg'|| file_ext =='doc' || file_ext == 'docx' || file_ext == 'pdf'){
                res.json(file_name);
            }else{
                res.status(200).send({messagge:'Extension no permitida'});
            }
        }
    });


    router.post('/subirImagen/:id',[ensureAuth.ensureAuth, multipartMiddleware] ,(req:any, res: Response)=>{
        
        
        let id = req.params.id;
        
        let file_name = 'Sin Imagen';
       
        if(req.files){
            
            let file_path = req.files.image.path;
            let file_split = file_path.split('\\');
            file_name = file_split[2];
            let ext_split = file_name.split('\.');
            let file_ext = ext_split[1];

            if(file_ext =='png'|| file_ext =='jpg'|| file_ext =='jpeg'|| file_ext =='gift'){
                usuario.findByIdAndUpdate(id, {imagen:file_name}, (err , data)=>{
                    if(err){
                        res.status(404).send({messagge:'Error al subir el archivo'});
                    }else{
                        res.json({
                            messagge:'Se ha guardado la imagen correctamente',
                            imagen:file_name
                        });
                    }
                });
            }
            
            console.log(file_path);
        }else{
            res.status(200).send({messagge: 'la imagen no se ha subido'});
        }

        
    });


router.get('/obtenerImagen/:imageFile',(req:Request, res:Response)=>{
    console.log("entro a obtener imagen");
    let imageFile = req.params.imageFile;
    let aux = './assets/img/'+imageFile;
    fs.exists(aux, function(exists:any){
        if(exists){
            res.sendFile(path.resolve(aux));
        }else{
            res.status(200).send({messagge:'No existe la imagen'});
        }
    });
});

router.get('/descargarDocumento/:file', (req:Request, res:Response)=>{
    let arch = req.params.file;
    const file = './assets/img/'+arch ;
    res.download(file);
});

router.post('/download', (req:Request, res:Response)=>{
	res.sendFile(path.resolve('./assets/img/'+req.body.filename));

});
    



/*
    Metodos REST para la gestion de incidentes
*/


// Da de alta el incidente e informa mediante socket la cantidad total de incidentes
router.post('/altaIncidente',(req:Request, res:Response)=>{
   
   
   

    const server =  Server.getInstancia();
    var numero: number=0;

    let fechaActual:any = {
        dia : moment().date(),
        mes: moment().month(),
        anio: moment().year()
    }
    
    
    const inc = new incidente();
    let params = req.body;
    let correo = params.correo;
    
    inc.titulo = params.titulo;
    inc.descripcion = params.descripcion;
    inc.fechaAlta = fechaActual;
    inc.adjunto = params.adjunto;
    inc.estado = params.estado;
    inc.fechaAparicion  = {
        dia:  params.fecha_primer_reclamo.day,
        mes : params.fecha_primer_reclamo.month,
        anio : params.fecha_primer_reclamo.year
    }
    inc.numeroSpring = params.numeroSpring;
    inc.trxAsociada = params.trxAsociada
    
    usuario.findOne({correo}, (error, data)=>{
        if(error){
            res.status(404).send({messagge:"Error en la peticion"});
        }
        if(data){
            
            inc.usuario = data._id;
            inc.save((err, saved)=>{
                if(err){
                    res.status(404).send({messagge:'Error al guardar el incidente', data: err});
                }else{
        
                   //se dio de alta el incidente debo informar la cantidad total
                   incidente.count((err:any, data:number)=>{
                    
                  if(err){
                      console.log("error al consultar la cantidad de incidentes");
        
                  }else{
                      console.log(data);
                      numero = data;
                      
                      res.json(saved);
                   console.log(numero);
                   server.io.emit('cantidad-incidentes',numero);
                  }
        
                   });
                   
                  
                   
                }
            });
        }
    });

    
   

    

});


router.get('/cantidadIncidentes',(req:Request, res:Response)=>{
    incidentes.count((err:any, data:number)=>{
        if(!err){
            res.json(data);
        }
    });
});

router.get('/cantidadIncidentesPorEstado', (req:Request, res:Response)=>{
  
    incidentes.aggregate([{
        $group:{
            _id:'$estado',
            count:{$sum:1}
        }
    }], 
        (err:any, result:any)=>{
            if(err){
                res.json(err);
            }else{
                res.json(result);
            }
        }
    );
});


router.get('/incidentesNuevos', (req:Request, res:Response)=>{
    
    incidentes.find({estado:'nuevo'},(err, data)=>{
        if(data){
            res.json(data);
        }else{
            res.status(404).send({messagge:'Error al ejecutar la transaccion'});
        }
    }).populate('usuario');
});

router.post('/incidentesAsignados', (req:Request, res:Response)=>{
    
})




router.get('/lineChart', (req:Request, res:Response)=>{
    res.json(lineChart.getData());
});





router.get('/equipos', (req:Request, res:Response)=>{
    equipos.find((err, data)=>{
        if(err){
            res.json(err);
        }else{
            res.json(data);
        }
    });
});

router.get('/generarGraficosMensuales', (req:Request, res:Response)=>{
    const server = Server.getInstancia();
    incidente.aggregate([
        
      {
            $match:{estado:"nuevo"}
        },
        
        {
            $group:{
                _id:'$fechaAlta.mes',
                
                cantidad:{$sum:1}
            }
        }, 
       
    ], (error:any, data:[])=>{
        if(data){
            res.json(data);
            lineChart.generarGraficoIncidentesMensuales(data);
            server.io.emit('line-chart', lineChart.getData());
            
        }
        if(error){
            res.json(error);
        }
    }
    
    );
    
});



//logica de Socket!!
router.post('/lineChart', (req:Request, res:Response)=>{
    const mes = req.body.mes;
    
    
    
    const unidades = Number(req.body.unidades);
    const server = Server.getInstancia();

    lineChart.cambiarValor(mes,unidades);
    
    server.io.emit('line-chart', lineChart.getData());
    res.json(lineChart.getData());
    
});



router.post('/asignarIncidente', (req:Request, res:Response)=>{
    const _idEquipo = req.body._idEquipo;
    const _idIncidente = req.body._idIncidente;
    const server = Server.getInstancia();
    const inc_asig = new incidentes_asignados();

    //cambio el estado del incidente a Asignado antes de persistirlo.
    incidente.findByIdAndUpdate(_idIncidente,{estado:"Asignado"}, (err, data)=>{
        if(err){
            console.log(err);
        }if(data){
            inc_asig.equipo = _idEquipo;
            inc_asig.incidente = _idIncidente;
            inc_asig.save((err, data)=>{
                if(data){
                    res.json(data);
                    server.io.emit('incidente-asignados', data);
                }else{
                    res.status(404).send({message: err});
                }
            });
        }
    });
});


router.post('/mensajeprivado/:id', (req:Request, res:Response)=>{
    const cuerpo = req.body.cuerpo;
    const de  = req.body.de;
    const id = req.params.id;
    const server = Server.getInstancia();
    const payload = {de, cuerpo};
    server.io.in(id).emit('mensaje-privado', payload);
    res.json({
        de,
        cuerpo
    });
});


router.get('/usuariosActivos', (req:Request, res:Response)=>{
    const server = Server.getInstancia();
    
    
    server.io.clients((err:any, clientes:any)=>{
        if(err){
            res.json({err});
        }else{
            server.io.emit('usuarios-activos', usuariosConectados.getUsuarios());
            res.json({
                
                clientes:usuariosConectados.getUsuarios()});
        }

    });
});


//Deep Population
router.get('/incidentesAsignados/:ids', (req:Request, res:Response)=>{

    let _id = req.params.ids;
    
        incidentes_asignados.find({equipo: {$in:_id}}, (err, data)=>{
            if(err){
                res.status(404).send({message:'Error al ejecutar la consulta'});
            }else{
                res.json(data);
            }
        }).populate('equipo').populate({
            path:'incidente',
            model:'Incidente',
            populate:{
                path:'usuario',
                model:'Usuario'
            }
        })
        });
    
    
   


router.post('/getEquiposPorId/', (req:Request, res:Response)=>{
    
   
    
    equipo.find().where('_id').in(req.body).exec((err, data)=>{
        if(err){
            res.status(404).send({err});
            console.log(err);
        }else{
            res.json(data);
            
        }
    });
});

router.post('/cambiarEstadoIncidente/', (req:Request, res:Response)=>{
   
    let id = req.body.id;
    let estado = req.body.estado;

    console.log(id, estado);
    incidente.findByIdAndUpdate(id,{estado: estado}, 
        
        (err, res)=>{
            if(err){
                console.log(err);
            }else{
                console.log(res);
            }
        }
        
        );

    
});


router.post('/guardarRechazados', (req:Request, res:Response)=>{
    let recha = new rechazados();
   
    recha.equipo = req.body.equipo;
    recha.incidente = req.body.incidente;
    recha.motivo = req.body.motivo;

    recha.save((err, data)=>{
        if(err){
            res.status(404).send({err});
        }else{
            res.json(data);
        }
    });
});

 



