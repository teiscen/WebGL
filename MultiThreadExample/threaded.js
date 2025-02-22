const {Worker, threadId} = require('worker_threads');


//https://www.youtube.com/watch?v=_Im4_3Z1NxQ
const doFib = async (iterations) => {
    return new Promise((resolve, reject) => {
        const start = Date.now()
        // Start Worker
        const worker = new Worker('./fib.js', {
            workerData: {
                iterations
            }
        })
        // listen for msg from worker
        worker.once('message', (data) => {
            console.log(`worker [${worker,threadId}]: done in ${Date.now() - start}ms`)
            resolve(data)
        })

        //listen for error from worker
        worker.once('error', (err) => reject(err))
    })
}

const main = async() => {
    try {
        const start = Date.now()
        const values = await Promise.all([
            doFib(40),
            doFib(40),
            doFib(40),
            doFib(40),
            doFib(40),
            doFib(40),
            doFib(40),
            doFib(40),
            doFib(40),
            doFib(40),
            doFib(40)
        ])
        console.log('values: ', values)
        console.log(`ALL Done in ${Date.now() - start}ms`)
    } catch (err) {
        console.error('Error occurred:', err);
    } finally {
        console.log('Exiting main function');
    }
}

main();