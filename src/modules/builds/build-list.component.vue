<template>
    <div class="builds-list__component">
        <div class="loading" v-if="loading">Loading...</div>
        <ba-android-version-list :companyId="companyId"></ba-android-version-list>

        <el-checkbox v-if="isSuperuser" @change="loadBuilds()" v-model="showAllBuilds">Show builds for all companies</el-checkbox>
        <h4 v-if="builds && builds.length > 0"class="u-mt4" >Previous builds:</h4>
        <el-table v-loading="loadingTable" v-if="builds && builds.length > 0" :data="builds">
            <el-table-column
                    label="Operations"
                    width="180">
                <template slot-scope="scope">
                    <a :href="'/build-details/' + scope.row.id" @click="$event.preventDefault()">
                        <el-button @click="$router.push({ name: 'build-details', params: { buildId: scope.row.id}})">
                            Details
                        </el-button>
                    </a>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="showAllBuilds"
                    prop="status"
                    label="Company"
                    width="180">
                <template slot-scope="scope">
                    {{scope.row.company}}

                </template>
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="Status"
                    width="180">
                <template slot-scope="scope">
                    <ba-status-label :build="scope.row"></ba-status-label>

                </template>
            </el-table-column>
            <el-table-column
                    prop="build_number"
                    label="#"
                    width="180">
                <template slot-scope="scope">
                    {{scope.row.version}}.{{scope.row.build_number}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="queued_at"
                    label="Queued At"
            >
                <template slot-scope="scope">
                    <div :title="'Time is local. \n UTC:' + scope.row.queued_at">{{scope.row.queued_at |
                        moment('YYYY-MM-DD HH:mm')}}
                    </div>
                </template>
            </el-table-column>


        </el-table>
        <h3 class="c-heading u-text--center" v-if="builds && builds.length === 0">
            There are no builds to show yet...
        </h3>
        <div v-if="builds" class="u-text--sm u-text--light u-text--right">50 latest builds shown</div>


    </div>


</template>

<script>
  import axios from 'axios'
  import config from '@/config'
  import router from '@/router'
  import ElButton from 'element-ui/packages/button/src/button'
  import AndroidVersionList from './android-version.component'
  import _ from 'lodash'
  import {mapGetters} from 'vuex'

  export default {
    components: {ElButton, 'ba-android-version-list': AndroidVersionList},
    name: 'baBuildList',
    data () {
      return {
        companyId: this.$route.params.companyId,
        timerRef: null,
        loading: true,
        loadingTable: false,
        builds: null,
        commitId: null,
        showAllBuilds: false,
      }
    },
    computed: {
      ...mapGetters('shared', ['isSuperuser'])
    },
    methods: {
      goLink (link) {
        router.push({path: link})
      },
      loadBuilds () {
        this.loadingTable = true
        let url = config.url + `/company/${this.companyId}/builds/`

        if (this.showAllBuilds) {
          url = config.url + `/builds/`
        }
        axios.get(url)
          .then(response => {
            this.loadingTable = false
            this.loading = false
            this.builds = response.data
            let pendingBuildsExist = _.some(
              this.builds, (build) => {
                return ['queued', 'IN_PROGRESS'].indexOf(build.status) !== -1
              }
            )

            let timeout = pendingBuildsExist ? 15000 : 60000
            this.timerRef = setTimeout(this.loadBuilds, timeout)
          })
          .catch(e => {
            this.loading = false
            this.$notify.error({
              title: 'Error',
              message: 'Failed to load builds',
            })
            this.builds = null
          })
      },
    },
    beforeMount () {
      this.loading = true
      this.loadBuilds()
    },
    beforeDestroy () {
      clearTimeout(this.timerRef)
    }
  }
</script>
<style scoped>
    .builds-list__component {
        padding: 2em;
    }

    .builds-list__item {
        padding: 1em;
    }

    .build__date,
    .build__status,
    .build__details {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
