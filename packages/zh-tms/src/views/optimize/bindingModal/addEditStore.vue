<!-- 线上服务绑定 新增/编辑-->
<template>
  <basic-container v-loading="loading" class="bindingAddEdit">
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix" style="height:25px ;line-height:25px">
        <span>基本信息</span>
        <el-button style="float: right; " size="mini" type="primary" @click="define()">保存</el-button>
        <el-button style="float: right;margin-right:5px" size="mini" type="primary" @click="close()">取消</el-button>

      </div>
      <el-form
        ref="rulesForm"
        :rules="rules"
        size="mini"
        :model="serviceBindingInfo"
        label-width="90px"
      >
        <el-row type="flex">
          <el-col>
            <el-form-item prop="ocsId" label="线上服务名:">
              <g-select
                v-if="isAdd"
                v-model="serviceBindingInfo.ocsId"
                :items="serviceList"
                key-field="id"
                :label-field="getOnlineServiceLabel"
                value-field="id"
                clearable
                :item-title="true"
              />

              <span v-else>{{ serviceBindingInfo.ocsName }}</span>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item prop="platformName" label="平台:">
              {{ serviceBindingInfo.platformName }}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="deliveryType" label="发货类型:">
              <el-select
                v-if="isAdd"
                v-model="serviceBindingInfo.deliveryType"
                clearable
                placeholder="请选择"
                filterable
              >
                <el-option
                  v-for="item in deliveryList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                />
              </el-select>

              <span v-else>  {{ getDeliveryType( serviceBindingInfo.deliveryType ) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item prop="channelIds" label="渠道名称:">
              <g-select v-show="isAdd"
                        ref="channelName"
                        v-model="serviceBindingInfo.channelIds"
                        :items="showChannelNameList"
                        key-field="id"
                        :multiple="true"
                        :label-field="getLabel"
                        value-field="id"
                        placeholder="请选择"
              />
              <span v-show="!isAdd">{{ serviceBindingInfo.channelName }}</span>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item prop="freightLow" label="运费:">
              <el-input
                v-model="serviceBindingInfo.freightLow"
                v-input.number.positive
                maxlength="13"
                class="small"
                @input="controlPoint('freightLow')"
              />~
              <el-input
                v-model="serviceBindingInfo.freightHigh"
                v-input.number.positive
                maxlength="13"
                class="small"
                @input="controlPoint('freightHigh')"
              />(单位：美元)
            </el-form-item>
          </el-col>

          <el-col type="flex">
            <el-form-item prop="totalPriceLow" label="总金额:">
              <el-input
                v-model="serviceBindingInfo.totalPriceLow"
                v-input.number.positive
                maxlength="13"
                class="small"
                @input="controlPoint('totalPriceLow')"
              />~
              <el-input
                v-model="serviceBindingInfo.totalPriceHigh"
                v-input.number.positive
                maxlength="13"
                class="small"
                @input="controlPoint('totalPriceHigh')"
              />(单位：美元)
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="priceLow" label="单件金额:">
              <el-input
                v-model="serviceBindingInfo.priceLow"
                v-input.number.positive
                maxlength="13"
                class="small"
                @input="controlPoint('priceLow')"
              />~
              <el-input
                v-model="serviceBindingInfo.priceHigh"
                v-input.number.positive
                maxlength="13"
                class="small"
                @input="controlPoint('priceHigh')"
              />(单位：美元)
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 新增店铺限制 -->
    <el-card class="box-card mt-2" shadow="hover">
      <div slot="header" class="clearfix" style="height:25px ;line-height:25px ">
        <span>店铺限制</span>
      </div>
      <add-edit-table :platform-code="serviceBindingInfo.platformCode"
                      :store-type="serviceBindingInfo.storeType"
                      :store-vo-list="serviceBindingInfo.onlineChannelServiceBindStoreDTOList"
                      @changeStoreType="changeStoreType"
                      @storeDTOList="storeDTOList"
      />

    </el-card>
  </basic-container>
</template>
<script>
import addEditTable from '../components/addEditStoreTable'
import { dictionary, logisticsChannel } from '@/api/common'
import {
  onlineServiceBindSave,
  onlineServiceBindUpdate,
  onlineServiceBindDetail
} from '@/api/serviceBinding'

export default {
  name: 'BindingAddEdit',
  components: { addEditTable },

  props: {
    isAdd: Boolean,
    id: String,
    platformList: Array,
    serviceList: Array
  },
  data() {
    const validatSection = (left, right, label, cb, flag) => {
      if (!flag && !(left + '') && !(right + '')) {
        return cb()
      }
      if (!(left + '') || !(right + '')) {
        return cb(new Error(`${label}都不能为空!`))
      }
      if (right + '' === '0') {
        return cb(new Error(`请输入有效的${label}`))
      }
      if (Number(left) > Number(right)) {
        return cb(new Error(`最低${label}不能大于最高${label}!`))
      }
      return cb()
    }
    return {
      loading: true,
      storeList: [],
      channelNameList: [],
      showChannelNameList: [],
      deliveryList: [],
      serviceBindingInfo: {
        storeType: '1',
        ocsId: '',
        channelIds: [],
        freightLow: '',
        freightHigh: '',
        totalPriceLow: '',
        totalPriceHigh: '',
        priceLow: '',
        priceHigh: '',
        platformName: '',
        platformId: '',
        deliveryType: '',
        platformCode: '',
        onlineChannelServiceBindStoreDTOList: []
      },
      rules: {
        ocsId: [
          { required: this.isAdd, message: '请选择线上服务名', trigger: 'change' }
        ],
        channelIds: [
          { required: this.isAdd, message: '请选择渠道名称', trigger: 'change' }
        ],
        totalPriceLow: [
          {
            trigger: 'change',
            validator: (rules, value, cb) => {
              const data = this.serviceBindingInfo.totalPriceHigh
              const totalPriceHigh = data || ''
              validatSection(value, totalPriceHigh, '运费', cb, false)
            }
          }
        ],

        priceLow: [
          {
            trigger: 'change',
            validator: (rules, value, cb) => {
              const data = this.serviceBindingInfo.priceHigh
              const priceHigh = data || ''
              validatSection(value, priceHigh, '单件金额', cb, false)
            }
          }
        ],
        freightLow: [
          {
            trigger: 'change',
            validator: (rules, value, cb) => {
              const data = this.serviceBindingInfo.freightHigh
              const freightHigh = data || ''
              validatSection(value, freightHigh, '运费', cb, false)
            }
          }
        ]
      }
    }
  },
  watch: {
    'serviceBindingInfo.ocsId'(newVal) {
      this.serviceList.forEach(item => {
        if (item.id === newVal) {
          this.serviceBindingInfo.platformName = item.platformName
          this.serviceBindingInfo.platformCode = item.platformCode
          this.serviceBindingInfo.platformId = item.platformId
        }
      })
    },
    'serviceBindingInfo.deliveryType'(newVal) {
      this.$nextTick(function() {
        if (newVal) {
          this.showChannelNameList =
          this.channelNameList.filter(item => item.deliveryType + '' === newVal + '')
        } else {
          this.showChannelNameList = this.channelNameList
        }
      })
    }
  },
  created() {
    this.getData()
  },

  methods: {
    getLabel(item) {
      return `${item.name} (${item.channelCode})`
    },

    changeStoreType(val) {
      this.serviceBindingInfo.storeType = val
    },
    storeDTOList(data) {
      const list = data.map(item => {
        const obj = {}
        obj.storeCode = item.storeCode
        obj.tenantId = item.tenantId
        return obj
      })
      this.serviceBindingInfo.onlineChannelServiceBindStoreDTOList = list
    },
    getDeliveryType(deliveryType) {
      return (this.deliveryList) && this.deliveryList.find(item => item.dictKey === deliveryType)?.dictValue
    },

    getData() {
      this.loading = true

      Promise.all([
        logisticsChannel(),
        dictionary('delivery_type')
      ]).then(res => {
        this.channelNameList = res[0].data
        this.deliveryList = res[1].data
        this.showChannelNameList = this.channelNameList
        !this.isAdd && this.init()
        this.loading = false
      })
    },
    getOnlineServiceLabel(item) {
      return `${item.onlineServiceNameEn} (${item.onlineServiceNameCn})`
    },
    close(val) {
      this.$emit('close', val)
    },
    init() {
      onlineServiceBindDetail({ id: this.id }).then(res => {
        const data = res.data
        this.showChannelNameList.forEach(item => {
          if (item.id === data.channelId) {
            data.channelName = item.name
            data.deliveryType = item.deliveryType + ''
          }
        })
        const dealWithDecimal = [
          'freightLow',
          'freightHigh',
          'totalPriceLow',
          'totalPriceHigh',
          'priceLow',
          'priceHigh'
        ]
        dealWithDecimal.forEach(item => {
          data[item] = data[item] == null ? '' : Number(data[item])
        })
        this.serviceList.forEach(item => {
          if (item.id === data.ocsId) {
            data.ocsName = `${item.onlineServiceNameEn}(${item.onlineServiceNameCn})`
          }
        })
        data.storeType = data.storeType.toString()
        Object.assign(this.serviceBindingInfo, data)
      })
    },
    controlPoint(data) {
      const val = this.serviceBindingInfo[data].replace(/[^(0-9|.)]+/, '')
      const newVal = val.match(/^\d+(\.?\d{0,3})/g)
      this.serviceBindingInfo[data] = newVal ? newVal[0] : val
    },
    define() {
      this.$refs.rulesForm.validate(valid => {
        if (valid) {
          this.loading = true
          const {
            ocsId,
            freightHigh,
            freightLow,
            priceHigh,
            priceLow,
            totalPriceHigh,
            totalPriceLow,
            platformId,
            channelIds,
            id,
            storeType,
            platformCode,
            onlineChannelServiceBindStoreDTOList
          } = this.serviceBindingInfo

          // 处理渠道名称
          const channels = []
          if (this.isAdd) {
            this.channelNameList.forEach(item => {
              channelIds.forEach(elem => {
                if (item.id === elem) {
                  channels.push({ id: item.id, channelCode: item.channelCode })
                }
              })
            })
          }

          const params = {
            storeType,
            channels,
            ocsId,
            freightHigh,
            freightLow,
            priceHigh,
            priceLow,
            totalPriceHigh,
            totalPriceLow,
            platformId,
            platformCode,
            onlineChannelServiceBindStoreDTOList
          }

          const ct = this.isAdd
            ? onlineServiceBindSave(params)
            : onlineServiceBindUpdate({ id, ...params })
          //  新增
          ct.finally(() => {
            this.loading = false
          }).then(res => {
            this.close(1)
            this.$message.success({ message: '操作成功!' })
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.bindingAddEdit {
  &.basic-container {
    min-width: 600px !important;
    .el-input {
      width: 50%;
    }

    .small {
      width: 28%;
    }
  }
}
::v-deep {
   .g-select  {
      width: 60% !important;
    }
}
</style>
