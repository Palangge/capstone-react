/* const validator = require('validator');
const userss = require('../model/user');

function loginUser(req, res) {
  const { email, password } = req.body;
  const user = userss.getUserByEmail(email);

  if (user && user.authenticate(password)) {
    res.status(200).json({ success: true, message: 'Login successful!' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password!' });
  }
}

function addUser(req, res) {
  const { email, password, firstName, lastName } = req.body;

  // Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  if(email.trim() === ''){
    return res.status(400).json({ success: false, message: 'Email address cannot be blank'});
  }

  if (userss.getUserByEmail(email)) {//check if email exist or already registered
    return res.status(409).json({ success: false, message: 'Email already exists' });
  }
  userss.addUser(email, password, firstName, lastName);
  res.json({ success: true, message: 'User registered successfully' });

}
function users(req, res){
  return res.json({ success: true, message: userss.getUsers() });
}

module.exports = 
{
  loginUser,
  addUser,
  users
}; */
const validator = require('validator');
const users = require('../model/user');

async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await users.getUserByEmail(email);

  if (user && user.authenticate(password)) {//user browser have corresponding session_id
    req.session._id = user._id;//server variable on successful login
    req.session.email = email;//server variable on successful login
    req.session.isAdmin = user.isAdmin();//server variable on successful login
    return res.status(200).json({ success: true, message: 'Login successful!' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid email or password!' });
  }
}

async function addUser(req, res) {
  const { email, password, firstName, lastName } = req.body;

  // Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  if (email.trim() === '') {
    return res.status(400).json({ success: false, message: 'Email address cannot be blank' });
  }

  const existingUser = await users.getUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Email already exists' });
  }

  await users.addUser(email, password, firstName, lastName);
  res.json({ success: true, message: 'User registered successfully' });
}
/* 
async function getUsers(req, res) {
  const userList = await users.getUsers();
  res.json({ success: true, users: userList });
} */

async function isLoggedIn(req, res) {
  return res.status(200).json({ success: true, message: (!!req.session.email) });
}

async function isAdmin(req, res) {
  return res.status(200).json({ success: true, message: req.session.isAdmin });
}

async function getMe(req, res) {
  return res.status(200).json({ success: true, message: req.session.email });
}

async function logout(req, res) {
  if(req.session.isAdmin){
    delete req.session.isAdmin;
  }
  if(req.session.email){
    delete req.session.email;
  }
  try{
    req.session.destroy();
    //res.clearCookie('session_id'); // Optional: Clear the session cookie if needed
    return res.json({ message: 'Logout successful' });
  }catch(err){
    console.error('Error destroying session:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  loginUser,
  addUser,
  // getUsers,
  isAdmin,
  getMe,
  isLoggedIn,
  logout,
};