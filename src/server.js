const cors = require("cors");
const express = require("express");

const userRouter = require("./routes/user.router");
const campusRouter = require("./routes/campus.router");
const teacherRouter = require("./routes/teacher.router");
const classRouter = require("./routes/class.router");
const tutorRouter = require("./routes/tutor.router");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/campus", campusRouter);
app.use("/teacher", teacherRouter);
app.use("/class", classRouter);
app.use("/tutor", tutorRouter);

app.get("/", (req, res) => {
  res.json({
    message: "SASC APIv1",
  });
});

module.exports = app;
