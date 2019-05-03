import * as jwt from "jwt-simple"; 

import moment = require("moment");

export const ensureAuth = (req:any, res:any, next:any)=>{
    if(!req.headers.authorization){
        return res.status(403).send({messagge:'La peticion no tiene la cabecera de autenticacion'});
    }else{
        
        let token:string = req.headers.authorization;
        //por si vienen comillas
        token.replace(/['¨]+/g, '');
        
        try {

            let payload = jwt.decode(token,'BancoProvincia');
            if(payload.exp <= moment().unix()){
                return res.status(403).send({messagge:'El token ha expirado'});
            }
            req.usuario = payload;
            
            
        } catch (error) {
            return res.status(404).send({message:'El token no es válido'});
        }
        next();
        
        
        
        
        
       

        

    }
};