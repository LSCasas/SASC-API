const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.router");
const campusRouter = require("./routes/campus.router");
const teacherRouter = require("./routes/teacher.router");
const staffRouter = require("./routes/staff.router");
const classRouter = require("./routes/class.router");
const tutorRouter = require("./routes/tutor.router");
const studentRouter = require("./routes/student.router");
const instrumentRouter = require("./routes/instrument.router");
const transferRouter = require("./routes/transfer.router");
const authRouter = require("./routes/auth.router");

const app = express();

app.use(
  cors({
    origin: ["https://sasc-tultepec.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/campus", campusRouter);
app.use("/teacher", teacherRouter);
app.use("/staff", staffRouter);
app.use("/class", classRouter);
app.use("/tutor", tutorRouter);
app.use("/student", studentRouter);
app.use("/instrument", instrumentRouter);
app.use("/transfer", transferRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.json({
    message: "SASC APIv1",
  });
});

module.exports = app;
