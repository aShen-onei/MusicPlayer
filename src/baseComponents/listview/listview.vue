<template>
  <scroll
    class="listview"
    :data="data"
    ref="listview"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
    >
    <ul>
      <li v-for="(group, index) in data" :key="index" class="list-group" ref="listgroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" :key="item.id" class="list-group-item" @click="selectItem(item)">
            <img v-lazy="item.imgurl" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="index"
          class="item"
          :class="{'current':currentIndex === index}"
          :data-index="index"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixed_title" ref="fixed">
      <h1 class="fixed-title">
        {{fixed_title}}
      </h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll.vue'
import { getData } from 'commons/js/dom.js'
import Loading from 'base/loading/loading.vue'
import { setTimeout } from 'timers'

const ANCHOR_HIGHT = 18
const TITLE_HIGHT = 30
export default {
  // 传入数据
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  created() {
    this.touch = {}
    this.listenScroll = true
    // 每个group的高度
    this.listHeight = []
    this.probeType = 3
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      // 滚动差
      diff: -1
    }
  },
  computed: {
    // 右侧快速导航的数组
    shortcutList() {
      let list = []
      this.data.map((group) => {
        list.push(group.title.substring(0, 1))
      })
      return list
    },
    // 固定标题
    fixed_title() {
      if (this.scrollY > 0) return ''
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    refresh() {
      this.$refs.listview.refresh() // 滚动组件刷新
    },
    // 派发事件
    selectItem(item) {
      this.$emit('select', item)
    },
    // 右侧快速导航栏快速跳转
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      // 获取touch点击的第一个y坐标的坐标值
      this.touch.y1 = e.touches[0].pageY
      // 一开始点击的时候是第几个索引
      this.touch.anchorIndex = anchorIndex
      // 跳转
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      // 获取移动时候的y轴坐标
      this.touch.y2 = e.touches[0].pageY
      // 偏移量
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    // 滚动事件
    scroll(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      // 空白区域处理
      if (!index && index !== 0) return
      // 滑动的时候滑倒最上最下处理
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index + 1]
      // 滚动， 0是动画时间
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
    },
    // 计算每个group的高度
    _calculateHeight() {
      this.listHeight = []
      // 获取listgroup
      const list = this.$refs.listgroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        // 计算每个group的高度
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      // 当滚动到最上部时候 newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 当滚动到中部的时候
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (!height2 || (-newY >= height1 && -newY <= height2)) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部的时候
      this.currentIndex = this.listHeight.length - 2
    },
    // 滑动顶上个
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HIGHT) ? newVal - TITLE_HIGHT : 0
      if (this.fixedTop === fixedTop) return
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  }
}
</script>
<style lang="scss" scoped>
@import "commons/style/variable.scss";

.listview{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;
    .list-group{
      padding-bottom: 30px;
      .list-group-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
      .list-group-item{
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar{
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name{
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
    .list-shortcut{
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: $color-background-d;
      font-family: Helvetica;
      .item{
        padding: 3px;
        line-height: 1;
        color: $color-text-l;
        font-size: $font-size-small;
        &.current{
          color: $color-theme;
        }
      }
    }
    .list-fixed{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
    }
    .loading-container{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
}
</style>