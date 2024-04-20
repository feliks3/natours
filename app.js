const express = require("express");
const app = express();

const port = 8000;
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
  });
});
app.listen(port, () => {
  console.log(`listen to ${port}`);
});
