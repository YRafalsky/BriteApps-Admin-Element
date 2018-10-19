<template>
    <div class="users">
        <ba-header activeModule="Users"></ba-header>
        <div class="u-p4 main-content" v-loading="loading">
            <h2 class="c-heading__page u-mt4 u-pt2 u-pb3">Users List</h2>
            <!--Table list of available super users-->
            <el-table
                    class="users-table"
                    :data="superUsers"
                    >
                <el-table-column
                        prop="username"
                        label="Username"
                        >
                </el-table-column>
                <el-table-column
                        prop="company_name"
                        label="Company"
                        >
                </el-table-column>
                <el-table-column
                        prop="date_joined"
                        label="Date Joined"
                        >
                    <template slot-scope="scope">
                        <div :title="'Time is local. \n UTC:' + scope.row.date_joined">
                            {{scope.row.date_joined | moment('YYYY-MM-DD HH:mm')}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="Modify">
                    <template slot-scope="scope">
                        <el-button @click="saveNewPassword(scope.row)"
                                   @keyup.enter.native="saveNewPassword(scope.row)">Reset Password
                        </el-button>
                        <el-button  :disabled="user.username === scope.row.username"
                                    @click="removeUser(scope.row)"
                                    @keyup.enter.native="removeUser(scope.row)">Remove
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="u-p4">
            <el-button @click="showModalWindow" v-if="user.is_superuser">Add Superuser</el-button>
        </div>
        <!--Dialog Window for Adding new user-->
        <el-dialog
                title="Add Super User"
                :visible.sync="centerDialogVisible"
                width="80%"
                center>
            <div class="user-input">
                <!--List of available Companies-->
                <div class="user-info">
                    <div>Company Name</div>
                    <el-select v-model="selectedCompany" placeholder="Select" required>
                        <el-option disabled value="">Select</el-option>
                        <el-option
                                v-for="company in getAllCompanies"
                                :key="company.id"
                                :label="company.name"
                                :value="company.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="user-info">
                    <span>Email</span>
                    <el-input @keyup.native.enter="saveNewSuperUser"
                              placeholder="New Username" type="email" v-model="inputDataUsername" required></el-input>
                </div>
                <div class="user-info">
                    <span>Password</span>
                    <el-input @keyup.native.enter="saveNewSuperUser"
                              placeholder="New Password" type="password" v-model="inputDataPassword" required></el-input>
                </div>
                <el-button class="reset-btn" @click="reset">Clear All</el-button>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="closeModal">Cancel</el-button>
            <el-button type="primary" @click="saveNewSuperUser">Save
            </el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import {mapGetters, mapActions, mapState} from 'vuex'

let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line

export default {
  name: 'users-list',
  computed: {
    ...mapGetters('shared', ['availableCompanies']),
    ...mapState('users', ['superUsers']),
    ...mapState('shared', ['user']),
    getAllCompanies () {
      let chooseAllCompanies = [{
        id: null,
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
    ...mapActions('users', ['loadSuperUsers', 'deleteSuperUser', 'addSuperUser', 'resetSuperUserPassword']),
    saveNewSuperUser () {
      if (this.companyValidation !== '') {
        return
      }
      if (this.emailValidation !== '' && this.passwordValidation !== '') {
        return
      }
      let payload = {
        username: this.inputDataUsername,
        password: this.inputDataPassword,
        company_id: this.selectedCompany,
        token: localStorage.carrierToken
      }
      this.centerDialogVisible = false
      let addUser = async () => {
        this.loading = true
        await this.addSuperUser(payload)
          .then(() => {
            this.updateUsers()
            this.loading = false
            this.$message({
              type: 'success',
              message: 'User Added Successfully!'
            })
          }, (e) => {
            this.loading = false
            console.log(e)
            this.$message({
              type: 'error',
              message: 'Oops user was not added...'
            })
          })
      }
      this.reset()
      return addUser()
    },
    removeUser (data) {
      // prohibit the removal of oneself
      if (this.user.username === data.username) return
      // restriction if it is not superuser
      if (!this.isUsersDownloaded || !this.user.is_superuser) return
      this.$confirm('This will remove user. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        let deleteUser = async () => {
          let userId = data.id
          let companyId = this.companyId
          let payload = {
            userId,
            companyId
          }
          this.loading = true
          await this.deleteSuperUser(payload)
            .then(() => {
              this.updateUsers()
              this.loading = false
              this.$message({
                type: 'success',
                message: 'User Removed Successfully!'
              })
            }, (e) => {
              this.loading = false
              console.log(e)
              this.$message({
                type: 'error',
                message: 'Oops user was not removed...'
              })
            })
        }
        return deleteUser()
      })
    },
    saveNewPassword (data) {
      this.$prompt('Please input your new password', 'Reset Password', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        customClass: 'el-input-reset-password'
      }).then(({ value }) => {
        let savePassword = async () => {
          let payload = {
            userId: data.id,
            token: localStorage.carrierToken,
            companyId: this.companyId,
            password: value
          }
          this.loading = true
          await this.resetSuperUserPassword(payload)
            .then(() => {
              this.loading = false
              this.$message({
                type: 'success',
                message: 'Password Updated Successfully!'
              })
            }, (e) => {
              this.loading = false
              console.log(e)
              this.$message({
                type: 'error',
                message: 'Oops something was wrong...'
              })
            })
        }
        return savePassword()
      })
    },
    updateUsers () {
      let data = {
        token: localStorage.carrierToken,
        companyId: this.companyId
      }
      this.loading = true
      this.loadSuperUsers(data)
        .then(() => {
          this.isUsersDownloaded = true
          this.loading = false
        })
        .catch(e => {
          this.isUsersDownloaded = false
          this.loading = false
          this.$message({
            type: 'error',
            message: '' + e,
          })
        })
    },
    showModalWindow () {
      this.centerDialogVisible = true
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
    this.loading = true
    this.updateUsers()
  },
  data () {
    let companyId = this.$route.params.companyId
    return {
      companyId,
      centerDialogVisible: false,
      resetPasswordVisible: false,
      inputDataUsername: '',
      inputDataPassword: '',
      inputResetPassword: '',
      selectedCompany: '',
      isUsersDownloaded: false,
      loading: false
    }
  },
}
</script>

<style lang="scss">
    @import '../../styles/variables';

    .user-info {
        margin-right: 10px;
    }
    .text-details {
        color: $gray--080;
        font-size: .9em;
    }


    // Modal window
    .user-input {
        display: flex;
    }
    .el-input-reset-password .el-input > .el-input__inner {
        -webkit-text-security: disc ;
    }
    .reset-btn {
        position: relative;
        height: 40px;
        bottom: -24px;
    }

</style>