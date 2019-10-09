<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" :src="currentSong.image">
      </div>
      <div class="top">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <h2 class="subtitle" v-html="currentSong.singer"></h2>
      </div>
      <div class="middle"
        @touchstart="touchMiddleStart"
        @touchmove="touchMiddleMove"
        @touchend="touchMiddleEnd"
      >
        <div class="middle-l" ref="middleL">
          <div class="cd-wrapper" ref="cdWrapper">
            <div class="cd" :class="cdRotate">
              <img :src="currentSong.image" alt="¿" class="image">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{playLyric}}</div>
          </div>
        </div>
        <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
          <div class="lyric-wrapper">
            <div v-if="currentLyric">
              <p
                class="text"
                v-for="(line, index) in currentLyric.lines"
                :key="index"
                :class="{'current': currentLineNum === index}"
                ref="lyricLine"
              >
              {{line.txt}}
              </p>
            </div>
          </div>
        </Scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <div class="dot" :class="{'active': currentShowDot === 'cd'}"></div>
          <div class="dot" :class="{'active': currentShowDot === 'lyric'}"></div>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{format(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <ProgressBar :precent="precent" @precentChange="onProgressChange"></ProgressBar>
          </div>
          <span class="time time-r">{{format(currentSong.duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left" @click="changeMode">
            <i :class="iconMode"></i>
          </div>
          <div @click="prev" class="icon i-left">
            <i class="icon-prev"></i>
          </div>
          <div @click="togglePlaying" class="icon i-center">
            <i :class="normalIcon"></i>
          </div>
          <div @click="next" class="icon i-right">
            <i class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    </transition>
    <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="open">
      <div class="icon">
        <img :class="cdRotate" width="40" height="40" :src="currentSong.image">
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer"></p>
      </div>
      <div @click.stop="togglePlaying" class="control">
        <ProgressCircle :radius="radius" :precent="precent">
          <i :class="miniIcon" class="icon-mini"></i>
        </ProgressCircle>
      </div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div>
    </transition>
    <audio :src="url" ref="audio" @timeupdate="getCurrentTime" @ended="end"></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { playMode } from 'commons/js/config.js'
import { shuffle } from 'commons/js/util.js'
import { getSongPlayUrl } from '@/api/song.js'
import animations from 'create-keyframe-animation'
import ProgressBar from 'base/progress-bar/progress-bar.vue'
import ProgressCircle from 'base/progress-circle/progress-circle.vue'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll.vue'
export default {
  data() {
    return {
      url: '',
      currentLyric: null, // 歌词
      currentTime: 0, // 时间
      radius: 32,
      playLyric: '', // 正在播放的歌词
      currentShowDot: 'cd', // 播放器点的显示
      currentLineNum: 0 // 正确的歌词行号
    }
  },
  created() {
    this.touch = {} // 定义滑动对象
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  },
  computed: {
    normalIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdRotate() {
      return this.playing ? 'play' : 'play pause'
    },
    precent() {
      return this.currentTime / this.currentSong.duration
    },
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  methods: {
    // 播放器缩小
    back() {
      this.setFullScreen(false)
    },
    // 播放器放大
    open() {
      this.setFullScreen(true)
    },
    /*
    动画函数
      参数(el, done)
        el:元素
        done:完成钩子，自动跳到下一个动画钩子
    */
    enter(el, done) {
      const { x, y, scale } = this._getPosandScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: 'translate3d(0, 0, 0) scale(1.1)'
        },
        100: {
          transform: 'translate3d(0, 0, 0) scale(1)'
        }
      }
      /*
        动画插件create-keyframe-animations
          注册动画
            参数
                name: 动画名称
                animation-CSS3动画样式
                preset: {
                  相关动画参数
                    duration: 动画过渡时间
                    easing: 动画过渡的样式，此处为线性渐变
                }
      */
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      // 运行动画
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    // 进场动画完成后注销
    afterEnter(el, done) {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    // 离开动画
    leave(el, done) {
      // 设置动画时间
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosandScale()
      // 设置动画
      this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.style.webkitTransform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      // 监听离开动画完成后
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    // 离开动画完成后
    afterLeave(el, done) {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style.transform = ''
    },
    // 播放器播放暂停
    togglePlaying() {
      this.setPlayingState(!this.playing)
      if (this.currentLyric) this.currentLyric.togglePlay()
    },
    // 播放器上一曲定义
    prev() {
      // if (!this.songReady) return
      let index = this.currentIndex - 1
      if (this.playList.length === 1) {
        this._loop()
      } else {
        if (index === -1) index = this.playList.length - 1
        this.setCurrentIndex(index)
        if (!this.playing) this.togglePlaying()
      }
      // this.songReady = false
    },
    // 播放器下一曲定义
    next() {
      // if (!this.songReady) return
      let index = this.currentIndex + 1
      if (this.playList.length === 1) {
        this._loop()
      } else {
        if (index === this.playList.length) index = 0
        this.setCurrentIndex(index)
        if (!this.playing) this.togglePlaying()
      }
      // this.songReady = false
    },
    /**
     * 描述: 歌曲播放完成后的动作
     * 参数: 无
     * 功能:
     */
    end() {
      console.log(this.playMode)
      if (this.mode === playMode.loop) {
        this._loop()
      } else {
        // 下一首
        this.next()
      }
    },
    /**
     * 描述: 歌曲循环播放动作
     * 参数: 无
     * 功能:
     */
    _loop() {
      // 设置时间为0
      this.$refs.audio.currentTime = 0
      if (this.currentLyric) this.currentLyric.seek(0)
      this.$refs.audio.play()
    },
    // 当歌曲加载完成
    // ready() {
    //   this.songReady = true
    // },
    // error() {
    //   console.log('error')
    //   this.songReady = true
    // },
    // 动画的起始坐标还有目标坐标获取
    // 获取歌曲当前的播放进度，即时间
    getCurrentTime(e) {
      this.currentTime = e.target.currentTime
    },
    // 时间格式化
    format(interval) {
      let time = interval | 0
      let minute = time / 60 | 0
      let second = this._pad(time % 60)
      return `${minute}:${second}`
    },
    // 进度条子组件派发的事件，进度条移动的自适应改变
    onProgressChange(precent) {
      const currentTime = this.currentSong.duration * precent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) this.togglePlaying()
      if (this.currentLyric) this.currentLyric.seek(currentTime * 1000) // 歌词跳动
    },
    // 改变歌曲的播放模式
    changeMode() {
      let mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      // 初始化新列表
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      // 改变currentIndex来改变currentSong
      this._resetCurrentIndex(list)
      // 重新设置播放列表
      this.setPlayList(list)
    },
    _resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    /**
     * 描述: 滑动开始
     */
    touchMiddleStart(e) {
      this.touch.init = true
      const touch = e.touches[0]
      this.touch.StartX = touch.pageX
      this.touch.StartY = touch.pageY
    },
    /**
     * 描述: 滑动中
     */
    touchMiddleMove(e) {
      if (!this.touch.init) return
      const touch = e.touches[0]
      const deltX = touch.pageX - this.touch.StartX
      const deltY = touch.pageY - this.touch.StartY
      // 如果Y轴的偏移比X轴的偏移要大，则认为上滑，不触发左右滑动
      if (Math.abs(deltY) > Math.abs(deltX)) return
      const left = this.currentShowDot === 'cd' ? 0 : -window.innerWidth // 歌词部分距离右边距的距离
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltX)) // 偏移量
      this.touch.precent = Math.abs(offsetWidth / window.innerWidth) // 设置滑动的宽度与屏幕占比
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style.transitionDuration = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.precent // 透明度
    },
    /**
     * 描述: 滑动完成
     */
    touchMiddleEnd(e) {
      let offsetWidth = 0 // 滑动的偏移量
      let opacity // 透明度
      // 从右向左滑
      if (this.currentShowDot === 'cd') {
        if (this.touch.precent > 0.1) {
          offsetWidth = -window.innerWidth // 滑动超过10%放开，自动滑完
          this.currentShowDot = 'lyric' // 下面的点效果
          opacity = 0 // 透明度
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        // 从左向右滑
        if (this.touch.precent < 0.9) {
          offsetWidth = 0
          this.currentShowDot = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const times = 300
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.lyricList.$el.style.transitionDuration = `${times}ms`
    },
    /**
     * 描述: 获取歌词并处理
     * 参数: 无
     * 功能: 处理歌词
     */
    _getLyrics() {
      this.currentSong.getLyrics().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this._handleLyric) // 使用lyric-parser来处理歌词
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playLyric = ''
        this.currentLineNum = 0
      })
    },
    /**
     * 描述: 歌词播放时候的回调函数
     * 参数:
     *       {linenum, text}: 对应的行数以及里面的文本
     * 功能: 歌曲到正确行数后，高亮歌词显示和自动滚动歌词
     */
    _handleLyric({ lineNum, text }) {
      this.currentLineNum = lineNum // 正确的行数
      if (lineNum > 5) {
        let scrollEL = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scroll.scrollToElement(scrollEL, 1000)
      } else {
        this.$refs.lyricList.scroll.scrollToElement(0, 0, 1000)
      }
      this.playLyric = text
    },
    // 格式化秒
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    _getPosandScale() {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULLSCREEN',
      setPlayingState: 'SET_PLAY_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST'
    })
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) return
      // 获取歌曲的url
      getSongPlayUrl(this.currentSong.mid, this.currentSong.type).then((res) => {
        let baseUrl = 'http://ws.stream.qqmusic.qq.com/'
        res.data.req_0.data.midurlinfo.forEach((purl) => {
          baseUrl += purl.purl
        })
        this.url = baseUrl
        if (this.currentLyric) this.currentLyric.stop()
        // 播放
        if (this.playing) {
          this.$nextTick(() => {
            this.$refs.audio.play() // 播放
            this._getLyrics() // 处理歌词
          })
        }
      })
    },
    /*
      报错:Uncaught (in promise) DOMException: The element has no supported sources.
        第一次渲染时候没有src？
    */
    playing(newPlaying) {
      const Audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? Audio.play() : Audio.pause()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "commons/style/variable.scss";
@import "commons/style/mixin.scss";
.player{
  .normal-player{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }
    .top{
      position: relative;
      margin-bottom: 25px;
      .back{
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back{
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title{
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle{
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle{
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l{
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper{
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd{
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            &.play{
              animation: rotate 20s linear infinite;
            }
            &.pause{
              animation-play-state: paused;
            }
            .image{
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
        .playing-lyric-wrapper{
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric{
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r{
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper{
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text{
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current{
              color: $color-text;
            }
          }
        }
      }
    }
    .bottom{
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper{
        text-align: center;
        font-size: 0;
        .dot{
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active{
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper{
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time{
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
          &.time-l{
            text-align: left;
          }
          &.time-r{
            text-align: right;
          }
        }
        .progress-bar-wrapper{
          flex: 1;
        }
      }
      .operators{
        display: flex;
        align-items: center;
        .icon{
          flex: 1;
          color: $color-theme;
          &.disable{
            color: $color-theme-d;
          }
          i{
            font-size: 30px;
          }
        }
        .i-left{
          text-align: right;
        }
        .i-center{
          padding: 0 20px;
          text-align: center;
          i{
            font-size: 40px;
          }
        }
        .i-right{
          text-align: left;
        }
        .icon-favorite{
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active, &.normal-leave-active{
      transition: all 0.4s;
      .top, .bottom{
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter, &.normal-leave-to{
      opacity: 0;
      .top{
        transform: translate3d(0, -100px, 0);
      }
      .bottom{
        transform: translate3d(0, 100px, 0);
      }
    }
  }
  .mini-player{
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;
    &.mini-enter-active, &.mini-leave-active{
      transition: all 0.4s;
    }
    &.mini-enter, &.mini-leave-to{
      opacity: 0;
    }
    .icon{
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;
      img{
        border-radius: 50%;
        &.play{
          animation: rotate 10s linear infinite;
        }
        &.pause{
          animation-play-state: paused;
        }
      }
    }
    .text{
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name{
        margin-bottom: 2px;
        @include no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }
      .desc{
        @include no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
    .control{
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-play-mini, .icon-pause-mini, .icon-playlist{
        font-size: 30px;
        color: $color-theme-d;
      }
      .icon-mini{
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}
@keyframes rotate{
  0%{
    transform: rotate(0)
  }
  100%{
    transform: rotate(360deg)
  }
}
</style>