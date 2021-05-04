// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/yCgI_GSAQ/";

let model,
  webcam,
  labelContainer,
  maxPredictions,
  webcam_container,
  background,
  body,
  result,
  article_title;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  if (window.screen.width < 500) {
    webcam = new tmImage.Webcam(360, 360, flip); // width, height, flip
  } else {
    webcam = new tmImage.Webcam(600, 600, flip); // width, height, flip
  }

  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  webcam_container = document.getElementById("webcam-container");
  webcam_container.appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);

  body = document.getElementsByTagName("body")[0];

  for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2)*100 +" % | ";
    labelContainer.childNodes[i].innerHTML = classPrediction;

    changeStatus(prediction[i].probability.toFixed(2));
  }
}

changeStatus = (result) => {
    background = document.getElementById("background");
    article_title = document.getElementById("text");
   
  if (result < 0.7) {
    background.classList.add("sin_tapabocas");
    background.classList.remove("tapabocas");
    body.classList.add("sin_tapabocas");
    body.classList.remove("tapabocas");
    article_title.innerHTML = (" Cuidate querete, ojito ojete ");
  } else {
    background.classList.add("tapabocas");
    background.classList.remove("sin_tapabocas");
    body.classList.add("tapabocas");
    body.classList.remove("sin_tapabocas");
    article_title.innerHTML = (" libertad responsable ");
  }
};

