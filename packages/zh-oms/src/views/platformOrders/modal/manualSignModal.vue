<template>
  <div v-loading="loading">
    <el-form ref="formName" :model="form" label-width="70px" :rules="rules" size="mini">
      <el-form-item label="物流名称" prop="channelCode">
        <g-select v-model="form.channelCode" class="w-100" placeholder="请选择物流名称" :items="channelList" key-field="channelCode" label-field="channelLabel" value-field="channelCode" />
      </el-form-item>

      <el-form-item v-if="hasItems" label="itemID" prop="platItemIds">
        <el-select v-model="form.platItemIds" multiple clearable class="w-100" placeholder="请选择itemID">
          <el-option v-for="(item,index) in itemIdList" :key="index" :label="`${item.name}+(${item.itemId})`" :value="item.itemId" />
        </el-select>
      </el-form-item>

      <el-form-item label="跟踪号" prop="trackCode">
        <el-input v-model="form.trackCode" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <span>备注：订单标记结果请到订单详情列表或者系统后台查询。</span>
    <el-row type="flex" class="row-bg" justify="end">
      <el-button size="mini" @click="close">取消</el-button>
      <el-button type="primary" size="mini" @click="submit">确定</el-button>
    </el-row>
  </div>
</template>

<script>
import { handler, getChannel } from '@/api/platformOrder'
import { getItems } from '@/api/common.js'
export default {
  props: {
    platformCode: {
      type: String,
      default: ''
    },
    platOrderId: {
      type: String,
      default: ''
    },
    trackCode: {
      type: String,
      default: ''
    },
    storeCode: String,
    hasItems: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        platformCode: this.platformCode,
        platOrderId: this.platOrderId,
        trackCode: this.trackCode,
        channelCode: '',
        platItemIds: []
      },
      channelList: [],
      itemIdList: [],
      loading: false,
      rules: {
        channelCode: [{ required: true, message: '请选择物流名称' }],
        trackCode: [{ required: true, message: '跟踪号不能为空' }]
      }
    }
  },
  mounted() {
    const { hasItems, platformCode, storeCode, platOrderId } = this
    getChannel({ platCode: platformCode }).then(res => {
      this.channelList = res.data.map(item => {
        item.channelLabel = item.shortName + '(' + item.channelName + ')'
        return item
      })
    })
    if (hasItems) {
      const params = this.platformCode === 'LZ' ? { ordersId: platOrderId, storeCode } : { data: platOrderId }
      getItems(this.platformCode, params).then(res => {
        this.itemIdList = res.data
      })
    }
  },
  methods: {
    submit() {
      if (this.loading) return
      this.$refs.formName.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = { ...this.form }
          if (!this.hasItems) delete params.platItemIds
          handler(params).then(res => {
            if (res.success) {
              this.$message.success('添加手工标记成功，稍后系统会自动进行标记')
              this.close(true)
            }
          }).finally(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    close(type = false) {
      this.$parent.$emit('close', type)
    }
  }
}
</script>
