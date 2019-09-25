<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer.js'
import { creatSong } from 'commons/js/song.js'
import MusicList from 'components/music-list/music-list.vue'
export default {
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getSingerDetail()
  },
  components: {
    MusicList
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.imgurl
    },
    ...mapGetters([
      'singer'
    ])
  },
  methods: {
    // 获取歌手详情
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push({
          path: '/singer'
        })
        return
      }
      // 获取歌手详情的api
      getSingerDetail(this.singer.id).then((res) => {
        let { songlist } = res.data.singer.data
        this.songs.push(this._normalizeSongs(songlist))
      })
    },
    // 初始化歌曲列表
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        if (item.album.mid && item.mid) {
          ret.push(creatSong(item))
        }
      })
      return ret
    }
  }
}
</script>
<style lang="scss" scoped>
@import "commons/style/variable.scss";
.slide-enter-active, .slide-leave-active{
  transition: all 0.3s;
}
.slide-enter, .slide-leave-to{
  transform: translate3d(100%, 0, 0);
}
</style>