require('./db/config');
require('dotenv').config()
const User = require("./db/User");
const Images = require('./db/Images')
const express = require("express");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken');
const multer = require('multer')
const Key = process.env.Key;

app.use(express.json());
app.use(cors());
app.use(express.static('uploads'));



app.post('/login', async (req, resp) => {
    if (req.body) {
        let result = await User.findOne({ "username": req.body.username })
        console.log(result)
        pass = await bcrypt.compare(req.body.password, result.password)
        console.log(pass)
        if (pass) {
            console.log(Key)
            JWT.sign({ result }, Key, { expiresIn: '2h' }, (err, token) => {
                if (err) {
                    resp.send({ error: err })
                } else {
                    resp.send({ result, auth: token })
                }
            })
        } else {
            resp.send(false);
        }
    } else {
        resp.send("Please send data")
    }
})



app.post('/register', async (req, resp) => {
    let result = new User(req.body);
    result = await result.save();
    resp.send(result)
})


// Upload image Multer 
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname)
        }
    })
});


app.post('/images', upload.array('image'), async (req, resp) => {
    const files = req.files;
    let result = ''
    if (Array.isArray(files) && files.length > 0) {
        files.flatMap(async (file) => {
            result = new Images({
                image: file.filename
            })
            result = await result.save();
        })
        if (result) {
            resp.send(result)
        } else {
            resp.send(false)
        }

    } else {
        resp.send(false)
    }
})



app.get('/images',async(req,resp)=>{
    let result = await Images.find();
    if(result){
        resp.send(result)
    }else{
        resp.send({error:"Data is not present."})
    }
})


app.delete('/delete/:id',async(req,resp)=>{
    if(req.params.id){
        let result = await Images.deleteOne({image:req.params.id})
        resp.send(result)
    }else{
        resp.send({error:"Please select the image to delete"})
    }
})


app.listen(PORT);
