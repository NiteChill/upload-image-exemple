const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  imgSchema = require('./model.js'),
  fs = require('fs'),
  multer = require('multer'),
  path = require('path');
app.set('view engine', 'ejs');
require('dotenv').config();

mongoose.connect(process.env.ATLAS_URI).then(console.log('DB Connected'));

app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  imgSchema.find({}).then((data, err) => {
    if (err) {
      console.log(err);
    }
    res.render('imagepage', { items: data });
  });
});

app.post('/', upload.single('image'), (req, res, next) => {
  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + '/uploads/' + req.file.filename)
      ),
      contentType: 'image/png',
    },
  };
  imgSchema.create(obj).then((err, item) => {
    if (err) {
      console.log(err);
    } else {
      // item.save();
      res.redirect('/');
    }
  });
});

const port = process.env.PORT || '3000';
app.listen(port, (err) => {
  if (err) throw err;
  console.log('Server listening on port', port);
});
