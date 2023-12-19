const express = require("express");
const path = require("path");
const db = require("./data/database");
const bodyParser = require('body-parser');


const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static("public"));
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({extended: true}));

const homeRoutes = require("./routes/home.routes");
const authRoutes = require("./routes/auth.routes");
const loadModelAndPredict=require("./util/model_loader")

app.use(authRoutes);
app.use(homeRoutes);

// app.listen(3000,()=>{console.log("Server started on port 3000");});
db.connectToDatabase()
  .then(function () {

  app.post("/prediction1",(req,res)=>{
    
    const transactionId=req.body.transaction_id;
    const x1=+transactionId;
    const amount=req.body.amount;
    const x2=+amount;
    const category=req.body.category;
    const x3 =+ category;
    const domain=req.body.pymt;
    const x4 =+domain;
    const type=req.body.type;
    const x5 =+type;

    const atm = 65.69;
    const gma = 381.129;
    const gsd = 257.70;
    const gmaid = 403.045;
    const gsdid = 270.541;
    
    const prediction = loadModelAndPredict(x1,x2,x3,x4,x5,atm,gma,gsd,gmaid,gsdid);
    // console.log(prediction);

})
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });







