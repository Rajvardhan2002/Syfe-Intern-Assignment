const axios = require("axios");
const NLP = require("../models/nlpMsg.model");

/////render nlp form
function getNLP(req, res) {
  const prediction = { errorMessage: "", num: 1010, subject: "", message: "" };
  res.render("index/messageNLP", { prediction: prediction });
}

/////sends a post request whenever nlp form is submitted
async function submitNLP(req, res, next) {
  try {
    const response = await axios.post(
      "http://ec2-3-110-119-238.ap-south-1.compute.amazonaws.com:8080/predict-message",
      {
        text: req.body.sms,
      }
    );
    // console.log(response.data.prediction);
    const output = response.data.prediction;
    const message = new NLP(
      req.session.uid,
      req.body.subject,
      req.body.sms,
      output
    );
    await message.addNewMessage();
    let ans;
    if (output === 0) {
      ans = "Entered message is not a spam or fraud";
    } else {
      ans = "Entered message can be a spam or fraud";
    }
    const prediction = {
      errorMessage: ans,
      num: 101,
      subject: req.body.subject,
      message: req.body.sms,
    };
    res.render("index/messageNLP", { prediction: prediction });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
}

function getPredictionForm(req, res) {
  const prediction = {
    errorMessage: "",
    num: 1010,
    custID: "",
    amount: "",
    category: "",
  };
  res.render("index/predictFraudForm", { prediction: prediction });
}

async function submitPredictForm(req, res, next) {
  try {
    const response = await axios.post(
      "http://ec2-3-110-119-238.ap-south-1.compute.amazonaws.com:8080/predict-trans",
      {
        custID: +req.body.custId,
        amount: +req.body.amount,
        balance: +1500.0,
        amount_mean: +400,
        category: +req.body.category,
        day: +new Date().getDate(),
        month: +new Date().getMonth() + 1,
        year: +new Date().getFullYear(),
        amountPerMonth: +11000.0,
        amountDif: -317.0,
      }
    );
    console.log(response.data.prediction);
    let ans;
    if (response.data.prediction < 0.5) {
      ans = "Your transaction is safe. You are good to go";
    } else {
      ans =
        "Your transaction is marked SUSPICIOUS.Please make sure you are paying to a right merchant!";
    }
    const prediction = {
      errorMessage: ans,
      num: 101,
      custID: req.body.custId,
      amount: req.body.amount,
      category: req.body.category,
    };
    res.render("index/predictFraudForm", { prediction: prediction });
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

module.exports = {
  submitNLP: submitNLP,
  getNLP: getNLP,
  getPredictionForm: getPredictionForm,
  submitPredictForm: submitPredictForm,
};
