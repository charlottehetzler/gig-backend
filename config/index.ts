import convict from 'convict';
import packageJson from '../package.json';
import dotenv from 'dotenv';

dotenv.config();

const envConfig = convict({
    env: {
        format: ['production', 'dev', 'test'],
        default: 'dev',
        arg: 'nodeEnv',
        env: 'NODE_ENV',
        doc: 'Node environment'
    },
    port: {
        format: Number,
        default: 3000,
        arg: 'port',
        env: 'PORT',
        doc: 'HTTP port for the server to listen on'
    },
    db: {
        host: {
            doc: "Database host name/IP",
            format: '*',
            default: 'localhost',
            env: 'DB_HOST'
        },
        name: {
            doc: "Database name",
            format: String,
            default: 'gig',
            env: 'DB_NAME'
        },
        port: {
            doc: 'Database port',
            format: Number,
            default: 5432,
            env: 'DB_PORT'
        },
        user: {
            doc: 'Database user',
            format: String,
            default: 'charlottehetzler',
            env: 'DB_USER'
        },
        password: {
            doc: 'Database password',
            format: String,
            default: '',
            env: 'DB_PASSWORD'
        }
    }

});

const env = envConfig.get('env');

envConfig.validate({ allowed: 'strict' });

export const config = { name: packageJson.name, version: packageJson.version, ...envConfig.getProperties() };