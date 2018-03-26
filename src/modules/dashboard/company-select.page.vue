<template>
    <div class="company-select__root">
        <ba-header :disableMenu="true"></ba-header>
        <div class="u-pt4"></div>
        <div class="u-pt4"></div>
        <div class="u-text--center u-mb4">Please choose your company</div>

        <router-link v-for="company in availableCompanies" :key="company.id" class="company-link" :to="'/company/'+ company.id +'/'">{{company.name}}</router-link>

    </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'ba-company-select',
    computed: {
      ...mapGetters('shared', ['availableCompanies'])
    },
    methods: {
      ...mapActions('login', ['init'])
    },
    created () {
      this.init()
    },
  }
</script>

<style scoped>
    .company-select__root {
    }

    .company-link {
        text-align: center;

        display: block;
    }

</style>