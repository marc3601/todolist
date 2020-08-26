const express = require("express");
const app = express();
const ip = process.env.IP || "localhost";
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
let data;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
  console.log("online");
});

const kittySchema = new mongoose.Schema({
  name: String,
  time: String,
});
const Kitten = mongoose.model("Kitten", kittySchema);

//ROUTES --------------------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
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

app.listen(port, () => {
  console.log(`Example app listening at http://${ip}:${port}`);
});
