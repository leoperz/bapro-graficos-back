import Server from './clases/server';
import bodyParser from 'body-parser';
import cors from 'cors';
import {router} from './rest/rest.routes';
import mongoose from 'mongoose';


const server = Server.getInstancia();

//conexion a la base de datos no relacional
mongoose.connect('mongodb://localhost:27017/stackMean', (err)=>{
    if(err){
        throw err;
    }else{
        console.log('conexion a la base de datos correcta');
        
        
    }
});
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());
server.app.use(cors({origin:true, credentials:true}));
server.app.use('/', router);


server.start();
