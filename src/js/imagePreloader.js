class imageManager {
    constructor(options = {
                    maxRequest: 3,
                    maxRetries: 2,
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
                timer:0,
                loadProgress: loadProgress,
                callback: callback
            };
            // добавим задачу в очередь
            this.queue.push(newtask);
            // запустим задачи на выполнение
            this.runAll(newtask);
        } else {
            console.error(url,'is not a String');
            callback(null);
        }

    }

    runAll(){
        if (this.queue.length >0 && (this.taskCount < this.maxRequest)){
            this.nextTask();
        }
    }

    nextTask(){
        this.taskCount ++;
        let task = this.queue.shift();
        this.loadProgress(task)
            .then(res => {
                this.taskCount --;
                let blob = new Blob([res], {type: "image/jpg"});
                let img = new Image();
                img.src = window.URL.createObjectURL(blob);
                task.objImg = img;
                task.callback(img);
                this.runAll();
                // console.log("выполняется задач", this.taskCount, "в очереди задач", this.queue.length);
            })
            .catch(err => {
                task.retries++;
                this.taskCount --;
                if (task.retries <= this.maxRetries){
                    console.log("Еще попытка", task.retries);
                    setTimeout(()=>{
                        this.queue.push(task);
                        this.runAll();
                    },this.timeout)

                } else {
                    task.callback(null)
                }
            })
    }

    loadProgress(task){
        return  fetch(task.url, {
            method: 'GET',
            mode: 'cors'
        })
            .then(res => {

                if(res.status !== 200){
                    throw new Error(res.status);
                }
                let loaded = 0;
                let pos = 0;
                let contentLength = res.headers.get('Content-Length');
                let byteArr = new Uint8Array(contentLength);
                let reader = res.body.getReader();
                let pump = function(reader) {
                    return reader.read()
                        .then(function(result) {
                            if (result.done) {
                                return byteArr;
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
            })
            .catch(err => {
                throw new Error(err);
            });
    }

}