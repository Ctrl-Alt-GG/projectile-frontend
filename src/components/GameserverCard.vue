<template>
  <div :class="{'server-card': true, 'active': gameServer.capabilities.player_count && gameServer.online_players > 0}">
    <div class="card-header" :style="{background: getColor(gameServer.game).bg, color: getColor(gameServer.game).text}">
      <img :src="getIcon(gameServer.game)" alt="">
      <div class="title">
        <div class="game-name">{{ gameServer.name }}</div>
        <div class="sub-info">{{ gameServer.info }}</div>
      </div>
    </div>

    <div class="card-body">
      <div class="meta d-flex justify-content-between">

        <div v-if="display === 'desktop'">
          <strong>Addresses:</strong>
          <ul>
            <li v-for="addr in gameServer.addresses">
              <span>{{ addr }}</span>
            </li>
          </ul>
        </div>
        <div v-else-if="display === 'wall'" class="pb-2">
          <strong>Address:</strong>&nbsp;{{ gameServer.addresses[i] }}
        </div>

        <div :class="{'empty': gameServer.capabilities.player_count && gameServer.online_players === 0, 'playerCount':true}">
          <strong>Players:</strong>&nbsp;{{ formatPlayerCount(gameServer) }}
        </div>
      </div>

      <div v-if="gameServer.capabilities.player_names">
        <GameserverCardPlayerMarquee v-if="display === 'wall'" :players="gameServer.players"/>
        <GameserverCardPlayerListing v-else :players="gameServer.players"
                                     :withScore="gameServer.capabilities.player_score"/>
      </div>
      <div v-else>
        <!-- empty placeholder when player names capability is unavailable -->
        <div v-if="display === 'wall'" :style="{height: '20px'}">

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import getIcon from "@/data/icons.js";
import getColor from "@/data/colors.js";
import gameServers from "@/components/GameServers.vue";

export default {
  computed: {
    gameServers() {
      return gameServers
    }
  },
  data() {
    return {
      i: 0,
      interval: null
    }
  },
  props: ['gameServer', 'display'],
  methods: {
    getIcon,
    getColor,
    formatPlayerCount(gameServer) {
      if (gameServer.capabilities.player_count) {
        return `${gameServer.online_players} / ${gameServer.max_players}`;
      } else {
        return `max: ${gameServer.max_players}`;
      }
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.i++;
      if (this.i === this.gameServer.addresses.length) {
        this.i = 0;
      }
    }, 7500)
  },
  unmounted() {
    clearInterval(this.interval)
  }
}
</script>


<style scoped>
ul {
  margin-bottom: 0.5rem;
  padding-left: 1rem;
}

li {
  color: #777;
}

li span {
  color: #fff;
}


.server-card {
  margin: 3px;
  border: 2px solid #444;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  position: relative;
}

.server-card.active {
  border: 2px solid #777;
  background: #222222;
}

.server-card.active:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;

  box-shadow: #777 0 0 15px;
}

/* -------- Header -------- */

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border-bottom: 2px solid #000;
  min-height: 40px;
}

.card-header img {
  width: 24px;
  height: 24px;
}

.title {
  line-height: 1.1;
}

.game-name {
  font-weight: bold;
  font-size: 14px;
}

.sub-info {
  font-size: 12px;
  opacity: 0.85;
}

/* -------- Body -------- */

.card-body {
  padding: 4px 6px;
  font-size: 13px;
}

.playerCount.empty {
  color: #555555;
}

/* Metadata block */
.meta {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px;
  margin-bottom: 4px;
}
</style>