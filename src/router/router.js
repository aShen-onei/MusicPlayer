// 引入Vue和路由vue-router组件
import Vue from 'vue'
import Router from 'vue-router'
// 引入网页
import Rank from 'components/rank/rank.vue'
import Recommand from 'components/recommand/recommand.vue'
import Search from 'components/search/search.vue'
import Singer from 'components/singer/singer.vue'
import SingerDetail from 'components/singer-detail/singer-detail.vue'

Vue.use(Router)

// 创建路由
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: Recommand
    },
    {
      path: '/recommand',
      name: 'Recommand',
      component: Recommand
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [
        {
          path: ':id', // 以ID为变量传入
          component: SingerDetail
        }
      ]
    }
  ]
})

export default router