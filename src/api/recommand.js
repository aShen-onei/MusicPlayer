// 请求推荐的轮播页面
// https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg歌单

import jsonp from 'commons/js/jsonp.js'
import { commonParams } from './config.js'

export function getRecommand() {
  // 请求的url
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    // 其他参数
    uin: 0,
    // _:1566958504373,
    platform: 'h5',
    needNewCode: 1
  })
  // 请求
  return jsonp(url, data)
}
export function getDiscList() {
  // url
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  const data = Object.assign({}, commonParams, {
    // 其他参数
    picmid: 1,
    rnd: 0.06431575398398004,
    g_tk: 1748572626,
    loginUin: 996052370,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 19
  })
  // 请求
  return jsonp(url, data)
}