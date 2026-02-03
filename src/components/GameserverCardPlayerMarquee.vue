<template>
  <div class="player-ticker empty" v-if="!players || players.length === 0">
    <span>this server is empty</span>
  </div>
  <div class="player-ticker" v-else>
    <div class="ticker-track">
      <span v-for="ply in players">{{ ply.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['players'],
}
</script>


<style scoped>
.player-ticker {
  position: relative;
  overflow: hidden;
  border: 1px solid #444;
  background: #000;
  height: 20px;
  display: flex;
  align-items: center;
}

.player-ticker.empty {
  justify-content: center;
  font-size: 12px;
  opacity: 0.6;
}

/* Moving content */
.ticker-track {
  display: inline-flex;
  gap: 16px;
  padding-left: 100%;
  white-space: nowrap;
  animation: scroll-left 21s linear infinite;
}

.ticker-track span:not(:last-child)::after {
  content: "|";
  margin-left: 8px;
  opacity: 0.6;
}

/* Animation */
@keyframes scroll-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
</style>