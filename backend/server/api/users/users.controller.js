

var User = require('./users.model')
var moment = require('moment')

var crypto = require("crypto");
const jwt = require("jsonwebtoken")
const jwtExpirySeconds = '1d'

exports.Login = function (req, res) {
    try {
        User.findOne({ email: req.body.email }).exec(function (err, user) {
            if (err) throw new Error()
            if (!user) {
                res.status(200).json({ "message": 'Account does not exist !!' });
            } else {
                if (user.password === encrypt(req.body.password).toUpperCase()) {

                    let username = user.email;
                    let userdat = {
                        email: user.email,
                        _id: user._id,
                        role: user.role,
                        username: user.username
                    }
                    User.findOneAndUpdate({ "email": req.body.email }, { "$set": { "lastLogin": Date.now(), "IP": req.connection.remoteAddress } }).exec(function (err, result) {
                        if (err) throw new Error()
                        const token = jwt.sign({ id: username.toString() }, '123-key', { algorithm: "HS256", expiresIn: jwtExpirySeconds })
                        res.status(201).json({ user: userdat, token: token })
                    })
                }
                else {
                    res.status(200).json({ "message": 'Invalid password !!' });

                }
            }

        })

    } catch{
        res.status(400).send({ "message": "Something went wrong !!" })
    }
}





exports.getUsers = function (req, res) {
    try {
        console.log(req.params)
        var role=req.header('Authorization').replace('Bearer ', '')
        if(role=='auditor'){
        User.find({}).skip(Number(req.query.skip)).limit(Number(req.query.limit)).exec((err, result) => {
            if (err) throw new Error()
            else {
                res.status(201).json(result)
            }
        })
    }else{
        res.status(401).send({ "error": "Not Found" })
        
    }
    } catch{
        res.status(400).send({ "error": "Something went wrong" })
    }
}



function encrypt(data) {
    var cipher = crypto.createCipher('aes-256-cbc', 'onlineuserr');
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}

