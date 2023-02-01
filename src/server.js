import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import 'reflect-metadata';
import dbConnect from './database/config.js';
import routes from './routes/main_routes.js'
import cors from 'cors';
import fileUpload from 'express-fileupload';

export class Server {
    static _instance;
    port;
    app;

    constructor() {
        this.port = parseInt(process.env.PORT) || 3001;
        this.app = express();
        this.appMiddlewares();
        this.uploadFile();
        this.connectDB();
    }

    appRouting() {
        this.app.use('/api', routes);
    }

    connectDB() {
        dbConnect()
        .then(() => {
            this.appRouting();
            this.app.listen(this.port, () => {
                console.log(`Running server in http://localhost:${this.port}`);
            });
            console.log('database connected successfully');
        })
        .catch((error) => {
            console.log(error);
            throw new Error('Error init Database')
        })
        
    }

    static get instance() {
        return this._instance || (this._instance = new this());
    }

    appMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.static('public'));
        // this.app.use(`${process.env.URL}/public/images`, express.static(__dirname + '/public/images'));
        this.app.use(cors({ allowedHeaders: ['Content-Type', 'Authorization'], methods: ['GET', 'PUT', 'POST', 'DELETE'], origin: true, credentials: true }))
    }

    uploadFile() {
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/'
        }))
    }
}