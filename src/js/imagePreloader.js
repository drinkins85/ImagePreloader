class imageManager {
    constructor(options = {
                    maxRequest: 4,
                    maxRetries: 1,
                    timeout: 1000
                }){
        this.maxRequest = options.maxRequest;
        this.maxRetries = options.maxRetries;
        this.timeout = options.timeout;
        this.queue = [];
        this.taskCount = 0;
    }

    getUrl(url, loadProgress, callback){

        if (typeof loadProgress !== 'function'){
            console.error(loadProgress, 'is not a Function');
            return;
        }

        if (typeof callback !== 'function'){
            console.error(callback, 'is not a Function');
            return;
        }

        if (typeof  url === 'string'){
            let newtask = {
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
            console.error(url,'is not a String');
            callback(null);
        }

    }

    runAll(){
        if (this.queue.length > 0 && (this.taskCount < this.maxRequest)){
            this.nextTask();
        }
    }

    nextTask(){
        this.taskCount ++;
        // get first task from queue
        let task = this.queue.shift();
        this.loadProgress(task)
            .then(res => {
                this.taskCount --;
                let img = new Image();
                img.src = window.URL.createObjectURL(res);
                 task.loadProgress(100);
                task.callback(img);
                this.runAll();
            })
            .catch(err => {
                task.retries++;
                this.taskCount --;
                if (task.retries <= this.maxRetries){
                    setTimeout(()=>{
                        this.queue.push(task);
                        this.runAll();
                    },this.timeout)
                } else {
                    task.callback(null);
                    this.runAll();
                }
            })
    }

    loadProgress(task){

        return  fetch(task.url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type':'application'
            }
        })
            .then(res => {
                if(res.status !== 200){
                    throw new Error(res.status);
                }
                if (res.body){
                    let loaded = 0;
                    let pos = 0;
                    let contentLength = +res.headers.get('Content-Length');
                    let byteArr = new Uint8Array(contentLength);
                    let reader = res.body.getReader();
                    let pump = function(reader) {
                        return reader.read()
                            .then(function(result) {
                                if (result.done) {
                                    return new Blob([byteArr], {type: "image/jpg"});
                                }
                                let chunk = result.value;
                                byteArr.set(chunk, pos);
                                pos += chunk.byteLength;
                                loaded += chunk.byteLength;
                                let progress = Math.floor(((loaded / contentLength) * 100));
                                task.loadProgress(progress);
                                return pump(reader);
                            });
                    };
                    return pump(reader);
                } else {
                    // if stream not support
                    let progress = 0;
                    setTimeout(function incProgress() {
                        progress++;
                        task.loadProgress(progress);
                        if (progress < 90){
                            setTimeout(incProgress, 70);
                        }
                    }, 70);
                    return res.blob();
                }
            })
            .catch(err => {
                throw new Error(err);
            });
    }

}