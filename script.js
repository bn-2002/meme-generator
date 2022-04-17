const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext("2d");
const img = document.querySelector('.img');

fetch('https://api.imgflip.com/get_memes')
.then(response => response.json())
.then(response => {
    img.src = response.data.memes[Math.floor(Math.random()*(101))].url;
});