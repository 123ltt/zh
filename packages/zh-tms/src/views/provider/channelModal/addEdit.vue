<template>
  <basic-container class="channelAdd">
    <el-form ref="formRef"
             v-loading="loading"
             :rules="rules"
             size="mini"
             :model="channelInfo"
             label-width="100px"
             class="pe-4 form-col"
    >
      <el-card shadow="hover">
        <div slot="header" class="clearfix" style="height:25px ;line-height:25px">
          <span>基本信息</span>
          <el-button v-if="!isDetail" class="float-end " size="mini" type="primary" @click="define()">保存</el-button>
          <el-button class="float-end me-2" size="mini" @click="close(1)">返回</el-button>
        </div>
        <el-row v-if="!isDetail" :gutter="10">
          <el-col :span="6">
            <el-form-item prop="name" label="渠道名称: ">
              <el-input v-model="channelInfo.name" maxlength="40" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="channelType" label="渠道类型: ">
              <el-select v-model="channelInfo.channelType" clearable placeholder="请选择" filterable>
                <el-option v-for="item in channelTypeList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="+item.dictKey"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="exWarehouseLpId" label="出库物流商: ">
              <g-select v-model.trim="channelInfo.exWarehouseLpId"
                        :items="providerList"
                        key-field="id"
                        :item-title="true"
                        label-field="lpAbbreviation"
                        value-field="id"
                        placeholder="请选择"
                        style="width:97%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="reconciliaLpId" label="对账物流商: ">
              <g-select v-model.trim="channelInfo.reconciliaLpId"
                        :items="providerList"
                        key-field="id"
                        :item-title="true"
                        label-field="lpAbbreviation"
                        value-field="id"
                        placeholder="请选择"
                        style="width:97%"
              />
            </el-form-item>

          </el-col>
        </el-row>
        <g-list-group v-else label-align="center" :cols="4" label-width="80px">
          <g-list-group-item label="渠道名称">
            <g-text-ellipsis>{{ channelInfo.name }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="渠道类型">
            <g-text-ellipsis>{{ channelInfo.channelType }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="出库物流商">
            <g-text-ellipsis>{{ channelInfo.exWarehouseLpId }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="对账物流商">
            <g-text-ellipsis>{{ channelInfo.reconciliaLpId }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>

        <el-row v-if="!isDetail" :gutter="10">
          <el-col :span="6">
            <el-form-item prop="agentCode" label="代理商编号: ">
              <el-input v-model="channelInfo.agentCode" maxlength="20" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="exWarehouseCode" label="出库编号: ">
              <el-input v-model="channelInfo.exWarehouseCode" maxlength="20" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="jpParameter" label="计抛参数: ">
              <el-input v-model="channelInfo.jpParameter"
                        v-input.number.numeric.positive
                        clearable
                        maxlength="10"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="minJpWeight" label="最低计抛重量: ">
              <el-input v-model="channelInfo.minJpWeight"
                        v-input.number
                        maxlength="10"
                        clearable
                        placeholder="单位：KG"
                        @input="limitDecimal"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <g-list-group v-else :cols="4" label-width="80px" label-align="center">
          <g-list-group-item label="代理商编号">
            <g-text-ellipsis>{{ channelInfo.agentCode }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="出库编号">
            <g-text-ellipsis>{{ channelInfo.exWarehouseCode }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="计抛参数">
            <g-text-ellipsis>{{ channelInfo.jpParameter }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="最低计抛重量">
            <g-text-ellipsis>{{ channelInfo.minJpWeight }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>

        <el-row v-if="!isDetail" :gutter="10">
          <el-col :span="6">
            <el-form-item prop="externalChannelCode" label="渠道代码(外): ">
              <el-input v-model="channelInfo.externalChannelCode"
                        maxlength="50"
                        clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="timeliness" label="时效: ">
              <el-input v-model="channelInfo.timeliness"
                        clearable
                        placeholder="时间范围用-隔开,例:3-7;10"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="deliveryType" label="发货类型: ">
              <el-select v-model="channelInfo.deliveryType" clearable filterable>
                <el-option v-for="item in shipmentTypeList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="+item.dictKey"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="freightDiscount" label="运费折扣: ">
              <el-input
                v-model="channelInfo.freightDiscount"
                style="width:70%"
                placeholder="折扣格式:0.8,自动保留小数点后二位,无折扣则填1"
                @input="forcedInput"
                @blur="blurCheck"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <g-list-group v-else :cols="4" label-width="80px" label-align="center">
          <g-list-group-item label="渠道代码(外)">
            <g-text-ellipsis>{{ channelInfo.externalChannelCode }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="时效">
            <g-text-ellipsis>{{ channelInfo.timeliness }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="发货类型">
            <g-text-ellipsis>{{ channelInfo.deliveryType }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="运费折扣">
            <g-text-ellipsis>{{ channelInfo.freightDiscount }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>

        <el-row v-if="!isDetail" :gutter="10">
          <el-col :span="6">
            <el-form-item prop="storeHandleWays" label="仓库处理方式: ">
              <el-select v-model="channelInfo.storeHandleWays"
                         clearable
                         filterable
              >
                <el-option v-for="item in warehousehandleList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="+item.dictKey"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="trackingNumberRegex" label="跟踪号正则: ">
              <el-input v-model="channelInfo.trackingNumberRegex" clearable style="width:70%" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col v-show="!isAdd" :span="6">
            <el-form-item prop="dwgId" label="渠道ID: ">
              <el-input v-model="channelInfo.dwgId" :disabled="!isAdd" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="virtualChannel" label="虚拟渠道">
              <el-radio-group v-model="channelInfo.virtualChannel" style="width:100%">
                <el-radio v-for="item in virtualChannelList"
                          :key="item.dictKey"
                          :label="+item.dictKey"
                          style="width:40%"
                >{{ item.dictValue }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <g-list-group v-else :cols="4" label-width="80px" label-align="center">
          <g-list-group-item label="仓库处理方式">
            <g-text-ellipsis>{{ channelInfo.storeHandleWays }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="跟踪号正则">
            <g-text-ellipsis>{{ channelInfo.trackingNumberRegex }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="渠道ID">
            <g-text-ellipsis>{{ channelInfo.dwgId }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="虚拟渠道">
            <g-text-ellipsis>{{ channelInfo.virtualChannel }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>

        <el-row v-if="!isDetail">
          <el-col :span="12">
            <el-form-item prop="printType" label="面单尺寸: ">
              <el-select v-model="channelInfo.printType" clearable filterable>
                <el-option v-for="item in printTypeList"
                           :key="item.dictKey"
                           :label="item.dictValue"
                           :value="+item.dictKey"
                />
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="remark" label="备注：">
              <el-input v-model="channelInfo.remark"
                        type="textarea"
                        placeholder="请输入内容"
                        maxlength="200"
                        :rows="1"
                        clearable
                        @input="limitSpaceOrGtLt"
              />

            </el-form-item>
          </el-col>
        </el-row>

        <g-list-group v-else :cols="2" label-width="80px" label-align="center">
          <g-list-group-item label="面单尺寸">
            <g-text-ellipsis>{{ channelInfo.printType }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="备注">
            <g-text-ellipsis>{{ channelInfo.remark }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>
      </el-card>
    </el-form>

    <detailTab :id="row.channelCode"
               :include-pane="includePane"
               type="channel_message"
               :hide-handle-rec="!isDetail"
    >
      <el-tab-pane label="服务范围" name="serviceRange" lazy>
        <rangeInfo ref="rangeInfo" :detail-info="row" />
      </el-tab-pane>
      <el-tab-pane label="渠道限制" name="channelLimit" lazy>
        <limitInfo ref="limitInfo" :detail-info="row" />
      </el-tab-pane>
      <el-tab-pane label="增值服务" name="valueAdd" lazy>
        <valueInfo ref="valueInfo" :detail-info="row" />
      </el-tab-pane>
    </detailTab>

  </basic-container>
</template>
<script>
import { dictionary, getLogisticsProvider } from '@/api/common'
import { save, update, detail } from '@/api/channelInformation'
import detailTab from '../../components/detailTab'
import rangeInfo from './rangeInfo'
import limitInfo from './limitInfo'
import valueInfo from './valueInfo'
export default {
  name: 'ChannelAddEdit',
  components: { rangeInfo, detailTab, limitInfo, valueInfo },
  props: {
    isAdd: Boolean,
    isDetail: Boolean,
    row: Object,
    channelTypeList: Array
  },

  provide() {
    return {
      isDetail: this.isDetail
    }
  },

  data() {
    const invalidVerification = (rules, value, cb, label) => {
      if (value + '' === '0') {
        return cb(new Error(`请输入有效的${label}`))
      }
      return cb()
    }
    return {
      includePane: [
        { tabName: 'serviceRange', tableName: 'rangeInfo' },
        { tabName: 'channelLimit', tableName: 'limitTable' },
        { tabName: 'valueAdd', tableName: 'valueTable' }
      ],
      loading: false,
      channelInfo: {
        id: '', // 渠道自身ID
        name: '', // 渠道名称
        channelType: '', // 渠道类型
        dwgId: '', // 渠道id
        exWarehouseLpId: '', // 出库物流商id
        reconciliaLpId: '', // 入库物流商id
        agentCode: '', // 代理商编号
        exWarehouseCode: '', // 出库编码
        jpParameter: '', // 计抛参数
        minJpWeight: '', // 最低计抛重量
        externalChannelCode: '', // 渠道代码(外)
        timeliness: '', // 时效
        deliveryType: '', // 发货类型
        storeHandleWays: '', // 仓库处理方式
        printType: '', // 面单尺寸
        freightDiscount: '1', // 运费折扣
        remark: '', // 备注
        trackingNumberRegex: '',
        virtualChannel: ''
      },
      providerList: [],
      shipmentTypeList: [],
      warehousehandleList: [],
      printTypeList: [], // 面单列表
      virtualChannelList: [],
      rules: {
        name: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }],
        channelType: [{ required: true, message: '请选择渠道类型', trigger: 'change' }],
        exWarehouseLpId: [{ required: true, message: '请选择出库物流商', trigger: 'change' }],
        reconciliaLpId: [{ required: true, message: '请选择对账物流商', trigger: 'change' }],
        externalChannelCode: [{ required: true, message: '请输入渠道代码(外)', trigger: 'blur' }],
        agentCode: [{ required: true, message: '请输入代理商编号', trigger: 'blur' }],
        deliveryType: [{ required: true, message: '请选择发货类型', trigger: 'change' }],
        storeHandleWays: [{ required: true, message: '请选择仓库处理方式', trigger: 'change' }],
        virtualChannel: [{ required: true, message: '请选择虚拟渠道', trigger: 'change' }],
        printType: [{ required: true, message: '面单尺寸', trigger: 'change' }],
        freightDiscount: [{
          trigger: 'change',
          validator: (rules, value, cb) => {
            invalidVerification(rules, value, cb, '运费折扣')
          }
        }],
        jpParameter: [{
          trigger: 'change',
          validator: (rules, value, cb) => {
            invalidVerification(rules, value, cb, '计抛参数')
          }
        }],
        timeliness: [{
          trigger: 'change',
          validator: (rules, value, cb) => {
            invalidVerification(rules, value, cb, '时效')
          }
        }],

        minJpWeight:
         [{
           trigger: 'change',
           validator: (rules, value, cb) => {
             invalidVerification(rules, value, cb, '最低计抛重量')
           }
         }]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      Promise.all([
        dictionary('store_handle_ways'),
        getLogisticsProvider(),
        dictionary('delivery_type'),
        dictionary('channel_print_type'),
        dictionary('online_channel')
      ]).then(res => {
        this.warehousehandleList = res[0].data
        this.providerList = res[1].data.filter(item => item.auditStatus === 1)
        this.shipmentTypeList = res[2].data
        this.printTypeList = res[3].data
        this.virtualChannelList = res[4].data
        if (this.isAdd) {
          this.channelInfo.storeHandleWays = this.warehousehandleList[0].dictKey
          this.channelInfo.deliveryType = this.shipmentTypeList[0].dictKey
          this.channelInfo.printType = this.printTypeList[0].dictKey
        }
        // 获取详情
        if (!this.isAdd || this.isDetail) {
          detail({ id: this.row.id }).then(res => {
            this.channelInfo = JSON.parse(JSON.stringify(res.data))
            this.isDetail && this.init()
          })
        }
      })
    },
    init() {
      const {
        storeHandleWays,
        deliveryType,
        printType,
        channelType,
        virtualChannel,
        exWarehouseLpId,
        reconciliaLpId
      } = this.channelInfo
      // 渠道类型转换
      this.channelInfo.channelType = this.channelTypeList.find(
        item => channelType + '' === item.dictKey
      ).dictValue
      // 出库物流商转换
      this.channelInfo.exWarehouseLpId = this.providerList.find(item => exWarehouseLpId === item.id).lpAbbreviation
      // 入库物流商转换
      this.channelInfo.reconciliaLpId = this.providerList.find(item => reconciliaLpId === item.id).lpAbbreviation
      // 发货类型转换
      this.channelInfo.deliveryType = this.shipmentTypeList.find(
        item => deliveryType + '' === item.dictKey
      ).dictValue
      // 仓库处理方式
      this.channelInfo.storeHandleWays = this.warehousehandleList.find(
        item => storeHandleWays + '' === item.dictKey
      ).dictValue
      // 面单尺寸
      this.channelInfo.printType = this.printTypeList.find(
        item => printType + '' === item.dictKey
      ).dictValue
      // 虚拟渠道
      this.channelInfo.virtualChannel = this.virtualChannelList.find(
        item => virtualChannel + '' === item.dictKey
      ).dictValue
    },

    blurCheck(e) {
      if (!e.target.value) {
        this.channelInfo.freightDiscount = 1
      }
    },

    close(refreshPage) {
      this.$emit('close', refreshPage) // refreshPage确认是否刷新
    },

    define: function() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.loading = true
          this.providerList.forEach(item => {
            if (item.id === this.channelInfo.exWarehouseLpId) {
              this.channelInfo.exWarehouseLpCode = item.supplierNumber
            }
            if (item.id === this.channelInfo.reconciliaLpId) {
              this.channelInfo.reconciliaLpCode = item.supplierNumber
            }
          })

          const params = {}
          Object.assign(params, this.channelInfo)
          params.trackingNumberRegex = params.trackingNumberRegex && encodeURI(params.trackingNumberRegex)
          const ct = this.isAdd ? save(params) : update(params)

          ct.finally(() => {
            this.loading = false
          }).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        }
      })
    },

    // 限定小数点只能输入3位
    limitDecimal(inputStr) {
      const val = inputStr.replace(/[^(0-9|.)]+/, '')
      const newVal = val.match(/^\d+(\.?\d{0,3})/g)
      this.channelInfo.minJpWeight = newVal ? newVal[0] : val
    },

    // 强制限制运费折扣输入
    forcedInput(inputStr) {
      const val = inputStr.replace(/[^(0-9|.)]+/, '')
      if (val[0] !== '1' && val[0] !== '0') {
        this.channelInfo.freightDiscount = ''
      } else if (val[0] === '1') {
        this.channelInfo.freightDiscount = 1
      } else if (val[0] === '0') {
        this.channelInfo.freightDiscount = 0
        if (val[1] === '.') {
          const newVal = val.match(/^\d+(\.?\d{0,2})/g) // 限制输入2位小数
          this.channelInfo.freightDiscount = newVal ? newVal[0] : val
        }
      }
    },

    // 限制输入空格以及<>
    limitSpaceOrGtLt(val) {
      const trimResult = val.trim()
      const result = trimResult.match(/[<>]/g)
      this.channelInfo.remark = result ? val.substring(0, val.length - 1) : trimResult
    }
  }
}

</script>
<style lang="scss" scoped>

*{
  font-size: 12px;
}

.channelAdd{
  &.basic-container{
    min-width:900px!important;
    .el-input{
      width:98%!important;
    }
    .el-select{
      width: 98%!important
    }
    .g-select {
      width:98%!important;
    }
  }

}
::v-deep .el-tabs__content #pane-channelLimit .el-form{
  overflow: auto;
}

</style>
