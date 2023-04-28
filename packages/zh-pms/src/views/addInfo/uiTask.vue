// 美工任务
<template>
  <ArtDesignerList :product-id="productId" :tasktype="3">
    <div v-if="formData.ifCanCreateTask" slot="header" class="text-end pb-1">
      <el-button size="mini" type="primary" @click="add">创建新任务</el-button>
      <el-button size="mini" type="primary" @click="batch">批量创建</el-button>
    </div>
  </ArtDesignerList>
</template>

<script>
import ArtDesignerList from '../artTask/components/designerTable.vue'
import BatchCreateTask from '../artTask/components/batchCreateTask.vue'
import CreateTask from '../artTask/components/createTask.vue'

export default {
  components: { ArtDesignerList },
  props: {
    formData: Object,
    productId: [String, Number]
  },
  methods: {
    add() {
      this.$newTab({
        path: '/art-task/create',
        title: '创建任务',
        component: CreateTask,
        data: {
          taskStatus: '新增',
          productId: this.productId
        },
        clearCache: true
      })
    },
    batch() {
      this.$newTab({
        path: '/art-task/batch-create',
        title: '批量创建任务',
        component: BatchCreateTask,
        data: {
          productId: this.productId
        },
        clearCache: true
      })
    }
  }
}
</script>
