<template>
  <div class="nav-wrapper nav nav--fixed":class="isMenuCollapsed ? 'nav--collapsed' : 'nav--expanded'">
    <div class="nav__menu-toggle">
      <el-button class="toggle-button" @click="collapseMenu">
        <icon name="bars"></icon>
      </el-button>
    </div>

    <router-link v-if="!isMenuCollapsed" @click="collapseMenu" to="/company-select">
      <img class="nav__logo nav__logo--img u-img-responsive" alt="BriteApps" src="../assets/briteappslogonotagline.png">
    </router-link>
    <router-link @click="collapseMenu" :disabled="isMenuCollapsed" to="./"
                 :class="{ 'nav__link--active' : activeModule === 'dashboard', 'u-mb4' :  !isMenuCollapsed, 'hidden-company': disableMenu}"
                 class="nav__link nav__link--last nav__link--company">
      {{companyNameById(companyId)}}
    </router-link>

    <div v-if="!isMenuCollapsed" @click="collapseMenu" class="outer" v-for="module in modules" :key="module.name">
      <router-link v-if="!disableMenu"  :to="module.link"  class="nav__link" :class="{ 'nav__link--active' : activeModule === module.name }">
        <icon class="u-mr1" scale="0.75" :name="module.icon"></icon>
        {{ module.name }}
      </router-link>
      <div v-if="activeModule === module.name"><slot name="sidebar"></slot></div>
    </div>
    <a @click="logout(); $event.preventDefault(); collapseMenu()" class="nav__link nav__link--sign-out u-mr4">
      <icon :scale="1" name="sign-out"></icon>
      <span v-if="!isMenuCollapsed" class="nav__link_info">Logout</span>
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
        link: './',
        name: 'Enrolled users',
        icon: 'user',
      },
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
        link: 'administrators',
        name: 'Administrators',
        icon: 'users',
      },
    ]
    return {
      modules,
      companyId,
      isMenuCollapsed: false
    }
  },
  computed: {
    ...mapState('shared', ['user']),
    ...mapGetters('shared', ['companyNameById']),

  },
  methods: {
    ...mapActions('login', ['logout']),
    collapseMenu () {
      if (window.innerWidth > 767) {
        this.isMenuCollapsed = false
      } else {
        this.isMenuCollapsed ? this.isMenuCollapsed = false : this.isMenuCollapsed = true
      }
    },
    handleScroll () {
      window.innerWidth > 767 ? this.isMenuCollapsed = false : this.isMenuCollapsed = true
    }
  },
  created () {
    window.addEventListener('resize', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('resize', this.handleScroll)
  }

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

  .hidden-company {
    display: none !important;
  }

  .nav--fixed {
    position: fixed;
    height: 100%;
    z-index: 999;
    top: 0;
    left: 0;
    max-width: 240px;
    overflow-y: scroll;
    padding: 50px 15px 0;
    @media (max-width: 767px) {
      position: fixed;
      height: 100%;
      max-width: none;
      padding: 0 15px;
    }
  }

  .nav--collapsed {
    width: 4em;
    overflow: hidden;

    @media (max-width: 767px) {
      width: 100vw;
      height: 5em;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
    }
  }

  .nav--expanded {
    padding-top: 15px;
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

  // Button
  .toggle-button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    z-index: 10;
  }

  .nav__menu-toggle {
    display: none;
  }
  @media (max-width: 767px) {

    .nav__link {
      display: block;
    }

    .nav__menu-toggle {
      display: inline-block;
      top: 2px;
      left: 3px;
      & > .toggle-button > span > svg[class="fa-icon"] {
        position: relative;
        top: 1px;
        right: 3px;
      }
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
