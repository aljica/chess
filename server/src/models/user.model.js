/**
 * @class User
 */

class User {
  constructor(name, password) {
    this.name = name;
    this.password = password;
  }

  getName() {
    return this.name;
  }

  getPassword() {
    return this.password;
  }
}

module.exports = User;
