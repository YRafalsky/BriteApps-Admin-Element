<template>
  <div>
    Android promotions
    <el-tag
      v-loading="loading"
      style="min-width: 100px;"
      class="u-text--center"
      type="success"
      close-transition>PROD: {{prodBuild | capitalize}}</el-tag>
    <el-tag
      v-loading="loading"
      style="min-width: 100px;"
      class="u-text--center"
      type="primary"
      close-transition>BETA: {{betaBuild | capitalize}}</el-tag>
  </div>
</template>


<script>
import axios from 'axios'
import config from '@/config'

export default {
  name: 'ba-android-version-list',
  props: ['companyId'],
  data () {
    return {
      loading: true,
      builds: {},
      loadAndroidTimerRef: null,
      dataValid: false
    }
  },
  computed: {
    prodBuild () {
      return this.builds && this.builds.production? this.builds.production: 'None'
    },
    betaBuild () {
      return this.builds && this.builds.beta? this.builds.beta: 'None'
    }
  },
  methods: {
    loadAndroidPromotesState () {
      this.loading = true
      clearTimeout(this.loadAndroidTimerRef)
      axios.get(`${config.url}/company/${this.companyId}/promoted/android`)
        .then(response => {
          this.builds = response.data
          this.dataValid = true
          this.loadAndroidTimerRef = setTimeout(this.loadAndroidPromotesState, 60000)
        })
        .catch(response => {
          this.dataValid = false
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  beforeMount () {
    this.loadAndroidPromotesState()
  },
  beforeDestroy () {
    clearTimeout(this.loadAndroidTimerRef)
  }
}
</script>

