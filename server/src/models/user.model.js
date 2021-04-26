/**
 * @class User
 */
class User {
  constructor(name) {
    this.id = Math.random();
    this.name = name;
  }

  getID() {
    return this.id;
  }
}

module.exports = User;
