import { playMode } from 'commons/js/config.js'
// 状态文件
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1
}

export default state