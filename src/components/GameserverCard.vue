<template>
  <b-card no-body>
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
</template>

<script>
import getIcon from "@/data/icons.js";

export default {
  props: ['gameServer'],
  methods: {
    getIcon,
    formatPlayerCount(game) {
      if (game.meta.knowOnlinePlayerCount) {
        return `${game.playerCount} / ${game.maxPlayers}`;
      } else {
        return `max: ${game.maxPlayers}`;
      }
    }
  }
}
</script>



<style scoped>

</style>