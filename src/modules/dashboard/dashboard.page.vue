<template>
  <div class="dashboard-root">
    <ba-header active-module="dashboard"></ba-header>
    <div class="u-pt4"></div>
    <div class="u-pt4"></div>
    <h2 class="u-text--center u-header-padding"> {{user.company.name}}</h2>
    <div class="u-text--sm u-text--center">Welcome {{user.username}}</div>

  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'ba-dashboard',
  components: {},
  data () {
    return {}
  },
  computed: {
    ...mapState('shared', ['user'])
  },
}
</script>
<style scoped>
</style>