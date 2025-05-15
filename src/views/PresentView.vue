<template>
  <network-error-overlay :active="networkError" />
  <b-container fluid class="border-0">
    <b-row class="mt-2 mb-3">
      <b-col class="text-center">
        <h1>Ctrl-Alt-GG 2025</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="my-2 mx-5">
        <div class="announcement-text">
          {{ liveData.announcement.text }}
        </div>
      </b-col>
    </b-row>
    <b-row class="my-2">
      <b-col>
        <b-card-group columns>
          <gameserver-card v-for="gameServer in liveData.gameServers" :gameServer="gameServer" class="my-2 p-2" />
        </b-card-group>
      </b-col>
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
    this.update()
    this.interval = setInterval(() => {
      this.update()
    }, 5000)

    document.body.style.background = "#000"; // time constarint
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

.container-fluid {
  color: #fff !important;
  font-size: 1.1em;
}

.card {
  --bs-card-bg: #000 !important;
  --bs-card-border-color: #666 !important;
}

.card-columns {
    column-count: 2 !important;
}
</style>
