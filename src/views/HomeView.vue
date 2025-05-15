<template>
  <network-error-overlay :active="networkError"/>
  <b-container>
    <b-row class="py-3">
      <b-col>
        <h1><img style="height: 1.2em" src="@/assets/logo-voros.svg">&nbsp;Ctrl-Alt-GG 2025</h1>
      </b-col>
    </b-row>
    <b-row class="px-2 py-4">
      <b-col>
        <div class="announcement-text">
          {{ liveData.announcement.text }}
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h2>Szerverek</h2>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col>

        <gameserver-card v-for="gameServer in liveData.gameServers" :gameServer="gameServer" class="my-2" />

      </b-col>
    </b-row>
    <b-row class="py-5">
      <hr/>
      <div class="text-center">
        Ctrl-Alt-GG 2025<br/>
        <a href="https://ctrl-alt-gg.hu" target="_blank">ctrl-alt-gg.hu</a>
      </div>
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
      },
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
    this.update()
    this.interval = setInterval(() => {
      this.update()
    }, 10000)
  },
  unmounted() {
    if (this.interval !== null) {
      clearInterval(this.interval)
    }
  }
}
</script>


<style scoped>
.announcement-text {
  font-size: 1.3em;
  min-height: 2em;
  white-space: pre-wrap;
  line-height: 1.3em;
}
</style>