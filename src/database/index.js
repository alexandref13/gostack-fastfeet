import Sequelize from 'sequelize';

import dbConfig from '../config/database';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';
import Deliveryman from '../app/models/Deliveryman';

const models = [User, Recipient, File, Deliveryman];

const connection = new Sequelize(dbConfig);

models.map((model) => model.init(connection));
models.map((model) => model.associate && model.associate(connection.models));

export default connection;
