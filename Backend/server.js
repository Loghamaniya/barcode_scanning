const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const moment = require("moment-timezone");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://nandhavelan2003:8aMTayT9LTK20xUO@cluster0.oz3spl2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connected to db & listening on port 5000!!!");
    });
  })
  .catch((error) => {
    console.log(error);
  });

const StudentSchema = new mongoose.Schema({
  barcode: { type: String, required: true },
  name: { type: String, required: true },
  year: { type: String, required: true },
  dept: { type: String, required: true },
  section: { type: String, required: true },
});

const SearchSchema = new mongoose.Schema(
  {
    barcode: { type: String, required: true },
    name: { type: String, required: true },
    year: { type: String, required: true },
    dept: { type: String, required: true },
    section: { type: String, required: true },
    entryAt: { type: String, required: true },
  },
  { timestamps: false }
);
//  default: Date.now

const Student = mongoose.model("Student", StudentSchema);
const Search = mongoose.model("Search", SearchSchema);

// Endpoint to get student details by barcode number
app.get("/student/:barcode", async (req, res) => {
  try {
    const student = await Student.findOne({ barcode: req.params.barcode });
    if (!student) {
      console.log("Student not found");
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
    console.log("Student found");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Endpoint to store search details
app.post("/entry", async (req, res) => {
  try {
    const { barcode, name, year, dept, section, entryAt } = req.body;
    const newSearch = new Search({
      barcode,
      name,
      year,
      dept,
      section,
      entryAt,
    });
    await newSearch.save();
    console.log("Entry successful");
    res.status(201).json({ message: "Search details saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Endpoint to handle filter requests
app.get("/filter", (req, res) => {
  const selectedDate = req.query.date;
  const dateParam = req.query.date;
  const regexDate = new RegExp("^" + dateParam);

  console.log(selectedDate);
  const startDateIST = moment(selectedDate)
    .startOf("day")
    .tz("Asia/Kolkata")
    .toDate();
  const endDateIST = moment(selectedDate)
    .endOf("day")
    .tz("Asia/Kolkata")
    .toDate();
  console.log(startDateIST, endDateIST);

  //   Search.find({
  //     entryAt: {
  //       $gte: startDateIST,
  //       $lte: endDateIST,
  //     },
  //   }).toArray(function (err, docs) {
  //     if (err) {
  //       console.error("Error fetching documents:", err);
  //       res
  //         .status(500)
  //         .json({ error: "An error occurred while fetching documents" });
  //       return;
  //     }

  //     res.json(docs);
  //   });
  Search.find({ entryAt: regexDate })
    .then(function (data) {
      console.log(data); // This will log the fetched data
      res.json(data)
    })
    .catch(function (err) {
      console.error(err);
    });
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
