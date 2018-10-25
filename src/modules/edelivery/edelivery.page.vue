<template>
  <div class="edelivery">
    <ba-header activeModule="E-Delivery"></ba-header>
    <div class="edelivery__content u-p4 main-content">
      <h2 class="c-heading__page u-mt4 u-pt2">E-Delivery dashboard</h2>
      <div class="edelivery__table">
        <div class="edelivery__filters u-mt4">
          <el-form inline>


            <el-form-item label="From" class="line-height-3"><el-date-picker v-model="range.from"></el-date-picker></el-form-item>
            <el-form-item label="To" class="line-height-3"><el-date-picker  v-model="range.to"></el-date-picker></el-form-item>

            <el-form-item><el-button @click="loadPage(1)" icon="el-icon-search">Filter</el-button></el-form-item>
            <el-checkbox @change="loadPage(1)" v-model="ignoreState" class="u-ml4 u-mt2">Ignore notification state</el-checkbox>
          </el-form>
        </div>

        <div class="u-mt3">
          <el-button @click="willSendAndMarkAsSent()" :disabled="!areButtonsEnabled" icon="el-icon-check">Send and Mark</el-button>
          <el-button @click="willSend()" :disabled="!areButtonsEnabled" icon="el-icon-message">Send</el-button>
          <el-button @click="willMarkAsSent()" :disabled="!areButtonsEnabled">Mark as sent</el-button>

          <el-table @row-click="rowClick"  @selection-change="selectionDidChange" v-loading="loading" ref="edeliveryTable" class="u-mt3" :data="items" style="width: 100%">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="policy_number" label="Policy Number" width="150"></el-table-column>
            <el-table-column prop="label" label="Label" width="190"></el-table-column>
            <el-table-column prop="title" label="Title"></el-table-column>
            <el-table-column prop="print_date" label="Print Date" width="150"></el-table-column>
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
import _ from 'lodash'

export default {
  components: {
    ElButton,
    BaCompanyImage,
  },
  name: 'ba-edelivery',
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
      loading: true,
      total: 0,
      perPage: 50,
      selectedItems: [],
      ignoreState: false,
      onlyElectronicDelivery: true
    }
  },
  computed: {
    areButtonsEnabled () {
      return !this.loading && this.selectedItems.length > 0
    }
  },
  beforeMount () {
    this.loading = true
    this.loadInitial()
  },
  methods: {
    rowClick (selectedObject) {
      this.$refs.edeliveryTable.toggleRowSelection(selectedObject)
    },
    loadInitial () {
      this.loadPage(1)
    },
    setSelectionStateForAll (desiredCheckedState) {
      if (this.items) {
        this.items.forEach(row => {
          this.$refs.edeliveryTable.toggleRowSelection(row, desiredCheckedState)
        })
      }
    },
    checkAll () {
      this.setSelectionStateForAll(true)
    },
    uncheckAll () {
      this.setSelectionStateForAll(false)
    },
    loadPage (page) {
      console.log('loadPage')
      this.loading = true
      axios.post(`${config.url}/company/${this.companyId}/get_edelivery/`, {
        from_date: this.range.from,
        to_date: this.range.to,
        per_page: this.perPage,
        page: page,

        ignore_state: this.ignoreState,
        only_electronic_delivery: this.onlyElectronicDelivery,
      }).then((ret) => {
        // debugger
        this.items = ret.data.data.documents
        this.total = ret.data.data.total
        this.perPage = ret.data.data.page_size
      })
      .finally(() => {
        this.loading = false
      })
    },
    selectionDidChange (selectedItems) {
      this.selectedItems = selectedItems
    },
    sendNow (selectedItems) {
      let fileIds = _.map(selectedItems, function (item) {
        return item['file_id']
      })
      axios.post(`${config.url}/company/${this.companyId}/make_edelivery/`, {ignore_state: this.ignoreState, file_ids: fileIds})
      .then(response => {
        this.$message({
          type: 'success',
          message: 'EMails sent.'
        })
      })
      .catch(response => {
        this.$message({
          type: 'error',
          message: 'Failed to send emails.'
        });
      })
      .finally(() => this.loadInitial())

    },
    sendAndMarkNow (selectedItems) {
      let fileIds = this.fileIdsFromItems(selectedItems)
      axios.post(`${config.url}/company/${this.companyId}/make_edelivery/`, {ignore_state: this.ignoreState, file_ids: fileIds})
        .then(response => {
          this.markAsSentNow(selectedItems)
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: 'Failed to sent emails.'
          });
        })

    },
    markAsSentNow (selectedItems) {
      let fileIds = this.fileIdsFromItems(selectedItems)
      axios.post(`${config.url}/company/${this.companyId}/mark_as_delivered/`, {ignore_state: this.ignoreState, file_ids: fileIds})
      .then(response => {
        this.$message({
          type: 'success',
          message: 'EMails marked as sent.'
        })
      })
      .catch(response => {
        this.$message({
          type: 'error',
          message: 'Failed to mark as sent emails.'
        });
      })
      .finally(() => this.loadInitial())

    },
    howManyMailsWillBeSend () {
      const uniqueContacts = [...new Set( this.selectedItems.map(_=> _.contact_id)) ];
      return uniqueContacts.length
    },
    fileIdsFromItems (selectedItems) {
      let fileIds = _.map(selectedItems, function (item) {
        return item['file_id']
      })

      return fileIds
    },
    willSendAndMarkAsSent () {
      let countOfEmails = this.howManyMailsWillBeSend()
      let countOfDocuments = this.selectedItems.length
      this.$confirm(`This will send ${countOfEmails} email(s) and mark ${countOfDocuments} documents(s) as sent. Continue?`, 'Emails are about to be sent', {
        confirmButtonText: 'Send and Mark',
        cancelButtonText: 'Cancel',
        type: 'info'
      }).then(() => {
        this.sendAndMarkNow(this.selectedItems)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Operation canceled'
        });
      });
    },
    willMarkAsSent () {
      let count = this.selectedItems.length
      this.$confirm(`This will mark as sent ${count} document(s). Continue?`, 'Documents are about to be marked as sent', {
        confirmButtonText: 'Mark as Sent',
        cancelButtonText: 'Cancel',
        type: 'info'
      }).then(() => {
        this.markAsSentNow(this.selectedItems)

      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Operation canceled'
        });
      });
    },
    willSend () {
      let count = this.howManyMailsWillBeSend()
      this.$confirm(`This will send ${count} email(s). Continue?`, 'Emails are about to be sent', {
        confirmButtonText: 'Send',
        cancelButtonText: 'Cancel',
        type: 'info'
      }).then(() => {
        this.sendNow(this.selectedItems)

      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Operation canceled'
        });
      });
    }
  },
}
</script>

<style scoped>
  .line-height-3 {
    line-height: 2em;
  }
</style>

<style>
  .edelivery .el-pager li.active {
    color: #fff;
    background-color: #409EFF;
  }

</style>

