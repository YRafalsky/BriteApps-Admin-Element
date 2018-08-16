<template>
  <div class="healthcheck">
    <!--:onclick="preventDefault($event)"-->
    <a :href="url" target="_blank"  :title="cssClass + ' - ' + url" class="status" :class="cssClass">
      <icon v-if="status === false" class="healthcheck__icon" name="warning" scale="0.7"></icon>
    </a>
  </div>
</template>

<script>
  export default {
    props: ['healthcheck'],
    name: 'ba-healthcheck-status',
    computed: {
      status () {
        if (!this.healthcheck) {
          return null
        }

        return this.healthcheck.britecore_status
      },

      url () {
        if (!this.healthcheck) {
          return null
        }

        return this.healthcheck.url
      },
      cssClass () {
        if (this.status === null) {
          return 'status--unknown'
        }

        return !this.status ? 'status--down' : 'status--up'
      }
    },
  }
</script>

<style scoped lang="scss">
.status {
  width: 1.5em;
  height: 1.5em;
  display: inline-block;
  border-radius: 50%;
  opacity: .9;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.24), inset 0px 1px 1px rgba(255, 255, 255, 0.1);
  line-height: 1.5em;
}

.status--unknown {
  background-color: #414247;
  &:after {
    content: '.';
    font-size: 20px;
    position: relative;
    right: 5px;
    bottom: 5px;
    color: white;
    animation: dots 1s steps(5, end) infinite;
  }

  @keyframes dots {
    0%, 20% {
      color: rgba(0,0,0,0);
      text-shadow:
              .25em 0 0 rgba(0,0,0,0),
              .5em 0 0 rgba(0,0,0,0);}
    40% {
      color: white;
      text-shadow:
              .25em 0 0 rgba(0,0,0,0),
              .5em 0 0 rgba(0,0,0,0);}
    60% {
      text-shadow:
              .25em 0 0 white,
              .5em 0 0 rgba(0,0,0,0);}
    80%, 100% {
      text-shadow:
              .25em 0 0 white,
              .5em 0 0 white;}}
}
.status--down {
  background-color: red;
}
.status--up {
  background-color: green;
}
.healthcheck__icon {
  color: white;
}
</style>