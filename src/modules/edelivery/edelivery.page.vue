<template>
  <div class="edelivery">
    <ba-header activeModule="E-Delivery"></ba-header>
    <div class="edelivery__content">
      <h2 class="c-heading__page">E-Delivery dashboard</h2>
      <div class="edelivery__table">

        <div>
          <el-form inline>
            <el-form-item label="From"><el-date-picker></el-date-picker></el-form-item>
            <el-form-item label="To"><el-date-picker></el-date-picker></el-form-item>
            <el-form-item><el-button @click="loadPage(1)">Filter</el-button></el-form-item>
          </el-form>
        </div>

        <div class="u-mt3">
          <el-button-group>
            <el-button>Check all</el-button>
            <el-button>Check none</el-button>
          </el-button-group>
          <el-button @click="doSomething">DO SOMETHING</el-button>
          <el-button>SEND</el-button>
          <el-button>Mark as sent</el-button>
          <el-table class="u-mt3" :data="items" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="policy_number" label="Policy Number" width="180"></el-table-column>
            <el-table-column prop="title" label="Title" width="180"></el-table-column>
            <el-table-column prop="label" label="Label"></el-table-column>
            <el-table-column prop="print_date" label="Print Date"></el-table-column>
          </el-table>
          <el-pagination class="u-mt4" layout="prev, pager, next"
                         :total="total" :page-size="perPage"
                         @current-change="loadPage">
          </el-pagination>
        </div>

      </div>
      <div class="edelivery__paginator">
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

export default {
  components: {
    ElButton,
    BaCompanyImage,
  },
  name: 'ba-edelivery',
  data () {
    return {
      companyId: this.$route.params.companyId,
      items: [],
      total: 0,
      perPage: 50,
      fromDate: '2017-10-10',
      toDate: '2018-02-20',
      ignoreState: false,
      onlyElectronicDelivery: true
    }
  },
  methods: {
    loadInitial () {
      this.loadPage(1)
    },
    loadPage (page) {
      console.log('loadPage')
      axios.post(`${config.url}/company/${this.companyId}/get_edelivery/`, {page: page}).then((ret) => {
        debugger
        this.items = ret.data.data.documents
        this.total = ret.data.data.total
      })
    },
    doSomething () {
      var page = 1
      axios.post(`${config.url}/company/${this.companyId}/get_edelivery/`,{
        from_date: this.fromDate,
        to_date: this.toDate,
        per_page: this.perPage,
        page: page,
        ignore_state: this.ignoreState,
        only_electronic_delivery: this.onlyElectronicDelivery
      }).then((ret) => {
        console.log(ret.data)
      })
    }
  },
}
</script>

<style scoped>
  .edelivery__content {
    padding-top: 3em;
  }

  .edelivery__table {
    padding: 3em;
  }
</style>