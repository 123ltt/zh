<template>
  <div>
    <el-table :ref="reocrds" row-key="id" :data="reocrds" class="g-table">
      <el-table-column label="店铺" prop="storeName" />
      <el-table-column label="提示信息" prop="description" />
    </el-table>
    <div style="padding: 20px 0 10px;text-align: right">
      <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImproveBatch',
  props: {
    reocrds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      headers: [{
        label: '店铺',
        prop: 'storeName'
      }, {
        label: '提示信息',
        prop: 'description'
      }]
    }
  }
}
</script>

<style scoped>
.el-form-item{
  display: flex;
  margin-bottom: 0;
}
.el-form-item__label{
  min-width: 10em;
  max-width: 15em;
  line-height: 30px;
  text-align: left;
}
.el-form-item__content{
  line-height: 30px;
}
</style>
