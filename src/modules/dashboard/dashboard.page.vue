<template>
  <div class="dashboard-root">
    <ba-header active-module="dashboard"></ba-header>
    <div class="u-pt4"></div>
    <div class="u-pt4"></div>
    <h2 class="u-text--center u-header-padding"> {{companyNameById(companyId)}}</h2>
    <div class="u-text--sm u-text--center">Welcome {{user.username}}</div>

    <el-row v-if="isUsersAllowed" class="container">
      <el-col class="users-list" :span="24">
        <div class="el-card" v-for="(user, i) in users" :key="i">
          <div class="users-list__view">
            <div>
              <div class="el-card__name">{{user.name}}</div>
              <div class="el-card__tel" v-if="!user.phones.length">
                <i class="el-icon-phone-outline"></i>No Data
              </div>
              <div class="el-card__tel" v-if="user.phones.length">
                <i class="el-icon-phone-outline"></i>{{user.phones[0].phone}}
              </div>
              <div class="el-card__address" v-if="user.addresses.length">
                <p><i class="el-icon-location-outline"></i>{{user.addresses[0].address_country}}, {{user.addresses[0].address_city}}</p>
                <p><i class="el-icon-location-outline"></i>{{user.addresses[0].address_zip}}, {{user.addresses[0].address_line1}}</p>
              </div>
            </div>
            <div class="users-list__view_icon">
              <div v-if="user.photo_id" class="el-card__photo"><img :src="urlForAttachment(user.photo_id)"></div>
              <div v-if="!user.photo_id" class="el-card__photo"><img :src="iconUser" alt="user photo"></div>
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
  components: {},
  data () {
    let companyId = this.$route.params.companyId
    return {
      companyId,
      iconUser,
      isUsersAllowed: false
    }
  },
  computed: {
    ...mapState('shared', ['user', 'users']),
    ...mapGetters('shared', ['companyNameById']),
  },
  methods: {
    ...mapActions('shared', ['getInsureds']),
    urlForAttachment (fileId) {
      return config.url + '/get_attachment_all/?file_id=' + fileId + '&company_id=' + this.companyId
    }
  },
  created () {
    this.getInsureds(this.companyId)
      .then(() => {
        this.isUsersAllowed = true
      })
      .catch(e => {
        this.isUsersAllowed = false
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
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 30px 30px 0;
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

    @media only screen and (max-width: 768px) {
      padding: 0 15px 0;
    }
    .el-card {
      min-width: 300px;
      margin-bottom: 30px;
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