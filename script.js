const topText = document.getElementById("top-text");
const bottomText = document.getElementById("bottom-text");
const imageFileInput = document.getElementById("image-file-input");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const randomMemeBtn = document.querySelector('.random-meme-button');
let image;
let renderableHeight, renderableWidth,xStart,yStart;
let yOffset;
let randomMemeUrl;

/////////////////render random meme image by click
randomMemeBtn.addEventListener('click', async function() {
    await getRandomMemeUrl();
    image = new Image();
    image.src = randomMemeUrl;
    image.addEventListener('load',function() {
      updateMeme(canvas,image,topText,bottomText);
    },{once:true});
})

/////////////get random meme from api
const getRandomMemeUrl = async function() {
    try {
        await fetch('https://api.imgflip.com/get_memes')
        .then(response => response.json())
        .then(response => {
            randomMemeUrl =  response.data.memes[Math.floor(Math.random()*(101))].url;
        });    
    } catch(err) {
        console.log(err);
    }
}

/////////////updte meme canvas
const updateMeme = function (canvas,image,topText,bottomText) {
    canvas.width = 800;
    canvas.height = 600;
    fitImageOn(canvas,image);
    const fontSize = Math.floor(renderableWidth/10);
    yOffset =renderableHeight/4;

    /////////////text styles
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

///////////fit image size
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

///////////////change image of meme by uploading file
imageFileInput.addEventListener("change", function (e) {
  const inputImageDataUrl = URL.createObjectURL(e.target.files[0]);
  image = new Image();
  image.src = inputImageDataUrl;
  image.addEventListener('load',function() {
    updateMeme(canvas,image,topText,bottomText);
  },{once:true});
});

/////////update top text
topText.addEventListener('keyup',() => {
    updateMeme(canvas,image,topText,bottomText);
});

/////////update bottom text
bottomText.addEventListener('keyup',() => {
    updateMeme(canvas,image,topText,bottomText);
});


