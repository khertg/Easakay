const express = require('express');
const app = express();
const port = process.env.PORT || 8082
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose');
const User = require('./model/user.model')
const Bus = require('./model/bus.model')
const config = require('./key')
const jwt = require('jsonwebtoken')
const multer = require('multer');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.use('/public/images', express.static(path.join(__dirname, 'uploads')))

let url = 'mongodb://localhost:27017/easakayDB'
const imageRootUrl = 'http://localhost:'+ port +'/public/images/'

var storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, next) {
      next(null, Date.now() + path.extname(file.originalname))
    }
  });

var upload = multer({ storage: storage })

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connedted to DB')
    })
    .catch(err => {
        console.log(err)
    })

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world')
});

app.post('/user/register', (req, res) => {
    console.log(req.body)
    let user = new User(req.body.data)
    user.save()
        .then(() => {
            console.log('saved')
            res.json({ message: "saved" })
        })
        .catch(err => {
            res.status(500).send(err)
        })

});

app.post('/user/login', (req, res) => {
    console.log(req.body)
    console.log(req.body.data.username)
    User.findOne({ username: req.body.data.username, password: req.body.data.password })
        .then((data) => {
            if (data) {
                var token = jwt.sign({
                    _id: data._id
                }, config.secret, {
                        expiresIn: 86400
                    });
                res.json({user:data,token:token,
                    AUTH: true,
                })
            } else {
                res.send('not found')
            }
        })
        .catch(err => {
            res.status(500).send(err)
        })

});


// GET ALL BUS
app.get('/crud/buses', (req, res) => {
    console.log(req.body);

    Bus.find({})
        .then((buses) => {
            res.status(200).json({ buses: buses });
        })
        .catch(err => {
            res.status(500).json({ message: err })
        })
});

var cpUpload = upload.fields([{ name: 'imageFile', maxCount: 1 },{ name: 'iconBusFile', maxCount: 1 }])

// ADD BUS
app.post('/crud/buses',cpUpload, (req, res) => {
    
    // UNCOMMENT FOR TRACING
    // console.log(req.body)
    // console.log(req.files['imageFile'])
    // console.log(req.files['iconBusFile'])

    let bus = convertToBusJson(req.body);

    if(req.files['imageFile'] != null){
        bus.image = imageRootUrl + req.files['imageFile'][0].filename;
    }
    if(req.files['iconBusFile'] != null){
        bus.image1 = imageRootUrl + req.files['iconBusFile'][0].filename;
    }

    let busObject = new Bus(bus);
    console.log(busObject);
    busObject.save()
        .then((data) => {
            res.status(201).json({ message: 'Bus succesfully added!', bus: data })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: err })
        });
    
});

// UPDATE BUS
app.put('/crud/buses',cpUpload, (req, res) => {

    //UNCOMMENT FOR TRACING
    console.log(req.body)
    // console.log(req.files['imageFile'])
    // console.log(req.files['iconBusFile'])

    let updatedBus = convertToBusJson(req.body,false)

    if(req.files['imageFile'] != null){
        updatedBus.image = imageRootUrl + req.files['imageFile'][0].filename;
    }
    if(req.files['iconBusFile'] != null){
        updatedBus.image1 = imageRootUrl + req.files['iconBusFile'][0].filename;
    }

    Bus.updateOne({ bus_id: req.body.bus_id}, updatedBus )
        .then((data)=>{
            
            updatedBus.busRoute = {
                to: updatedBus["busRoute.to"],
                from: updatedBus["busRoute.from"],
                address: updatedBus["busRoute.address"]
            };

            delete updatedBus["busRoute.to"];
            delete updatedBus["busRoute.from"];
            delete updatedBus["busRoute.address"];

            res.status(200).json({ message: 'Successfully updated!', bus : updatedBus })
        })
        .catch((err)=>{
            console.log(err)
            res.status(500).json({ message: err })
        });
});

// DELETE BUS
app.delete('/crud/buses', (req, res) => {
    
    //UNCOMMENT FOR TRACING
    // console.log(req.body)
    // console.log(req.body.bus_id)

    Bus.deleteOne({bus_id: req.body.bus_id})
        .then((data)=>{
            res.status(202).json({ message: 'Successfully deleted!', bus_id: req.body.bus_id })
        })
        .catch((err)=>{
            console.log(err)
            res.status(500).json({ message: err })
        });
});


function convertToBusJson(data, isAdd = true){
    let bus = {};

    bus.bus_id = data.bus_id;
    bus.name = data.name;

    if(isAdd){
        bus.image = "#";
        bus.image1 = "#";
    }else{
        bus.image = data.image;
        bus.image1 = data.image1;
    }
    
    bus.plateNumber = data.plateNumber;
    bus.busType = data.busType;
    bus.company = data.company;
    bus.departureTime = data.departureTime;
    bus.arrivalTime = data.arrivalTime;
    bus.departureDate = data.departureDate;
    bus.fare = data.fare;
    bus.availableSeats = data.availableSeats;
    bus["busRoute.from"] = data.from;
    bus["busRoute.to"] = data.to;
    bus["busRoute.address"] = data.address;

    return bus;
}



app.listen(port, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('connected '+ port)
    }
})