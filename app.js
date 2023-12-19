const express = require("express");
const path = require("path");
const csrf = require("csurf");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static("public"));
app.use(express.urlencoded({extended:false}));

const homeRoutes = require("./routes/home.routes");
const authRoutes = require("./routes/auth.routes");

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(csrf());///calling tpp to generate tokens
app.use(addCsrfTokenMiddleware);////providing middleware checks and tokens for every call
app.use(checkAuthStatusMiddleware);

app.use(authRoutes);
app.use(homeRoutes);

app.use(errorHandlerMiddleware);
// app.listen(3000,()=>{console.log("Server started on port 3000");});
db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });