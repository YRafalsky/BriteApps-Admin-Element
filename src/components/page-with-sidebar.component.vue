<template>
    <div class="off-canvas-wrapper">

        <main role="main" class="off-canvas-content main-content" data-off-canvas-content>
            <div id="js-content-container">
                <div id="js-content" class="l-page-content l-page-content--no-sidebar">
                    <div class="l-page__header">
                        <h1 class="c-heading__page"></h1>
                    </div>

                    <div class="l-page__main">
                        <!-- Main content will be transcluded here-->
                        <slot name="main"></slot>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
  export default {
    props: ['title'],
    name: 'ba-page-with-sidebar'
  }
</script>

<style scoped>

</style>
