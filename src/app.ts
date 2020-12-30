// import "reflect-metadata";
// import { ApolloServer} from 'apollo-server';
// import { schema } from "./utils/CreateSchema";
// import { createConnection } from "typeorm";
// import { config } from '../config';
// import logger from "./logger/logger";

// export class Server {
//   app: ApolloServer;

//     constructor() {

//         this.setupExecpetionHandling();
//         this.app = new ApolloServer(
//             {
//                 schema: schema,
//                 subscriptions: {
//                     path: "/subscriptions",
//                     // other options and hooks, like `onConnect`
//                 },
            
//             }
//         );
//     }

//     private setupExecpetionHandling() {
//         process.on('uncaughtException', (err) => {
//             logger.error('Uncaught Exception', err);
//             process.exit(1); // TODO exception notifier
//         });

//         process.on('unhandledRejection', (reason, promise) => {
//             logger.error('Unhandled Rejection', { reason: reason, promise: promise });
//         });

//         process.on('SIGINT', (async () => {
//             logger.info('Shutting down...');
//             await this.app.stop();
//             logger.info('Shut down!');
//             process.exit(0);
//         }));
//     }

//     async run(port: number) {

//         try {
//             logger.info(`Connecting to database on ${config.db.host}:${config.db.port}...`);
//             await createConnection();
            
//             logger.info(`Starting server on port ${port}.`)
//             await this.app.listen({ port: port });

//         } catch (err) {
//             logger.error(err);
//         }

//     }
// }

import express from 'express';
import logger from "./logger/logger";
import http from 'http';
import { config } from '../config/index';
import { createConnection } from "typeorm";
import * as databaseConfig from '../ormconfig';
import bodyParser = require("body-parser");
import { ApolloServer } from 'apollo-server-express';
import { schema } from "./utils/CreateSchema";

export class Server {
    app: express.Express;
    server: http.Server;
    apolloServer: ApolloServer;

    constructor() {
        this.setupExecpetionHandling();
        this.apolloServer = new ApolloServer({ schema: schema });
        this.app = express();
        this.apolloServer.applyMiddleware({app: this.app});
    }

    private setupExecpetionHandling() {
        process.on('uncaughtException', (err) => {
            logger.error('Uncaught Exception', err);
            process.exit(1); // TODO exception notifier
        });

        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection', { reason: reason, promise: promise });
        });

        const shutdown = async () => {
            logger.info('Shutting down...');
            this.server.close( () => {
                logger.info('Shut down!');
                process.exit(0);
            });
        };
       
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    }

    async run(port: number) {
        try {
            logger.info('Connecting to database...');
            // @ts-ignore
            await createConnection(databaseConfig);
            await this.app.use(bodyParser);

            logger.info(`Starting server on port ${port}`)
            this.server = this.app.listen({ port: port });

        } catch (err) {
            logger.error(err);
        }
    }
}

(new Server()).run(config.port);