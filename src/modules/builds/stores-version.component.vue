<template>
    <div>
  <div>
    Android promotions
    <el-tag
      v-loading="loading"
      style="min-width: 100px;"
      class="u-text--center"
      type="success"
      close-transition>PROD: {{androidProdBuild | capitalize}}</el-tag>
    <el-tag
      v-loading="loading"
      style="min-width: 100px;"
      class="u-text--center"
      type="primary"
      close-transition>BETA: {{androidBetaBuild | capitalize}}</el-tag>
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
      type="success"
      close-transition>IN-FLIGHT: {{appleInFlightBuild | capitalize}}</el-tag>
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
    androidProdBuild () {
      return this.builds && this.builds['Play Market'] && this.builds['Play Market'].production? this.builds['Play Market'].production: 'None'
    },
    androidBetaBuild () {
      return this.builds && this.builds['Play Market'] && this.builds['Play Market'].beta? this.builds['Play Market'].beta: 'None'
    },
    appleProdBuild () {
      return this.builds && this.builds['App Store'] && this.builds['App Store'].production? this.builds['App Store'].production: 'None'
    },
    appleInFlightBuild () {
      return this.builds && this.builds['App Store'] && this.builds['App Store']['in-flight']? this.builds['App Store']['in-flight']: 'None'
    },
    appleBetaBuild () {
      return this.builds && this.builds['App Store'] && this.builds['App Store'].beta? this.builds['App Store'].beta: 'None'
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

