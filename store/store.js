// 第一步既然你是一个插件那么我们必须使用vue去use一下
import Vue from 'vue'

import Vuex from 'vuex'
// 第二步我的我们使用一下这个插件
Vue.use(Vuex)
// 第三步封装暴露出去挂载到整个实例对象身上
const store = new Vuex.store({
  // 利用这个构造函数然后直接配置仓库使用模块化的操作
  module:{},
})
export default store