<template>
    <div class="users">
        <ba-header activeModule="Emails"></ba-header>
        <div class="u-p4">
            <h2 class="c-heading__page u-mt4 u-pt2 u-pb3">Users List</h2>

            <el-table
                    :data="users"
                    style="width: 100%">
                <el-table-column
                        prop="username"
                        label="Username"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="company"
                        label="Company"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="last_login.date"
                        label="Last Login Date"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="last_login.time"
                        label="Last Login Time"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="[users]"
                        label="Modify">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="resetPassword(scope.row)">Reset Password</el-button>
                        <el-button @click.native.prevent="removeUser(scope.row)">Remove</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
        <div class="u-p4">
            <el-button @click="addSuperUser">Add Superuser</el-button>
        </div>
        <el-dialog
                title="Add Super User"
                :visible.sync="centerDialogVisible"
                width="50%"
                center>
            <div class="user-input">
                <el-select v-model="selectedCompany" placeholder="Select">
                    <el-option disabled value="">Select</el-option>
                    <el-option
                            v-for="company in availableCompanies"
                            :key="company.id"
                            :label="company.name"
                            :value="company.name">
                    </el-option>
                </el-select>
                <el-input placeholder="Please input new Username" type="email" v-model="inputData"></el-input>
                <el-button @click="reset">Clear</el-button>
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
import {mapGetters} from 'vuex'

let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line

export default {
  name: 'users-list',
  computed: {
    ...mapGetters('shared', ['availableCompanies']),
    inputValidation () {
      return this.inputData.trim() !== ''
    },
    emailValidationErrMessage () {
      let errMessage = ''
      if (this.inputData.length === 0 || !emailRegex.test(this.inputData)) {
        errMessage = 'Please Input Correct Data'
        this.$message(errMessage)
      }
      console.log('errMessage: ', errMessage)
      return errMessage
    }
  },
  methods: {
    removeUser (data) {
      let userId = data.user_id
      let token = localStorage.getItem('carrierToken')
      let chosenCompanyId = this.selectedCompany
      console.log(userId, token, chosenCompanyId)
      this.$confirm(`Are you sure you want to delete the ${data.username}?`, 'Warning', {
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
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    resetPassword (data) {
      let userId = data.user_id
      let token = localStorage.getItem('carrierToken')
      let chosenCompanyId = this.selectedCompany
      console.log(userId, token, chosenCompanyId)
      this.$confirm(`Are you sure you want to reset password of ${data.username}?`, 'Warning', {
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
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    addSuperUser (e) {
      this.centerDialogVisible = true
      console.log('addSuperUser: ', e)
    },
    saveNewSuperUser () {
      if (!this.inputValidation || this.emailValidationErrMessage !== '') {
        return
      }
      this.centerDialogVisible = false
      let userName = this.inputData
      let token = localStorage.getItem('carrierToken')
      let chosenCompanyId = this.selectedCompany
      console.log(token, userName, chosenCompanyId)
      this.reset()
    },
    closeModal () {
      this.centerDialogVisible = false
      this.inputData = ''
    },
    reset () {
      this.inputData = ''
    },
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
      inputData: '',
      selectedCompany: ''
    }
  },
}
</script>

<style scoped lang="scss">


    .text-details {
        color: #666666;
        font-size: .9em;
    }

    // Modal window
    .user-input {
        display: flex;
    }

</style>