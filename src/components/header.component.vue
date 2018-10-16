<template>
  <div class="nav-wrapper nav nav--fixed":class="isMenuCollapsed ? 'nav--collapsed' : 'nav--expanded'">
    <el-button round class="nav__menu-toggle"  @click="isMenuCollapsed = !isMenuCollapsed">       <icon name="bars"></icon>
    </el-button>

    <router-link to="/company-select">
      <img class="nav__logo nav__logo--img u-img-responsive" alt="BriteApps" src="../assets/briteappslogonotagline.png">
    </router-link>
    <router-link :class="{ 'nav__link--active' : activeModule === 'dashboard' }" to="./"
                 class="nav__link nav__link--last nav__link--company u-mb4">
      {{companyNameById(companyId)}}
    </router-link>

    <div class="outer" v-for="module in modules" :key="module.name">
      <router-link v-if="!disableMenu"  :to="module.link"  class="nav__link" :class="{ 'nav__link--active' : activeModule === module.name }">
        <icon class="u-mr1" scale="0.75" :name="module.icon"></icon>
        {{ module.name }}
      </router-link>
      <div v-if="activeModule === module.name"><slot name="sidebar"></slot></div>
    </div>
    <a @click="logout(); $event.preventDefault()" class="nav__link nav__link--sign-out u-mr4">
      <icon :scale="1" name="sign-out"></icon>
      <span class="nav__link_info">Logout</span>
    </a>
  </div>
</template>

<script>

import {mapActions, mapState, mapGetters} from 'vuex'

export default {
  name: 'ba-header',
  props: ['activeModule', 'disableMenu'],
  data () {
    let companyId = this.$route.params.companyId
    let modules = [
      {
        link: {name: 'builds', query: { mode: 'mobile' }},
        name: 'Builds',
        icon: 'rocket',
      },
      {
        link: {name: 'builds', query: { mode: 'desktop' }},
        name: 'Desktop Builds',
        icon: 'desktop',
      },
      {
        link: 'settings',
        name: 'Settings',
        icon: 'cog',
      },
      {
        link: 'content',
        name: 'Content',
        icon: 'font',
      },
      {
        link: 'templates',
        name: 'Templates',
        icon: 'code',
      },

      {
        link: 'appearance',
        name: 'Appearance',
        icon: 'adjust',
      },
      {
        link: 'edelivery',
        name: 'E-Delivery',
        icon: 'envelope',
      },
      {
        link: 'emails',
        name: 'Emails',
        icon: 'envelope',
      },
      {
        link: 'users',
        name: 'Users',
        icon: 'users',
      },
    ]
    return {
      modules,
      companyId,
      isMenuCollapsed: true,
    }
  },
  computed: {
    ...mapState('shared', ['user']),
    ...mapGetters('shared', ['companyNameById']),

  },
  methods: {
    ...mapActions('login', ['logout']),
  },

}
</script>
<style scoped lang="scss">
  @import "../styles/variables";

  .nav-wrapper {
    display: flex;
    flex-direction: column;
  }
  .nav {
    transition: all 0.3s ease-in-out;
    vertical-align: center;
    background-image: -ms-linear-gradient(top left, #667EEA 0%, #764BA2 100%);
    background-image: -moz-linear-gradient(top left, #667EEA 0%, #764BA2 100%);
    background-image: -o-linear-gradient(top left, #667EEA 0%, #764BA2 100%);
    background-image: -webkit-gradient(linear, left top, right bottom, color-stop(0, #667EEA), color-stop(100, #764BA2));
    background-image: -webkit-linear-gradient(top left, #667EEA 0%, #764BA2 100%);
    background-image: linear-gradient(to bottom right, #667EEA 0%, #764BA2 100%);
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .nav--fixed {
    position: fixed;
    height: 100%;
    z-index: 999;
    top: 0;
    left: 0;
    max-width: 240px;
    overflow-y: scroll;
  }

  .nav__logo {
    max-width: 160px;
    display: inline-block;
    vertical-align: middle;
  }

  .nav__logo--img {
    filter: brightness(100);
  }

  .nav__link-container {
    display: inline;
  }

  .nav__link {
    color: $white;
    display: inline-block;
    text-decoration: none;
    vertical-align: center;
    margin: 0 1em 1em;
    padding: 0.5em;
    border-radius: 6px;
    background-color: transparent;
    will-change: background-color;
    transition: background-color 100ms;
  }

  .nav__link--last {
    margin: .5em 1em 1em;
  }

  .nav__link--sign-out {
    margin: 2em 1em 3em;
    cursor: pointer;
  }

  .nav__link_info {
    position: relative;
    bottom: 2px;
  }

  .nav__link--active {
    background-color: rgba(74, 76, 134, .9);
    color: $gray--005;
    width: 200px;
  }

  .nav__link:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: $white;
    width: 200px;
  }
  .nav__menu-toggle {
    display: none;
  }
  @media (max-width: 1524px) {
    .nav__menu-toggle {
      display: inline-block;
    }

    .nav--fixed {
      position: static;
      height: 31em;
      text-align: center;
    }

    .nav__link {
      margin: 0 0;
      padding: 0.8em 0;
      display: block;
    }

    .nav__menu-toggle {
      position: absolute;
      top: 2px;
      left: 3px;
    }

    .nav--collapsed {
      height: 3em;
      overflow: hidden;
    }
    .u-float-right {
      float:  none !important;
    }
    .nav__link--last {
      margin: 0;
    }
    .u-mr4 {
      margin: 0 !important;
    }
  }

</style>
