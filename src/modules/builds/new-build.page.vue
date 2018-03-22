<template>
  <div class="new-build__root">
    <ba-header :activeModule="activeModule"></ba-header>

    <div class="u-pt4"></div>
    <div class="row u-p4">
      <div class="el-card u-mb4">
        <h4 class="c-heading__section u-mb4">Run new build</h4>

        <el-checkbox v-model="useCustomCommitId" class="u-mb4 u-mt4">Use custom commitId</el-checkbox>
        <div v-if="useCustomCommitId" class="col-12 col-sm-6  ">
          <el-input placeholder="Commit hash in GIT" v-model="commitId"></el-input>
        </div>
      </div>
      <div class="col-12 col-sm-6 u-mt4">
        <el-button v-if="!loading" @click="queueBuild()" class="build-button el-button--primary">Build for {{mode | capitalize}}</el-button>
        <el-button v-if="loading" :disabled="true" class="build-button--disabled">Please wait...</el-button>
      </div>
    </div>



  </div>
</template>

<script>
import axios from 'axios'
import BaHeader from '@/components/header.component'
import config from '@/config'
import ElCheckbox from 'element-ui/packages/checkbox/src/checkbox'

export default {
  components: {
    ElCheckbox,
    BaHeader},
  name: 'ba-new-build',
  data () {
    return {
      companyId: this.$route.params.companyId,
      loading: false,
      commitId: '',
      useCustomCommitId: false,
    }
  },
  computed: {
    mode () {
      return this.$route.query.mode
    },
    activeModule () {
      let activeModule = 'Builds'
      if (this.mode === 'desktop') {
        activeModule = 'Desktop ' + activeModule
      }
      return activeModule
    }
  },
  methods: {
    queueBuild () {
      this.loading = true

      let commitId = this.useCustomCommitId ? this.commitId : ''
      axios.post(`${config.url}/company/${this.companyId}/build-${this.mode}-app/`, {commit_id: commitId})
        .then(response => {
          this.$notify({
            title: 'Success',
            message: 'Build has been queued...',
            type: 'success'
          })
          this.$router.back()
        })
        .catch(response => {
          this.$notify.error({
            title: 'Error',
            message: 'Failed to queue build at this time',
          })
          this.loading = false
        })
    },
  },
}
</script>

<style scoped>

</style>