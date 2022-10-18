import { config } from "dotenv";
config();

import { createServer } from "http";
import { DataSource } from "typeorm";
import app from "./src/app";
import { UserEntity } from "./src/models/entities/User.entity";
import { PageEntity } from "./src/models/entities/Page.entity";
import { env } from "./src/utils/env-wrapper";
import Logger from "./src/utils/Logger";
import { PageRequestEntity } from "./src/models/entities/PageRequest.entity";

const logger = new Logger('Main');

//Connecting with database
export const dataSource = new DataSource({
    type: "postgres",
    host: env.pg.host,
    port: env.pg.port,
    username: env.pg.username,
    password: env.pg.password,
    database: env.pg.database,
    synchronize: env.orm.synchronize,
    logging: env.orm.logging,
    entities: [UserEntity, PageEntity, PageRequestEntity]
  });

(async function main(): Promise<void> {

    try {

        await dataSource.initialize()

        logger.info(`✅ - Connected to database successfully`)
        
        const PORT = env.port || 8080;
        createServer(app).listen(PORT);

        logger.info(`✅ - Server is up, listening on port ${PORT}`)

    } catch (error) {
        logger.error('❌', error)
        process.exit(-1);
    }
})();
