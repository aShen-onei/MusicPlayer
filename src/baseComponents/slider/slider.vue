<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="index" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>
<script>
import { setTimeout, clearTimeout } from 'timers'
import { addClass } from 'commons/js/dom.js'
import Bscroll from '@better-scroll/core'
import slide from '@better-scroll/slide'

Bscroll.use(slide)

export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    // 是否循环轮播
    loop: {
      type: Boolean,
      default: true
    },
    // 是否自动轮播
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 轮播得间隔时间
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._intiDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)
    // 当页面的形式发生变化的时候，即放大缩小的时候，重新计算宽度
    window.addEventListener('resize', () => {
      if (!this.slider) return
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    // 设置轮播得宽度
    _setSliderWidth(isResize) {
      // 获取孩子元素，为什么要用this？
      this.children = this.$refs.sliderGroup.children
      // 设置宽度
      let width = 0
      // 父容器得宽度
      let sliderWidth = this.$refs.slider.clientWidth
      // 设置每个孩子得宽度，并且添加样式
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')

        child.style.width = sliderWidth + 'px'

        width += sliderWidth
      }
      // 循环轮播有两个复制？
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      // 总的宽度
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 点样式添加
    _intiDots() {
      this.dots = new Array(this.children.length)
    },
    _play() {
      let pageIndex = this.currentPageIndex + 1
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    },
    // 使用Bscroll插件来控制轮播
    _initSlider() {
      // 文档https://better-scroll.github.io/docs/zh-CN/
      this.slider = new Bscroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        slide: {
          loop: this.loop,
          threshold: 100
        },
        snapSpeed: 400,
        click: true
      })

      // 下面得点，没有click
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
        // 每当结束时都设置settimeout自动轮播
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>
<style lang="scss" scoped>
@import "commons/style/variable.scss";
.slider{
  min-height: 1px;
  .slider-group{
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item{
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a{
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }
      img{
        display: block;
        width: 100%;
      }
    }
  }
  .dots{
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;
    .dot{
      display: inline-block;
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
}
</style>