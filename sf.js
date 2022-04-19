const imageFileInput = document.getElementById("image-file-input");
const topTextInput = document.getElementById("top-text");
const bottomTextInput = document.getElementById("bottom-text");
const randomMemeBtn = document.querySelector('.random-meme-button');
const slider = document.querySelector('.slider');
const slides = slider.children;
const canvas = new fabric.Canvas('c');
let topText,bottomText,img;
let imgWidth,imgHeight,canvasWidth,canvasHeight;
let randomMemeUrl;
let popularMemes = [];


const getPopularMemes = async function() {
    try {
        await fetch('https://api.imgflip.com/get_memes')
        .then(response => response.json())
        .then(response => {
        popularMemes = response.data.memes;
        });    
    } catch(err) {
        console.log(err);
    }
}

getPopularMemes();


const updateMemeCanvas = function(url,topTxt,bottomTxt) {
    canvas.clear();
    addTopText(topTxt);
    addBottomText(bottomTxt)
    addImage(url);
}

const addImage = function(url) {
    fabric.Image.fromURL(url,function(image) {
        canvas.setDimensions({width:800,height:500});
        fitImageSize (image);
        canvas.add(image);
        image.center();
        image.lockMovementX = true; 
        image.lockMovementY = true;
        image.selectable = false;
        canvas.sendToBack(image);
    })    
}

const fitImageSize = function(image) {
    imgWidth = image.width;
    imgHeight = image.height;
    canvasWidth = canvas.getWidth();
    canvasHeight = canvas.getHeight();

    let imgRatio = imgWidth / imgHeight;
    let canvasRatio = canvasWidth / canvasHeight;
    if(imgRatio <= canvasRatio){
      if(imgHeight> canvasHeight){
       image.scaleToHeight(canvasHeight);
      }
    }else{
      if(imgWidth> canvasWidth){
        image.scaleToWidth(canvasWidth);
      }
    }
};

const addTopText = function(topTxt){
    topText = new fabric.Text(topTxt,{
        paintFirst: "stroke",
        fill: 'white',
        strokeWidth:4,
        stroke: 'black',
        fontSize : 55,
        fontFamily:'sans-serif',
        // fontWeight: 'bold',
        left:canvasWidth/2,
        top:canvasHeight/50,
    })
    canvas.add(topText);
    canvas.bringToFront(topText);
}

const addBottomText = function(BottomTxt){
    bottomText = new fabric.Text(BottomTxt,{
        paintFirst: "stroke",
        fill: 'white',
        strokeWidth:4,
        stroke: 'black',
        fontSize : 55,
        fontFamily:'sans-serif',
        left:canvasWidth/2,
        top:canvasHeight - canvasHeight/4,
    });
    canvas.add(bottomText);
    canvas.bringToFront(bottomText);
}

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

imageFileInput.addEventListener("change", function (e) {
    const inputImageDataUrl = URL.createObjectURL(e.target.files[0]);
    img = new Image();
    img.src = inputImageDataUrl;
    img.addEventListener('load',function() {
        updateMemeCanvas(img.src,topTextInput.value,bottomTextInput.value)
    },{once:true});
});
  
topTextInput.addEventListener('keyup',() => {
    canvas.remove(topText);
    addTopText(topTextInput.value)
});

bottomTextInput.addEventListener('keyup',() => {
    canvas.remove(bottomText);
    addBottomText(bottomTextInput.value)
});

randomMemeBtn.addEventListener('click', async function() {
    await getRandomMemeUrl();
    img = new Image();
    img.src = randomMemeUrl;
    img.addEventListener('load',function() {
      updateMemeCanvas(img.src,topTextInput.value,bottomTextInput.value);
    },{once:true});
})




const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

/////////////////////////////slider autoplay
function autoPlay(slider,maxScrollLeft) {
    if (slider.scrollLeft > (maxScrollLeft - 1)) {
        slider.scrollLeft -= maxScrollLeft;
    } else {
        slider.scrollLeft += 1;
    }    
}

// /////////////////////////pause slider on hover
const pauseSlider = function(slider,slides,maxScrollLeft) {
    for (let slide of slides) {
        slide.addEventListener('mouseover',()=> {
                clearInterval(play);
        });
        slide.addEventListener('mouseout',()=> {
                play = setInterval(function() {
                    autoPlay(slider,maxScrollLeft);
                },50);
                return play;
        })
    }    
}

let play = setInterval(function() {
    autoPlay(slider,maxScrollLeft);
},50);


pauseSlider(slider,slides,maxScrollLeft);


