const express = require('express');
const router = express.Router();

// Path to your JSON file, although it can be hardcoded in this file.
const dummyData = require('../data/ta10-data.json')

router.get('/', (req, res, next) => {
    res.render('pages/prove11', {
        title: 'Team Activity 11',
        path: '/teamActivities/11',
        names: dummyData.avengers
    });
});

// Initialize socket.io
// Make sure you `npm install socket.io socket.io-client`
// const io = require('socket.io')(server)
// const PORT = 5000;
// const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
// const io = require('socket.io')(server);

// // Listen for new connections
// io.on('connection', socket => {
//     console.log('Client connected!')
//     socket.on('disconnect', () => {
//         console.log('Client disconnected!')
//     })

//     // Listen for add events
//     socket.on('add', name => {
//         // Add a name and tell clients to remove a name
//         dummyData.avengers.push({ name: name });
//         io.emit('add', name);
//     })
// })

// router.get('/fetchAll', (req, res, next) => {
//     res.json(dummyData);
// });

// router.post('/insert', (req, res, next) => {
// /************************************************
//  * INSERT YOUR WEB ENDPOINT CODE HERE
//  ************************************************/
//     if (req.body.name != undefined) {
//         const name = req.body.name;

//         if (dummyData.avengers.find(el=>el.name===name)===undefined){
//             //make it
//             dummyData.avengers.push({ name: name });
//             res.status(200).send({name: name});
//         }
//         else{
//             res.sendStatus(400);
//         }
//     }
//     else
//     {
//         res.sendStatus(400);
//     }
// });

module.exports = router;