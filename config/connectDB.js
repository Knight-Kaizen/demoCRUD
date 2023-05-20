const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        await mongoose.connect(`mongodb://localhost:27017`)
        console.log('Connected to Database');
    }
    catch(err){
        console.log('Error connecting to DB', err);
    }
}

module.exports = connectDB;