<template>
  <div>
    <json-viewer
      :value="jsonData"
      :expand-depth="5"
      copyable
      sort
    />
  </div>
</template>

<script>
import Vue from 'vue'
import JsonViewer from 'vue-json-viewer'
Vue.use(JsonViewer)
export default {
  name: 'ShowJsonData',
  components: {
    JsonViewer
  },
  props: {
    jsonData: Object
  }

}
</script>
