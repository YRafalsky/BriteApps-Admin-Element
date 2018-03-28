<template>
    <div>
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
  <div>
    Apple promotions
    <el-tag
      v-loading="loading"
      style="min-width: 100px;"
      class="u-text--center"
      type="success"
      close-transition>PROD: {{appleProdBuild | capitalize}}</el-tag>
    <el-tag
      v-loading="loading"
      style="min-width: 100px;"
      class="u-text--center"
      type="primary"
      close-transition>BETA: {{appleBetaBuild | capitalize}}</el-tag>
  </div>
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
      return this.builds && this.builds['Play Market'].production? this.builds['Play Market'].production: 'None'
    },
    betaBuild () {
      return this.builds && this.builds['Play Market'].beta? this.builds['Play Market'].beta: 'None'
    },
    appleProdBuild () {
      return this.builds && this.builds['App Store'].production? this.builds.production['App Store']: 'None'
    },
    appleBetaBuild () {
      return this.builds && this.builds['App Store'].beta? this.builds['App Store'].beta: 'None'
    }
  },
  methods: {
    loadAndroidPromotesState () {
      this.loading = true
      clearTimeout(this.loadAndroidTimerRef)
      axios.get(`${config.url}/company/${this.companyId}/promoted/tracks`)
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

