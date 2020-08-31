const express = require("express");
const app = express();
const ip = process.env.IP || "localhost";
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const enforce = require('express-sslify');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(enforce.HTTPS({ trustProtoHeader: true }))

//DATABASE CONNECTION ------------------------------------------
const mongoUrl =
  "mongodb+srv://admin:admin@cluster0.f27yr.mongodb.net/Cluster0?retryWrites=true&w=majority";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("db connected");
});

const kittySchema = new mongoose.Schema({
  name: String,
  time: String,
});
const Kitten = mongoose.model("Kitten", kittySchema);

const viewSchema = new mongoose.Schema({
  count: Number,
});
const View = mongoose.model("View", viewSchema);

//ROUTES --------------------------------------------------------

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/views", (req, res) => {
  const filter = { _id: "5f484119c6df5427883430dc" };

  //read and save view count
  const p = new Promise((resolve, reject) => {
    View.findOne(filter, (err, doc) => {
      if (doc) {
        resolve(console.log(doc.count));
        const update = { count: doc.count + 1 };
        res.send(update);
        View.findOneAndUpdate(
          filter,
          update,
          { useFindAndModify: false },
          (err) => {
            if (err) return console.error(err);
          }
        );
      } else {
        reject("Failed " + err);
      }
    });
  });
});

app.get("/cat", (req, res) => {
  let p = new Promise((resolve, reject) => {
    Kitten.find(function (err, kittens) {
      if (kittens) {
        resolve((data = kittens));
      } else {
        reject("Failed " + err);
      }
    });
  });
  p.then((data) => {
    res.send(data);
  }).catch((data) => {
    console.log("Error: " + data);
  });
});

app.post("/catty", (req, res) => {
  const clck = new Date().toLocaleTimeString();
  req.body.time = clck;
  const data = new Kitten(req.body);
  data.save(function (err) {
    if (err) return console.error(err);
    console.log("saved");
  });
  res.send({ result: "Saved to database!" });
});

app.post("/delete", (req, res) => {
  const filter = {_id: req.body.value};
  let p = new Promise((resolve, reject) => {
    Kitten.findByIdAndDelete(filter, (err, deleted) => {
      if (deleted) {
        resolve(console.log(`Item deleted`));
      } else if (err) {
        reject("Failed " + err);
      }
    })
    res.send({ result: "Delete sucess!" });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://${ip}:${port}`);
});
