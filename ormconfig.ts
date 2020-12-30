import { config } from "./config"

module.exports = {
   "type": "postgres",
   "host": config.db.host,
   "port": config.db.port,
   "username": config.db.user,
   "password": config.db.password,
   "database": config.db.name,
   "synchronize": false,
   "logging": false,
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}