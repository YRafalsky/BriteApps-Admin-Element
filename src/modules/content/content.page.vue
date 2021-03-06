<template>
  <div>
    <ba-header activeModule="Content"></ba-header>

    <ba-page-with-sidebar :title="'Content'">
      <div slot="sidebar">
        <div class="c-nav__list">
          <div v-for="section in filteredSections" v-if="section.contents.length > 0">
            <a class="c-nav__link" :class="{'c-nav__link--active' : sectionInViewport === section.name }" :href="'#'+ section.name">{{section.name}}</a>
          </div>
        </div>
      </div>
      <div slot="main" :class="{'has-fixed-search': showFixedSearch}" v-loading="loading">

        <h3 class="u-pt5 c-heading__page u-pb3">Content Customization</h3>

        <div class="search-container-shell">
          <div class="fixed-search" :class="{'fixed-search--visible': showFixedSearch}">
            <div class="fixed-search__content">
                <el-form label-position="left">
              <el-row :gutter="50">
                <el-col :xs="24" :sm="16">
                  <el-form-item label="Search">
                    <el-input v-model="searchFilter">
                      <i slot="prefix" class="el-input__icon el-icon-search"></i>
                      <i slot="suffix" class="el-input__icon el-icon-close u-link" @click="searchFilter = ''"></i>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="8">
                  <el-form-item label="Language">
                    <el-select v-model="selectedLanguage">
                      <el-option
                              v-for="language in languages"
                              :value="language"
                              :key="language">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="50">

                <el-col  :xs="24" :sm="9">
                    <el-checkbox v-model="showOnlyOverridden">
                      Show only customized content
                    </el-checkbox>
                </el-col>
              </el-row>
            </el-form>
            </div>
          </div>
        </div>
        <ba-content-section v-for="section in filteredSections"
                            :section="section"
                            v-if="section.contents.length > 0"
                            :key="section.name"
                            :ref="'section__' + section.name"
        >
        </ba-content-section>


      </div> <!-- Content module end -->
    </ba-page-with-sidebar>

  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import BaPageWithSidebar from '@/components/page-with-sidebar.component'
import BaContentSection from '@/modules/content/content-section.component'

export default {
  components: {
    BaContentSection,
    BaPageWithSidebar,
  },
  data () {
    let companyId = this.$route.params.companyId
    this.load({companyId})
    return {
      searchFilter: '',
      selectedLanguage: null,
      showOnlyOverridden: false,
      sectionInViewport: null,
      isScrolled: false
    }
  },
  methods: {
    ...mapActions('content', ['load']),
    passSearchFilter (content) {
      let searchFilterPass = false
      let overriddenFilterPass = false
      let fullSlug = content.section.slug + '.' + content.slug
      if (fullSlug.indexOf(this.searchFilter) >= 0) {
        searchFilterPass = true
      }

      if (!searchFilterPass && content.default.toLowerCase().indexOf(this.searchFilter.toLowerCase()) >= 0) {
        searchFilterPass = true
      }
      if (!searchFilterPass && content.overridden &&
           content.overridden.value.toLowerCase().indexOf(this.searchFilter.toLowerCase()) >= 0) {
        searchFilterPass = true
      }

      if (!this.showOnlyOverridden) {
        overriddenFilterPass = true
      } else {
        if (content.overridden && content.overridden.value !== content.default) {
          overriddenFilterPass = true
        }
      }

      return searchFilterPass && overriddenFilterPass
    },
    handleScroll (e) {
      this.isScrolled = window.scrollY > 150

      let section = this.nearestSectionPositionToScroll(window.scrollY)
      this.sectionInViewport = section
    },
    nearestSectionPositionToScroll (scrollY) {
      let nearestSection = null
      for (let i in this.filteredSections) {
        let currentName = this.filteredSections[i].name
        let refKey = 'section__' + currentName
        let ref = this.$refs[refKey]
        if (!ref) {
          continue
        }
        if (ref.length <= 0) {
          continue
        }
        let first = ref[0]
        let fixedHeaderAdjust = 100
        let floatingSearchAdjust = this.showFixedSearch ? 110 : 0

        let currentOffset = first.$el.offsetTop - (fixedHeaderAdjust + floatingSearchAdjust)
        if (nearestSection === null) {
          nearestSection = currentName
        }
        if (currentOffset < scrollY) {
          nearestSection = currentName
        }
        if (currentOffset > scrollY) {
          break
        }
      }
      return nearestSection
    },
  },
  computed: {
    ...mapState('content', ['all']),

    loading () {
      return this.all === undefined || this.all === null
    },
    showFixedSearch () {
      return this.isScrolled
    },
    sections () {
      let arr = []
      if (this.all === null) {
        return arr
      }

      let sections = this.all[this.selectedLanguage]
      for (let section in sections) {
        arr.push(
          {
            name: section,
            contents: sections[section],
          })
      }

      return arr
    },

    filteredSections () {
      let all = this.sections
      let map = new Map()
      for (let sectionName in all) {
        let currentSection = all[sectionName]
        let filteredContentForSection = []
        for (let contentIndex in currentSection.contents) {
          let content = currentSection.contents[contentIndex]
          if (this.passSearchFilter(content)) {
            filteredContentForSection.push(content)
          }
        }
        map.set(currentSection.name, filteredContentForSection)
      }
      let keys = Array.from(map.keys())
      let result = []
      keys.sort()
      keys.forEach((key) => {
        if (this.sectionInViewport === null) {
          this.sectionInViewport = key
        }
        result.push({
          name: key,
          contents: map.get(key),
        })
      })
      return result
    },
    languages () {
      let arr = []
      for (let key in this.all) {
        arr.push(key)
      }
      arr.sort()
      if (this.selectedLanguage === null && arr.length > 0) {
        this.selectedLanguage = arr[0]
      }
      return arr
    },
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
}
</script>
<style lang="scss">
  .search-container-shell {
    height: 110px;
  }

  @media (max-width: 768px) {
    .search-container-shell {
      height: 220px;
    }
  }
  .fixed-search {
    width: 100%;
    z-index: 99;
    &--visible {
      position: fixed;
      top: 3em;
      left: 0;
    }
  }

  .fixed-search--visible .fixed-search__content {
    background-color: #eeeeee;
    padding: 1em;
    padding-bottom: 0.5em;
    margin-left: 0;
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.18);
  }

  @media (min-width: 1000px) {
    .fixed-search--visible .fixed-search__content {
        margin-left: 220px;
      }
    }

</style>
