import {createApp} from 'vue'
import {createBootstrap} from 'bootstrap-vue-next'
import App from './App.vue'
import router from './router'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

const app = createApp(App)
app.provide("$api", api)

app.use(router)
app.use(createBootstrap())
app.mount('#app')
