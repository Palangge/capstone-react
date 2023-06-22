const { getDB } = require('../driver/mongodb');
class User {
  constructor(email, password, firstName, lastName, admin = false) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.admin = Boolean(admin);
  }

  authenticate(password) {
    return this.password === password;
  }

  isAdmin(){
    return (this.admin || false);
  }
}
function getUserCollection() {
  const db = getDB();
  return db.collection('user');
}

async function getUserByEmail(email) {
  const collection = getUserCollection();
  const userDocument = await collection.findOne({ email });
  if (userDocument) {
    const { email, password, firstName, lastName, admin } = userDocument;
    return new User(email, password, firstName, lastName, admin);
  } else {
    return null;
  }
}

async function addUser(email, password, firstName, lastName) {
  const collection = getUserCollection();
  const user = new User(email, password, firstName, lastName);
  return collection.insertOne(user);
}

/* async function getUsers() {
  const collection = getUserCollection();
  const users = await collection.find().toArray();
  return users.map((userDocument) => {
    const { email, password, firstName, lastName, admin } = userDocument;
    return new User(email, password, firstName, lastName, admin);
  });
} */

module.exports = {
  getUserByEmail,
  addUser,
  //getUsers,
  User
};