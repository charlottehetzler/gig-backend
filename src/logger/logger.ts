import bunyan from 'bunyan';
import { config } from '../../config';

export default bunyan.createLogger({name: config.name, version: config.version});