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
app.use(express.urlencoded({extended:false}));

/////csrf needs sessions to work properly
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(csrf());////generates tokens and check for incoming tokens and validate them
app.use(addCsrfTokenMiddleware);////this one only distributes the tokens to our middlewares

app.use(checkAuthStatusMiddleware);////checking whether user is login or not

const homeRoutes = require("./routes/home.routes");
const authRoutes = require("./routes/auth.routes");
// const loadModelAndPredict = require("./util/model_loader");

app.use(authRoutes);
app.use(protectRoutesMiddleware);
app.use(homeRoutes);

app.use(errorHandlerMiddleware);


db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });



//   app.post("/prediction1",(req,res)=>{
    
//     const transactionId=req.body.transaction_id;
//     const x1=+transactionId;
//     const amount=req.body.amount;
//     const x2=+amount;
//     const category=req.body.category;
//     const x3 =+ category;
//     const domain=req.body.pymt;
//     const x4 =+domain;
//     const type=req.body.card;
//     const x5 =+type;

//     const atm = 65.69;
//     const gma = 381.129;
//     const gsd = 257.70;
//     const gmaid = 403.045;
//     const gsdid = 270.541;
    
//     const prediction = loadModelAndPredict(x1,x2,x3,x4,x5,atm,gma,gsd,gmaid,gsdid);
//     console.log("Prediction is:- "+prediction);

// })