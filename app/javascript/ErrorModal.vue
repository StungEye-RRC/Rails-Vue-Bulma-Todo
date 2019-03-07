<template>
  <bModal :active.sync="active">
    <bMessage
      title="Network Error"
      type="is-danger"
      :closable="false"
    >
      <p>{{ message }}</p>
      <br>
      <p class="has-text-grey-light">{{ debuggingDetails }}</p>
    </bMessage>
  </bModal>
</template>

<script>
export default {
  props: ['active', 'message', 'debuggingDetails']
}
</script>