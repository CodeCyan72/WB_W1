const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://Heroku_User:7q0dTVkK80Q2tWjm@cluster0.qceaq.mongodb.net/test?retryWrites=true&w=majority'
    ).then(result => {
        console.log('Connected!');
    }).catch(err => {
        console.log(err);
    });
};

module.exports = mongoConnect;