<template>
  <b-modal :active.sync="errorDetails.active">
    <b-message title="Network Error" type="is-danger" :closable="false">
      <p>{{ errorDetails.message }}</p>
      <br>
      <p class="has-text-grey-light">{{ errorDetails.debugging }}</p>
    </b-message>
  </b-modal>
</template>

<script>
export default {
  props: ['errorDetails']
}
</script>

<style scoped>
</style>
