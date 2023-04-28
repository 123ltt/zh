<template>
  <!-- oms 详情 - 撤销/恢复包裹/订单 -->
  <div v-loading="loading" class="channel-wrap">
    <el-form ref="formRef" :model="form" size="mini" :rules="rules" label-width="90px">
      <el-form-item v-if="detailsType==='package'" label="包裹单号：" prop="packageCode">
        {{ form.packageCode[0] }} <CombineOrder v-if="form.packageCode.length>1" :orders="form.packageCode" />
      </el-form-item>
      <el-form-item label="平台单号：" prop="platOrderId">
        {{ form.platOrderId[0] }} <CombineOrder v-if="form.platOrderId.length>1" :orders="form.platOrderId" />
      </el-form-item>
      <el-form-item label="OMS单号：" prop="omOrderId">
        {{ form.omOrderId[0] }} <CombineOrder v-if="form.omOrderId.length>1" :orders="form.omOrderId" />
      </el-form-item>

      <el-form-item v-if="type.startsWith('cancel')" label="撤单类型：" prop="cancelType">
        <el-select v-model="form.cancelType" class="w-100" filterable placeholder="请选择撤单类型">
          <el-option
            v-for="item in cancelTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="`${type.startsWith('cancel')?'撤单':'恢复'}原因：`" prop="reason">
        <el-input v-model="form.reason" type="textarea" resize="none" :autosize="{ minRows: 3, maxRows: 5}" />
      </el-form-item>
    </el-form>
    <div class="text-end">
      <el-button size="mini" @click="close(false)">取消</el-button>
      <el-button type="primary" size="mini" @click="submit(type)">确认</el-button>
    </div>
  </div>
</template>
<script>
import { cancelPackage, recoveryPackage } from '@/api/packageDetails.js'
import { cancelOrder, recoveryOrder } from '@/api/orderManagement.js'
import { getDict } from '@/api/common/dict'
import CombineOrder from '../../combine-order/index.vue'

export default {
  name: 'CancelOrRecoveryPackage',
  components: { CombineOrder },
  props: {
    ids: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'cancelorder'
    },
    detailsType: String,
    isRPDetails: Boolean
  },
  data() {
    return {
      form: {
        packageCode: [],
        omOrderId: [],
        platOrderId: [],
        cancelType: '',
        reason: ''
      },
      rules: {
        cancelType: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]
      },
      cancelTypeList: [],
      loading: false
    }
  },
  created() {
    this.formatter()
    if (this.type.startsWith('cancel')) {
      getDict('cancel_type', 'oms').then(res => {
        this.cancelTypeList = res
      })
    }
  },
  methods: {
    formatter() {
      this.ids.forEach(obj => {
        this.form.platOrderId.push(...obj.platOrderId)
        this.form.omOrderId.push(obj.omOrderId)
        this.form.packageCode.push(obj.packageCode)
      })
    },
    submit(type) {
      if (this.loading) return
      this.$refs.formRef.validate((bool) => {
        if (!bool) return
        this.loading = true
        const api = {
          cancelorder: cancelOrder,
          recoveryorder: recoveryOrder,
          cancelpackage: cancelPackage,
          recoverypackage: recoveryPackage
        }[type]

        const { cancelType, reason } = this.form
        const data = this.ids.map(item => {
          item.reason = reason
          delete item.platOrderId
          delete item[this.detailsType === 'package' ? 'omOrderId' : 'packageCode']
          if (type.startsWith('cancel')) item.cancelType = cancelType
          return item
        })
        if (this.isRPDetails) return this.close(true, data) // 包裹详情的恢复包裹不直接调审核接口

        api(data).then(res => {
          this.close(true)
          this.$message.success(res.msg)
        }).finally(() => {
          this.loading = false
        })
      })
    },
    close(bool, data) {
      this.$parent.$emit('close', bool, data)
    }
  }
}
</script>

<style scoped lang="scss">
.channel-wrap ::v-deep {
  .el-form-item__content>.el-input--mini .el-input__inner[readonly]{
    border:none;
    padding-left: 0;
  }
}
</style>
