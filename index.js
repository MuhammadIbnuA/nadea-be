const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/Users");
const EmployeeModel = require("./models/Employee");

const app = express();
app.use(express.json());
app.use(cors());

// Replace 'YOUR_MONGODB_ATLAS_URI' with your actual MongoDB Atlas URI
const atlasUri = "mongodb+srv://nadea:nadeanadea@atlascluster.cenwrrx.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(atlasUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", err => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Connected to MongoDB!");
});

app.get('/users', (req, res) => {
  UserModel.find({})
    .then(users => res.json(users))
    .catch(err => res.json(err))
});

app.get('/getUser/:id', (req, res) => {
  const id = req.params.id;
  UserModel.findById(id)
    .then(user => res.json(user))
    .catch(err => res.json(err))
});

app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  UserModel.findByIdAndUpdate(id, req.body)
    .then(() => res.json("User updated successfully"))
    .catch(err => res.json(err))
});

app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  UserModel.findByIdAndDelete(id)
    .then(() => res.json("User deleted successfully"))
    .catch(err => res.json(err))
});

app.post("/create", (req, res) => {
  UserModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err))
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          res.json("Success");
        } else {
          res.json("The password is incorrect");
        }
      } else {
        res.json("No record exists");
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json("An error occurred");
    });
});

app.post("/register", (req, res) => {
  EmployeeModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
