const loadModelAndPredict = require("../util/model_loader");

function getDetails(req,res){
    res.render("index/details");
}

/////shows prediction form
function getPrediction(req,res){
    res.render("index/predictForm"); 
}

function getTransactions(req,res){
    res.render("index/transaction");
} 

async function predictTransactionsController(req,res){

    try {
    
    const transactionId = req.body.transaction_id;
      const x1 = +transactionId;
      const amount = req.body.amount;
      const x2 = +amount;
      const category = req.body.category;
      const x3 = +category;
      const domain = req.body.pymt;
      const x4 = +domain;
      const type = req.body.card;
      const x5 = +type;

      const atm = 65.69;
      const gma = 381.129;
      const gsd = 257.7;
      const gmaid = 403.045;
      const gsdid = 270.541;

    const predictionResult = await loadModelAndPredict(x1,x2,x3,x4,x5,atm,gma,gsd,gmaid,gsdid);

    console.log(`Prediction Result is :- ${predictionResult}`);

    res.status(200).send({
        success:true,
        message:`Successfully Predicted!! Prediction result :- ${predictionResult} `
    })

        
    } catch (error) {
        console.log(`Error while predicting -> Error Message:- ${error}`);
        res.status(500).send({
            success:false,
            message:`Something went wrong. Please try again later`
        })
    }

    
}

module.exports = {
    getPrediction : getPrediction,
    getDetails : getDetails,
    getTransactions: getTransactions,
    predictTransactionsController:predictTransactionsController
}