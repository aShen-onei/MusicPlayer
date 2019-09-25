<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" ref="playBtn" v-show="songs.length > 0" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <Scroll
      :probeType="probeType"
      :listenScroll="listenScroll"
      @scroll="scroll"
      :data="songs"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper">
        <SongList @select="select" :songs="songs"></SongList>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <Loading></Loading>
      </div>
    </Scroll>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll.vue'
import SongList from 'base/song-list/song-list.vue'
import Loading from 'base/loading/loading.vue'
import { mapActions } from 'vuex'
const RESERVER_HEIGHT = 40
export default {
  props: {
    // 歌曲数组
    songs: {
      type: Array,
      default: () => []
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 背景图片
    bgImage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  // 组件注册
  components: {
    Scroll,
    SongList,
    Loading
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    // 手动调节
    this.imageHeight = this.$refs.bgImage.clientHeight // 获取图片的高度
    this.minTranslateY = -this.imageHeight + RESERVER_HEIGHT // 设置最小的
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  methods: {
    scroll(pos) {
      // Y轴滚动的距离
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    // 状态改变,修改vux的状态
    select(item, index) {
      this.selectPlay({
        list: this.songs[0],
        index
      })
    },
    /**
     * 描述: 点击随机播放全部按钮
     * 参数:
     * 功能:
     */
    random() {
      this.randomPlay({
        list: this.songs[0]
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY(newY) {
      let translateY = 0
      // 设置layer的动态高度
      translateY = Math.max(this.minTranslateY, newY)
      // 控制图片的图层优先级
      let zIndex = 0
      // 设置图片的大小
      let scale = 1
      // 高斯模糊效果
      let blur = 0
      // 控制layer移动
      this.$refs.layer.style.transform = `translate3d(0, ${translateY}px, 0)`
      this.$refs.layer.style.webkitTransform = `translate3d(0, ${translateY}px, 0)`
      // 图片放大公式
      const precent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        // 放大大小
        scale = 1 + precent
        zIndex = 10
      } else {
        blur = Math.min(20 * precent, 20)
      }
      // 高斯模糊效果
      this.$refs.filter.style.backdropFilter = `blur(${blur})`
      this.$refs.filter.style.webkitBackdropFilter = `blur(${blur})`
      // 滚动时候图片的样式变化
      if (newY < translateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVER_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
      // 图片放大
      this.$refs.bgImage.style.transform = `scale(${scale})`
      this.$refs.bgImage.style.webkitTransform = `scale(${scale})`
    }
  }
}
</script>
<style lang="scss" scoped>
@import "commons/style/variable.scss";
@import "commons/style/mixin.scss";
 .music-list{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
    .back{
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-back{
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title{
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 40;
      width: 80%;
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image{
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;
      .play-wrapper{
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 100%;
        .play{
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
          .icon-play{
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
            font-size: $font-size-medium-x;
          }
          .text{
            display: inline-block;
            vertical-align: middle;
            font-size: $font-size-small;
          }
        }
      }
      .filter{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .bg-layer{
      position: relative;
      height: 100%;
      background: $color-background;
    }
    .list{
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      background: $color-background;
      .song-list-wrapper{
        padding: 20px 30px
      }
      .loading-container{
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
 }
</style>