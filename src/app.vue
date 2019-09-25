<template>
    <div id = "app">
        <mheader></mheader>
        <Tabs></Tabs>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
        <player></player>
    </div>
</template>
<script>
import Mheader from 'components/m_header/m_header.vue'
import Tabs from 'components/tabs/tabs.vue'
import Player from 'components/player/player.vue'
export default {
  components: {
    Mheader,
    Tabs,
    Player
  }
}
</script>
<style lang="scss" scoped>
</style>