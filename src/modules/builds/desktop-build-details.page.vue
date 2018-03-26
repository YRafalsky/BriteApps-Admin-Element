<template>
  <div class="build-details">
    <ba-header activeModule="Desktop Builds"></ba-header>
    <div v-loading="loading" class="build-details__root ">
      <div class="u-pt4"></div>
      <div class="u-pt4"></div>
      <h2 class="u-text--center">Build {{ humanBuildId }} Details</h2>
      <div class="controls-container u-text--center">
        <el-button  icon="el-icon-refresh" @click="invalidateBuildStatus()">Invalidate Status</el-button>
      </div>
      <div class="u-text--center u-mt3">
          <ba-status-label v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0.1)"  v-if="build" :build="build"></ba-status-label>
      </div>


      <div v-if="loading">Loading...</div>
      <div v-if="!loading && build && build.status=='SUCCEEDED'">

      </div>
        <div class="u-text--right">
            <el-checkbox  v-model="showBuildTechnicalDetails">Show Build Technical Details</el-checkbox>
        </div>
        <el-collapse-transition>
            <div v-show="showBuildTechnicalDetails">

            <pre class="build__pre u-px4">
            <div>Build status : {{build.status}}</div>
            <div>aws_build_id : {{build.aws_build_id}}</div>
            <div>internal_id : {{build.internal_id}}</div>
            <div>queued_at: {{build.queued_at | moment('YYYY-MM-DD HH:mm')}}</div>
            <div>queued_at (UTC): {{build.queued_at}} (UTC)</div>
            <div>commit_id: {{build.commit_id ? build.commit_id : '[master]'}}</div>
            </pre>
            </div>

        </el-collapse-transition>
      <div class="row" v-if="!loading && build">
        <div class="col-12">
        </div>
        <div class="col-12">
          <h3 class="u-text--center u-mt4">Build Preview</h3>
            <a :href="buildPreviewLink" target="_blank" class="desktop__preview-link u-m4 c-heading__section u-text--center">Open In Separate Tab</a>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios'

import config from '@/config'

import ElTag from 'element-ui/packages/tag/src/tag'

export default {
  components: {
    ElTag,
  },
  data () {
    let buildId = this.$route.params.buildId
    let companyId = this.$route.params.companyId
    return {
      loading: true,
      loadingStatus: false,
      buildId,
      showBuildTechnicalDetails: false,
      build: {},
      loadBuildTimerRef: null,
      companyId,
    }
  },
  computed: {
    buildPreviewLink () {
      return this.build.aws_build_preview
    },
    humanBuildId () {
      return this.build ? this.build.version + '.' + this.build.build_number : 'UNDEFINED'
    }
  },
  methods: {

    invalidateBuildStatus () {
      this.loading = true
      axios.patch(config.desktop_builds_details + this.buildId + '/')
        .then(response => {
          this.loading = false
          this.build = response.data
        })
    },
    loadBuild () {
      if (this.build.status && ['queued', 'IN_PROGRESS'].indexOf(this.build.status) === -1) {
        this.loading = false
        return
      }
      if (!this.loading) {
        this.loadingStatus = true
      }
      axios.get(config.desktop_builds_details + this.buildId + '/')
        .then(response => {
          if (!this.loading) {
            this.loadingStatus = false
          }
          this.loading = false
          this.build = response.data
          if (['queued', 'IN_PROGRESS'].indexOf(this.build.status) !== -1) {
            this.loadingStatus = true
            this.initBuildStatus = this.build.status
            this.loadBuildTimerRef = setTimeout(this.loadBuild, 15000)
          } else {
            this.loadingStatus = false
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  beforeMount () {
    this.loading = true
    this.initBuildStatus = null
    this.loadBuild()
  },
  beforeDestroy () {
    clearTimeout(this.loadBuildTimerRef)
    clearTimeout(this.loadApplePromoteTimerRef)
  }
}
</script>
<style>
  .build-details__root  .el-loading-mask{
      z-index: 799;
  }

  .build__pre {
    background-color: #eeeeee;

  }
    .desktop__preview-link {
        text-align: center;
        display: block;
        text-decoration: underline;
    }

</style>
