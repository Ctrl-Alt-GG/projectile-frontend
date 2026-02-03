<template>
  <b-col cols="12" md="6" xl="4" v-for="gameServer in gameServers" class="m-0 p-0" >
    <gameserver-card :gameServer="gameServer" :display="display" />
  </b-col>
</template>

<script>
export default {
  props: ['gameServers', 'display'],
}
</script>

<style scoped>

</style>