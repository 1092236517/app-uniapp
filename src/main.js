import Vue from 'vue'
import App from './App'
import api from './api/api.js'
import store from './store/index.js'
import {func} from './common/utils/func.js'

Vue.prototype.$api = api
Vue.prototype.$store = store
Vue.prototype.$func = func
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()