<template>
    <div class="users">
        <ba-header activeModule="Users"></ba-header>
        <div class="u-p4">
            <h2 class="c-heading__page u-mt4 u-pt2 u-pb3">Users List</h2>
            <!--Table list of available super users-->
            <el-table
                    class="users-table"
                    :data="superUsers"
                    >
                <el-table-column
                        prop="username"
                        label="Username"
                        width="100"
                        >
                </el-table-column>
                <el-table-column
                        class-name="u-text--center"
                        prop="company_name"
                        label="Company"
                        >
                </el-table-column>
                <el-table-column
                        prop="date_joined"
                        label="Date Joined"
                        width="120"
                        >
                </el-table-column>
                <el-table-column
                        label="Modify"
                        class-name="u-text--center">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="saveNewPassword(scope.row)">Reset Password</el-button>
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
                width="80%"
                center>
            <div class="user-input">
                <!--List of available Companies-->
                <el-select v-model="selectedCompany" placeholder="Select" required>
                    <el-option disabled value="">Select</el-option>
                    <el-option
                            v-for="company in getAllCompanies"
                            :key="company.id"
                            :label="company.name"
                            :value="company.id">
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

let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line

export default {
  name: 'users-list',
  computed: {
    ...mapGetters('shared', ['availableCompanies']),
    ...mapState('users', ['superUsers']),
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
        await this.addSuperUser(payload)
          .then(() => {
            this.updateUsers()
            this.$message({
              type: 'success',
              message: 'User Added Successfully!'
            })
          }, (e) => {
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
      if (!this.isUsersDownloaded) return
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
          await this.deleteSuperUser(payload)
            .then(() => {
              this.updateUsers()
              this.$message({
                type: 'success',
                message: 'User Removed Successfully!'
              })
            }, (e) => {
              console.log(e)
              this.$message({
                type: 'error',
                message: 'Oops user was not removed...'
              })
            })
        }
        return deleteUser()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Input canceled'
        })
      })
    },
    saveNewPassword (data) {
      this.$prompt('Please input your e-mail', 'Reset Password', {
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
          console.log(payload)
          await this.resetSuperUserPassword(payload)
            .then(() => {
              this.$message({
                type: 'success',
                message: 'Password Updated Successfully!'
              })
            }, (e) => {
              console.log(e)
              this.$message({
                type: 'error',
                message: 'Oops something was wrong...'
              })
            })
        }
        return savePassword()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Input canceled'
        })
      })
    },
    updateUsers () {
      let data = {
        token: localStorage.carrierToken,
        companyId: this.companyId
      }
      this.loadSuperUsers(data)
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
    .el-input-reset-password .el-input > .el-input__inner {
        -webkit-text-security: disc !important;
    }

</style>