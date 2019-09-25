// 创建歌曲类
// import { getSongPlayUrl } from '@/api/song.js'
import { getSongLyrics } from '@/api/lyrics.js'
import { Base64 } from 'js-base64'
export default class Song {
  constructor({ id, mid, singer, name, album, duration, type, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.type = type
    this.image = image
    this.url = url
  }

  // 获取歌词
  getLyrics() {
    // 如果该歌词已经获取过了
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getSongLyrics(this.mid).then((res) => {
        if (res.data.code === 0) {
          // 解码
          this.lyric = Base64.decode(res.data.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('error!'))
        }
      })
    })
  }
}

// 创建一个对象，返回一个对象
// data.singer.data.songlist
export function creatSong(song) {
  console.log()
  return new Song({
    id: song.id,
    mid: song.mid,
    singer: filterSinger(song.singer),
    name: song.name,
    album: song.album.name,
    duration: song.interval,
    type: song.type,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.album.mid}.jpg?max_age=2592000`,
    url: getSongUrl(song.mid, song.type)
  })
}
// 演唱歌手遍历
export function filterSinger(singer) {
  let ret = []
  if (!singer) return
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}
// 获取歌曲的url
export function getSongUrl(songid, songtype) {
  // url的头
  let url = 'http://ws.stream.qqmusic.qq.com/'
  // getSongPlayUrl(songid, songtype).then((res) => {
  //   res.data.req_0.data.midurlinfo.forEach((purl) => {
  //     url += purl.purl
  //   })
  // })
  return url
}