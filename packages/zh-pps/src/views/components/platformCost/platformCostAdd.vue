<template>
  <basic-container v-loading="loading">
    <el-card class="cardBox">
      <div slot="header" style="height:20px;line-height:20px;">
        <span style="font-weight: 600;">基本信息</span>
        <div style="float: right">
          <el-button size="mini" type="primary" @click="$emit('close')">返回</el-button>
          <el-button size="mini" type="primary" @click="define">保存</el-button>
        </div>
      </div>
      <el-form ref="rulesForm" :model="openData" size="mini" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item prop="platformCode" label="平台名称" :rules="{ required: true, message: '请选择平台名称', trigger: 'change' }">
              <el-select v-model="openData.platformCode" :disabled="!isAdd" clearable placeholder="请选择" filterable style="width:50%" @change="platformChange">
                <el-option v-for="item in platformList" :key="item.id" :label="item.platformName" :value="item.platformCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="platformSiteIdArr" label="经营站点" :rules="{ required: true, message: '请选择经营站点', trigger: 'change' }">
              <el-select v-model="openData.platformSiteIdArr" :disabled="!isAdd" multiple clearable placeholder="请选择" filterable style="width:50%">
                <el-option v-for="item in platformSiteList" :key="item.id" :label="item.siteCode" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item prop="storeLevelIdArr" label="平台店铺级别">
              <el-select v-model="openData.storeLevelIdArr" multiple clearable placeholder="请选择" filterable style="width:50%" @change="$forceUpdate()">
                <el-option v-for="item in storeLevelList" :key="item.storeLevelId" :label="item.storeLevelName" :value="item.storeLevelId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="storeCodeArr" label="店铺编码">
              <el-select v-model="openData.storeCodeArr" multiple clearable placeholder="请选择" filterable style="width:50%" @change="$forceUpdate()">
                <el-option v-for="item in storeCodeList" :key="item.id" :label="item.storeCode" :value="item.storeCode" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--  基础费用配置    -->
      <el-form ref="rulesForm" :model="baseCostConfig" size="mini" label-width="100px" label-position="left">
        <el-row :gutter="10">
          <el-col :span="18">
            <el-form-item prop="platformCostConfig">
              <el-checkbox slot="label" v-model="baseCostConfig.platformCostConfig.checked">{{ baseCostConfig.platformCostConfig.costName }}</el-checkbox>
              <el-select v-model="baseCostConfig.platformCostConfig.costType" placeholder="请选择" filterable style="width:12%" @change="$forceUpdate()">
                <el-option v-for="item in costTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
              <el-input v-model="baseCostConfig.platformCostConfig.costValue" v-input.positive style="width:20%" @input="changePlatformCostValue" />
              <el-select v-if="baseCostConfig.platformCostConfig.costType === '1'" v-model="baseCostConfig.platformCostConfig.costCurrency" placeholder="请选择" filterable style="width:10%" @change="$forceUpdate()">
                <el-option v-for="item in costCurrencyList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
              <span v-if="baseCostConfig.platformCostConfig.costType === '2'">%</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="18">
            <el-form-item prop="paypalCostConfig">
              <el-checkbox slot="label" v-model="baseCostConfig.paypalCostConfig.checked">{{ baseCostConfig.paypalCostConfig.costName }}</el-checkbox>
              <el-select v-model="baseCostConfig.paypalCostConfig.costType" placeholder="请选择" filterable style="width:12%" @change="$forceUpdate()">
                <el-option v-for="item in costTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
              <el-input v-model="baseCostConfig.paypalCostConfig.costValue" v-input.positive style="width:20%" @input="changePaypalCostValue" />
              <el-select v-if="baseCostConfig.paypalCostConfig.costType === '1'" v-model="baseCostConfig.paypalCostConfig.costCurrency" placeholder="请选择" filterable style="width:10%" @change="$forceUpdate()">
                <el-option v-for="item in costCurrencyList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
              <span v-if="baseCostConfig.paypalCostConfig.costType === '2'">%</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="18">
            <el-form-item prop="publishCostConfig">
              <el-checkbox slot="label" v-model="baseCostConfig.publishCostConfig.checked">{{ baseCostConfig.publishCostConfig.costName }}</el-checkbox>
              <el-select v-model="baseCostConfig.publishCostConfig.costType" placeholder="请选择" filterable style="width:12%" @change="$forceUpdate()">
                <el-option v-for="item in costTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
              <el-input v-model="baseCostConfig.publishCostConfig.costValue" v-input.positive style="width:20%" @input="changePublishCostValue" />
              <el-select v-if="baseCostConfig.publishCostConfig.costType === '1'" v-model="baseCostConfig.publishCostConfig.costCurrency" placeholder="请选择" filterable style="width:10%" @change="$forceUpdate()">
                <el-option v-for="item in costCurrencyList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
              <span v-if="baseCostConfig.publishCostConfig.costType === '2'">%</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="18">
            <el-form-item prop="manageCostConfig">
              <el-checkbox slot="label" v-model="baseCostConfig.manageCostConfig.checked">{{ baseCostConfig.manageCostConfig.costName }}</el-checkbox>
              <el-select v-model="baseCostConfig.manageCostConfig.costType" placeholder="请选择" filterable style="width:12%" @change="$forceUpdate()">
                <el-option v-for="item in costTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
              <el-input v-model="baseCostConfig.manageCostConfig.costValue" v-input.positive style="width:20%" @input="changeManageCostValue" />
              <el-select v-if="baseCostConfig.manageCostConfig.costType === '1'" v-model="baseCostConfig.manageCostConfig.costCurrency" placeholder="请选择" filterable style="width:10%" @change="$forceUpdate()">
                <el-option v-for="item in costCurrencyList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
              <span v-if="baseCostConfig.manageCostConfig.costType === '2'">%</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="18">
            <el-form-item prop="platformReturnCostConfig">
              <el-checkbox slot="label" v-model="baseCostConfig.platformReturnCostConfig.checked">{{ baseCostConfig.platformReturnCostConfig.costName }}</el-checkbox>
              <el-select v-model="baseCostConfig.platformReturnCostConfig.costType" placeholder="请选择" filterable style="width:12%" @change="$forceUpdate()">
                <el-option v-for="item in costTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
              <el-input v-model="baseCostConfig.platformReturnCostConfig.costValue" v-input.positive style="width:20%" @input="changeReturnCostValue" />
              <el-select v-if="baseCostConfig.platformReturnCostConfig.costType === '1'" v-model="baseCostConfig.platformReturnCostConfig.costCurrency" placeholder="请选择" filterable style="width:10%" @change="$forceUpdate()">
                <el-option v-for="item in costCurrencyList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
              <span v-if="baseCostConfig.platformReturnCostConfig.costType === '2'">%</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">自定义成本</span>
        <div style="float: right">
          <el-button size="mini" type="primary" @click="addCustomCost()">新增</el-button>
        </div>
      </div>
      <el-table :data="openData.customCostConfigList" size="mini" max-height="400px" stripe style="width: 100%" border>
        <el-table-column prop="categoryName" label="产品类目" align="center" min-width="80" />
        <el-table-column prop="productName" label="产品名称" align="center" min-width="100" />
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="200" />
        <el-table-column prop="costName" label="费用名称" align="center" min-width="150" />
        <el-table-column prop="costTypeName" label="费用类型" align="center" min-width="150" show-overflow-tooltip />
        <el-table-column prop="costValueShow" label="费用值" align="center" min-width="100" />
        <el-table-column label="操作" align="center" fixed="right" min-width="150">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="addCustomCost(scope.row, scope.$index)">编辑</el-button>
            <el-button type="text" size="mini" @click="removeBtn(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </basic-container>
</template>

<script>
import { getStoreInfoByPlatformCode } from '@/api/commonApi.js'
import platformCustomCostAdd from './platformCustomCostAdd.vue'
import { save, update, getDetail } from '@/api/platform/platform-cost'
export default {
  name: 'PlatformCostAdd',
  props: {
    costTypeList: Array,
    costCurrencyList: Array,
    platformList: Array,
    isAdd: Boolean,
    editData: Object
  },
  data() {
    return {
      isCustomCostAdd: true,
      loading: false,
      platformSiteList: [],
      storeLevelList: [],
      storeCodeList: [],
      openData: {
        platformSiteIdArr: [],
        storeLevelIdArr: [],
        storeCodeArr: [],
        platformCode: '',
        storeSiteId: '',
        storeLevelId: '',
        storeCode: '',
        customCostConfigList: [],
        baseCostConfigList: []
      },
      baseCostConfig: {
        platformCostConfig: {
          platformCostType: 0,
          checked: false,
          costName: '平台佣金',
          costType: '1',
          costValue: '',
          costCurrency: '1'
        },
        paypalCostConfig: {
          platformCostType: 0,
          checked: false,
          costName: 'PayPal费',
          costType: '1',
          costValue: '',
          costCurrency: '1'
        },
        publishCostConfig: {
          platformCostType: 0,
          checked: false,
          costName: '刊登费',
          costType: '1',
          costValue: '',
          costCurrency: '1'
        },
        manageCostConfig: {
          platformCostType: 0,
          checked: false,
          costName: '管理费',
          costType: '1',
          costValue: '',
          costCurrency: '1'
        },
        platformReturnCostConfig: {
          platformCostType: 0,
          checked: false,
          costName: '平台退款',
          costType: '1',
          costValue: '',
          costCurrency: '1'
        }
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    if (!this.isAdd) {
      this.editInit()
    }
  },
  methods: {
    //   获取信息
    getData() {
    },
    platformChange(val) {
      // 重置当前平台带出的数据
      this.platformSiteList = []
      this.storeLevelList = []
      this.storeCodeList = []
      this.platformList.forEach(item => {
        if (item.platformCode === val) {
          if (item.sites) {
            this.platformSiteList = item.sites
          } else {
            this.$message.error('当前平台无站点！')
          }
        }
      })
      getStoreInfoByPlatformCode(val).then(res => {
        if (res.code === 200) {
          const data = res.data
          data.forEach(item => {
            if (item.storeLevelId === -1) {
            } else {
              this.storeLevelList.push(item)
            }
            this.storeCodeList.push(item)
          })
          // 去重
          this.storeLevelList = this.unique(this.storeLevelList)
        } else {
          this.$message.error('平台店铺等级获取失败！')
        }
      })
    },
    removeBtn(index) {
      this.openData.customCostConfigList.splice(index, 1)
    },
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          this.openData.baseCostConfigList = []
          this.openData.storeSiteId = this.convertArr2Str(this.openData.platformSiteIdArr)
          if (this.openData.storeLevelIdArr === undefined) {
            this.openData.storeLevelId = ''
          } else {
            this.openData.storeLevelId = this.convertArr2Str(this.openData.storeLevelIdArr)
          }
          if (this.openData.storeCodeArr === undefined) {
            this.openData.storeCode = ''
          } else {
            this.openData.storeCode = this.convertArr2Str(this.openData.storeCodeArr)
          }
          // 处理基础费用为List给后端
          for (const argumentsKey in this.baseCostConfig) {
            if (this.baseCostConfig[argumentsKey].checked) {
              // 验证选中的value不能为空
              if (this.baseCostConfig[argumentsKey].costValue.length < 1) {
                this.$message.error('选中的【' + this.baseCostConfig[argumentsKey].costName + '】没有填值！')
                return
              }
              if (this.baseCostConfig[argumentsKey].costValue.length > 12) {
                this.$message.error('选中的【' + this.baseCostConfig[argumentsKey].costName + '】值超出范围！')
                return
              }
              // 选的百分比时，默认赋值
              if (this.baseCostConfig[argumentsKey].costType === '2') {
                this.baseCostConfig[argumentsKey].costCurrency = null
              }
              this.openData.baseCostConfigList.push(this.baseCostConfig[argumentsKey])
            }
          }
          if (this.isAdd) {
            // 判断是否存在站点信息以及站点信息是否选择
            if (!this.openData.platformSiteIdArr || this.openData.platformSiteIdArr.length === 0) {
              if (this.platformSiteList !== undefined && this.platformSiteList.length > 0) {
                this.$message.error('请选择站点信息')
                return
              }
            }
            save(this.openData).then(res => {
              if (res.code === 200) {
                this.$emit('close')
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              } else {
                this.$message.error('保存失败')
              }
            })
          } else {
            update(this.openData).then(res => {
              if (res.code === 200) {
                this.$emit('close')
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              } else {
                this.$message.error('更新失败')
              }
            })
          }
        }
      })
    },
    // 编辑初始化
    editInit() {
      this.loading = true
      getDetail(this.editData.id).then(res => {
        const data = res.data
        this.platformChange(data.platformCode)
        this.openData = JSON.parse(JSON.stringify(data))
        this.openData.platformSiteIdArr = this.openData.storeSiteId.split(',')
        if (this.openData.storeLevelId.length > 0) {
          this.openData.storeLevelIdArr = this.openData.storeLevelId.split(',')
        }
        if (this.openData.storeCode.length > 0) {
          this.openData.storeCodeArr = this.openData.storeCode.split(',')
        }

        // 设置基础费用的页面数据对象 baseCostConfig
        if (this.openData.baseCostConfigList) {
          this.openData.baseCostConfigList.forEach(item => {
            for (const argumentsKey in this.baseCostConfig) {
              if (this.baseCostConfig[argumentsKey].costName === item.costName) {
                this.baseCostConfig[argumentsKey] = item
                if (this.baseCostConfig[argumentsKey].costCurrency === null) {
                  this.baseCostConfig[argumentsKey].costCurrency = '1'
                } else {
                  this.baseCostConfig[argumentsKey].costCurrency = this.baseCostConfig[argumentsKey].costCurrency + ''
                }
                this.baseCostConfig[argumentsKey].costType = this.baseCostConfig[argumentsKey].costType + ''
                // this.baseCostConfig[argumentsKey].checked = true
                this.$set(this.baseCostConfig[argumentsKey], 'checked', true)
                break
              }
            }
          })
        }
        this.openData.customCostConfigList.forEach(item => {
          if (item.costType === 1) {
            item.costValueShow = item.costValue + ' ' + item.costCurrencyName
          } else if (item.costType === 2) {
            item.costValueShow = item.costValue + ' %'
          }
        })
        this.loading = false
      })
    },
    addCustomCost(val, index) {
      console.log('openData', val)
      if (val) {
        this.isCustomCostAdd = false
      } else {
        this.isCustomCostAdd = true
      }
      this.$modal({
        title: (this.isCustomCostAdd ? '新增自定义成本' : '编辑自定义成本'),
        component: platformCustomCostAdd,
        width: '40%',
        data: {
          costTypeList: this.costTypeList,
          costCurrencyList: this.costCurrencyList,
          isAdd: this.isCustomCostAdd,
          openData: this.isCustomCostAdd ? {
            categoryId: '',
            productSku: '',
            costName: '',
            costType: '1',
            costValue: '',
            costCurrency: '1',
            costTypeName: '',
            costCurrencyName: ''
          } : val
        },
        callback: (bool) => {
          if (bool) {
            if (this.isCustomCostAdd) {
              this.openData.customCostConfigList.push(bool)
            } else {
              val = bool
              this.openData.customCostConfigList.splice(index, 1)
              this.openData.customCostConfigList.push(bool)
            }
            this.openData.customCostConfigList.forEach(item => {
              if (item.costType === '1') {
                item.costValueShow = item.costValue + ' ' + item.costCurrencyName
              } else if (item.costType === '2') {
                item.costValueShow = item.costValue + ' %'
              }
            })
          }
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.storeLevelId) && res.set(arr.storeLevelId, 1))
    },
    convertArr2Str(arr) {
      let str = ''
      arr.forEach((item, index) => {
        if (index === 0) {
          str = item
        } else {
          str = str + ',' + item
        }
      })
      return str
    },
    changePlatformCostValue(val) {
      if (val.indexOf('.') !== -1 && val.split('.')[1].length > 2) {
        this.baseCostConfig.platformCostConfig.costValue = this.oldValue
      } else {
        this.oldValue = val
      }
    },
    changePaypalCostValue(val) {
      if (val.indexOf('.') !== -1 && val.split('.')[1].length > 2) {
        this.baseCostConfig.paypalCostConfig.costValue = this.oldValue
      } else {
        this.oldValue = val
      }
    },
    changePublishCostValue(val) {
      if (val.indexOf('.') !== -1 && val.split('.')[1].length > 2) {
        this.baseCostConfig.publishCostConfig.costValue = this.oldValue
      } else {
        this.oldValue = val
      }
    },
    changeManageCostValue(val) {
      if (val.indexOf('.') !== -1 && val.split('.')[1].length > 2) {
        this.baseCostConfig.manageCostConfig.costValue = this.oldValue
      } else {
        this.oldValue = val
      }
    },
    changeReturnCostValue(val) {
      if (val.indexOf('.') !== -1 && val.split('.')[1].length > 2) {
        this.baseCostConfig.platformReturnCostConfig.costValue = this.oldValue
      } else {
        this.oldValue = val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  *{
    font-size: 12px;
  }
  .header{
    height: 50px;
    line-height: 50px;
  }
  ::v-deep .el-form-item{
    margin-bottom: 10px!important;
  }
  .redStar{
    color: red;
    font-size: 12px;
  }
  .cardBox{
    ::v-deep .el-card__body{
      padding-bottom: 0;
    }
  }
  .hiddenWord{
    display: -webkit-box;
    overflow: hidden;
    white-space: normal !important;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
  }
  .btnBox{
    ::v-deep .el-form-item__content{
      margin-left: 20px!important;
    }
    .btn{
      width: 30%;
    }
  }
  ::v-deep .el-dialog__body{
    padding-top: 10px;
    padding-bottom: 40px;
  }
  .file{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
</style>
