<template>
  <div class="singer">
    <ListView :data="singers" @select="selectSinger"></ListView>
    <router-view></router-view>
  </div>
</template>
<script>
import { getSingerList } from '@/api/singer.js'
import { setTimeout } from 'timers'
// 直接调用mutations
import { mapMutations } from 'vuex'
import SingerList from 'commons/json/singer.json'
import ListView from 'base/listview/listview.vue'
const HOT_NAME = '热门'
const HOT_SINGER_LENGTH = 10
export default {
  data() {
    return {
      singers: []
    }
  },
  created() {
    setTimeout(() => {
      // this._getSingerList()
      this.singers = this._normalizeList(SingerList.singerlist)
    }, 20)
  },
  components: {
    ListView
  },
  methods: {
    selectSinger(item) {
      this.$router.push({
        path: `/singer/${item.id}`
      })
      this.setSinger(item)
    },
    // 获取歌手列表数据
    _getSingerList() {
      getSingerList().then(res => {
        console.log(res)
      })
    },
    // 格式化歌手数据
    _normalizeList(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      // 把歌手数据中的前10条作为热门数据
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LENGTH) {
          map.hot.items.push({
            id: item.singer_mid,
            name: item.singer_name,
            imgurl: item.singer_pic
          })
        }
        // 把歌手的首字母排序
        const key = item.Findex
        // 如果map中没有该首字母，则创建
        if (!map[key]) {
          // 创建
          map[key] = {
            title: key,
            items: []
          }
        }
        // 将符合的，首字母相同的歌手添加入同一组中，聚类
        map[key].items.push({
          id: item.singer_mid,
          name: item.singer_name,
          imgurl: item.singer_pic
        })
      })
      // 排序map
      let hot = [] // 热门数组
      let ret = [] // 字母数组
      // 分开热门和字母
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      // 字母排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // 返回一维数组
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>
<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>