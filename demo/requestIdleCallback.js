console.log('Hello, world!');

let workCount = 0;

function workLoop(deadline) {
    workCount++;
    while (deadline.timeRemaining() > 1) {
        // 执行任务
        console.log('workLoop: do work ' + workCount);
    }

    requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
