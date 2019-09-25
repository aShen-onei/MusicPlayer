// import { getSongPlayUrl } from '@/api/song.js'
// 从state中获取数据
export const singer = state => state.singer
// 播放器播放状态
export const playing = state => state.playing
// 播放器是否全屏
export const fullScreen = state => state.fullScreen
// 获取播放列表
export const playList = state => state.playList
// 设置播放模式时候的播放列表
export const sequenceList = state => state.sequenceList
// 设置播放模式
export const mode = state => state.mode
// 正在播放的歌曲的playlist索引
export const currentIndex = state => state.currentIndex
// 正在播放的歌曲
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}
// 正在播放歌曲的url
// export const url = (state) => {
//   let currentSong = state.playList[state.currentIndex]
//   // this.url = 'http://ws.stream.qqmusic.qq.com/'
//   if (!currentSong) return
//   console.log(currentSong)
//   getSongPlayUrl(currentSong.mid, currentSong.type).then((res) => {
//     res.data.req_0.data.midurlinfo.forEach((purl) => {
//       url += purl.purl
//     })
//   })
// }