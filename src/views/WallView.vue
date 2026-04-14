<template>
  <network-error-overlay :active="networkError" />
  <b-container fluid class="border-0">
    <b-row class="px-2 py-4">
      <b-col>
        <div class="announcement-text">
          {{ liveData.announcement.text }}
        </div>
      </b-col>
    </b-row>

    <b-row class="px-1 mt-2">
      <game-servers :gameServers="liveData.gameServers" display="wall" />
    </b-row>

  </b-container>
</template>

<script>
import {inject} from 'vue'
import NetworkErrorOverlay from "@/components/NetworkErrorOverlay.vue";

export default {
  components: {NetworkErrorOverlay},
  setup() {
    const api = inject('$api');
    return {api}
  },
  data() {
    return {
      networkError: false,
      interval: null,
      liveData: {
        announcement: {
          text: "",
        },
        gameServers: []
      }
    }
  },

  methods: {
    update() {
      this.api.get("/bundle").then(res => {
        this.liveData = res.data;
        this.networkError = false;
      }).catch(err => {
        console.error(err);
        this.networkError = true;
      })
    },
  },

  mounted() {
    document.body.classList.add('wall-bg')
    this.update()
    this.interval = setInterval(() => {
      this.update()
    }, 5000)
  },
  unmounted() {
    document.body.classList.remove('wall-bg')
    if (this.interval !== null) {
      clearInterval(this.interval)
    }
  }
}
</script>

<style>
.wall-bg {
  background: #000;
  margin: 0;
  font-family: system-ui, sans-serif;
}
</style>
