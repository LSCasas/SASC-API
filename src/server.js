const cors = require("cors");
const express = require("express");

const userRouter = require("./routes/user.router");
const campusRouter = require("./routes/campus.router");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/campus", campusRouter);

app.get("/", (req, res) => {
  res.json({
    message: "SASC APIv1",
  });
});

module.exports = app;
