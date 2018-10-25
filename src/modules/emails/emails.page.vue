<template>
  <div class="emails">
    <ba-header activeModule="Emails"></ba-header>
    <div class="u-p4 main-content">
      <h2 class="c-heading__page u-mt4 u-pt2">EMails dashboard</h2>
      <div>
        <div class="u-mt3" v-show="view_mode=='group_events'">
          <h2 class="u-pt2">Emails group events</h2>
          <div class="u-mt4">
            <el-form inline>
              <el-form-item label="From" class="line-height-3"><el-date-picker v-model="range.from"></el-date-picker></el-form-item>
              <el-form-item label="To" class="line-height-3"><el-date-picker  v-model="range.to"></el-date-picker></el-form-item>
              <el-form-item><el-button @click="loadPage(1)" icon="el-icon-search">Filter</el-button></el-form-item>
            </el-form>
          </div>
          <el-table @row-click="groupEventsRowClick"  v-loading="loading" class="u-mt3" :data="items" style="width: 100%">
            <el-table-column prop="short_description" label="Description"></el-table-column>
            <el-table-column prop="related_user_name" label="Related User" width="300"></el-table-column>
            <el-table-column label="Mail events amount" width="100">
                  <template slot-scope="scope">
                    {{scope.row.email_events.length}}
                </template>
            </el-table-column>
            <el-table-column prop="initiated_at" label="Event Date" width="300"></el-table-column>
          </el-table>
          <el-pagination class="u-mt4" layout="prev, pager, next"
                         :total="total" :page-size="perPage"
                         @current-change="loadPage">
          </el-pagination>
        </div>
        <div class="u-mt3" v-show="view_mode=='events'">
          <div><el-button @click="leaveEventsTable" icon="el-icon-d-arrow-left" style="display: inline-block"></el-button><h2 style="display: inline-block" class="u-pt2 u-ml3">Emails events</h2></div>
          <el-table @row-click="eventsRowClick" v-loading="loading" class="u-mt3" :data="email_events" style="width: 100%">
            <el-table-column prop="subject" label="Subject"></el-table-column>
            <el-table-column prop="recipient" label="Recipient" width="300"></el-table-column>
            <el-table-column prop="actual_recipient" label="Actual Recipient" width="300"></el-table-column>
            <el-table-column prop="status" label="Status" width="100"></el-table-column>
            <el-table-column prop="sent_at" label="Event Date" width="300"></el-table-column>
          </el-table>
        </div>

        <div class="u-mt3" v-show="Object.keys(singleEvent).length">
          <div class="el-card u-mt4 u-pb0">
            <h4 class="c-heading--lg u-mb3 section">
              <div class="section__name"> {{ singleEvent.subject }}</div>
            </h4>
            <el-form v-for="value, name in singleEvent" :key="name" label-position="top">
              <el-form-item :label="name">
                <div v-if="value && value.length > 50">
                  <el-input type="textarea" v-bind:value="value" readonly></el-input>
                </div>
                <div v-else>
                  <el-input v-bind:value="value" readonly></el-input>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
/* eslint-disable */
import BaCompanyImage from '@/modules/appearance/company-image.component'
import ElButton from 'element-ui/packages/button/src/button'
import axios from 'axios'
import config from '@/config'
import qs from 'qs'
import _ from 'lodash'

export default {
  components: {
    ElButton,
    BaCompanyImage,
  },
  name: 'ba-email',
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
      view_mode: 'group_events',
      email_events: [],
      singleEvent: {},
      loading: true,
      total: 0,
      perPage: 20,
    }
  },
  beforeMount () {
    this.loading = true
    this.loadInitial()
  },
  methods: {
    groupEventsRowClick (selectedObject) {
      this.view_mode = 'events'
      this.email_events = selectedObject.email_events
    },
    leaveEventsTable () {
      this.view_mode = 'group_events'
      this.email_events = []
      this.singleEvent = {}
    },
    eventsRowClick (selectedObject) {
      this.singleEvent = _.pick(selectedObject, ['subject', 'user_name', 'status' ,'status_details', 'recipient', 'actual_recipient', 'content', 'recipient_type'])
    },
    loadInitial () {
      this.loadPage(1)
    },
    loadPage (page) {
      console.log('loadPage')
      this.loading = true
      axios.get(`${config.url}/company/${this.companyId}/email_group_events/`, {params:{
        page_size: this.perPage,
        page: page,
        from_date: this.$moment(this.range.from).format('MM-DD-YYYY'),
        to_date: this.$moment(this.range.to).format('MM-DD-YYYY'),
      }}).then((ret) => {
        this.items = ret.data.data.items
        this.total = ret.data.data.total
        this.perPage = ret.data.data.page_size
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

