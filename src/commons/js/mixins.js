/**
 * 调整在有迷你播放器时候的各项列表高度问题
 */
import { mapGetters } from 'vuex'
export const playListMixins = {
  computed: {
    ...mapGetters([
      'playList' // 当有播放列表的时候就会有迷你播放器
    ])
  },
  mounted() {
    this.handleMiniPlayer(this.playList)
  },
  activated() {
    this.handleMiniPlayer(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handleMiniPlayer(newVal)
    }
  },
  methods: {
    /**
     * 描述: 迷你播放器存在时调整列表高度  
     * 参数:
     *       playList: 歌曲列表  
     * 功能: 如果混入该mixins，则必须定义方法来调整高度
     */
    handleMiniPlayer(playList) {
      throw new Error('在有迷你播放器时候必须重新定义高度')
    }
  }
}