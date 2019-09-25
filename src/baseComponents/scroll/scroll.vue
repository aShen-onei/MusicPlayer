<template>
  <div ref="scroll">
    <slot></slot>
  </div>
</template>
<script>
// 滚动组件抽象出单独得组件
import Bscroll from '@better-scroll/core'
import { setTimeout } from 'timers'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    // 使用data，当歌单列表渲染上，也就是有歌单列表数据时候，
    // 监视这个数据的数据变化，当数据变化的时候，重新计算scroll高度。
    data: {
      type: Array,
      default: null
    },
    // 参数，是否监听滚动事件
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    // 初始化
    _initScroll() {
      if (!this.$refs.scroll) return
      this.scroll = new Bscroll(this.$refs.scroll, {
        scrollY: true,
        probeType: this.probeType,
        click: this.click
      })
      // 监听滚动事件
      if (this.listenScroll) {
        let $this = this
        this.scroll.on('scroll', (pos) => {
          // 派发scroll事件
          $this.$emit('scroll', pos)
        })
      }
    },
    // 可用
    enable() {
      this.scroll && this.scroll.enable()
    },
    // 不可用
    disable() {
      this.scroll && this.scroll.disable()
    },
    // 刷新
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    // 跳转到哪里
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    // 跳转到element
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    // 监视数据变化，重新计算
    data() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>