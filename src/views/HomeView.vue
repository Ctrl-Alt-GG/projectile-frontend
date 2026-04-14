<template>
  <network-error-overlay :active="networkError"/>
  <b-container fluid>

    <header-row title="Ctrl-Alt-GG 2026" />

    <b-row class="px-2 py-4">
      <b-col>
        <div class="announcement-text">
          {{ liveData.announcement.text }}
        </div>
      </b-col>
    </b-row>

    <div class="px-1 mt-2"> <!-- https://github.com/metafizzy/isotope/issues/1112 -->
      <b-row data-masonry='{"percentPosition": true }'>
        <game-servers :gameServers="sortedGameServers" display="desktop"/>
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
import Masonry from "masonry-layout"
import _ from "lodash";

function orderGameServersByIP(list) {
  return _.sortBy(list, [
    function (o) {
      try {
        return parseInt(o.addresses[0].split('.')[3], 10)
      } catch {
        return 100
      }
    }
  ])
}

export default {
  components: {NetworkErrorOverlay},
  setup() {
    const api = inject('$api');
    return {api}
  },
  data() {
    return {
      networkError: false,
      liveData: {
        announcement: {
          text: "",
        },
        gameServers: []
      },
      sortedGameServers: [],

      // stuff
      interval: null,
      masonry: null
    }
  },

  methods: {
    update() {
      this.api.get("/bundle").then(res => {
        const changed = !_.isEqual(this.liveData, res.data);
        this.networkError = false;
        // Update layout if needed

        if (changed) {
          this.liveData = res.data;
          this.sortedGameServers = orderGameServersByIP(this.liveData.gameServers)

          this.$nextTick(() => {
            if (this.masonry !== null) {
              this.masonry.reloadItems()
              this.masonry.layout()
            }
          })
        }

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
    this.masonry = new Masonry(row, {
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
</style>