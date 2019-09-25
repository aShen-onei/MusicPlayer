// 获取歌曲的vkey拼接成歌曲请求url

import jsonp from 'commons/js/jsonp.js'
import { commonParams } from './config.js'

// 获取歌曲的vkey并拼接
export function getSongPlayUrl(songMid, songType) {
  const formatdata = {
    'req': {
      'module': 'CDN.SrfCdnDispatchServer',
      'method': 'GetCdnDispatch',
      'param': {
        'guid': '6522994400',
        'calltype': 0,
        'userip': ''
      }
    },
    'req_0': {
      'module': 'vkey.GetVkeyServer',
      'method': 'CgiGetVkey',
      'param': {
        'guid': '6522994400',
        'songmid': [songMid],
        'songtype': [songType],
        'uin': '0996052370',
        'loginflag': 1,
        'platform': '20'
      }
    },
    'comm': {
      'uin': '0996052370',
      'format': 'json',
      'ct': 24,
      'cv': 0
    }
  }
  // 请求的url
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const data = Object.assign({}, commonParams, {
    '-': 'getplaysongvkey23994238586850547',
    g_tk: 1748572626,
    hostUin: 0,
    format: 'json',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: JSON.stringify(formatdata)
  })
  return jsonp(url, data)
}