<template>
  <div class="edelivery">
    <ba-header activeModule="E-Delivery"></ba-header>
    <div class="edelivery__content">
      <h2 class="c-heading__page">E-Delivery dashboard</h2>
      <div class="edelivery__table">
        <el-button-group>
          <el-button>Check all</el-button>
          <el-button>Check none</el-button>
        </el-button-group>
        <el-button>SEND</el-button>
        <el-button>Mark as sent</el-button>
          <el-table class="u-mt3" :data="items" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="policy_number" label="Policy Number" width="180"></el-table-column>
            <el-table-column prop="date1" label="Name" width="180"></el-table-column>
            <el-table-column prop="type" label="Invoice Type"></el-table-column>
            <el-table-column prop="date2" label="Address"></el-table-column>
          </el-table>
        <el-pagination class="u-mt4" layout="prev, pager, next" :total="50">
        </el-pagination>
      </div>
      <div class="edelivery__paginator">
      </div>
    </div>
  </div>

</template>

<script>
import BaCompanyImage from '@/modules/appearance/company-image.component'
import ElButton from 'element-ui/packages/button/src/button'
import axios from 'axios'
import config from '@/config'

export default {
  components: {
    ElButton,
    BaCompanyImage,
  },
  name: 'ba-edelivery',
  data () {
    return {
      companyId: this.$route.params.companyId,
      items: [
        {
          'policy_number': '10-2016-659',
          'date1': '02/01/2018',
          'name': 'Juanita Linkous',
          'type': 'Installment Invoice',
          'yesno': 'N',
          'date2': '05/01/2018'
        },
        {
          'policy_number': '10-2017-4225',
          'date1': '08/01/2017',
          'name': 'Krystin Davis',
          'type': 'Installment Invoice',
          'yesno': 'N',
          'date2': '05/01/2018'
        },
        {
          'policy_number': '10-2017-4430',
          'date1': '08/01/2017',
          'name': 'William Whitley',
          'type': 'Installment Invoice',
          'yesno': 'Y',
          'date2': '05/01/2018'
        },
        {
          'policy_number': '10-2017-7165',
          'date1': '01/01/2018',
          'name': 'Terry Lynn Lilley',
          'type': 'Installment Invoice',
          'yesno': 'Y',
          'date2': '05/01/2018'
        },
        {
          'policy_number': '10-2018-2022',
          'date1': '05/01/2018',
          'name': 'Aaron Powell Sisk',
          'type': 'Initial Invoice',
          'yesno': 'N',
          'date2': '05/01/2018'
        },
        {
          'policy_number': '10-2018-70',
          'date1': '02/01/2018',
          'name': 'Joseph Barnes',
          'type': 'Installment Invoice',
          'yesno': 'Y',
          'date2': '05/01/2018'
        },
        {
          'policy_number': '2000262',
          'date1': '02/01/2018',
          'name': 'Francine Mallory',
          'type': 'Installment Invoice',
          'yesno': 'Y',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 2000923,
          'date1': '05/14/2018',
          'name': 'Sue W. Wilkerson',
          'type': 'Renewal Invoice',
          'yesno': 'N',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 4001900,
          'date1': '03/01/2018',
          'name': 'Donald K. Foutz, Jr.',
          'type': 'Installment Invoice',
          'yesno': 'Y',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 4002704,
          'date1': '04/01/2018',
          'name': 'Eric Johanan Silvers',
          'type': 'Installment Invoice',
          'yesno': 'Y',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 4003766,
          'date1': '05/14/2018',
          'name': 'Kimberly D. Stallings',
          'type': 'Renewal Invoice',
          'yesno': 'N',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 4003803,
          'date1': '05/14/2018',
          'name': 'George F Wiseman',
          'type': 'Renewal Invoice',
          'yesno': 'N',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 4003847,
          'date1': '05/14/2018',
          'name': 'Howard F Louisos',
          'type': 'Renewal Invoice',
          'yesno': 'N',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 4006812,
          'date1': '05/14/2018',
          'name': 'Jeffery N. Crouch',
          'type': 'Renewal Invoice',
          'yesno': 'N',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 4006868,
          'date1': '05/14/2018',
          'name': 'Stacey E. Billups',
          'type': 'Renewal Invoice',
          'yesno': 'N',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 4008632,
          'date1': '05/14/2018',
          'name': 'Eldridge J. Bennett',
          'type': 'Renewal Invoice',
          'yesno': 'N',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 4012703,
          'date1': '02/01/2018',
          'name': 'Minnie Clark',
          'type': 'Installment Invoice',
          'yesno': 'N',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 4018022,
          'date1': '02/01/2018',
          'name': 'Edith M Alexander',
          'type': 'Installment Invoice',
          'yesno': 'Y',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 4018730,
          'date1': '05/14/2018',
          'name': 'Johnna E. Bordwine And',
          'type': 'Renewal Invoice',
          'yesno': 'N',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 4021238,
          'date1': '11/01/2017',
          'name': 'Donald L. Chandler',
          'type': 'Installment Invoice',
          'yesno': 'Y',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 4023804,
          'date1': '05/14/2018',
          'name': 'Dion F. Bentley',
          'type': 'Renewal Invoice',
          'yesno': 'N',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 4025903,
          'date1': '02/01/2018',
          'name': 'Charles Johnson',
          'type': 'Installment Invoice',
          'yesno': 'N',
          'date2': '05/01/2018'
        },
        {
          'policy_number': 4026671,
          'date1': '05/14/2018',
          'name': 'Roy Burrell And',
          'type': 'Renewal Invoice',
          'yesno': 'N',
          'date2': '05/01/2018'
        }
      ]
    }
  },
  methods: {},
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