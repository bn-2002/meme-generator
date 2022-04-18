// const canvas = document.querySelector('.canvas');
// const ctx = canvas.getContext("2d");
// const img = document.querySelector('.img');

// fetch('https://api.imgflip.com/get_memes')
// .then(response => response.json())
// .then(response => {
//     img.src = response.data.memes[Math.floor(Math.random()*(101))].url;
// });

const topText = document.getElementById("top-text");
const bottomText = document.getElementById("bottom-text");
const imageFileInput = document.getElementById("image-file-input");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let image;
let renderableHeight, renderableWidth,xStart,yStart;
let yOffset;


const updateMeme = function () {
    canvas.width = 800;
    canvas.height = 600;
    fitImageOn(canvas,image);
    const fontSize = Math.floor(renderableWidth/10);
    yOffset =renderableHeight/4;
    ////Text
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.floor(fontSize/10);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = `${fontSize}px sans-serif`

    /////////////top text
    ctx.textBaseLine = 'top';
    ctx.strokeText(topText.value,renderableWidth/2,yOffset);
    ctx.fillText(topText.value,renderableWidth/2,yOffset);

    /////////////top text
    ctx.textBaseLine = 'bottom';
    ctx.strokeText(bottomText.value,renderableWidth/2,renderableHeight - yOffset)
    ctx.fillText(bottomText.value,renderableWidth/2,renderableHeight - yOffset)
};


const fitImageOn = function(drawCanvas,imageObj) {
	const imageAspectRatio = imageObj.width / imageObj.height;
	const canvasAspectRatio = drawCanvas.width /drawCanvas.height;

	// If image's aspect ratio is less than canvas's we fit on height
	// and place the image centrally along width
	if(imageAspectRatio < canvasAspectRatio) {
		renderableHeight = drawCanvas.height;
		renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
		xStart = (drawCanvas.width - renderableWidth) / 2;
		yStart = 0;
	}

	// If image's aspect ratio is greater than canvas's we fit on width
	// and place the image centrally along height
	else if(imageAspectRatio > canvasAspectRatio) {
		renderableWidth = drawCanvas.width
		renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
		xStart = 0;
		yStart = (drawCanvas.height - renderableHeight) / 2;
	}

	// Happy path - keep aspect ratio
	else {
		renderableHeight = drawCanvas.height;
		renderableWidth = drawCanvas.width;
		xStart = 0;
		yStart = 0;
	}
	ctx.drawImage(imageObj,xStart,yStart,renderableWidth,renderableHeight);
};

imageFileInput.addEventListener("change", function (e) {
  const inputImageDataUrl = URL.createObjectURL(e.target.files[0]);
  console.log(inputImageDataUrl);
  image = new Image();
  image.src = inputImageDataUrl;
  image.addEventListener('load',function() {
    updateMeme();
  },{once:true})
});

const updateTopText = function() {
    ctx.textBaseLine = 'top';
    ctx.strokeText('',renderableWidth/2,yOffset);
    ctx.fillText('',renderableWidth/2,yOffset);
    ctx.strokeText(topText.value,renderableWidth/2,yOffset);
    ctx.fillText(topText.value,renderableWidth/2,yOffset);
}

topText.addEventListener('keyup',() => {
    updateMeme();
});

bottomText.addEventListener('keyup',() => {
    updateMeme();
});


