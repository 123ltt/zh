<template>
  <el-row v-loading="loading" style="width:90%;margin:0 auto">
    <el-col :span="24">
      <div>
        <p v-for="(item,index) in header" :key="index" class="el-form">{{ item }}</p>
      </div>
    </el-col>
    <el-col v-for="(item,index) in tableList" :key="index" :span="24">
      <!-- 定时刊登 -->
      <div v-if="isType === 'audit' || 'update'" :class="item.onlyTips ? 'tip-warning' : ''" class="mt-2">
        {{ item.msg }}
      </div>
      <!-- 上传 -->
      <!-- <div v-if="isType === 'update'" class="el-form-item">
        <span class="conLeft">{{ item.sku }}</span>
        <span class="label">{{ (item.fbWords|| []).join() }}</span>
      </div> -->
      <!-- 批量更新价格 -->
      <div v-if="isType === 'updatePrice'" class="el-form-item">
        <span class="conLeft">{{ item.productSku }}</span>
        <span class="content">{{ item.sellerSku }}</span>
        <div class="content">{{ item.reason }}</div>
      </div>
    </el-col>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button v-if="onlyTipsIds.length" type="primary" size="medium" @click="handleSave">继续提交</el-button>
      <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
    </div>
  </el-row>
</template>

<script>
// import { wishAudit, wishUpload } from '@/api/wish/wish.js'
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
    isCheck: {
      type: Boolean,
      default: true
    },
    requestApi: Function,
    keyName: String,
    isType: { // 是上传还是审核
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    onlyTipsIds() {
      const ids = []
      const noScrsIds = this.params[this.keyName].map(id => id)
      this.tableList.forEach(item => {
        item.onlyTips && ids.push(item.listingId)
        var i = noScrsIds.findIndex(id => id === item.listingId)
        i > -1 && noScrsIds.splice(i, 1)
      })
      return [...ids, ...noScrsIds]
    }
  },
  methods: {
    handleSave() {
      const params = this.params
      this.loading = true
      this.requestApi({ ...params, [this.keyName]: this.onlyTipsIds }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.$parent.$emit('close', true)
        } else {
          this.$message.error(res.msg || '未知错误')
        }
      }).finally(() => {
        this.loading = false
      }).catch(() => {
        this.$message.error('未知错误')
      })
    }
  }
}
</script>

<style scoped>
.el-form{
  display: inline-block;
 margin:0 8em 10px 0;
}
.el-form-item{
  display: flex;
  justify-content:space-around;
  margin-bottom: 0;
}
.label{
  font-size: 12px;
  flex: 1;
  vertical-align: middle;
  /* line-height: 30px; */
  /* text-align: left; */
}
.conLeft{
  min-width: 10em;
  max-width: 15em;
}
.content{
  /* line-height: 30px; */
  flex:1;
  vertical-align: middle;
  font-size: 12px;
}
.tip-warning{
  color: #E6A23C;
}
</style>
