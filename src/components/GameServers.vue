<template>
  <b-col cols="12" md="6" xl="4" v-for="gameServer in gameServers" :key="gameServer.id ?? gameServer.name" class="m-0 p-0" >
    <gameserver-card :gameServer="gameServer" :display="display" />
  </b-col>
</template>

<script>
export default {
  props: {
    gameServers: {
      type: Array,
      required: true,
    },
    display: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>

</style>