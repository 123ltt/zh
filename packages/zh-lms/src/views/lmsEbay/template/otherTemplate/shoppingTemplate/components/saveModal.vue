<template>
  <basic-container style="min-width: 0">
    <el-form ref="dialogForm" :model="formObj" size="mini" label-width="95px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="policyName" class="mb-3">
            <div class="d-flex">
              <el-input v-model="formObj.policyName" class="pe-3" maxlength="50" />
              <el-checkbox v-model="formObj.isDefault">设置为刊登默认运输模板</el-checkbox>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="刊登站点" prop="siteCode">
            <el-select v-model="formObj.siteCode" filterable clearable placeholder="请选择刊登站点" class="w-100" @change="chagneSiteCode($event, true)">
              <el-option v-for="item in siteOption" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="店铺" prop="storeCode">
            <el-select v-model="formObj.storeCode" filterable clearable placeholder="请选择店铺" style="width: 100%">
              <el-option v-for="item in storeOption" :key="item.hiddenValue" :label="item.displayName" :value="item.candidateDisplayName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板类型" prop="policyInfo.warehouseId">
            <el-select v-model="formObj.policyInfo.warehouseId" filterable clearable placeholder="请选择模板类型" class="w-100" @change="changeWarehouseId">
              <el-option v-for="(v,keys,index) in constList.businessPolicyShippingType" :key="index" :label="v" :value="keys" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品所在地" prop="policyInfo.listingLocation">
            <el-input v-model="formObj.policyInfo.listingLocation" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="国家或地区" prop="policyInfo.countryOrRegion">
            <el-select v-model="formObj.policyInfo.countryOrRegion" filterable clearable placeholder="请选择国家或地区" class="w-100">
              <el-option v-for="item in countryOption" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮编" prop="policyInfo.postCode">
            <el-input v-model="formObj.policyInfo.postCode" maxlength="10" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处理时间" prop="policyInfo.dispatchTimeMax">
            <el-select v-model="formObj.policyInfo.dispatchTimeMax" filterable clearable placeholder="请选择处理时间" style="width:80%;margin-right:10px">
              <el-option v-for="item in dispatchTimeMaxOption" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>工作日
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="国内运输">
            <div class="config-values">
              <el-row :gutter="5" class="config-title-row">
                <el-col :span="7">运输方式</el-col>
                <el-col :span="5">运费</el-col>
                <el-col :span="5">额外每件加收</el-col>
                <el-col :span="3">是否免运费</el-col>
                <el-col :span="3">操作</el-col>
              </el-row>
              <el-row v-for="(item, i) in formObj.policyInfo.domesticInfo" :key="i" :gutter="5" style="margin-bottom:4px;">
                <el-col :span="7">
                  <el-form-item :prop="'policyInfo.domesticInfo.'+ i +'.shippingService'"
                                :rules="{ required: true, message: '运输方式不能为空', trigger: 'blur'}"
                  >
                    <el-select v-model="item.shippingService" filterable style="width:100%" clearable>
                      <el-option v-for="(list,index) in shippingServiceDetails" :key="index" :label="list.name" :value="list.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item :prop="'policyInfo.domesticInfo.'+ i +'.freight'"
                                :rules="item.shippingService?{
                                  required: true, message: '运费不能为空', trigger: 'blur'
                                }:{required:false}"
                  >
                    <el-input
                      v-model="item.freight"
                      v-input.positive
                      :disabled="item.isFree"
                      size="mini"
                      type="text"
                      @input="() => { item.freight = toFixed2(item.freight) }"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item :prop="'policyInfo.domesticInfo.'+ i +'.freightAdditional'">
                    <el-input
                      v-model="item.freightAdditional"
                      v-input.positive
                      :disabled="item.isFree"
                      @input="() => { item.freightAdditional = toFixed2(item.freightAdditional) }"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-checkbox v-model="item.isFree" @change="(value) =>changeIsFree(value,i,'domesticInfo')">{{ item.isFree?'是':'否' }}</el-checkbox>
                </el-col>
                <el-col :span="3">
                  <el-button icon="el-icon-plus" circle size="mini" @click="addInfo('domesticInfo')" />
                  <el-button icon="el-icon-minus" circle size="mini" :disabled="!disabledDelBtn" @click="delInfo('domesticInfo',i)" />
                </el-col>
              </el-row>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="国际运输">
            <div class="config-values">
              <el-row :gutter="5" class="config-title-row">
                <el-col :span="7">运输方式</el-col>
                <el-col :span="5">运费</el-col>
                <el-col :span="5">额外每件加收</el-col>
                <!-- <el-col :span="3">是否免运费</el-col> -->
                <el-col :span="4">操作</el-col>
              </el-row>
              <div v-for="(item, i) in formObj.policyInfo.intlInfo" :key="i">
                <el-row :gutter="5" style="margin-bottom:4px;">
                  <el-col :span="7">
                    <el-form-item :prop="'policyInfo.intlInfo.'+ i +'.shippingService'">
                      <el-select v-model="item.shippingService" filterable style="width:100%" clearable>
                        <el-option v-for="(citem,index) in shippingInternationalServiceDetails" :key="index" :label="citem.name" :value="citem.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item :prop="'policyInfo.intlInfo.'+ i +'.freight'"
                                  :rules="item.shippingService?{
                                    required: true, message: '运费不能为空', trigger: 'blur'
                                  }:{required:false}"
                    >
                      <el-input v-model="item.freight" v-input.positive :disabled="item.isFree" size="mini" @input="() => { item.freight = toFixed2(item.freight) }" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item :prop="'policyInfo.intlInfo.'+ i +'.freightAdditional'">
                      <el-input v-model="item.freightAdditional" v-input.positive :disabled="item.isFree" size="mini" @input="() => { item.freightAdditional = toFixed2(item.freightAdditional) }" />
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="3">
                    <el-checkbox v-model="item.isFree" class="margin-left:20px" @change="(value) =>changeIsFree(value,i,'intlInfo')">{{ item.isFree?'是':'否' }}</el-checkbox>
                  </el-col> -->
                  <el-col :span="4">
                    <el-button icon="el-icon-plus" circle size="mini" @click="addInfo('intlInfo')" />
                    <el-button icon="el-icon-minus" circle size="mini" :disabled="!disabledDelBtn" @click="delInfo('intlInfo',i)" />
                  </el-col>
                </el-row>
                <div>
                  <span>运输地区</span>
                  <el-checkbox v-model="item.isALLCheckShoppingLocation" style="margin-left:10px" :indeterminate="isIndeterminate" @change="(value)=>changeAllCheck(value, i)">全选</el-checkbox>
                </div>
                <el-form-item :prop="'policyInfo.intlInfo.'+ i +'.shipToLocation'"
                              :rules="item.shippingService?{
                                required: true, message: '运输地区不能为空', trigger: 'change'
                              }:{required:false}"
                >
                  <el-checkbox-group v-model="item.shipToLocation" @change="(value)=>handleCheckedLocation(value,i)">
                    <el-checkbox v-for="citem in shoppingLocationDetails" :key="citem.name" :label="citem.value">{{ citem.name }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="text-end">
        <el-button size="mini" @click="$parent.$emit('close')">取消</el-button>
        <el-button type="primary" size="mini" :disabled="row ? submitBtnEnable : false" @click="submitDialog('dialogForm')">保存</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { addPolicyTemplate, editPolicyTemplate, getShoppingItems } from '@/api/ebay/template.js'
import { toFixed2 } from '@/views/lmsAmazon/amazon/components/addListing.handle.js'

import { deepClone } from '@/util/util'
const Info = () => {
  return {
    shippingService: '',
    shippingItemType: '',
    freight: '',
    freightAdditional: '',
    isFree: false,
    isALLCheckShoppingLocation: false,
    shipToLocation: []
  }
}
export default {
  name: 'SaveModal',
  props: {
    storeOption: {
      type: Array
    },
    row: {
      type: Object
    },
    siteOption: {
      type: Array
    },
    constList: {
      type: Object
    }
  },
  data() {
    return {
      toFixed2,
      formObj: {
        policyType: 'SHIPPING',
        isDefault: false,
        policyInfo: {
          domesticInfo: [Info()],
          intlInfo: [Info()]
        }
      },
      isIndeterminate: true,
      shoppingItem: Info(),
      oldForm: {},
      isBoolean: true,
      countryOption: [], // 国家地区
      shippingServiceDetails: [],
      shippingServiceDetailsTemp: [],
      shippingInternationalServiceDetails: [], // 国际运输方式
      shippingInternationalServiceDetailsTemp: [], // 国际运输方式副本
      shoppingLocationDetails: [],
      dispatchTimeMaxOption: [],
      rules: {
        policyName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        siteCode: [{ required: true, message: '请选择刊登站点', trigger: 'change' }],
        'policyInfo.warehouseId': [{ required: true, message: '请选择模板类型', trigger: 'change' }],
        'policyInfo.listingLocation': [{ required: true, message: '请输入商品所在地', trigger: 'blur' }],
        'policyInfo.countryOrRegion': [{ required: true, message: '请选择国家或地区', trigger: 'change' }],
        'policyInfo.dispatchTimeMax': [{ required: true, message: '请输入处理时间', trigger: 'blur' }]
      }
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.formObj))
    },
    disabledDelBtn() {
      return this.formObj.policyInfo.intlInfo.length > 1 || this.formObj.policyInfo.domesticInfo.length > 1
    }
  },
  created() {
    if (this.row) { // 编辑
      this.row.policyInfo.dispatchTimeMax = this.row.policyInfo.dispatchTimeMax + ''
      if (!this.row.policyInfo.domesticInfo.length) {
        this.row.policyInfo.domesticInfo.push(Info())
      }
      if (!this.row.policyInfo.intlInfo.length) {
        this.row.policyInfo.intlInfo.push(Info())
      }
      this.formObj = deepClone(this.row)
      this.oldForm = deepClone(this.row)
    }
  },
  mounted() {
    this.row && this.chagneSiteCode()
  },
  methods: {
    changeIsFree(val, index, type) {
      if (val) {
        this.formObj.policyInfo[type][index].freight = '0.00'
        this.formObj.policyInfo[type][index].freightAdditional = '0.00'
      } else {
        this.formObj.policyInfo[type][index].freight = ''
        this.formObj.policyInfo[type][index].freightAdditional = ''
      }
    },
    changeWarehouseId(val) {
      if (val === 'FIVE_UP_DOMESTIC') {
        this.shippingServiceDetails = this.shippingServiceDetails.filter(item => item.value.includes('SppedPAK'))
        this.shippingInternationalServiceDetails = this.shippingInternationalServiceDetails.filter(item => item.value.includes('SppedPAK'))
      } else {
        this.shippingServiceDetails = deepClone(this.shippingServiceDetailsTemp)
        this.shippingInternationalServiceDetails = deepClone(this.shippingInternationalServiceDetailsTemp)
      }
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formObj.policyInfo.domesticInfo.forEach((item, index) => {
            if (item.shippingService === '') {
              this.formObj.policyInfo.domesticInfo.splice(index, 1)
            }
          })
          this.formObj.policyInfo.intlInfo.forEach((item, index) => {
            if (item.shippingService === '') {
              this.formObj.policyInfo.intlInfo.splice(index, 1)
            }
          })
          this.formObj.policyName = this.formObj.policyName.trim()
          if (this.row && this.row.id) { // 修改
            editPolicyTemplate({ ...this.formObj }).then((res) => {
              this.$message.success('修改成功')
              this.$parent.$emit('close', true)
            })
          } else { // 添加
            addPolicyTemplate({ ...this.formObj }).then((res) => {
              this.$message.success('添加成功')
              this.$parent.$emit('close', true)
            }, (error) => {
              if (!this.formObj.policyInfo.intlInfo.length) {
                this.addInfo('intlInfo')
              }
              if (!this.formObj.policyInfo.domesticInfo.length) {
                this.addInfo('domesticInfo')
              }
              return error
            })
          }
        } else {
          return false
        }
      })
    },
    // 全选
    changeAllCheck(val, index) {
      if (val) {
        this.formObj.policyInfo.intlInfo[index].shipToLocation = this.shoppingLocationDetails.filter(item => item.value).map(acc => acc.value)
      } else {
        this.formObj.policyInfo.intlInfo[index].shipToLocation = []
      }
      this.isIndeterminate = false
    },
    // 运输地区change
    handleCheckedLocation(value, index) {
      const checkedCount = value.length
      this.formObj.policyInfo.intlInfo[index].isALLCheckShoppingLocation = checkedCount === this.shoppingLocationDetails.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.shoppingLocationDetails.length
    },
    chagneSiteCode(e, isEditChange) {
      if (isEditChange) { // 切换站点 清空国内/国际运输方式和运输地区
        this.formObj.policyInfo = Object.assign(this.formObj.policyInfo, {
          domesticInfo: [Info()],
          intlInfo: [Info()]
        })
      }
      if (this.isBoolean) {
        this.isBoolean = false
        for (const i in this.constList.shippingItemType) {
          this.getShoppingItems(i)
        }
      } else {
        this.getShoppingItems('ShippingServiceDetails')
        this.getShoppingItems('ShippingLocationDetails')
      }
      this.getShoppingItems('ShippingServiceDetails', true)
    },
    addInfo(info) {
      const obj = deepClone(this.shoppingItem)
      if (info === 'intlInfo' && this.formObj.policyInfo[info].length <= 4) {
        this.formObj.policyInfo[info].push(obj)
      }
      if (info === 'domesticInfo') {
        this.formObj.policyInfo[info].push(obj)
      }
    },
    delInfo(info, index) {
      if (this.formObj.policyInfo[info].length !== 1) {
        this.formObj.policyInfo[info].splice(index, 1)
      }
    },
    getShoppingItems(itemType, international = false) {
      const formObj = this.formObj
      getShoppingItems({ siteCode: formObj.siteCode, storeAccount: formObj.storeCode, itemType: itemType, international: international }).then(res => {
        const data = res.data
        if (itemType === 'CountryDetails') { // 国家
          this.countryOption = data.sort((a, b) => a.name.localeCompare(b.name))
        } else if (itemType === 'ShippingServiceDetails' && !international) { // 国内运输方式
          this.shippingServiceDetails = data.sort((a, b) => a.name.localeCompare(b.name))
          this.shippingServiceDetailsTemp = data.sort((a, b) => a.name.localeCompare(b.name))
        } else if (itemType === 'ShippingServiceDetails' && international) { // 国际运输方式
          this.shippingInternationalServiceDetails = data.sort((a, b) => a.name.localeCompare(b.name))
          this.shippingInternationalServiceDetailsTemp = data.sort((a, b) => a.name.localeCompare(b.name))
        } else if (itemType === 'ShippingLocationDetails') { // 运输地区
          this.shoppingLocationDetails = data
        } else { // 处理时间
          this.dispatchTimeMaxOption = data
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.config-values{
  border-radius:6px;
  padding:6px;
  border: 1px solid #ddd;
  .el-form-item--mini.el-form-item{
    margin-bottom: 0;
  }
}
</style>
