/**
 * 描述: 洗牌函数
 * 参数:
 *      arr: 需要洗牌的数组
 * 功能: 将传入的数组进行洗牌打乱
 * 返回值: 返回洗牌后的数组
 */
export function shuffle(arr) {
  console.log(typeof (arr))
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = _getRandomNumber(0, i)
    // 交换
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
/**
 * 描述: 两数之间的随机数函数
 * 参数:
 *      min: 区间最小值
 *      max: 区间最大值
 * 功能: 返回两数区间的一个随机数
 * 返回值: Number
 */
function _getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}