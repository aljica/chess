/**
 * @class User
 */

class User {
  constructor(name, password) {
    if (name.length === 0 || name.length > 15) throw new Error('length');

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
