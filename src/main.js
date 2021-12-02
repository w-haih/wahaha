import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui';//引用element-ui包
import 'element-ui/lib/theme-chalk/index.css';//导入相关样式
Vue.use(ElementUI);//引用

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
