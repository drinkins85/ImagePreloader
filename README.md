# ImagePreloader

Image preloader with progress bar.
Use FETCH for preload images. Work only for CORS requests.

[Demo](http://this.drinkins.com/image-preloader/)

## Usage

```javascript

const imgManager = new imageManager({
                    maxRequest: 4, // max simultaneous requests count
                    maxRetries: 1, // retries count
                    timeout: 1000 // retries timeout
                    });


```

### Preload

```javascript
imgManager.getUrl('url', progressFunc, callbackFunc);
```

**url** (string) -  path to image
**progressFunc** (function) - get progress(number from 0 to 100) as argument. Used for render progress bar.
**callbackFunc** (function) - get Image object as argument/ Used for render image

### Example

#### JavaScript

```javascript
const imgManager = new imageManager({
                    maxRequest: 4, // max simultaneous requests count
                    maxRetries: 1, // retries count
                    timeout: 1000 // retries timeout
                    });

let imageContainer = document.getElementById('img_1');
let loadIndicator = imageContainer.querySelector('.load-indicator');
let progressBar = loadIndicator.querySelector('.progress-bar');
let progressPc = loadIndicator.querySelector('.progress-pc');

const loadProgress = function(progress){
    progressBar.style.width = progress + '%';
    progressPc.innerHTML = progress + '%';
    if (progress === 100){
        loadIndicator.classList.add('hidden'); // hide progress bar when 100%
    }
};

const showImage = function(img, id){
          if (img){
              imageContainer.appendChild(img);
          } else {
              imageContainer.innerHTML = "Loading error";
          }
      };

imgManager.getUrl('img/pic_1.jpg', loadProgress, showImage);

```

#### HTML

```html

<div class="img-container" id="img_1">
    <div class="load-indicator">
        <div class="progress-bar"></div>
        <div class="progress-pc"></div>
    </div>
</div>

<!-- JS code here -->

<!-- For old browsers need Promise and Fetch polyfills -->
<script src="promise-polyfill.js"></script>
<script src="fetch-polyfill.js"></script>
<script src="imagePreloader.js" defer></script>
```
