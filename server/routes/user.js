const express = require('express');
const userHandler = require('../handler/user');

const userRouter = express.Router();

// User login route
//http://localhost:5500/users/login
userRouter.post('/login', userHandler.loginUser);
//http://localhost:5500/users/register
userRouter.post('/register', userHandler.addUser);
//http://localhost:5500/users/users
//userRouter.get('/users', userHandler.getUsers);//this is strictly for testing only
//http://localhost:5500/users/isAdmin
userRouter.get('/isAdmin', userHandler.isAdmin);//would you believe me if I said this is necessary?
//http://localhost:5500/users/getMe
userRouter.get('/getMe', userHandler.getMe);//would you believe me if I said this is necessary?
//http://localhost:5500/users/isLoggedIn
userRouter.get('/isLoggedIn', userHandler.isLoggedIn);//would you believe me if I said this is necessary?
//http://localhost:5500/users/logout
userRouter.get('/logout', userHandler.logout);//for [session.destroy], so that the server forget you ever existed


module.exports = { userRouter };