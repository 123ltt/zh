<template>
  <basic-container v-loading="loading" class="platformAddLimit">
    <el-form ref="rulesForm" :rules="rules" size="mini" :model="platformLimitInfo" label-width="100px" class="form-col">
      <el-card shadow="hover">
        <div slot="header" class="clearfix" style="height:25px ;line-height:25px">
          <span>基本信息</span>
          <el-button style="float: right; " size="mini" type="primary" @click="define()">保存</el-button>
          <el-button style="float: right;margin-right:5px" size="mini" type="primary" @click="close()">取消</el-button>
        </div>
        <el-row :gutter="10" style="padding:0px">
          <el-col :span="8">
            <el-form-item prop="channelId" label="渠道名称: ">
              <span v-if="!isAdd">{{ getName() }}</span>
              <g-select
                v-else
                v-model="platformLimitInfo.channelId"
                :items="channelNameList"
                key-field="id"
                :label-field="getChannelLabel"
                :value-field="id"
                placeholder="请选择"
                :item-title="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="name" label="限制名称: ">
              <el-input v-model="platformLimitInfo.name" clearable maxlength="40" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              class="country"
              label="目的国: "
              prop="countryDTOList"
            >
              <g-select v-model="platformLimitInfo.countryDTOList"
                        :items="countryList"
                        key-field="id"
                        :label-field="getLabel"
                        value-field="id"
                        multiple
                        is-checked-all
                        placeholder="请选择"
                        :item-title="true"
              />
              <el-popover
                v-model="visible"
                placement="bottom"
                width="400"
                title="请复制你要输入的内容"
              >
                <el-card class="box-card">
                  <el-input
                    v-model="value"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入你要复制的内容，用英文分号分隔开，注意会自动勾选"
                  />
                  <div style="text-align: right; margin: 0" class="mt-2">
                    <el-button size="mini" type="text" @click="cancel('value','visible')">取消</el-button>
                    <el-button type="primary" size="mini" @click="copySuccessCountry">确定</el-button>
                  </div>
                </el-card>
                <i slot="reference" class="el-icon-edit myicon" />
              </el-popover>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item prop="weightLow" label="重量: ">
              <el-input v-model="platformLimitInfo.weightLow"
                        v-input.number.positive
                        maxlength="13"
                        class="small"
                        @input="newVal=>{platformLimitInfo.weightLow= limitDecimal(newVal,3)}"
              />~
              <el-input v-model="platformLimitInfo.weightHigh"
                        v-input.number.positive
                        maxlength="13"
                        class="small"
                        @input="newVal=>{platformLimitInfo.weightHigh= limitDecimal(newVal,3)}"
              />(单位：kg)
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="totalPriceLow" label="总金额: ">
              <el-input v-model="platformLimitInfo.totalPriceLow"
                        v-input.number.positive
                        maxlength="13"
                        class="small"
                        @input="newVal=>{platformLimitInfo.totalPriceLow= limitDecimal(newVal,3)}"
              />~
              <el-input v-model="platformLimitInfo.totalPriceHigh"
                        v-input.number.positive
                        maxlength="13"
                        class="small"
                        @input="newVal=>{platformLimitInfo.totalPriceHigh= limitDecimal(newVal,3)}"
              />(单位：美元)
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item prop="priceLow" label="单件金额: ">
              <el-input v-model="platformLimitInfo.priceLow"
                        v-input.number.positive
                        maxlength="13"
                        class="small"
                        @input="newVal=>{platformLimitInfo.priceLow= limitDecimal(newVal,3)}"
              />~
              <el-input v-model="platformLimitInfo.priceHigh"
                        v-input.number.positive
                        maxlength="13"
                        class="small"
                        @input="newVal=>{platformLimitInfo.priceHigh= limitDecimal(newVal,3)}"
              />(单位：美元)
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item prop="orderFreightLow" label="订单运费: ">
              <el-input v-model="platformLimitInfo.orderFreightLow"
                        v-input.number.positive
                        maxlength="13"
                        class="small"
                        @input="newVal=>{platformLimitInfo.orderFreightLow= limitDecimal(newVal,3)}"
              />~
              <el-input v-model="platformLimitInfo.orderFreightHigh"
                        v-input.number.positive
                        maxlength="13"
                        class="small"
                        @input="newVal=>{platformLimitInfo.orderFreightHigh= limitDecimal(newVal,3)}"
              />(单位：美元)
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="priority" label="优先级: ">
              <el-input v-model="platformLimitInfo.priority"
                        v-input.number.positive.numeric
                        clearable
                        @blur="blurCheck"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="onlineChannel" label="线上渠道: ">
              <el-radio-group v-model="platformLimitInfo.onlineChannel" class="w-100">
                <el-radio v-for="item in onlineChannelList"
                          :key="item.dictKey"
                          :label="item.dictKey"
                          style="width:18%"
                >{{ item.dictValue }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8" :class="platformLimitInfo.surplusDistributionNum?'d-flex':''">
            <el-form-item prop="distributionNum" label="日分配数: ">
              <el-input v-model="platformLimitInfo.distributionNum" v-input.number.positive.numeric maxlength="9" clearable />
            </el-form-item>
            <g-list-group v-if="platformLimitInfo.surplusDistributionNum">
              <g-list-group-item label="剩余数">
                {{ platformLimitInfo.surplusDistributionNum }}
              </g-list-group-item>
            </g-list-group>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="platform" label="平台: ">
              <g-select v-model="platformLimitInfo.platform"
                        :items="platformList"
                        key-field="platformCode"
                        label-field="platformName"
                        value-field="platformCode"
                        multiple
                        is-checked-all
                        placeholder="请选择"
                        :item-title="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="备注: " prop="remark">
            <el-input
              v-model="platformLimitInfo.remark"
              :rows="2"
              type="textarea"
              clearable
              style="width:97%"
              show-word-limit
              @input="(val)=>{platformLimitInfo.remark = limitSpaceOrGtLt(val)}"
            />
          </el-form-item>
        </el-row>
      </el-card>

      <el-tabs v-show="platformLimitInfo.platform.length" id="tabs" v-model="activeName">
        <el-tab-pane label="店铺限制" name="storeLimit" lazy>
          <addEditTable :platform-code="platformLimitInfo.platform"
                        :store-type="platformLimitInfo.storeType"
                        :store-vo-list="platformLimitInfo.channelSaleLimitStoreVos"
                        :platform-all-list="platformAllList"
                        @storeDTOList="storeDTOList"
                        @changeStoreType="changeStoreType"
                        @allStoreCb="allStoreCb"
          />
        </el-tab-pane>
      </el-tabs>
    </el-form>

  </basic-container>
</template>
<script>
import { getCountryList, dictionary, logisticsChannel } from '@/api/common'
import { platformDetail, platformSave, getplatformAllList } from '@/api/platformLimits'
import addEditTable from './../components/addEditStoreTable'
import { limitDecimal, limitSpaceOrGtLt } from './../../until'
export default {
  name: 'PlatformAddLimit',
  components: { addEditTable },
  props: {
    isAdd: Boolean,
    id: String,
    platformList: Array,
    itemList: Array
  },
  data() {
    const validatSection = (left, right, label, cb, flag) => {
      if (!flag && !left && !right) {
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

    const invalidVerification = (rules, value, cb, label) => {
      if (value + '' === '0') {
        return cb(new Error(`请输入有效的${label}`))
      }
      return cb()
    }

    return {
      loading: false,
      visible: false,
      hasContent: false,
      activeName: 'storeLimit',
      value: '',
      countryList: [],
      onlineChannelList: [],
      storeTypeList: [],
      storeList: [],
      channelNameList: [],
      channelObj: {},
      tableList: [],
      platformAllList: [],
      platformLimitInfo: {
        storeType: '',
        channelId: '', // 渠道名称
        name: '', // 平台限制名称
        countryDTOList: [], // 国家
        weightLow: '', // 最低重量
        weightHigh: '', // 最高重量
        platform: [], // 平台
        totalPriceLow: '', // 最低总金额
        totalPriceHigh: '', // 最高总金额
        priceLow: '', // 最低单件金额
        priceHigh: '', // 最高单件金额
        orderFreightLow: '', // 最低运费金额
        orderFreightHigh: '', // 最高运费金额
        priority: 1, // 优先级
        onlineChannel: '', // 是否线上渠道
        distributionNum: '', // 日分配数
        remark: '' // 备注
      },
      rules: {
        channelId: [{ required: true, message: '请输入渠道名称', trigger: 'change' }],
        name: [{ required: true, message: '请输入限制名称', trigger: 'change' }],
        onlineChannel: [{ required: true, message: '请选择线上渠道', trigger: 'change' }],
        platform: [{ required: true, message: '请输入平台', trigger: 'change' }],
        countryDTOList: [{ required: true, message: '请输入目的国', trigger: 'change' }],
        weightLow: [
          {
            required: true,
            trigger: 'change',
            validator: (rules, value, cb) => {
              const data = this.platformLimitInfo.weightHigh
              const weightHigh = data || ''
              validatSection(value, weightHigh, '重量', cb, true)
            }
          }
        ],
        totalPriceLow: [
          {
            trigger: 'change',
            validator: (rules, value, cb) => {
              const data = this.platformLimitInfo.totalPriceHigh
              const totalPriceHigh = data || ''
              validatSection(value, totalPriceHigh, '总金额', cb, false)
            }
          }
        ],
        priceLow: [
          {
            trigger: 'change',
            validator: (rules, value, cb) => {
              const data = this.platformLimitInfo.priceHigh
              const priceHigh = data || ''
              validatSection(value, priceHigh, '单件金额', cb, false)
            }
          }
        ],
        orderFreightLow: [
          {
            trigger: 'change',
            validator: (rules, value, cb) => {
              const data = this.platformLimitInfo.orderFreightHigh
              const orderFreightHigh = data || ''
              validatSection(value, orderFreightHigh, '订单运费', cb, false)
            }
          }
        ],
        priority: [
          {
            required: true,
            trigger: 'change',
            validator: (rules, value, cb) => {
              if (Number(value) < 1 || Number(value) > 99) {
                return cb(new Error('只能输入1~99的数值'))
              }
              return cb()
            }
          }
        ],
        distributionNum: [{
          trigger: 'change',
          validator: (rules, value, cb) => {
            invalidVerification(rules, value, cb, '日分配数')
          }
        }]
      }
    }
  },
  computed: {
    selectAllStore() {
      return this.platformLimitInfo.storeType !== '1'
    }
  },

  created() {
    this.getData()
  },
  methods: {
    allStoreCb(data) {
      const res = data.map(item => {
        return item.tenantId ? {
          platformCode: item.platformCode,
          tenantId: item.tenantId
        } : {
          platformCode: item.platformCode
        }
      }

      )
      this.platformLimitInfo.channelSaleLimitStoreDTOList = res
    },
    changeStoreType(val) {
      this.platformLimitInfo.storeType = val
      val !== '1' && (this.platformLimitInfo.channelSaleLimitStoreDTOList = [])
    },
    storeDTOList(data) {
      const list = data.map(item => ({
        platformCode: item.platformCode,
        tenantId: item.tenantId,
        storeCode: item.storeCode
      }))
      if (this.platformLimitInfo.storeType !== '1') {
        this.platformLimitInfo.channelSaleLimitStoreDTOList = list
      }
    },
    getName() {
      return this.channelObj && this.channelObj[this.platformLimitInfo.channelId]?.name
    },
    getData() {
      Promise.all([
        logisticsChannel(),
        getCountryList(),
        dictionary('online_channel'),
        dictionary('common_store_type'),
        getplatformAllList()
      ]).then(res => {
        this.channelNameList = res[0].data
        this.channelNameList.forEach(item => {
          this.channelObj[item.id] = { code: item.channelCode, name: item.name }
        })
        this.countryList = res[1].data
        this.onlineChannelList = res[2].data
        this.storeTypeList = res[3].data
        this.platformAllList = res[4].data
      })
      this.isAdd && (this.platformLimitInfo.storeType = '1')
      !this.isAdd && this.init()
    },

    init() {
      platformDetail({ id: this.id }).then(res => {
        // 去除多余后端传来的小数点
        const data = res.data
        const operateArray = [
          'totalPriceLow',
          'totalPriceHigh',
          'priceLow', 'priceHigh',
          'orderFreightLow',
          'orderFreightHigh']
        operateArray.forEach(item => {
          data[item] = data[item] ? parseFloat(data[item]) : ''
        })
        data.onlineChannel += ''
        data.storeType += ''

        // 国家数据处理
        const counrtyVos = data.channelSaleLimitCountryVos
        data.countryDTOList = counrtyVos.map(item => item.countryId)
        // 平台数据处理
        const platformVos = data.channelSaleLimitStoreVos
        data.channelSaleLimitStoreDTOList = platformVos
        data.platform = platformVos.map(item => item.platformCode)
        Object.assign(this.platformLimitInfo, data)
      })
    },
    getLabel(item) {
      return `${item.countryNameCn} ${item.countryName}(${item.countryNameShort})`
    },
    getChannelLabel(item) {
      return `${item.name} (${item.channelCode})`
    },
    getStoreLabel(item) {
      return `${item.code} (${item.tenantId})`
    },
    blurCheck(e) {
      if (!e.target.value) {
        this.platformLimitInfo.priority = 1
      }
    },
    close(val) {
      this.$emit('close', val)
    },
    define: function() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          const { countryDTOList, channelId, channelSaleLimitStoreDTOList } = this.platformLimitInfo
          if (!channelSaleLimitStoreDTOList?.length) {
            return this.$message.error('平台店铺不能为空')
          }
          // 处理国家数据
          const channelSaleLimitCountryDTOList = countryDTOList.map(item => ({
            countryId: item,
            countryCode: this.countryList.find(i => i.id === item).countryNameShort,
            countryNameCn: this.countryList.find(i => i.id === item).countryNameCn
          }))
          // 需要channelCode
          const channelCode = this.channelObj[channelId].code
          // data：打包后端要的格式内容
          const data = {
            ...this.platformLimitInfo,
            channelSaleLimitCountryDTOList,
            channelCode
          }
          this.loading = true
          platformSave(data).finally(() => {
            this.loading = false
          }).then(res => {
            this.$message.success('操作成功!')
            this.close(1)
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

    // 复制弹框取消按钮 内容
    cancel(content, isOpen) {
      this[isOpen] = false
      this[content] = ''
    },

    // 国家复制粘贴功能
    copySuccessCountry() {
      const val = this.value
      const label = 'countryDTOList'
      const labelList = ['countryName', 'countryNameCn']
      const allList = this.countryList
      if (this.copyToAdd(val, label, allList, labelList)) {
        this.cancel('value', 'visible')
      }
    },

    closeModal() {
      this.visible = false
    },

    /**
     * 复制粘贴
     * val:复制粘贴的内容
     * label： 复制到的索引的label输入框中
     * allList: 总列表（用于判断输入内容是否有效）
     * labelList:判断条件（与总列表的某个label对上则有效）
     */
    copyToAdd(val, label, allList, labelList) {
      const allCopyArray = []
      const errorList = []
      if (val) {
        const splitArray = val.split(';').filter(item => item)
        splitArray.forEach((item, index) => {
          const data = allList.filter(element => {
            for (let i = 0; i < labelList.length; i++) {
              if (item === element[labelList[i]]) return true
            }
          })
          if (!data.length) {
            errorList.push({
              value: item,
              index: index + 1
            })
            return false
          }
          allCopyArray.push(...data)
        })
        if (errorList.length) {
          let errorMessage = ''
          errorList.forEach(item => {
            errorMessage += `索引为${item.index}的${item.value}无法匹配;  `
          })
          this.$message.error(`${errorMessage}，自动添加失败`)
          return false
        }

        const allCopyId = allCopyArray.map(item => item.id)
        const array = [...allCopyId, ...this.platformLimitInfo[label]]
        this.platformLimitInfo[label] = array
        this.$message.success('操作成功')
        return true
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.redStar{
  color: red;
  font-size: 12px;
}
.platformAddLimit{
  &.basic-container{
    min-width:1000px!important;
      .el-input{
      width:87%!important;
      &.small{
        width:30%!important;
      }
    }
    .el-select{
        width: 87%!important;
    }
  }
}
.g-select {
  width:87%!important;
}

::v-deep .country .el-input--suffix .el-input__inner,
::v-deep .store .el-input--suffix .el-input__inner
 {
    padding-left: 30px!important;
}

::v-deep .country .el-select__tags,
::v-deep .store .el-select__tags{
  margin-left:20px!important;
}
.myicon{
    height: 100%;
    width: 30px;
    color: #C0C4CC;
    position: absolute;
    left:0px;
    font-size:14px;
    top:10px;
    text-align: center;
    -webkit-transition: all .3s;
    transition: all .3s;
}
.el-card__body {
  padding: 10px!important;
}
.el-row:last-child ::v-deep .el-form-item{
  margin-bottom:0px!important;
}
</style>
