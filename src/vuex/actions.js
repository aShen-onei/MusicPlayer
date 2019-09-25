// 事件处理
import { playMode } from 'commons/js/config.js'
import { shuffle } from 'commons/js/util.js'
// 多个事件处理成一个动作
import * as types from './mutations-types'
// 选择播放，在歌手列表的时候点击歌曲
export const selectPlay = function({ commit, state }, { list, index }) {
  // 播放
  commit(types.SET_PLAY_STATE, true)
  // 全屏
  commit(types.SET_FULLSCREEN, true)
  // 从歌手列表点击歌曲进去的时候模式是默认的顺序播放模式
  commit(types.SET_SEQUENCE_LIST, list)
  // 播放列表
  // 当播放模式为随机播放时
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    // 随机播放列表
    commit(types.SET_PLAY_LIST, randomList)
    index = _findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  // 当前播放的歌曲的索引
  commit(types.SET_CURRENT_INDEX, index)
}
// 歌手列表处点击随机播放全部
export const randomPlay = function ({ commit, state }, { list }) {
  console.log(list)
  // 设置播放模式
  commit(types.SET_MODE, playMode.random)
  // 设置播放列表
  commit(types.SET_SEQUENCE_LIST, list)
  // 设置播放列表
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  // 设置当前播放的歌曲index
  commit(types.SET_CURRENT_INDEX, 0)
  // 播放
  commit(types.SET_PLAY_STATE, true)
  // 全屏
  commit(types.SET_FULLSCREEN, true)
}

/**
 * 描述: 寻找随机列表中歌曲的正确位置
 * 参数:
 *      list: 随机的播放列表
 *      song: 需要播放的歌曲
 * 功能: 找寻徐娅播放的歌曲在重新生成的播放列表中的index
 * 返回值: index，需要找寻的歌曲的下标
 */
function _findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}