// 操作dom的相关函数集合

// 向dom中添加class
export function addClass(el, className) {
  // 首先检测元素上是否有className
  if (hasClass(el, className)) return
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}
// 检测是否存在
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className) // 正则表达式匹配
}

// 在元素中提取数据
export function getData(el, name, val) {
  const prefix = 'data-'
  if (val) {
    // 为data-name添加值
    return el.setAttribute(prefix + name, val)
  } else {
    // 获取data-name的值
    return el.getAttribute(prefix + name)
  }
}
// 人力检测浏览器？
let elementStyle = document.createElement('div').style
// 一个工厂类
let vendor = (() => {
  let transform = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transform) {
    if (elementStyle[transform[key]] !== undefined) {
      return key
    }
  }
  return false
})()

// prefixer前缀
export function prefixer(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase.substr(1)
}