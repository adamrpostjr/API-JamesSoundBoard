require('dotenv').config()
const express = require('express');
const multer  = require('multer')
const upload = multer({ dest: 'tmp/' })
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('sounds/'));
app.use(bodyParser.json());
app.use(cors())

app.get('/list-sounds', async (req, res)=>{
   res.json(fs.readdirSync('./sounds'))
})

app.get('/sounds/:file', async (req, res)=>{
    res.sendFile(__dirname +`/sounds/${req.params.file}`)
})

app.post('/upload', upload.single('sound'), async (req, res)=>{
    // this route is protected with a special key -- sorry people
    if (req.body.pass != process.env.UPLOADKEY) {
        res.status(401).json('sorry pal..')
        return
    }

    if (req.file && req.file.mimetype == 'audio/mpeg') {

        let existing = fs.readdirSync('./sounds')
        if (existing.includes(req.file.originalname)) {
            fs.unlink(`./tmp/${req.file.filename}`)
            res.status(409).json('file exist')
            return
        }

        fs.renameSync(`./tmp/${req.file.filename}`, `./sounds/${req.file.originalname}`)
    }

    res.json('thanks')
})


const server = app.listen(8085, function(){
    console.log("Server started at 8085");
});