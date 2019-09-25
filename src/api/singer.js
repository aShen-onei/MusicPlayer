// https://u.y.qq.com/cgi-bin/musicu.fcg //热门歌手

import jsonp from 'commons/js/jsonp.js'
import { commonParams } from './config.js'

// 获取歌手信息
export function getSingerList() {
  const formatdata = {
    'comm': {
      'ct': 24,
      'cv': 0
    },
    'singerList': {
      'module': 'Music.SingerListServer',
      'method': 'get_singer_list',
      'param': {
        'area': -100,
        'sex': -100,
        'genre': -100,
        'index': -100,
        'sin': 0,
        'cur_page': 1
      }
    }
  }
  // 请求的url
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  // 参数data
  const data = Object.assign({}, {
    '-': 'getUCGI6204468741521658',
    g_tk: 1748572626,
    loginUin: 996052370,
    hostUin: 0,
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: JSON.stringify(formatdata)
  }, commonParams)

  return jsonp(url, data)
}

// 获取歌手详细信息
export function getSingerDetail(singerId) {
  const formatdata = {
    'comm': {
      'ct': 24,
      'cv': 0
    },
    'singer': {
      'method': 'get_singer_detail_info',
      'param': {
        'sort': 5,
        'singermid': singerId,
        'sin': 0,
        'num': 100
      },
      'module': 'music.web_singer_info_svr'
    }
  }
  // 请求的url
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  // 参数
  const data = Object.assign({}, commonParams, {
    '-': 'getUCGI9244915051201494',
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