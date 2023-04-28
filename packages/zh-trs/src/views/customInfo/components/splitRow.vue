<template>
  <el-form ref="diySplitRowRef" :model="splitRowFormObj" label-width="119px" size="mini">
    <el-row>
      <el-col :span="24">
        <el-form-item label="第一行拆分数量：" class="ms-4">
          <el-input v-model="form.firstRowQuantity" type="text" style="width:150px;" @blur="getSecondRowNumber" @change="getSecondRowNumber" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="第二行拆分数量：" class="ms-4">
          <el-input v-model="form.secondRowQuantity" type="text" style="width:150px;" readonly />
        </el-form-item>
      </el-col>
    </el-row>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button size="small" @click="$parent.$emit('close')">取 消</el-button>
      <el-button type="primary" size="small" @click.stop="saveSplitRow">确认</el-button>
    </div>
  </el-form>

</template>

<script>
import { saveSplitRow } from '@/api/customDeclare'
export default {
  name: 'SplitRow',
  props: {
    currentCount: Number,
    checkedList: Object
  },
  data() {
    return {
      splitRowFormObj: {},
      file: null,
      form: {
        firstRowQuantity: null,
        secondRowQuantity: null
      }
    }
  },
  created() {
    console.log('666666666666666', this.checkedList)
  },
  methods: {
    saveSplitRow() {
      const params = {
        ...this.checkedList, ...this.form
      }
      saveSplitRow(params).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功')
          this.$parent.$emit('close', true)
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      })
    },
    getSecondRowNumber() {
      this.form.secondRowQuantity = this.form.firstRowQuantity ? Number(this.currentCount) - Number(this.form.firstRowQuantity) : ''
    }
  }
}
</script>

<style>

</style>
