<template>
    <div class="company-select__root">
        <ba-header :disableMenu="true"></ba-header>
        <div class="u-pt4"></div>
        <div class="u-pt4"></div>
        <div class="u-text--center u-mb4">Please choose your company</div>
        <el-input type="text" class="search__input u-p4" placeholder="Search..." v-model="searchText"></el-input>
        <div class="company-select u-p4">
            <div class="my-grid" :class="{'my-grid--no-results' : noResults}">
                <div class="company-select__no-results" v-if="noResults">
                    <div class="no-results__text u-mb4">No results</div>
                    <el-button @click="clearSearch()">Clear</el-button>
                </div>
                <router-link class="my-grid__element company-link" v-for="company in availableCompanies" v-if="company.name.toLowerCase().indexOf(searchText) >= 0" :key="company.id" :to="'/company/'+ company.id +'/'">
                        <el-button class="company-select__button">
                            <div class="company-select__name">
                                {{company.name}}
                            </div>
                            <div>
                                <img  class="company-select__button_pict" :src="apiRoot + '/get_image/logo/'+ company.id" />
                            </div>

                        </el-button>
                    </router-link>
                </div>
        </div>

    </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import config from '@/config'

  export default {
    name: 'ba-company-select',
    computed: {
      ...mapGetters('shared', ['availableCompanies']),
      apiRoot () {
        return config.url
      },
      noResults () {
        return this.availableCompanies.filter(_ => _.name.toLowerCase().indexOf(this.searchText) >= 0).length === 0
      }
    },
    methods: {
      ...mapActions('login', ['init']),
      ...mapActions('shared', ['loadHealthcheck']),
      clearSearch () {
        console.log('aa', this.searchText)
        this.searchText = ''
      }
    },
    data () {
      return {
        searchText: ''
      }
    },
    created () {
      this.init()
      this.loadHealthcheck()
    },
  }
</script>

<style lang="scss">
    .my-grid {
        display: grid;
        grid-gap: 2em;

        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;

        @media only screen and (max-width: 768px) {
            grid-template-columns: 1fr;
        }

    }
    .my-grid--no-results {
        display: block;

    }
    .company-select {
        /*display: flex !important;*/
        /*flex-direction: column !important;*/
        /*width: 25em;*/
        overflow: hidden;

    }

    .company-select__root {
    }

    .company-select__button {
        display: block;
        width: 100%;
        &_pict {
            height: 3em;
        }

    }
    .company-select__name {
        border-bottom: solid 1px rgba(0, 0, 0, 0.19);
        margin-bottom: 1em;
        font-size: 1.2em;
        padding-bottom: 1em;
        font-weight: 600;
    }
    .company-link {
        /*text-align: center;*/

        /*display: block;*/
        @media only screen and (max-width: 768px) {
            display: block;
            width: 100%;
        }

    }
    .company-select__no-results {
        visibility: hidden;

        font-size: 2em;
        text-align: center;
        color: #888888;

    }
    .no-results__text {

    }
    .company-select__no-results:only-child{
        visibility: visible;
    }

</style>