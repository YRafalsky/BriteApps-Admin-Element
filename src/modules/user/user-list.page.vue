<template>
    <div class="users">
        <ba-header activeModule="Users"></ba-header>
        <div class="u-p4">
            <h2 class="c-heading__page u-mt4 u-pt2 u-pb3">Users List</h2>
            <!--Table list of available super users-->
            <el-table
                    class="users-table"
                    :data="users"
                    >
                <el-table-column
                        prop="username"
                        label="Username"
                        width="100"
                        >
                </el-table-column>
                <el-table-column
                        class-name="u-text--center"
                        prop="company"
                        label="Company"
                        >
                </el-table-column>
                <el-table-column
                        prop="last_login.date"
                        label="Last Login Date"
                        width="100"
                        >
                </el-table-column>
                <el-table-column
                        prop="last_login.time"
                        label="Last Login Time"
                        width="90"
                        >
                </el-table-column>
                <el-table-column
                        label="Modify"
                        class-name="u-text--center">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="resetPassword(scope.row)">Reset Password</el-button>
                        <el-button @click.native.prevent="removeUser(scope.row)">Remove</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="u-p4">
            <el-button @click="showModalWindow">Add Superuser</el-button>
        </div>
        <!--Dialog Window for Adding new user-->
        <el-dialog
                title="Add Super User"
                :visible.sync="centerDialogVisible"
                width="70%"
                center>
            <div class="user-input">
                <!--List of available Companies-->
                <el-select v-model="selectedCompany" placeholder="Select" required>
                    <el-option disabled value="">Select</el-option>
                    <el-option
                            v-for="company in getAllCompanies"
                            :key="company.id"
                            :label="company.name"
                            :value="company.name">
                    </el-option>
                </el-select>
                <el-input placeholder="New Username" type="email" v-model="inputDataUsername" required></el-input>
                <el-input placeholder="New Password" type="password" v-model="inputDataPassword" required></el-input>
                <el-button @click="reset">Clear All</el-button>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="closeModal">Cancel</el-button>
            <el-button type="primary"
                       @keyup.native.enter="saveNewSuperUser"
                       @click="saveNewSuperUser">Save
            </el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import {mapGetters, mapActions, mapState} from 'vuex'
import axios from 'axios'
import config from '@/config'

let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line

export default {
  name: 'users-list',
  computed: {
    ...mapGetters('shared', ['availableCompanies']),
    ...mapState('users', ['superUsers']),
    getAllCompanies () {
      let chooseAllCompanies = [{
        id: '0',
        name: '*'
      }]
      return chooseAllCompanies.concat(this.availableCompanies)
    },
    companyValidation () {
      let errMessage = ''
      if (this.selectedCompany === '') {
        errMessage = 'Please choose company'
        this.$message(errMessage)
        return
      }
      return errMessage
    },
    emailValidation () {
      let errMessage = ''
      let inputData = this.inputDataUsername.trim()
      if (inputData.length === 0) {
        errMessage = 'Email field is required'
        this.$message(errMessage)
        return
      }
      if (inputData.length && !emailRegex.test(inputData)) {
        errMessage = 'Please Input Correct Email'
        this.$message(errMessage)
        return
      }
      return errMessage
    },
    passwordValidation () {
      let errMessage
      let inputData = this.inputDataPassword.trim()
      if (inputData.length === 0) {
        errMessage = 'Password field is required'
        this.$message(errMessage)
        return
      }
      if (inputData.length && inputData.length < 8) {
        errMessage = 'Password should be more than 8 signs'
        this.$message(errMessage)
        return
      }
      return errMessage
    }
  },
  methods: {
    ...mapActions('users', ['loadUsers']),
    removeUser (data) {
      let userId = data.user_id
      let companyId = this.companyId
      // let token = localStorage.getItem('carrierToken')
      // console.log(userId, token, companyId)

      return axios.delete(`${config.url}/company/${companyId}/portal-users/${userId}`)
        .then(() => {
          this.$message({
            type: 'success',
            message: 'Delete completed'
          })
        }, (e) => {
          console.log('remove user: ', e)
        })


      // this.$confirm(`Are you sure to delete the user ${data.username}?`, 'Warning', {
      //   confirmButtonText: 'OK',
      //   cancelButtonText: 'Cancel',
      //   type: 'warning'
      // }).then(() => {

      //   .catch(() => {
      //     this.$message({
      //       type: 'warning',
      //       message: 'Delete canceled'
      //     })
      //   })

      // })
    },
    resetPassword (data) {
      let userId = data.user_id
      let token = localStorage.getItem('carrierToken')
      let chosenCompanyId = this.selectedCompany
      console.log(userId, token, chosenCompanyId)
      this.$confirm(`Are you sure you want to reset password of user ${data.username}?`,
        'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: 'Delete completed'
          })
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: 'Delete canceled'
          })
        })
    },
    showModalWindow () {
      this.centerDialogVisible = true
    },
    saveNewSuperUser () {
      if (this.companyValidation !== '') {
        return
      }
      if (this.emailValidation !== '' && this.passwordValidation !== '') {
        return
      }
      this.centerDialogVisible = false
      let userName = this.inputDataUsername
      let psw = this.inputDataPassword
      let token = localStorage.getItem('carrierToken')
      let chosenCompanyId = this.selectedCompany
      console.log(token, userName, chosenCompanyId, psw)
      this.reset()
    },
    closeModal () {
      this.centerDialogVisible = false
      this.reset()
    },
    reset () {
      this.inputDataUsername = ''
      this.inputDataPassword = ''
    },
  },
  created () {
    let data = {
      token: localStorage.carrierToken,
      companyId: this.companyId
    }
    this.loadUsers(data)
      .then(() => {
        this.isUsersDownloaded = true
      })
      .catch(e => {
        this.isUsersDownloaded = false
        this.$message({
          type: 'error',
          message: '' + e,
        })
      })
  },
  data () {
    let companyId = this.$route.params.companyId
    let users = [
      {
        username: 'x@x.com',
        user_id: '0123',
        company: 'Company Name',
        last_login: {
          date: '2018-08-10',
          time: '15:57:50'
        },
      },
      {
        username: 'y@y.com',
        user_id: '0124',
        company: 'Company Name',
        last_login: {
          date: '2018-08-10',
          time: '15:57:50'
        },
      },
      {
        username: 'v@v.com',
        user_id: '0124',
        company: 'Company Name',
        last_login: {
          date: '2018-08-10',
          time: '15:57:50'
        },
      }
    ]
    return {
      users,
      companyId,
      centerDialogVisible: false,
      inputDataUsername: '',
      inputDataPassword: '',
      selectedCompany: '',
      isUsersDownloaded: false
    }
  },
}
</script>

<style lang="scss">
    @import '../../styles/variables';

    .el-input, .el-select {
        margin-right: 10px;
    }
    .text-details {
        color: $gray--080;
        font-size: .9em;
    }

    .users-table > .el-table__header-wrapper > .el-table__header > thead > tr > th > .cell {
        text-align: center;
    }

    // Modal window
    .user-input {
        display: flex;
    }

</style>