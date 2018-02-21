<template>
    <div class="company-select__root">
        <ba-header :disableMenu="true"></ba-header>
        <div class="u-pt4"></div>
        <div class="u-pt4"></div>
        <div class="u-text--center u-mb4">Please choose your company</div>

        <router-link class="company-link" to="/company/f19e0b98-533c-4cb4-8000-fe3f55b3f3ab/">IWS</router-link>

    </div>
</template>

<script>
  export default {
    name: 'ba-company-select'
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