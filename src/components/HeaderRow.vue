<template>
  <b-row class="py-3 header">
    <b-col>
      <div class="d-flex justify-content-between">
        <h1><img style="height: 1.2em" src="@/assets/new_logo_icon.svg" alt="logo" class="pe-2">{{ title }}</h1>
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  props: ['title'],
}
</script>


<style scoped>
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