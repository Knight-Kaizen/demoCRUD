const express = require('express');
const bodyParser = require('body-parser');

const connectDB = require('./config/connectDB')
const userController = require('./controllers/user');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 8001;
connectDB();

const customCheck = (req, res, next)=>{
    console.log(req.body);
    next();
}

app.post('/user/register', userController.createUser);
app.get('/user/view', userController.getUser);
app.patch('/user/update/:id', userController.modifyUser);
app.delete('/user/delete/:id', userController.deleteUser );

app.patch('/user/addFreind/:id', userController.addFreind);
app.patch('/user/handleRequests/:id', userController.resolveRequests);
// app.post('/user/freindRequests', customCheck, userController.resolveRequests);

app.listen(port, ()=>{
    console.log('Listening to port', port);
})
