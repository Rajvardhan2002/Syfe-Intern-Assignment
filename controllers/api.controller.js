const axios = require("axios");

async function fraudSMSDectection(req,res){
    try {
        const response = await axios.post("http://ec2-3-110-84-54.ap-south-1.compute.amazonaws.com:8080/predict-message",{
        text:req.body.sms
    })

    console.log(response);
    res.send("done");
    } catch (error) {
        console.log(`Error message ${error}`);
        res.send("error");
    }
}

module.exports = {fraudSMSDectection:fraudSMSDectection};