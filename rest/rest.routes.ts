import {Request, Response, Router} from 'express';
import  usuario from '../schemas/usuario';
import bcrypt = require("bcrypt");
import * as metodos from '../metodos/metodos';
import * as ensureAuth from '../middleware/authenticated';
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart( {uploadDir: './assets/img'});
const fs = require('fs');
const path = require('path');
import incidente from '../schemas/incidentes';
import moment = require("moment");





export const router = Router();

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


    router.post('/subirImagen/:id',[ensureAuth.ensureAuth, multipartMiddleware] ,(req:any, res: Response)=>{
        
        
        let id = req.params.id;
        
        let file_name = 'Sin Imagen';
       
        if(req.files){
            
            let file_path = req.files.image.path;
            let file_split = file_path.split('\\');
            file_name = file_split[2];
            let ext_split =     file_name.split('\.');
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


/*
    Metodos REST para la gestion de incidentes
*/

router.post('/altaIncidente',(req:Request, res:Response)=>{
    
    let fechaActual:any = {
        dia : moment().date(),
        mes: moment().month(),
        año: moment().year()
    }
    
    
    const inc = new incidente();
    let params = req.body;
    console.log(params);
    inc.titulo = params.incidentes;
    inc.descripcion = params.descripcion;
    /*inc.fechaAlta = fechaActual;
    inc.fechaAparicion = params.fecha_primer_reclamo;
    inc.adjunto = params.adjunto;
    inc.numeroSpring = params.numeroSpring;
    inc.trxAsociada = params.trxAsociada*/
    res.json(inc);

    inc.save((err, data)=>{
        if(err){
            res.status(404).send({messagge:'Error al guardar el incidente'});
        }else{
            res.json(data);
        }
    });

    

});


 



