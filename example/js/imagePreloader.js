'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var imageManager = function () {
    function imageManager() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
            maxRequest: 4,
            maxRetries: 1,
            timeout: 1000
        };

        _classCallCheck(this, imageManager);

        this.maxRequest = options.maxRequest;
        this.maxRetries = options.maxRetries;
        this.timeout = options.timeout;
        this.queue = [];
        this.taskCount = 0;
    }

    _createClass(imageManager, [{
        key: 'getUrl',
        value: function getUrl(url, loadProgress, callback) {

            if (typeof loadProgress !== 'function') {
                console.error(loadProgress, 'is not a Function');
                return;
            }

            if (typeof callback !== 'function') {
                console.error(callback, 'is not a Function');
                return;
            }

            if (typeof url === 'string') {
                var newtask = {
                    url: url,
                    retries: 0,
                    loadProgress: loadProgress,
                    callback: callback
                };
                // add to queue
                this.queue.push(newtask);
                // run tasks
                this.runAll();
            } else {
                console.error(url, 'is not a String');
                callback(null);
            }
        }
    }, {
        key: 'runAll',
        value: function runAll() {
            if (this.queue.length > 0 && this.taskCount < this.maxRequest) {
                this.nextTask();
            }
        }
    }, {
        key: 'nextTask',
        value: function nextTask() {
            var _this = this;

            this.taskCount++;
            // get first task from queue
            var task = this.queue.shift();
            this.loadProgress(task).then(function (res) {
                _this.taskCount--;
                var img = new Image();
                img.src = window.URL.createObjectURL(res);
                task.loadProgress(100);
                task.callback(img);
                _this.runAll();
            }).catch(function (err) {
                task.retries++;
                _this.taskCount--;
                if (task.retries <= _this.maxRetries) {
                    setTimeout(function () {
                        _this.queue.push(task);
                        _this.runAll();
                    }, _this.timeout);
                } else {
                    task.callback(null);
                    _this.runAll();
                }
            });
        }
    }, {
        key: 'loadProgress',
        value: function loadProgress(task) {

            return fetch(task.url, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application'
                }
            }).then(function (res) {
                if (res.status !== 200) {
                    throw new Error(res.status);
                }
                if (res.body) {
                    var loaded = 0;
                    var pos = 0;
                    var contentLength = +res.headers.get('Content-Length');
                    var byteArr = new Uint8Array(contentLength);
                    var reader = res.body.getReader();
                    var pump = function pump(reader) {
                        return reader.read().then(function (result) {
                            if (result.done) {
                                return new Blob([byteArr], { type: "image/jpg" });
                            }
                            var chunk = result.value;
                            byteArr.set(chunk, pos);
                            pos += chunk.byteLength;
                            loaded += chunk.byteLength;
                            var progress = Math.floor(loaded / contentLength * 100);
                            task.loadProgress(progress);
                            return pump(reader);
                        });
                    };
                    return pump(reader);
                } else {
                    // if stream not support
                    var progress = 0;
                    setTimeout(function incProgress() {
                        progress++;
                        task.loadProgress(progress);
                        if (progress < 90) {
                            setTimeout(incProgress, 70);
                        }
                    }, 70);
                    return res.blob();
                }
            }).catch(function (err) {
                throw new Error(err);
            });
        }
    }]);

    return imageManager;
}();