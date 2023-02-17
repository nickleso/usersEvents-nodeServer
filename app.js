const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const eventsRouter = require("./routes/api/eventsRouter");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/events", eventsRouter);
// app.use("/api/users", usersRouter); or customers ??
// app.use("/api/users", authRouter);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api/events or /api/users",
    data: "Not found",
  });
});

app.use((err, req, res, next) => {
  // objectId error handler
  if (err.message.includes("Cast to ObjectId failed")) {
    return noDataByIdError(res);
  }

  if (err.message.includes("duplicate")) {
    return duplicateError(res);
  }

  serverError(err, res);
});

module.exports = app;
