<template>
  <div class="dashboard-root">
    <ba-header active-module="dashboard"></ba-header>
    <div class="u-pt4"></div>
    <div class="u-pt4"></div>
    <h2 class="u-text--center u-header-padding"> {{companyNameById(companyId)}}</h2>
    <div class="u-text--sm u-text--center">Welcome {{user.username}}</div>
    <el-button class="u-ml4" @click="downloadInsuredListXls">Download insureds list</el-button>
    <el-row v-if="isUsersListDownloaded" class="container">
      <el-col class="users-list" :span="24">
        <div class="el-card" v-for="(userItem, i) in users" :key="i">
          <div class="users-list__view">
            <div>
              <div class="el-card__name">{{userItem.name}}</div>
              <div class="el-card__tel" v-if="!userItem.phones.length">
                <i class="el-icon-phone-outline"></i>No Data
              </div>
              <div class="el-card__tel" v-if="userItem.phones.length">
                <i class="el-icon-phone-outline"></i>{{userItem.phones[0].phone}}
              </div>
              <div class="el-card__address" v-if="userItem.addresses.length">
                <p><i class="el-icon-location-outline"></i>{{userItem.addresses[0].address_country}}, {{userItem.addresses[0].address_city}}</p>
                <p><i class="el-icon-location-outline"></i>{{userItem.addresses[0].address_zip}}, {{userItem.addresses[0].address_line1}}</p>
              </div>
              <el-button size="mini" @click="getSuperuserCredentialsClick(userItem.id)" v-if="user.is_superuser">
                <p>Login as Superuser</p>
              </el-button>
            </div>
            <div class="users-list__view_icon">
              <div v-if="userItem.photo_id" class="el-card__photo"><img :src="urlForAttachment(userItem.photo_id)"></div>
              <div v-if="!userItem.photo_id" class="el-card__photo"><img :src="iconUser" alt="user photo"></div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import iconUser from '../../assets/non-user.svg'
import config from '@/config'

export default {
  name: 'ba-dashboard',
  data () {
    let companyId = this.$route.params.companyId
    return {
      companyId,
      iconUser,
      isUsersListDownloaded: false
    }
  },
  computed: {
    ...mapState('shared', ['user', 'users']),
    ...mapGetters('shared', ['companyNameById']),
  },
  methods: {
    ...mapActions('shared', ['getInsureds', 'getSuperuserCredentials']),
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
  created () {
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
  }
}
</script>
<style lang="scss">

  @import '../../styles/variables';

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