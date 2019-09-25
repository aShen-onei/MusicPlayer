// QQ音乐歌词接口https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg
import XHR from 'commons/js/jsonp.js'
import { commonParams } from './config.js'
export function getSongLyrics(mid) {
  // 请求的url,使用本地的代理接口
  const url = 'api/getLyric'
  const data = Object.assign({}, commonParams, {
    '-': 'MusicJsonCallback_lrc',
    pcachetime: +new Date(),
    songmid: mid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0
  })
  return XHR(url, data)
}