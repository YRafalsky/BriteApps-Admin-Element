<template>
  <div class="dashboard-root">
    <ba-header active-module="dashboard"></ba-header>
    <div class="u-pt4"></div>
    <div class="u-pt4"></div>
    <h2 class="u-text--center u-header-padding"> {{companyNameById(companyId)}}</h2>
    <div class="u-text--sm u-text--center">Welcome {{user.username}}</div>

  </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'

export default {
  name: 'ba-dashboard',
  components: {},
  data () {
    let companyId = this.$route.params.companyId
    return {companyId}
  },
  computed: {
    ...mapState('shared', ['user']),
    ...mapGetters('shared', ['companyNameById']),
  },
  methods: {
    ...mapActions('settings', ['getInsureds']),
  },
  created () {
    this.getInsureds(this.companyId)
  }
}
</script>
<style scoped>
</style>