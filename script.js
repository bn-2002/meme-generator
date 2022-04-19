const imageFileInput = document.getElementById("image-file-input");
const topTextInput = document.getElementById("top-text");
const bottomTextInput = document.getElementById("bottom-text");
const randomMemeBtn = document.querySelector('.random-meme-label');
const saveCanvasBtn = document.querySelector('#save-canvas-button');
const slider = document.querySelector('.slider');
const colorPicker1 = document.querySelector('.color-picker1');
const colorPicker2 = document.querySelector('.color-picker2');
const c = document.querySelector('#c');
const canvas = new fabric.Canvas('c');
let imgWidth,imgHeight,canvasWidth,canvasHeight;
let topText,bottomText,img;
let randomMemeUrl;
let popularMemes = [];
let maxScrollLeft;
let slides;
let topTextColor,bottomTextColor;

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

const updateMemeCanvas = function(url,topTxt,bottomTxt) {
    canvas.clear();
    addTopText(topTxt,topTextColor);
    addBottomText(bottomTxt,bottomTextColor)
    addImage(url);
}

const addImage = function(url){
    fabric.Image.fromURL(url,function(image) {
        canvas.setDimensions({width:800,height:500});
        fitImageSize (image);
        canvas.add(image);
        image.center();
        image.lockMovementX = true; 
        image.lockMovementY = true;
        image.selectable = false;
        img.setAttribute("crossOrigin",'Anonymous')
        canvas.sendToBack(image);
    },{crossOrigin: 'anonymous'})    
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

const addTopText = function(topTxt,fillColor='black'){
    topText = new fabric.Text(topTxt,{
        paintFirst: "stroke",
        fill: fillColor,
        strokeWidth:4,
        stroke: 'white',
        fontSize : 55,
        fontFamily:'sans-serif',
        left:canvasWidth/2,
        top:canvasHeight/50,
    })
    canvas.add(topText);
    canvas.bringToFront(topText);
}

const addBottomText = function(BottomTxt,fillColor='black'){
    bottomText = new fabric.Text(BottomTxt,{
        paintFirst: "stroke",
        fill:fillColor,
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
    addTopText(topTextInput.value,topTextColor)
});

bottomTextInput.addEventListener('keyup',() => {
    canvas.remove(bottomText);
    addBottomText(bottomTextInput.value,bottomTextColor)
});

randomMemeBtn.addEventListener('click', async function() {
    await getRandomMemeUrl();
    img = new Image();
    img.src = randomMemeUrl;
    img.addEventListener('load',function() {
      updateMemeCanvas(img.src,topTextInput.value,bottomTextInput.value);
    },{once:true});
})

const renderPopularMemes = async function() {
    await getPopularMemes();
    console.log(popularMemes);
    popularMemes.forEach(meme => {
        const markUp = `<div data-id=${meme.id} class="slider-item">
        <img alt="" src=${meme.url}>
        <span>${meme.name}</span>
       </div>`;
       slider.insertAdjacentHTML('afterbegin',markUp);
    });
    maxScrollLeft = slider.scrollWidth - slider.clientWidth;
    slides = slider.children;
}

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

saveCanvasBtn.addEventListener('click',function() {
    c.toBlob(function(blob){
        saveAs(blob,"picture.png","image/png");
    },);
});

const selectFromPopularMemes = function() {
    document.querySelectorAll('.slider-item').forEach(selectedMeme => {
        selectedMeme.addEventListener('click',()=> {
            popularMemes.forEach(popularMeme => {
               if (popularMeme.id === selectedMeme.getAttribute('data-id')) {
                   updateMemeCanvas(popularMeme.url,topTextInput.value,bottomTextInput.value)
               }
            })
        })
    })
}

colorPicker1.addEventListener("change",function() {
    topTextColor = colorPicker1.value;
    canvas.remove(topText);
    addTopText(topTextInput.value,topTextColor)
});


colorPicker2.addEventListener("change",function() {
    bottomTextColor = colorPicker2.value;
    canvas.remove(bottomText);
    addBottomText(bottomTextInput.value,bottomTextColor)
});

const init = async function() {
    await renderPopularMemes();
    pauseSlider(slider,slides,maxScrollLeft);
    selectFromPopularMemes();
}

init();

