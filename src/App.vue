<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
  .main-content {
    margin-left: 220px !important;

    @media (max-width: 767px) {
      margin-left: 0 !important;
    }
  }
</style>
