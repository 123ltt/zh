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
        <div v-if="!isDetail">
          <el-row :gutter="10">
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
          <el-row :gutter="10">
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
                          @input="newVal=>{channelInfo.minJpWeight= limitDecimal(newVal,6)}"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
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
                  @input="(val)=>{
                    channelInfo.freightDiscount= forcedInput(val)
                  }"
                  @blur="blurCheck"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
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
                <el-input v-model="channelInfo.trackingNumberRegex" clearable style="width:70%" placeholder="" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col v-if="channelInfo.channelCode" :span="6">
              <el-form-item prop="dwgId" label="渠道ID: ">
                <el-input v-model="channelInfo.dwgId" :disabled="!!channelInfo.channelCode" />
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
          <el-row :gutter="10">
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
                          @input="(val)=>{channelInfo.remark = limitSpaceOrGtLt(val)}"
                />

              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <g-list-group v-for="(items,i) in detailRow1" :key="i" :cols="items.length" label-width="110px" label-align="center">
            <g-list-group-item v-for="(item,j) in items" :key="j" :label="item.label" :class="item.class?item.class:''">
              <g-text-ellipsis>{{ channelInfo[item.prop] }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </div>
      </el-card>
    </el-form>

    <detailTab v-if="channelInfo.channelCode"
               :id="channelInfo.channelCode"
               :include-pane="includePane"
               type="channel_message"
               :hide-handle-rec="!isDetail"
    >
      <el-tab-pane label="服务范围" name="serviceRange" lazy>
        <rangeInfo ref="rangeInfo" :detail-info="channelInfo" />
      </el-tab-pane>
      <el-tab-pane label="渠道限制" name="channelLimit" lazy>
        <limitInfo ref="limitInfo" :detail-info="channelInfo" />
      </el-tab-pane>
      <el-tab-pane label="增值服务" name="valueAdd" lazy>
        <valueInfo ref="valueInfo" :detail-info="channelInfo" />
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
import {
  limitDecimal,
  forcedInput,
  limitSpaceOrGtLt,
  invalidVerification,
  getDictVal
} from './../../until'
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
    return {
      includePane: [
        { tabName: 'serviceRange', tableName: 'rangeInfo' },
        { tabName: 'channelLimit', tableName: 'limitTable' },
        { tabName: 'valueAdd', tableName: 'valueTable' }
      ],
      loading: false,
      channelInfo: {
        deliveryType: '',
        storeHandleWays: '',
        printType: '',
        freightDiscount: '1'
      },
      providerList: [],
      shipmentTypeList: [],
      warehousehandleList: [],
      printTypeList: [],
      virtualChannelList: [],
      detailRow1: Object.freeze(
        [
          [
            { label: '渠道名称', prop: 'name' },
            { label: '渠道类型', prop: 'channelType' },
            { label: '出库物流商', prop: 'exWarehouseLpId' },
            { label: '对账物流商', prop: 'reconciliaLpId' }
          ],
          [
            { label: '代理商编号', prop: 'agentCode' },
            { label: '出库编号', prop: 'exWarehouseCode' },
            { label: '计抛参数', prop: 'jpParameter' },
            { label: '最低计抛重量', prop: 'minJpWeight' }
          ],
          [
            { label: '渠道代码(外)', prop: 'externalChannelCode' },
            { label: '时效', prop: 'timeliness' },
            { label: '发货类型', prop: 'deliveryType' },
            { label: '运费折扣', prop: 'freightDiscount' }
          ],
          [
            { label: '仓库处理方式', prop: 'storeHandleWays' },
            { label: '跟踪号正则', prop: 'trackingNumberRegex' },
            { label: '渠道ID', prop: 'dwgId' },
            { label: '虚拟渠道', prop: 'virtualChannel' }
          ],
          [
            { label: '面单尺寸', prop: 'printType' },
            { label: '备注', prop: 'remark' }
          ]
        ]),
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
        // 获取详情
        if (!this.isAdd || this.isDetail) {
          detail({ id: this.row.id }).then(res => {
            const data = JSON.parse(JSON.stringify(res.data))
            for (const prop in data) {
              this.$set(this.channelInfo, prop, data[prop])
            }
            this.isDetail && this.init()
          })
        }
      })
    },

    limitDecimal(newVal) {
      return limitDecimal(newVal, 3)
    },

    limitSpaceOrGtLt(val) {
      return limitSpaceOrGtLt(val)
    },

    forcedInput(val) {
      return forcedInput(val)
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

      // 出库物流商转换
      this.channelInfo.exWarehouseLpId = this.providerList.find(item => exWarehouseLpId === item.id).lpAbbreviation
      // 入库物流商转换
      this.channelInfo.reconciliaLpId = this.providerList.find(item => reconciliaLpId === item.id).lpAbbreviation

      // 转换 : 渠道类型 发货类型 仓库处理方式 面单尺寸 虚拟渠道
      this.channelInfo.channelType = getDictVal(this.channelTypeList, channelType)
      this.channelInfo.deliveryType = getDictVal(this.shipmentTypeList, deliveryType)
      this.channelInfo.storeHandleWays = getDictVal(this.warehousehandleList, storeHandleWays)
      this.channelInfo.printType = getDictVal(this.printTypeList, printType)
      this.channelInfo.virtualChannel = getDictVal(this.virtualChannelList, virtualChannel)
    },

    blurCheck(e) {
      if (!e.target.value) {
        this.channelInfo.freightDiscount = 1
      }
    },

    close() {
      this.$emit('close')
    },

    update() {
      this.$emit('update')
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

          const ct = !this.channelInfo.channelCode ? save(params) : update(params)

          ct.finally(() => {
            this.loading = false
          }).then(res => {
            if (!this.channelInfo.channelCode) {
              for (const prop in res.data) {
                this.$set(this.channelInfo, prop, res.data[prop])
              }
            }
            this.$message.success('操作成功!')
            this.update()
          })
        }
      })
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
