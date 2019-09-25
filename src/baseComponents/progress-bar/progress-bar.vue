<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <!-- 进度条 -->
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
const btnWidth = 16
export default {
  props: {
    // 百分比
    precent: {
      type: Number,
      default: 0
    }
  },
  created() {
    // 设置移动进度条时候的共享属性
    this.touch = {}
  },
  methods: {
    /**
     * 移动进度条
     * 先记录touchstart手指第一个点击的地方
     * touchmove记录移动的每一个位置，计算出差值
     * touchend移动进度条完成后派发时间设置播放时间还有播放的进度条
     */
    progressTouchStart(e) {
      // 标志位
      this.touch.initiated = true
      // 获取第一次点击的位置
      this.touch.stratX = e.touches[0].pageX
      // 获取已经移动了的进度条的值
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) return
      // 定义偏移量
      const delX = e.touches[0].pageX - this.touch.stratX
      // 加上已经偏移的
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - btnWidth, Math.max(0, this.touch.left + delX))
      this._offset(offsetWidth)
    },
    progressTouchEnd() {
      // 重置
      this.touch.initiated = false
      this._trigglePrecent()
    },
    // 点击滚动条事件，当点击滚动条的时候也可以跳着播放
    progressClick(e) {
      // 获取偏移量并移动
      let react = this.$refs.progressBar.getBoundingClientRect()
      let offsetWidth = e.pageX - react.left
      this._offset(offsetWidth)
      // 向父组件派发事件
      this._trigglePrecent()
    },
    _trigglePrecent() {
      // 获得进度条长度
      const barWidth = this.$refs.progressBar.clientWidth - btnWidth
      // 获取进度条已经覆盖了的长度和进度条长度的比值
      const precent = this.$refs.progress.clientWidth / barWidth
      this.$emit('precentChange', precent)
    },
    // 进度条移动函数小型封装
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  watch: {
    precent(newPrecent) {
      // 设置自行滑动
      if (newPrecent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - btnWidth
        const offsetWidth = newPrecent * barWidth
        // 进度条移动
        this._offset(offsetWidth)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "commons/style/variable.scss";
.progress-bar{
  height: 30px;
  .bar-inner{
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress{
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper{
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn{
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>