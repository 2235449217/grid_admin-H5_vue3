import App from './App'

import cuCustom from './colorui/components/cu-custom.vue'

// import store from './store/store.js'
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
    // store:store,
    
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.component('cu-custom',cuCustom)
  return {
    app
  }
}
// #endif
