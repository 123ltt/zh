<template>
  <el-row style="width:90%;margin:0 auto">
    <el-col :span="24">
      <span v-for="(item,index) in header" :key="index" class="el-form-item__label">{{ item }}</span>
    </el-col>
    <el-col v-for="(item,index) in tableList" :key="index" :span="24">
      <div v-if="isType" class="el-form-item">
        <span class="el-form-item__label">{{ item.sku }}</span>
        <span class="el-form-item__label">{{ item.fbWords.join(',') }}</span>
      </div>
      <!-- upc上传 -->
      <div v-else class="el-form-item">
        <span class="el-form-item__label">{{ item.codeType }}</span>
        <span class="el-form-item__label">{{ item.code }}</span>
        <div class="el-form-item__content">{{ item.errorMsg }}</div>
      </div>
    </el-col>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button v-if="isType" type="primary" size="medium" @click="handleSave">继续提交</el-button>
      <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>

    </div>
  </el-row>
</template>

<script>
import { amazonlistingAudit, updateAmazonListing } from '@/api/amazon/amazon'
export default {
  name: 'ImproveBatch',
  props: {
    tableList: { // 错误信息
      type: Array
      // default: () => { return [] }
    },
    params: { // 提交后端的参数
      type: Object,
      default: () => { return {} }
    },
    header: { // 头部文案信息
      type: Array,
      default: () => []
    },
    isType: { // 是上传还是审核
      type: String,
      default: ''
    }
  },
  methods: {
    handleSave() {
      if (this.isType === 'audit') {
        const params = this.params
        params.isCheck = false
        amazonlistingAudit({ ...params }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          }
        })
      } else if (this.isType === 'update') {
        updateAmazonListing({ ...this.params }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          }
        })
      }
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
