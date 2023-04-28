<!-- 新增仓库分区 -->
<template>
  <basic-container v-loading="loading" class="warehouseAddEdit">

    <el-form ref="rulesForm" :rules="rules" size="mini" :model="formData" label-width="120px">
      <el-row :gutter="10">
        <el-form-item prop="channelCode" label="渠道名称：">
          <g-select v-model.trim="formData.channelCode"
                    :items="channelList"
                    key-field="channelCode"
                    :item-title="true"
                    :label-field="getLabel"
                    value-field="channelCode"
                    placeholder="请选择"
                    class="w-95"
          />
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item prop="ruleName" label="规则名称：">
          <el-input v-model="formData.ruleName" class="w-95" type="text" maxlength="50" />
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item prop="trackingNumberCode" label="匹配跟踪号：">
          <el-input v-model="formData.trackingNumberCode" class="w-95" type="text" maxlength="100" />
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item prop="remark" label="备注：">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="2"
            class="w-95"
            maxlength="200"
            @input="remarkBlur"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <div class="float-end me-1">
          <el-button size="mini" type="primary" @click="close()">取消</el-button>
          <el-button size="mini" type="primary" @click="define()">确认</el-button>
        </div>

      </el-row>
    </el-form>

  </basic-container>
</template>
<script>
import { addWarehouse, updateWarehouse } from '@/api/warehouse'
export default {
  name: 'WarehouseAddEdit',
  props: {
    channelList: Array,
    isAdd: Boolean,
    detailInfo: Array
    // channelObj: Object
  },
  data() {
    return {
      loading: false,
      rules: {
        channelCode: [{ required: true, message: '请选择渠道名称', trigger: 'change' }],
        ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        trackingNumberCode: [{ required: true, message: '请输入匹配跟踪号', trigger: 'blur' }]
      },
      formData: {}
    }
  },
  mounted() {
    !this.isAdd && this.init()
  },
  methods: {
    getLabel(item) {
      return `${item.name} (${item.channelCode})`
    },

    remarkBlur(val) {
      const trimResult = val.trim()
      const result = trimResult.match(/[<>]/g)
      this.formData.remark = result ? val.substring(0, val.length - 1) : trimResult
    },

    init() {
      this.formData = {
        channelCode: '',
        ruleName: '',
        trackingNumberCode: '',
        remark: ''
      }
      Object.assign(this.formData, this.detailInfo)
    },
    close(val) {
      this.$parent.$emit('close', val)
    },
    define() {
      this.$refs.rulesForm.validate(valid => {
        if (valid) {
          const { channelCode } = this.formData
          this.formData.dwgId = this.channelList.find(item => item.channelCode === channelCode).dwgId
          const params = JSON.parse(
            JSON.stringify(this.formData,
              ['dwgId', 'channelCode', 'ruleName', 'remark', 'trackingNumberCode', 'id'])
          )
          this.loading = true
          const ct = this.isAdd
            ? addWarehouse(params)
            : updateWarehouse(params)
          ct.finally(() => {
            this.loading = false
          }).then(() => {
            this.close(1)
            this.$message.success('操作成功!')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.warehouseAddEdit{
  &.basic-container{
    min-width:600px!important;
   .w-95{
      width: 95%!important;
   }
  }
}

</style>
