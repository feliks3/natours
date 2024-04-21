const express = require("express");
const mongoose = require("mongoose");
const app = express();
const tourController = require("./controllers/tourController");

const port = 8000;
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "hello world",
    count: 5,
  });
});

app.route("/api/v1/tours").get(tourController.getAllTours);

const DB =
  "mongodb+srv://felikslyu:dXLmmahiSUFuAkgD@cluster0.kninbn4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.error("DB connection failed:", err);
  });

app.listen(port, () => {
  console.log(`listen to ${port}`);
});
