const {workerData, parentPort} = require('worker_threads')

function fibonacci(n) {
    return  n < 1 ? 0
         :  n <= 2 ? 1
         :  fibonacci(n - 1) + fibonacci(n - 2)
}

const result = fibonacci(workerData.iterations)

// send the data from the worker back up to the parent
parentPort.postMessage(result)