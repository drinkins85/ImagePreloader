const IMManager = new imageManager();

// loadIndicator
let loadProgress = function(progress, id){
    let loadIndicator = document.getElementById(id).querySelector('.load-indicator');
    let progressBar = loadIndicator.querySelector('.progress-bar');
    let progressPc = loadIndicator.querySelector('.progress-pc');
    progressBar.style.width = progress + '%';
    progressPc.innerHTML = progress + '%';
    if (progress === 100){
        loadIndicator.classList.add('hidden');
    }
};

// callback
let showImage = function(img, id){
    if (img){
        document.getElementById(id).appendChild(img);
    } else {
        document.getElementById(id).innerHTML = "Loading error";
    }
};

let gallery = document.getElementById('gallery');

IMManager.getUrl(`img/IMG_1.jpg`, (progress)=>loadProgress(progress, `img_1`), (img)=>showImage(img, `img_1`));
IMManager.getUrl(`img/IMG_2.jpg`, (progress)=>loadProgress(progress, `img_2`), (img)=>showImage(img, `img_2`));