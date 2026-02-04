<template>
  <network-error-overlay :active="networkError"/>
  <b-container fluid>

    <b-row class="py-3 header">
      <b-col>
        <div class="d-flex justify-content-between">
          <h1><img style="height: 1.2em" src="@/assets/new_logo_icon.svg" alt="logo" class="pe-2">Ctrl-Alt-GG 2026</h1>
        </div>

      </b-col>
    </b-row>

    <b-row class="px-2 py-4">
      <b-col>
        <div class="announcement-text">
          {{ liveData.announcement.text }}
        </div>
      </b-col>
    </b-row>

    <div class="px-1 mt-2"> <!-- https://github.com/metafizzy/isotope/issues/1112 -->
    <b-row data-masonry='{"percentPosition": true }'>
    <game-servers :gameServers="liveData.gameServers" display="desktop" />
    </b-row>
    </div>

    <b-row class="py-5">
      <hr/>
      <div class="text-center">
        Ctrl-Alt-GG 2026<br/>
        <a href="https://ctrl-alt-gg.hu" target="_blank">ctrl-alt-gg.hu</a>
      </div>
    </b-row>

  </b-container>
</template>


<script>
import {inject} from 'vue'
import NetworkErrorOverlay from "@/components/NetworkErrorOverlay.vue";
import {BLink} from "bootstrap-vue-next";
import Masonry from "masonry-layout"


export default {
  components: {BLink, NetworkErrorOverlay},
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

    // initialize masonry
    const row = document.querySelector("[data-masonry]");
    new Masonry(row, {
      // options
      percentPosition: true,
    });
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

body {
  margin: 0;
  font-family: system-ui, sans-serif;
}

.header {
  background: rgb(99, 102, 241);
  background: linear-gradient(
      90deg,
      rgba(99, 102, 241, 1) 0%,
      rgba(168, 85, 247, 1) 50%,
      rgba(236, 72, 153, 1) 100%
  );
}
</style>