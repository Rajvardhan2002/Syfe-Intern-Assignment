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

module.exports = {
    getPrediction : getPrediction,
    getDetails : getDetails,
    getTransactions: getTransactions,
}