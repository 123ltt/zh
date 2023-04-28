<template>
  <el-button
    :disabled="!checkIds.length"
    :loading="loading"
    size="mini"
    type="primary"
    @click="syncFromPlatform"
  >{{ text }}</el-button>
</template>

<script>

/**
 * @description 从后台同步
 * **/

import { syncFromPlatform } from '@/api/lmsCommon.js'
export default {
  name: 'SyncFromPlatformBtn',
  props: {
    text: {
      type: String,
      default: '从后台同步'
    },
    isBatch: Boolean,
    checkIds: Array,
    checkItemIds: Array,
    source: String,
    cancelPrice: String
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    // 同步返回信息显示
    showMessage(data) {
      const newDatas = []
      const h = this.$createElement
      data.forEach((item, i) => {
        newDatas.push(h('p', {
          class: item.code === 200 ? '' : 'color-danger'
        }, this.cancelPrice ? `itemId: ${this.checkItemIds[i]} ${item.code === 200 ? '批量取消活动价成功' : '批量取消活动价失败'} ` : `itemId: ${this.checkItemIds[i]} ${item.code === 200 ? '同步成功' : '同步失败'} `))
      })
      this.$msgbox({
        title: '消息',
        message: h('div', null, newDatas),
        showCancelButton: false,
        confirmButtonText: '确定'
      })
    },
    // 同步事件
    syncFromPlatform() {
      this.$confirm(this.cancelPrice ? '请确认是否取消选中listing活动价？' : '请确认是否同步？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        // ebay接口显神通啦
        if (this.isBatch) {
          const formData = new FormData()
          formData.append('listingIds', this.checkIds.join(','))
          syncFromPlatform(this.source, formData, this.cancelPrice, 'formData').then(res => {
            if (res.data) {
              this.showMessage(res.data)
              res.data.find(item => {
                if (item.code === 200) {
                  this.$emit('refreshList')
                }
              })
            } else this.$message.error(res.msg || '未知错误')
          }).catch(er => {
            this.$message.error('未知错误')
          }).finally(() => {
            this.loading = false
          })
        } else {
          const batchRequest = []
          this.checkIds.forEach(id => batchRequest.push(syncFromPlatform(this.source, { id }, this.cancelPrice)))
          Promise.all(batchRequest).then(res => {
            this.showMessage(res)
            this.$emit('refreshList')
          }).catch(() => {
            this.$message.error('未知错误')
          }).finally(() => {
            this.loading = false
          })
        }
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.color-danger{
  color: $--color-danger
}
</style>
