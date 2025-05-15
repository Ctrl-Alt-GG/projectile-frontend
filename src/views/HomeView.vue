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

        <b-card no-body v-for="gameServer in liveData.gameServers" class="my-2">
          <b-card-body>
            <b-container fluid>
              <b-row align-v="center">
                <b-col cols="auto" class="px-1">
                  <img :src="getIcon(gameServer.game)" style="height: 2.8em; width: auto">
                </b-col>
                <b-col>
                  <div><b>{{ gameServer.longName }}</b></div>
                  <div v-if="gameServer.info" class="text-muted"><small>{{ gameServer.info }}</small></div>
                </b-col>
                <b-col class="text-center">{{ formatPlayerCount(gameServer) }}</b-col>
                <b-col class="text-end">
                  <code>{{ gameServer.address }}</code>
                </b-col>
              </b-row>

              <b-row align-h="center" class="mt-3 pt-2" style="border-top: 1px solid #444"
                     v-if="gameServer.meta.knowPlayers && gameServer.onlinePlayers.length > 0">
                <b-col cols="12">
                  <table style="width: 100%">
                    <tr class="p-1" v-for="ply in gameServer.onlinePlayers">
                      <td>{{ ply.name }}</td>
                      <td class="text-muted">{{ ply.info }}</td>
                      <td class="text-end" v-if="gameServer.meta.playersHasScore">{{ ply.score }}</td>
                    </tr>
                  </table>
                </b-col>
              </b-row>

            </b-container>
          </b-card-body>
        </b-card>

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
import getIcon from "@/data/icons.js";

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
    getIcon,
    update() {
      this.api.get("/bundle").then(res => {
        this.liveData = res.data;
        this.networkError = false;
      }).catch(err => {
        console.error(err);
        this.networkError = true;
      })
    },
    formatPlayerCount(game) {
      if (game.meta.knowOnlinePlayerCount) {
        return `${game.playerCount} / ${game.maxPlayers}`;
      } else {
        return `max: ${game.maxPlayers}`;
      }
    }
  },

  mounted() {
    this.update()
    this.interval = setInterval(() => {
      this.update()
    }, 5000)
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