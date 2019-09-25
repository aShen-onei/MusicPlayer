// 请求通用接口
// 引入jsonp，解决跨域
// import originJSONP from 'jsonp'

import axios from 'axios'
// 向服务器提交的信息拼接
function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : '' // 不是undefined才拼接
    url += `&${k}=${encodeURIComponent(value)}` // 拼接url
  }
  return url ? url.substring(1) : '' // 去除第一个&
}
// 请求
const XHR = function(url, data) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data) // 拼接url
  return new Promise((resolve, reject) => {
    axios.get(url, {
    }).then(function(res) {
      resolve(res)
    }).catch(function(err) {
      reject(err)
    })
    // originJSONP(url, option, (error, data) => {
    //   if(!error){
    //     resolve(data) //成功
    //   }else{
    //     reject(error) //失败
    //   }
    // })
  })
}

export default XHR