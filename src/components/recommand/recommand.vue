<template>
  <div class="recommand">
    <Scroll ref="scroll" class="recommand-content" :data="discList">
      <div>
        <div v-if="recommands.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommands" :key="item.id">
              <a :href="item.linkUrl">
                <img @load="checkLoad" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommand-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) in discList" :key="index" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList">
        <loading></loading>
      </div>
    </Scroll>
  </div>
</template>
<script>
import Slider from 'base/slider/slider.vue'
import Scroll from 'base/scroll/scroll.vue'
import Loading from 'base/loading/loading.vue'
import { getRecommand, getDiscList } from '@/api/recommand.js'
import recommandJSON from 'commons/json/recommand.json'
export default {
  data() {
    return {
      recommands: recommandJSON.data.rollMap, // 轮播图
      discList: recommandJSON.data.discList // 歌单
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    this._getRecommand()
    this._getDiscList()
  },
  methods: {
    // 请求推荐界面
    _getRecommand() {
      getRecommand().then((res) => {
        console.log(res)
      })
    },
    // 请求歌单的页面
    _getDiscList() {
      getDiscList().then((res) => {
        console.log(res)
      })
    },
    // 在图片加载的时候就初始化scroll高度
    checkLoad() {
      // 判断是否是第一次，确保只刷新一次
      if (!this.check) {
        this.$refs.scroll.refresh()
        this.check = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "commons/style/variable.scss";
.recommand{
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommand-content{
    height: 100%;
    overflow: hidden;
    .slider-wrapper{
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .recommand-list{
      .list-title{
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme
      }
      .item{
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;
        .icon{
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text{
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
          .name{
            margin-bottom: 10px;
            color: $color-text;
          }
          .desc{
            color: $color-text-d
          }
        }
      }
    }
    .loading-container{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%)
    }
  }
}
</style>