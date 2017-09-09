'use strict';

var IMManager = new imageManager();

// loadIndicator
var loadProgress = function loadProgress(progress, id) {
    var loadIndicator = document.getElementById(id).querySelector('.load-indicator');
    var progressBar = loadIndicator.querySelector('.progress-bar');
    var progressPc = loadIndicator.querySelector('.progress-pc');
    progressBar.style.width = progress + '%';
    progressPc.innerHTML = progress + '%';
    if (progress === 100) {
        loadIndicator.classList.add('hidden');
    }
};

// callback
var showImage = function showImage(img, id) {
    if (img) {
        document.getElementById(id).appendChild(img);
    } else {
        document.getElementById(id).innerHTML = "Loading error";
    }
};

var gallery = document.getElementById('gallery');

IMManager.getUrl('img/IMG_1.jpg', function (progress) {
    return loadProgress(progress, 'img_1');
}, function (img) {
    return showImage(img, 'img_1');
});
IMManager.getUrl('img/IMG_2.jpg', function (progress) {
    return loadProgress(progress, 'img_2');
}, function (img) {
    return showImage(img, 'img_2');
});