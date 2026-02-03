<template>
  <div v-if="!players || players.length === 0" class="players-placeholder">
    No online players
  </div>
  <table v-else class="players">
    <thead>
    <tr>
      <th>Player</th>
      <th v-if="withScore">Score</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="ply in players">
      <td>{{ ply.name }}</td>
      <td v-if="withScore">{{ ply.score }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['players', 'withScore'],
}
</script>


<style scoped>

.players-placeholder {
  width: 100%;
  background: #222;
  border: 1px solid #444;
  padding: 2px 4px;
  text-align: center;
  color: #aaa;
}

/* -------- Player table -------- */

.players {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.players th,
.players td {
  border: 1px solid #444;
  padding: 2px 4px;
}

.players th {
  background: #222;
  text-align: left;
}

.players td:nth-child(2),
.players th:nth-child(2) {
  text-align: right;
  font-family: monospace;
}


</style>