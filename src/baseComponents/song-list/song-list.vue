<template>
  <div class="song-list">
    <ul>
      <li
        @click="selectItem(song, index)"
        v-for="(song, index) in songs[0]"
        :key="song.id"
        class="item"
      >
        <div class="content">
          <div class="name">{{song.name}}</div>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    songs: {
      type: Array,
      default: () => []
    }
  },
  created() {
  },
  methods: {
    // 获取歌曲得概要信息，通过函数获取
    getDesc(song) {
      return `${song.singer}。${song.album}`
    },
    // 点击事件，向父组件派发事件
    selectItem(item, index) {
      // 向父组件派发一个名叫select的事件
      this.$emit('select', item, index)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "commons/style/variable.scss";
@import "commons/style/mixin.scss";
 .song-list{
    .item{
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      font-size: $font-size-medium;
      .rank{
        flex: 0 0 25px;
        width: 25px;
        margin-right: 30px;
        text-align: center;
        .icon{
          display: inline-block;
          width: 25px;
          height: 24px;
          background-size: 25px 24px;
          &.icon0{
            @include bg-image('first')
          }
          &.icon1{
            @include bg-image('second')
          }
          &.icon2{
            @include bg-image('third')
          }
        }
        .text{
          color: $color-theme;
          font-size: $font-size-large;
        }
      }
      .content{
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name{
          @include no-wrap();
          color: $color-text;
        }
        .desc{
          @include no-wrap();
          margin-top: 4px;
          color: $color-text-d;
        }
      }
    }
 }
</style>