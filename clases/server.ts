
import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import * as metodos from '../metodos/metodos';

export default class Server{

    private static instancia : Server;
    port : number = 5500;
    app: express.Application;
    private http: http.Server;
    public io: socketIO.Server;

    private constructor(){
        this.app = express();
        this.http = new http.Server(this.app);
        this.io = socketIO(this.http);
        this.clientesConectados();
        

    }

    public static getInstancia(){
        if(this.instancia == null){
            this.instancia = new this();
        }
        return this.instancia;
    }

    start(){
        this.http.listen(this.port, ()=>{
            console.log("servidor corriendo en el puerto:",this.port);
        });

    }


    //chequeamos clientes conectados

    private clientesConectados(){
       this.io.on('connection', cliente=>{
        console.log("nuevo client conectado: ", cliente.id, cliente.rooms);
        metodos.conectarCliente(cliente);
        metodos.desconectar(cliente, this.io);
        metodos.configurarUsuario(cliente, this.io);
        metodos.getMensaje(cliente, this.io);
        metodos.mensajesDeSala(cliente, this.io);
       });
    }





}
