import Sequelize, { Model } from 'sequelize';

import bcrypy from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }

  chechPassword(password) {
    return bcrypy.compare(password, this.password_hash);
  }
}

export default User;
