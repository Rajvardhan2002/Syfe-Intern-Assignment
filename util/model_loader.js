const tf = require('@tensorflow/tfjs-node');

async function loadModelAndPredict(x1,x2,x3,x4,x5,x6,x7,x8,x9,x10) {
    try {
        console.log(typeof x1);
        console.log(typeof x2);
        console.log(typeof x3);
        console.log(typeof x4);
        console.log(typeof x5);
        console.log(typeof x6);
        console.log(typeof x7);
        console.log(typeof x8);
        console.log(typeof x9);
        console.log(typeof x10);
        const model = await tf.loadLayersModel('file:///media/somil/Ubuntu2/RJPolice/tensor/model.json');

        // Make predictions using the TensorFlow.js model
        const inputTensor = tf.tensor2d([[x1,x2,x3,x4,x5,x6,x7,x8,x9,x10]]);
        const prediction = await model.predict(inputTensor);

        console.log('Prediction:');
        // prediction.print();
        // console.log(prediction);
        console.log(prediction.dataSync());
        return(prediction.dataSync());
    } catch (error) {
        console.error('Error loading or making predictions:', error);
    }
}

module.exports=loadModelAndPredict;