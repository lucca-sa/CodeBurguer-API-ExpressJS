import Sequelize from 'sequelize'

import Users from '../app/models/User'
import configDatabase from '../config/database'

const models = [Users]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(configDatabase)
    models.map((model) => model.init(this.connection))
  }
}

export default new Database()
