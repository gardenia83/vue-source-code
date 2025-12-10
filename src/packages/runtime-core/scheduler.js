/**
 * 将任务添加到队列中并异步执行
 * @param {Function} job - 需要执行的任务函数
 * @returns {void}
 */
export const queueJob = (job) => {
  // 避免重复添加相同的任务到队列中
  if (!queue.includes(job)) {
    queue.push(job);
  }

  // 如果当前没有在刷新队列，则开始异步刷新过程
  if (!isFlushing) {
    isFlushing = true;
    resolvePromise.then(() => {
      isFlushing = false;
      // 创建队列副本并清空原队列，避免在执行过程中新添加的任务被立即执行
      let copy = queue.slice();
      queue.length = 0;

      // 依次执行队列中的所有任务
      for (let i = 0; i < copy.length; i++) {
        const job = copy[i];
        job();
      }
    });
  }
};
