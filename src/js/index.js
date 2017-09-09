const IMManager = new imageManager();

// функция отображения загрузчика
let loadProgress = function(progress, id){
    let loadIndicator = document.getElementById(id).querySelector('.load-indicator');
    loadIndicator.style.width = progress + '%';
    if (progress === 100){
        loadIndicator.classList.add('hidden');
    }
};

// callback получает на вход объект img или null в случае ошибки
let showImage = function(img, id){
    if (img){
        document.getElementById(id).appendChild(img);
    } else {
        document.getElementById(id).innerHTML = "Loading error";
    }
};

let gallery = document.getElementById('gallery');

for (let i=0; i<15; i++){
    let imgcontainer = document.createElement('div');
    imgcontainer.classList.add('img-container');
    imgcontainer.setAttribute('id',`img_${i}`);
    let loader = document.createElement('div');
    loader.classList.add('load-indicator');
    imgcontainer.appendChild(loader);
    gallery.appendChild(imgcontainer);
    IMManager.getUrl(`img/IMG_${i}.jpg`, (progress)=>loadProgress(progress, `img_${i}`), (img)=>showImage(img, `img_${i}`));
}