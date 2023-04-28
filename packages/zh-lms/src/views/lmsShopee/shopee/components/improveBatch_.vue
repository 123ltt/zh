<template>
  <el-row style="width:90%;margin:0 auto">
    <el-col :span="24">
      <div class="el-form-item">
        <span v-for="(item,index) in header" :key="index" class="label">{{ item }}</span>
      </div>
    </el-col>
    <el-col v-for="(item,index) in tableList" :key="index" :span="24">
      <!-- 定时刊登 -->
      <div v-if="isType === 'audit'" class="el-form-item">
        <span class="conLeft">{{ item.sku }}</span>
        <span class="label">{{ item.fbWords.join(',') }}</span>
      </div>
      <!-- upc上传 -->
      <div v-if="isType === 'update'" class="el-form-item">
        <span class="conLeft">{{ item.codeType }}</span>
        <span class="label">{{ item.code }}</span>
        <div class="content">{{ item.errorMsg }}</div>
      </div>
      <!-- 批量更新价格 -->
      <div v-if="isType === 'updatePrice'" class="el-form-item">
        <span class="conLeft">{{ item.productSku }}</span>
        <span class="content">{{ item.sellerSku }}</span>
        <div class="content">{{ item.reason }}</div>
      </div>
    </el-col>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button v-if="isType=== 'audit'" type="primary" size="medium" @click="handleSave">继续提交</el-button>
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
        params.isCheck = true
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
  justify-content:space-around;
  margin-bottom: 0;
}
.label{
  font-size: 12px;
  flex: 1;
  vertical-align: middle;
  line-height: 30px;
  /* text-align: left; */
}
.conLeft{
  min-width: 10em;
  max-width: 15em;
}
.content{
  line-height: 30px;
  flex:1;
  vertical-align: middle;
  font-size: 12px;
}
</style>
