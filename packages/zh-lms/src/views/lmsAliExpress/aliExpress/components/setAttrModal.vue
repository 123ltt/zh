<template>
  <div>
    <el-checkbox-group v-model="item.value">
      <el-checkbox v-for="val in item.valueJson" :key="val.id" :label="val.id" class="el-item">{{ val.names.zh }}</el-checkbox>
    </el-checkbox-group>
    <div style="padding-top: 20px; text-align: right">
      <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
      <el-button size="medium" type="primary" @click="handlerOk">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/util/util'
export default {
  props: {
    data: Object
  },
  data() {
    return {
      item: {}
    }
  },
  created() {
    this.item = deepClone(this.data)
  },
  methods: {
    handlerOk() {
      this.$parent.$emit('close', this.item.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-item{
  margin-right: 0;
  width: 25%;
  margin-bottom: 5px;
}
</style>
