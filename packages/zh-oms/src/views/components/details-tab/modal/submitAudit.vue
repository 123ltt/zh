<template>
  <!-- oms 详情 - 提交审核 -->
  <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" size="mini" label-width="70px" class="search-form">
    <el-row>
      <el-col :span="24" class="mb-0">
        <el-form-item label="审核结果" prop="ifPass">
          <el-radio-group v-model="form.ifPass" @change="ifPassChange">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="0">不通过（{{ detailsType==='order'?'撤单':'对包裹撤单' }}）</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-if="form.ifPass===0">
      <el-col :span="24" class="mb-0">
        <el-form-item label="撤单类型" prop="cancelType">
          <el-select v-model="form.cancelType" class="w-100" filterable placeholder="请选择撤单类型">
            <el-option
              v-for="item in cancelTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" class="mb-0">
        <el-form-item label="原因" prop="remarks">
          <el-input v-model="form.remarks"
                    type="textarea"
                    :autosize="{ minRows: 5, maxRows: 7}"
                    resize="none"
                    placeholder="不通过时请填写原因"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <div class="text-end">
      <el-button size="mini" @click="close(false)">取消</el-button>
      <el-button type="primary" size="mini" @click="submitAudit">确认</el-button>
    </div>
  </el-form>
</template>
<script>
import { exceptionAudit } from '@/api/orderManagement'
import { getDict } from '@/api/common/dict'

export default {
  name: 'SubmitAudit',
  props: {
    orderStatus: {
      type: Array,
      default() {
        return [{ omOrderId: '', packageCode: '', exceptionType: '1' }]
      }
    },
    detailsType: {
      type: String,
      default: 'order'
    },
    packageStatus: Number,
    packageCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      rules: {
        cancelType: [{ required: true, message: '请选择撤单类型', trigger: 'blur' }],
        remarks: [{ required: true, message: '请输入原因' }]
      },
      form: {
        ifPass: 1,
        remarks: '',
        cancelType: ''
      },
      loading: false,
      cancelTypeList: []
    }
  },
  created() {
    this.rules.remarks[0].required = this.ifPassifPass === 0
    getDict('cancel_type', 'oms').then(res => {
      this.cancelTypeList = res
    })
  },
  methods: {
    submitAudit() {
      this.$refs.formRef.validate(bool => {
        if (!bool || this.loading) return
        this.loading = true
        const params = this.orderStatus.map(item => {
          return Object.assign(item, this.form)
        })
        if (this.packageCode) {
          params[0].packageCode = this.packageCode
        }
        if (params[0].ifPass === 1) {
          delete params[0].cancelType
        }

        const type = {
          13: 'out', // 异常类型为出库拦截
          10: 'returnGoods' // 异常类型为退货待重发
        }[this.packageStatus]
        exceptionAudit(type || this.detailsType, params).then(res => {
          this.$message.success(res.msg)
          this.close(true)
        }).finally(() => {
          this.loading = false
        })
      })
    },
    ifPassChange(type) {
      try {
        this.rules.remarks[0].required = type === 0
        if (type === 1) {
          this.$refs.formRef.clearValidate()
        }
      } catch (e) {}
    },
    close(bool) {
      this.$parent.$emit('close', bool)
    }
  }
}
</script>
