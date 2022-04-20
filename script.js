const imageFileInput = document.getElementById("image-file-input");
const topTextInput = document.getElementById("top-text");
const bottomTextInput = document.getElementById("bottom-text");
const randomMemeBtn = document.querySelector(".random-meme-label");
const saveCanvasBtn = document.querySelector("#save-canvas-button");
const slider = document.querySelector(".slider");
const colorPicker1 = document.querySelector(".top-text-color-picker");
const colorPicker2 = document.querySelector(".bottom-text-color-picker");
const fontSize1 = document.querySelector(".top-text-font-size");
const fontSize2 = document.querySelector(".bottom-text-font-size");
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");
const strokeColorPicker1 = document.querySelector(".top-text-stroke-color-picker");
const strokeColorPicker2 = document.querySelector(".bottom-text-stroke-color-picker");
const c = document.querySelector("#c");
const canvas = new fabric.Canvas("c", {
  height: 500,
  width: 700,
});
let imgWidth, imgHeight, canvasWidth, canvasHeight;
let topText, bottomText, img;
let randomMemeUrl;
let popularMemes = [];
let maxScrollLeft;
let slides;
let topTextColor, bottomTextColor;
let topTextFontSize, bottomTextFontSize;
let topTextStrokeColor, bottomTextStrokeColor;

const getPopularMemes = async function () {
  try {
    await fetch("https://api.imgflip.com/get_memes")
      .then((response) => response.json())
      .then((response) => {
        popularMemes = response.data.memes;
      });
  } catch (err) {
    console.log(err);
  }
};

const updateMemeCanvas = function (url, topTxt, bottomTxt) {
  canvas.clear();
  addTopText(topTxt,topTextColor,topTextFontSize,topTextStrokeColor);
  addBottomText(
    bottomTxt,
    bottomTextColor,
    bottomTextFontSize,
    bottomTextStrokeColor
  );
  addImage(url);
};

const addImage = function (url) {
  fabric.Image.fromURL(
    url,
    function (image) {
      fitImageSize(image);
      canvas.add(image);
      image.center();
      image.lockMovementX = true;
      image.lockMovementY = true;
      image.selectable = false;
      canvas.sendToBack(image);
    },
    { crossOrigin: "anonymous" }
  );
};

const fitImageSize = function (image) {
  imgWidth = image.width;
  imgHeight = image.height;
  canvasWidth = canvas.getWidth();
  canvasHeight = canvas.getHeight();

  let imgRatio = imgWidth / imgHeight;
  let canvasRatio = canvasWidth / canvasHeight;
  if (imgRatio <= canvasRatio) {
    if (imgHeight > canvasHeight) {
      image.scaleToHeight(canvasHeight);
    }
  } else {
    if (imgWidth > canvasWidth) {
      image.scaleToWidth(canvasWidth);
    }
  }
};

const addTopText = function (
  topTxt,
  fillColor = "white",
  fontSize = "55",
  strokeColor = "black"
) {
  if (+fontSize <= 0) {
    alert("please enter valid amount");
    fontSize = 55;
  }

  topText = new fabric.Text(topTxt, {
    paintFirst: "stroke",
    fill: fillColor,
    strokeWidth: 4,
    stroke: strokeColor,
    fontSize: +fontSize,
    fontFamily: "sans-serif",
    left: canvasWidth / 2,
    top: canvasHeight / 50,
  });
  canvas.add(topText);
  canvas.bringToFront(topText);
};

const addBottomText = function (
  BottomTxt,
  fillColor = "white",
  fontSize = "55",
  strokeColor = "black"
) {
  if (+fontSize <= 0) {
    alert("please enter valid amount");
    fontSize = 55;
  }

  bottomText = new fabric.Text(BottomTxt, {
    paintFirst: "stroke",
    fill: fillColor,
    strokeWidth: 4,
    stroke: strokeColor,
    fontSize: fontSize,
    fontFamily: "sans-serif",
    left: canvasWidth / 2,
    top: canvasHeight - canvasHeight / 4,
  });
  canvas.add(bottomText);
  canvas.bringToFront(bottomText);
};

const getRandomMemeUrl = async function () {
  try {
    await fetch("https://api.imgflip.com/get_memes")
      .then((response) => response.json())
      .then((response) => {
        randomMemeUrl =
          response.data.memes[Math.floor(Math.random() * 101)].url;
      });
  } catch (err) {
    console.log(err);
  }
};

imageFileInput.addEventListener("change", function (e) {
  const inputImageDataUrl = URL.createObjectURL(e.target.files[0]);
  img = new Image();
  img.src = inputImageDataUrl;
  img.addEventListener(
    "load",
    function () {
      updateMemeCanvas(img.src, topTextInput.value, bottomTextInput.value);
    },
    { once: true }
  );
});

topTextInput.addEventListener("keyup", () => {
  canvas.remove(topText);
  addTopText(
    topTextInput.value,
    topTextColor,
    topTextFontSize,
    topTextStrokeColor
  );
});

bottomTextInput.addEventListener("keyup", () => {
  canvas.remove(bottomText);
  addBottomText(
    bottomTextInput.value,
    bottomTextColor,
    bottomTextFontSize,
    bottomTextStrokeColor
  );
});

randomMemeBtn.addEventListener("click", async function () {
  await getRandomMemeUrl();
  img = new Image();
  img.src = randomMemeUrl;
  img.addEventListener(
    "load",
    function () {
      updateMemeCanvas(img.src, topTextInput.value, bottomTextInput.value);
    },
    { once: true }
  );
});

const renderPopularMemes = async function () {
  await getPopularMemes();
  popularMemes.forEach((meme) => {
    const markUp = `<div data-id=${meme.id} class="slider-item">
        <img alt="" src=${meme.url}>
        <span class="meme-name">${meme.name}</span>
       </div>`;
    slider.insertAdjacentHTML("beforeend", markUp);
  });
  maxScrollLeft = slider.scrollWidth - slider.clientWidth;
  slides = slider.children;
};

function autoPlay(Slider,MaxScrollLeft) {
  if (Slider.scrollLeft > MaxScrollLeft - 1) {
    Slider.scrollLeft -= MaxScrollLeft;
  } else {
    Slider.scrollLeft += 1;
  }
}

const pauseSlider = function (Slider,Slides,MaxScrollLeft) {
  for (let slide of Slides) {
    slide.addEventListener("mouseover", () => {
      clearInterval(play);
    });
    slide.addEventListener("mouseout", () => {
      play = setInterval(function () {
        autoPlay(Slider,MaxScrollLeft);
      }, 50);
      return play;
    });
  }
};

let play = setInterval(function () {
  autoPlay(slider, maxScrollLeft);
}, 50);

saveCanvasBtn.addEventListener("click", function () {
  c.toBlob(function (blob) {
    saveAs(blob, "picture.png", "image/png");
  });
});

const selectFromPopularMemes = function () {
  document.querySelectorAll(".slider-item").forEach((selectedMeme) => {
    selectedMeme.addEventListener("click", () => {
      popularMemes.forEach((popularMeme) => {
        if (popularMeme.id === selectedMeme.getAttribute("data-id")) {
          updateMemeCanvas(
            popularMeme.url,
            topTextInput.value,
            bottomTextInput.value
          );
        }
      });
    });
  });
};

colorPicker1.addEventListener("change", function () {
  topTextColor = colorPicker1.value;
  canvas.remove(topText);
  addTopText(
    topTextInput.value,
    topTextColor,
    topTextFontSize,
    topTextStrokeColor
  );
});

colorPicker2.addEventListener("change", function () {
  bottomTextColor = colorPicker2.value;
  canvas.remove(bottomText);
  addBottomText(bottomTextInput.value, bottomTextColor, bottomTextStrokeColor);
});

fontSize1.addEventListener("change", function () {
  topTextFontSize = fontSize1.value;
  canvas.remove(topText);
  addTopText(
    topTextInput.value,
    topTextColor,
    topTextFontSize,
    topTextStrokeColor
  );
});

fontSize2.addEventListener("change", function () {
  bottomTextFontSize = fontSize2.value;
  canvas.remove(bottomText);
  addBottomText(
    bottomTextInput.value,
    bottomTextColor,
    bottomTextFontSize,
    bottomTextStrokeColor
  );
});

strokeColorPicker1.addEventListener("change", function () {
  topTextStrokeColor = strokeColorPicker1.value;
  canvas.remove(topText);
  addTopText(
    topTextInput.value,
    topTextColor,
    topTextFontSize,
    topTextStrokeColor
  );
});

strokeColorPicker2.addEventListener("change", function () {
  bottomTextStrokeColor = strokeColorPicker1.value;
  canvas.remove(bottomText);
  addBottomText(
    bottomTextInput.value,
    bottomTextColor,
    bottomTextFontSize,
    bottomTextStrokeColor
  );
});

const init = async function () {
  await renderPopularMemes();
  pauseSlider(slider, slides, maxScrollLeft);
  selectFromPopularMemes();
};

init();

const arrowLeftMove = function (s,arrowL) {
  arrowL.addEventListener("click", () => {
    s.scrollLeft -= 125;
  });
};

const arrowRightMove = function (s,arrowR) {
  arrowR.addEventListener("click", () => {
    s.scrollLeft += 125;
  });
};

arrowLeftMove(slider, arrowLeft);
arrowRightMove(slider, arrowRight);


const options = {
  bottom: '25px', // default: '32px'
  right: 'unset', // default: '32px'
  left: '32px', // default: 'unset'
  time: '0.3s', // default: '0.3s'
  mixColor: '#fff', // default: '#fff'
  backgroundColor: '#fff',  // default: '#fff'
  buttonColorDark: '#100f2c',  // default: '#100f2c'
  buttonColorLight: '#fff', // default: '#fff'
  saveInCookies: true, // default: true,
  label: '🌓', // default: ''
  autoMatchOsTheme: true // default: true
}

new Darkmode(options).showWidget();