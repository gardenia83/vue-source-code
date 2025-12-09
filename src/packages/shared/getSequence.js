/**
 * 获取数组中最长递增子序列的索引序列
 *
 * 该算法使用贪心+二分查找的方式，时间复杂度为 O(n log n)
 * 主要用于 Vue3 的 diff 算法中，找出需要移动的节点最少的更新策略
 *
 * @param {number[]} arr - 输入的数字数组，通常代表新旧节点的相对位置关系
 * @returns {number[]} 返回最长递增子序列在原数组中的索引数组
 *
 * @example
 * // 返回 [0, 2, 4]，对应值为 [1, 3, 5]
 * getSequence([1, 2, 3, 4, 5])
 *
 * @example
 * // 返回 [0, 1, 4]，对应值为 [2, 6, 9]
 * getSequence([2, 8, 6, 7, 9])
 */
export function getSequence(arr) {
  // 前驱数组，用于记录每个元素的前一个元素索引，便于最后回溯路径
  const p = arr.slice();

  // 结果数组，存储递增子序列的索引
  const result = [0];

  // 循环控制变量
  let i, j, u, v, c;

  // 数组长度
  const len = arr.length;

  // 遍历输入数组，构建递增序列
  for (i = 0; i < len; i++) {
    // 当前遍历的元素值
    const arrI = arr[i];

    // 忽略值为 0 的元素（在 Vue 中通常表示该节点不需要移动）
    if (arrI !== 0) {
      // 获取当前递增序列最后一个元素的索引
      j = result[result.length - 1];

      // 如果当前元素大于递增序列末尾元素，则直接扩展序列
      if (arr[j] < arrI) {
        // 记录前驱节点索引
        p[i] = j;
        // 将当前索引加入递增序列
        result.push(i);
        continue;
      }

      // 使用二分查找确定当前元素在递增序列中的合适位置
      u = 0;
      v = result.length - 1;

      // 在 result 数组中二分查找插入位置
      while (u < v) {
        // 计算中间位置
        c = (u + v) >> 1;

        // 如果中间元素小于当前元素，则搜索右半部分
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          // 否则搜索左半部分（包括中间位置）
          v = c;
        }
      }

      // 找到合适位置后更新结果数组
      if (arrI < arr[result[u]]) {
        // 如果不是第一个位置，记录前驱节点
        if (u > 0) {
          p[i] = result[u - 1];
        }
        // 更新当前位置的索引
        result[u] = i;
      }
    }
  }

  // 通过前驱数组重构完整的最长递增子序列
  u = result.length;
  v = result[u - 1];

  // 从后往前根据前驱关系重建序列
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }

  return result;
}
