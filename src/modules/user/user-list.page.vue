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
                width="50%"
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
                <el-input placeholder="Please input new Username" type="email" v-model="inputData" required></el-input>
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
    getAllCompanies () {
      let chooseAllCompanies = [{
        id: '0',
        name: '*'
      }]
      return chooseAllCompanies.concat(this.availableCompanies)
    },
    inputValidation () {
      return this.inputData.trim() !== ''
    },
    emailValidationErrMessage () {
      let errMessage = ''
      let inputData = this.inputData.trim()
      if (inputData.length === 0 || !emailRegex.test(inputData)) {
        errMessage = 'Please Input Correct Data'
        this.$message(errMessage)
      }
      return errMessage
    }
  },
  methods: {
    removeUser (data) {
      let userId = data.user_id
      let token = localStorage.getItem('carrierToken')
      let chosenCompanyId = this.selectedCompany
      console.log(userId, token, chosenCompanyId)
      this.$confirm(`Are you sure you want to delete the user ${data.username}?`, 'Warning', {
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
      this.reset()
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

<style lang="scss">
    @import '../../styles/variables';

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