<template>
  <div class="emails">
    <ba-header activeModule="Emails"></ba-header>
    <div class="u-p4">
      <h2 class="c-heading__page u-mt4 u-pt2">Insured Actions dashboard</h2>
      <div>
        <div class="u-mt3" >
          <h2 class="u-pt2">Insured Actions Log</h2>
          <div class="u-mt4">
            <el-form inline>
              <el-form-item label="From" class="line-height-3"><el-date-picker v-model="range.from"></el-date-picker></el-form-item>
              <el-form-item label="To" class="line-height-3"><el-date-picker  v-model="range.to"></el-date-picker></el-form-item>
              <el-form-item label="User" class="line-height-3">
                <el-select v-model="selectedUserName">
                  <el-option  :selected="selectedUser==user.id"
                              v-for="user in usersList"
                              :value="user.id"
                              :key="user.id">{{user.name}}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item><el-button @click="loadPage(1)" icon="el-icon-search">Filter</el-button></el-form-item>
            </el-form>
          </div>
          <el-table v-loading="loading" class="u-mt3" :data="items" style="width: 100%">
            <el-table-column prop="message" label="Message"></el-table-column>
            <el-table-column prop="message_code" label="Message code" width="200"></el-table-column>
            <el-table-column prop="user_name" label="user_name" width="200"></el-table-column>
            <el-table-column prop="received_at" label="Timestamp" width="220"></el-table-column>
            <el-table-column prop="message_timestamp" label="Message timestamp" width="220"></el-table-column>
            <el-table-column label="Extra vars" width="220">
              <template slot-scope="scope">{{scope.row.extra_vars}}</template>
            </el-table-column>
          </el-table>
          <el-pagination class="u-mt4" layout="prev, pager, next"
                         :total="total" :page-size="perPage"
                         @current-change="loadPage">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
/* eslint-disable */
import ElButton from 'element-ui/packages/button/src/button'
import axios from 'axios'
import config from '@/config'
import qs from 'qs'
import _ from 'lodash'

export default {
  components: {
    ElButton,
  },
  name: 'ba-insured-actions',
  data () {
    let now = new Date()
    let from = new Date()
    from.setFullYear(now.getFullYear() - 1);
    return {
      companyId: this.$route.params.companyId,
      range: {
        from: from,
        to: now,
      },
      items: [],
      usersListBriteApps: [],
      selectedUser: -1,
      loading: true,
      total: 0,
      perPage: 20,
    }
  },
  beforeMount () {
    this.loading = true
    this.loadInitial()
  },
  computed: {
    usersList () {
      return [{id: -1, name: 'All'}].concat(this.usersListBriteApps)
    },
    selectedUserName: {
      get: function () {
        let user = _.find(this.usersList, user => {
          return user.id === this.selectedUser;
        });
        return user.name
      },
      set: function (newValue) {
        this.selectedUser = newValue
      }
    }
  },
  methods: {
    loadInitial () {
      this.loadPage(1)
    },
    loadPage (page) {
      console.log('loadPage')
      this.loading = true
      let params = {
        page_size: this.perPage,
        page: page,
        from_date: this.$moment(this.range.from).format('MM-DD-YYYY'),
        to_date: this.$moment(this.range.to).format('MM-DD-YYYY'),
      }
      if (this.selectedUser !== -1) {
        params.user = this.selectedUser
      }
      axios.get(`${config.url}/company/${this.companyId}/get_insured_actions_list/`, {params:params})
      .then((ret) => {
        this.items = ret.data.data.search_result.items
        this.total = ret.data.data.search_result.total
        this.perPage = ret.data.data.search_result.page_size
        this.usersListBriteApps = ret.data.data.users
      })
      .finally(() => {
        this.loading = false
      })
    },
  },
}
</script>

<style scoped>
  .line-height-3 {
    line-height: 2em;
  }
</style>

<style>
</style>

