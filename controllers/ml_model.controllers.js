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
      "http://ec2-3-110-84-54.ap-south-1.compute.amazonaws.com:8080/predict-message",
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

module.exports = {
  submitNLP: submitNLP,
  getNLP: getNLP,
};
