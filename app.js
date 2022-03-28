const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const userAuth = require("./controller/userManipulation");
const postAuth = require("./controller/postProposal");
const port = process.env.PORT || 8800;
var cors = require("cors");
dotenv.config();

// const user = require("../model/userModel");
const user = require("./model/userModel");

//For image
const multer = require("multer");
const path = require("path");
const fs = require("fs");
//const mongoose = require("mongoose");
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/uploadphoto", upload.single("myImage"), (req, res, next) => {
  var obj = {
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };
  user.create(obj, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      //  res.redirect('/');
      //console.log(result.img.Buffer);
      console.log("Saved To database");
      res.contentType(obj.img.contentType);
      res.send(obj.img.data);
    }
  });
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Successfull"))
  .catch((err) => {
    console.error(err);
  });
app.use(cors());
app.use(express.json());

app.use("/api/userAuth", userAuth);
app.use("/api/postAuth", postAuth);
app.listen(port, () => {
  console.log("Backend server is running on", port);
});
