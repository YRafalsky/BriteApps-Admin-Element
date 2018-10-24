<template>
  <div v-loading="loading" class="dashboard-root main-content">
    <ba-header active-module="dashboard"></ba-header>
    <h2 class="u-text--center u-header-padding"> {{companyNameById(companyId)}}</h2>
    <div class="u-text--sm u-text--center">Welcome {{user.username}}</div>
    <el-button class="u-ml4" @click="downloadInsuredListXls">Download registered user list</el-button>

    <div v-if="isUsersListDownloaded" class="block u-ml4 u-mt4">
      <span class="demonstration">From</span>
      <el-date-picker
              v-model="pickerDateFrom"
              type="date"
              placeholder="Pick a date"
              default-value="10-22-2018"
              format="MM/dd/yyyy"
      >
      </el-date-picker>
      <span class="demonstration">To</span>
      <el-date-picker
              v-model="pickerDateTo"
              type="date"
              placeholder="Pick a date"
              default-value="10-23-2018"
              format="MM/dd/yyyy"
      >
      </el-date-picker>
      <el-button icon="el-icon-search"
                 @click="showFilteredUsers"
                 @keyup.enter.native="showFilteredUsers">Filter</el-button>
      <el-button v-if="pickerDateFrom !== '' || pickerDateTo !== ''"
                 @click="clearFilteredUsers"
                 @keyup.enter.native="clearFilteredUsers"
      >Clear selection</el-button>
    </div>

      <el-table
              v-if="isUsersListDownloaded"
              class="users-table u-ml4 u-mt4"
              :data="filterUsers"
      >
        <el-table-column
                label="User Name"
                prop="name"
                sortable
        ></el-table-column>
        <el-table-column
                label="User Login"
                prop="ba_username"
                sortable
        >
        </el-table-column>
        <el-table-column
                label="Registration Date"
                prop="ba_registered_date"
                sortable
        >
        </el-table-column>
        <el-table-column
                label="Phone Number"
                prop="phones[0].phone"
                width="150"
        >
        </el-table-column>
        <el-table-column
                label="Address"
                class-name="adress-data"
                prop="addresses[0].address_country"
                width="75"
        >
        </el-table-column>
          <el-table-column
                  label=""
                  class-name="adress-data"
                  prop="addresses[0].address_city"
                  width="90"
          >
          </el-table-column>
            <el-table-column
                    label=""
                    class-name="adress-data"
                    prop="addresses[0].address_line1"
                    width="150"
            >
            </el-table-column>
        <el-table-column
                label="Login as Superuser"
                class-name="adress-data"
          >
          <template slot-scope="scope">
            <el-button v-if="user.is_superuser" size="mini" @click="getSuperuserCredentialsClick(scope.row.id)">
              Login
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import iconUser from '../../assets/non-user.svg'
import config from '@/config'
import _ from 'lodash'
import * as moment from 'moment'

export default {
  name: 'ba-dashboard',
  data () {
    let companyId = this.$route.params.companyId
    return {
      companyId,
      iconUser,
      isUsersListDownloaded: false,
      usersArray: null,
      loading: false,
      momentFrom: '',
      momentTo: '',
      pickerDateFrom: '',
      pickerDateTo: ''
    }
  },
  computed: {
    ...mapState('shared', ['user', 'users']),
    ...mapGetters('shared', ['companyNameById']),
    filterUsers () {
      if (!this.momentFrom || !this.momentTo) {
        this.usersArray = _.values(this.users)
        return this.usersArray
      }
      this.usersArray = this.usersArray.filter((el) => {
        let superUserDate = Number(new Date(el.ba_registered_date))
        return this.momentFrom < superUserDate && superUserDate < this.momentTo
      })
      return this.usersArray
    },
  },
  methods: {
    ...mapActions('shared', ['getInsureds', 'getSuperuserCredentials']),
    showFilteredUsers () {
      this.getAllUsers()
      let dateFrom = new Date(this.pickerDateFrom)
      let dateTo = new Date(this.pickerDateTo)
      this.momentFrom = parseInt(moment(dateFrom).format('x'))
      this.momentTo = parseInt(moment(dateTo).format('x'))
    },
    getAllUsers () {
      this.usersArray = _.values(this.users)
    },
    clearFilteredUsers () {
      this.momentFrom = ''
      this.momentTo = ''
      this.pickerDateFrom = ''
      this.pickerDateTo = ''
      return () => this.filterUsers
    },
    urlForAttachment (fileId) {
      return config.url + '/get_attachment_all/?file_id=' + fileId + '&company_id=' + this.companyId
    },
    downloadInsuredListXls () {
      let url = config.url + '/company/' + this.companyId + '/get_insureds_xls/?token=' + localStorage.carrierToken
      window.open(url, '_blank')
    },
    getSuperuserCredentialsClick (userId) {
      this.getSuperuserCredentials(userId)
        .then(response => {
          if (response.data.success) {
            this.$alert(
              '<p><i>This is a one-time password to perform superuser access ' +
              'to given user. Password will expire immediately after logging in or ' +
              'automatically within 30 minutes</i><br>' +
              '<p>Username: ' + response.data.data.username +
              '<p>Password: ' + response.data.data.password,
              'Superuser Credentials',
              {dangerouslyUseHTMLString: true}
            )
          }
        })
    }
  },
  mounted () {
    this.loading = true
    this.getInsureds(this.companyId)
      .then(() => {
        this.isUsersListDownloaded = true
      })
      .catch(e => {
        this.isUsersListDownloaded = false
        this.$message({
          type: 'error',
          message: '' + e,
        })
      })
      .finally(() => {
        this.loading = false
      })
    this.getAllUsers()
  }
}
</script>
<style lang="scss">

  @import '../../styles/variables';

  .adress-data > div.cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .users-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-column-gap: 10px;
    grid-row-gap: 15px;
    padding: 30px;

    @media only screen and (max-width: 992px) {
      grid-template-columns: 1fr;
      width: 100%;
    }

    &__view {
      display: flex;
      justify-content: space-between;
      &_icon {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 10px;
        border-left: 1px solid $gray--020;

      }
    }

    .el-card {
      &__photo {
        & > img {
          height: 40px;
        }
      }
      &__name {
        color: $black;
        font-weight: 500;
        padding-bottom: 5px;
      }
      &__tel {
        color: $gray--080;
        font-size: 14px;
        font-weight: 300;
        line-height: 20px;
        & > i {
          padding-right: 5px;
        }
      }
      &__address {
        color: $gray--080;
        font-size: 14px;
        font-weight: 300;
        & > p {
          margin: 0;
          line-height: 20px;
          & > i {
            padding-right: 5px;
          }
        }
      }

      @media only screen and (max-width: 768px) {
        width: 100%;
      }
    }
  }

</style>