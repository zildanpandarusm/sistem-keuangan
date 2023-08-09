import { Sequelize } from 'sequelize';

const db = new Sequelize('amk_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default db;
