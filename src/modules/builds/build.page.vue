<template>
  <div class="builds-module-root">
    <ba-header :activeModule="activeModule"></ba-header>

    <div class="builds-module__content main-content">

        <h2 class="u-pl4 u-mt2 c-heading__page">{{activeModule}}</h2>
        <router-link :to="{name: 'new-build', query: {mode: mode}}" @click="$event.preventDefault()">
          <el-button type="success" class="u-ml4" icon="el-icon-plus" >New build</el-button>
        </router-link>
        <ba-build-list :mode="mode"></ba-build-list>
    </div>
  </div>
</template>

<script>
import BaBuildList from '@/modules/builds/build-list.component.vue'

export default {
  components: {'ba-build-list': BaBuildList},
  data () {
    return {
    }
  },
  computed: {
    mode () {
      return this.$route.query.mode
    },
    activeModule () {
      let activeModule = 'Builds'
      if (this.mode === 'desktop') {
        activeModule = 'Desktop ' + activeModule
      }
      return activeModule
    }
  },
  methods: {

  },
}
</script>
<style scoped lang="scss">
  .builds-module__content {
    padding-top: 3rem;
  }
</style>