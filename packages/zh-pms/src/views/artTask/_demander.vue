<template>
  <!-- 创建美工 comp-type -->
  <designer :create-art-task-type="createDesigner" />
</template>

<script>
import designer from './_designer.vue'
export default {
  name: 'PmsArtTaskDemander',
  components: {
    designer
  },
  data() {
    return {
      createDesigner: 'createDesigner'
    }
  }

}
</script>
