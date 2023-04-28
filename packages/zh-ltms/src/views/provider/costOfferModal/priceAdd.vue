<!-- 新增费用项 -->
<template>
  <basic-container v-loading="loading" class="priceAdd">

    <el-form ref="rulesForm" :rules="rules" size="mini" :model="priceInfo" label-width="120px">
      <el-row :gutter="10">
        <el-form-item v-if="isAdd" prop="itemCode" label="费用项名称：">
          <el-select v-model="priceInfo.itemCode" placeholder="请选择" filterable>
            <el-option v-for="item in priceNameList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item v-if="!isAdd" prop="channelName" label="渠道名称：">
          <span>{{ channelName }}</span>
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item prop="templateType" label="价格模板：">
          <el-select v-if="isAdd" v-model="priceInfo.templateType" placeholder="请选择" filterable>
            <el-option v-for="item in editionRulesList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
          <span v-else>{{ templateTypeName }}</span>
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item prop="currency" label="币种：">
          <el-select v-model="priceInfo.currency" placeholder="请选择" filterable>
            <el-option v-for="item in insurCurrList" :key="item.currCode" :label="`${item.currCode}(${item.currName})`" :value="item.currCode" />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item prop="startDate" label="生效日期：">
          <el-date-picker
            v-model="priceInfo.startDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            placeholder="选择日期"
          />
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item prop="endDate" label="失效日期：">
          <el-date-picker
            v-model="priceInfo.endDate"
            type="datetime"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          />
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="priceInfo.remark"
                    type="textarea"
                    :rows="2"
                    class="w-80"
                    maxlength="200"
                    @input="(val)=>{priceInfo.remark = limitSpaceOrGtLt(val)}"
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
import { dictionary, getCurrencyList } from '@/api/common'
import { priceSave, editionUpdate } from '@/api/costOffer'
import { dateFormat } from '@/util/date'
import {
  limitSpaceOrGtLt
} from './../../until'
export default {
  name: 'PriceAdd',
  props: {
    channelName: String,
    channelCode: String,
    detailInfo: Object,
    isAdd: {
      type: Boolean,
      default: true,
      require: false
    }
  },

  data() {
    return {
      isExhibition: true,
      templateTypeName: '',
      loading: false,
      priceNameList: [],
      editionRulesList: [],
      insurCurrList: [],
      rules: {
        itemCode: [{ required: this.isAdd, message: '请选择费用项名称', trigger: 'change' }],
        templateType: [{ required: this.isAdd, message: '请选择价格模板', trigger: 'change' }],
        currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
        startDate: [{
          required: true,
          message: '请选择生效日期',
          trigger: 'change'
        }]
      },
      priceInfo: {
        itemCode: '',
        templateType: '',
        currency: '',
        startDate: '',
        endDate: '',
        remark: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      }

    }
  },
  watch: {
    'priceInfo.startDate': {
      handler(newVal) {
        if (dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss') === newVal) {
          var d = new Date(newVal)
          d.setDate(d.getDate() + 1)
          var m = d.getMonth() + 1
          this.priceInfo.startDate = d.getFullYear() + '-' + m + '-' + d.getDate() + ' 00:00:00'
        }
      },
      deep: true
    },
    'priceInfo.endDate': {
      handler(newVal) {
        if (dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss') === newVal) {
          var d = new Date(newVal)
          d.setDate(d.getDate() + 1)
          var m = d.getMonth() + 1
          this.priceInfo.endDate = d.getFullYear() + '-' + m + '-' + d.getDate() + ' 00:00:00'
        }
      },
      deep: true
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      Promise.all([
        dictionary('tms_base_channel_price_item_name'),
        dictionary('tms_base_channel_edition_rules'),
        getCurrencyList()
      ]).then(arr => {
        this.priceNameList = arr[0].data // 费用项名称
        this.editionRulesList = arr[1].data// 价格模板
        this.insurCurrList = arr[2].data // 币种

        !this.isAdd && this.init()
      })
    },

    init() {
      Object.assign(this.priceInfo, this.detailInfo)
      const { templateType } = this.priceInfo
      this.templateTypeName = this.editionRulesList.find(item => item.dictKey === templateType + '').dictValue
      if (this.detailInfo.isExhibition) {
        this.isExhibition = false
        this.priceInfo.endDate = ''
      }
    },
    close(val) {
      this.$parent.$emit('close', val)
    },

    limitSpaceOrGtLt(val) {
      return limitSpaceOrGtLt(val)
    },

    define() {
      this.$refs.rulesForm.validate(valid => {
        if (valid) {
          const { startDate, endDate } = this.priceInfo
          if (startDate && endDate && (new Date(startDate)).getTime() >= (new Date(endDate)).getTime()) {
            return this.$message.error('失效日期必须在生效日期之后')
          }
          if ((new Date(startDate)).getTime() <= (new Date()).getTime()) {
            return this.$message.error('生效时间必须大于当前时间')
          }

          const params = {}
          Object.assign(params, this.priceInfo)

          this.loading = true
          const ct = this.isAdd
            ? priceSave({
              channelCode: this.channelCode,
              ...params
            })
            : editionUpdate(params)
          ct.finally(() => {
            this.loading = false
          }).then(() => {
            this.close(this.isAdd ? params.itemCode : 1)
            this.$message.success('操作成功!')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.priceAdd{
  &.basic-container{
    min-width:600px!important;
    .el-input{
      width:90%
    }
    .el-select{
      width:90%
    }
    .el-textarea{
      width:90%
    }
  }
}

</style>
<style lang="scss">
.el-picker-panel__link-btn.el-button--text.el-button--mini {
  display: none;
}

</style>
