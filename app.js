const express = require("express");
const path = require("path");
const csrf = require("csurf");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

//csrf needs sessions to work properly
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(csrf()); //generates tokens and check for incoming tokens and validate them
app.use(addCsrfTokenMiddleware); //this one only distributes the tokens to our middlewares

app.use(checkAuthStatusMiddleware); //checking whether user is login or not

const homeRoutes = require("./routes/home.routes");
const authRoutes = require("./routes/auth.routes");
const mlRoutes = require("./routes/ml_model.routes");
const kycRoutes = require("./routes/kyc.routes");

app.use(authRoutes);
app.use(protectRoutesMiddleware);
app.use(homeRoutes);
app.use(mlRoutes);
app.use(kycRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000, () => {
      console.log(`Server started on port 3000`);
    });
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });
