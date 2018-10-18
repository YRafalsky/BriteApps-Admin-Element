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
    padding-top: 20px;

    @media (max-width: 767px) {
      margin-left: 0 !important;
      padding-top: 80px;
    }
  }
</style>
