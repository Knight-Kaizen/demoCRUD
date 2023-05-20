const { consoleLogger } = require('@influxdata/influxdb-client');
const userDetailCollection = require('../models/userModel');


const createUser = async (req, res) => {
    try {
        const newUser = new userDetailCollection({
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender

        })
        const result = await newUser.save();
        console.log('Create user : ', result);
        res.send('User registered sucessfully!');
    }
    catch (err) {
        res.status(400).send(`Error in creating user, ${err}`);
    }
}

const getUser = async (req, res) => {
    try {
        const result = await userDetailCollection.find();
        console.log('get user : ', result);
        res.status(200).send(`${JSON.stringify(result)}`);

    }
    catch (err) {
        res.status(400).send(`Error in getting user, ${err}`);
    }
}

const modifyUser = async (req, res) => {
    try {
        const newDetails = req.body;
        const userId = req.params.id;
        const result = await userDetailCollection.updateOne({ _id: userId }, {
            $set: {
                name: newDetails.name,
                email: newDetails.email,
                gender: newDetails.gender
            }
        })
        console.log('Modify user : ', result);
        res.send(`user details updated successfully!`);
    } catch (err) {
        res.status(400).send(`error in updating details, ${err}`)
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await userDetailCollection.deleteOne({ _id: userId });
        console.log('Delete user : ', result);
        res.send(`user deleted sucessfully`);

    }
    catch (err) {
        res.status(400).send(`error in deleting user, ${err}`)

    }
}

const addFreind = async (req, res) => {
    try {
        const newFreinds = req.body.freind;
        const userId = req.params.id;
        const sendingFreindRequest = await userDetailCollection.updateOne({ _id: userId }, {
            $push: { freindRequestSent: newFreinds }
        })
        console.log('In add freind function : ', sendingFreindRequest);
        const receivingFreindRequest = await userDetailCollection.updateOne({ _id: newFreinds }, {
            $push: { freindRequestReceived: userId }
        })
        console.log('freind request received', receivingFreindRequest);
        res.send(`freind request sent`);

    }
    catch (err) {
        res.send('error in sending freind request', err);
    }
}

const resolveRequests = async (req, res) => {
    try {
        const userId = req.params.id;
        const action = req.body.action;
        const freind = req.body.freindId;
        if (action) {
            //true = accept request
            const addFreind = await userDetailCollection.updateOne({ _id: userId },
                {
                    $push: { freinds: freind }
                }
            )
            await userDetailCollection.updateOne({ _id: userId },
                
                {
                    $pull: { freindRequestReceived: freind }
                }
            )
            
            console.log('checking add freind1', addFreind);
            const addFreind2 = await userDetailCollection.updateOne({ _id: freind },
                {
                    $push: { freinds: userId }
                }
            )
            await userDetailCollection.updateOne({ _id: freind },
                
                {
                    $pull: { freindRequestSent: userId }
                }
            )
            console.log('checking add freind2', addFreind2);
            res.send('freind request received');
        }
        else {
            //false = reject request
            const addFreind = await userDetailCollection.updateOne({ _id: userId },
                {
                    $pull: { freindRequestReceived: freind }
                }
            )
            console.log('checking add freind1 reject', addFreind);
            const addFreind2 = await userDetailCollection.updateOne({ _id: freind },
                {
                    $pull: { freindRequestSent: userId }
                }
            )
            console.log('checking add freind2 reject', addFreind2);
            res.send('freind request handled')
            
        }
    }
    catch (err) {
        console.log('error in handling requests', err);
        res.send(`problem in adding freind`, err);
    }
}

module.exports = {
    createUser,
    getUser,
    modifyUser,
    deleteUser,
    addFreind,
    resolveRequests
}