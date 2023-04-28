<template>
  <div>
    <basic-container>
      <el-row>
        <el-button v-if="$auth('oms_plat_import_import')" type="primary" size="mini" @click="orderModal">订单导入</el-button>
        <el-button v-if="$auth('oms_plat_import_rich')" type="primary" size="mini" @click="orderPlump">从原订单丰富</el-button>
      </el-row>
      <el-row>
        <el-col>
          <el-button type="text">订单信息</el-button>
          <el-form ref="formData1" :model="formData" size="mini" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="平台订单号" prop="platOrderId">
                  <el-input v-model="formData.platOrderId" maxlength="24" />
                </el-form-item></el-col>
              <el-col :span="6">
                <el-form-item label="交易号" prop="transactionId">
                  <el-input v-model="formData.transactionId" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="原单号" prop="sourceOrderId">
                  <el-input v-model="formData.sourceOrderId" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="买家账号" prop="buyerId">
                  <el-input v-model="formData.buyerId" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="截止发货时间" prop="deliveryDeadline">
                  <el-date-picker
                    v-model="formData.deliveryDeadline"
                    class="width-100"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择时间"
                    default-time="23:59:59"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="跟踪号" prop="platTrackingNo">
                  <el-input v-model="formData.platTrackingNo" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="销售平台" prop="platformCode">
                  <el-select
                    v-model="formData.platformCode"
                    clearable
                    filterable
                    style="width:100%;"
                    placeholder="请选择销售平台"
                    @change="()=>formData.storeCode = ''"
                  >
                    <el-option
                      v-for="item in platformList"
                      :key="item.platformCode"
                      :value="item.platformCode"
                      :label="item.platformName"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="销售店铺"
                  prop="storeCode"
                >
                  <el-select
                    v-model="formData.storeCode"
                    clearable
                    filterable
                    :disabled="formData.platformCode.length===0"
                    placeholder="请选择销售店铺"
                    class="width-100"
                    size="mini"
                  >
                    <el-option
                      v-for="(item,index) in storeList"
                      :key="index"
                      :label="item.displayName"
                      :value="item.candidateDisplayName"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-row type="flex" class="row-bg" justify="space-between">
            <el-button type="text">商品信息</el-button>
            <el-button type="text" @click="addProduct">增加产品</el-button>
          </el-row>
          <el-table :data="formData.goodList" border class="g-table">
            <el-table-column label="序号" width="50" type="index" />
            <el-table-column label="缩略图">
              <template slot-scope="scope">
                <g-thumb :url="scope.row.productImgUrl" />
              </template>
            </el-table-column>
            <el-table-column label="SKU" prop="sellerSku" />
            <el-table-column label="SKU前后缀" prop="skuAffix" />
            <el-table-column label="产品名称" prop="productName">
              <template slot-scope="scope">
                <g-text-ellipsis :max-length="20">{{ scope.row.productName }}</g-text-ellipsis>
              </template>
            </el-table-column>
            <el-table-column label="销售单价" prop="productSalePrice">
              <template slot-scope="scope">
                {{ Number(scope.row.productSalePrice).toFixed(2) }} {{ scope.row.productSaleCurrency }}
              </template>
            </el-table-column>
            <el-table-column label="销售数量" prop="productQuantity" />
            <el-table-column label="销售金额" prop="productSaleMoney">
              <template slot-scope="scope">
                {{ Number(scope.row.productSaleMoney).toFixed(2) }} {{ scope.row.productSaleCurrency }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="proChange(scope.row,scope.$index)">修改</el-button>
                <el-button type="text" @click="proDel(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-button type="text">地址信息</el-button>
          <el-form ref="formData2" :model="formData" :rules="rules" size="mini" label-width="80px" :disabled="disabled">
            <el-row>
              <el-col :span="6">
                <el-form-item label="收件人" prop="receiveFullName">
                  <el-input v-model="formData.receiveFullName" />
                </el-form-item></el-col>
              <el-col :span="6">
                <el-form-item label="国家" prop="countryName">
                  <el-select v-model="formData.countryName" filterable clearable class="width-100" @change="countryCodeChange">
                    <el-option v-for="(item,index) in countryList" :key="index" :label="item.countryCn" :value="item.countryCode" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="国家简称" prop="receiveCountryCode">
                  <el-input v-model="formData.receiveCountryCode" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="邮编" prop="receiveZip">
                  <el-input v-model="formData.receiveZip" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="固定电话" prop="phoneNumber">
                  <el-input v-model="formData.phoneNumber" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="移动电话" prop="mobileNo">
                  <el-input v-model="formData.mobileNo" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="邮箱" prop="receiveEmail">
                  <el-input v-model="formData.receiveEmail" />
                </el-form-item></el-col>
              <el-col :span="6">
                <el-form-item label="社交账号" prop="socialContact">
                  <el-input v-model="formData.socialContact" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="省/州" prop="receiveDeltaProvince">
                  <el-input v-model="formData.receiveDeltaProvince" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="城市" prop="receiveCity">
                  <el-input v-model="formData.receiveCity" />
                </el-form-item></el-col>
              <el-col :span="6">
                <el-form-item label="税号" prop="taxNumber">
                  <el-input v-model="formData.taxNumber" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="地址一" prop="receiveAddressOne">
                  <el-input v-model="formData.receiveAddressOne" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="地址二" prop="receiveAddressTwo">
                  <el-input v-model="formData.receiveAddressTwo" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-button type="text">订单备注</el-button>
          <el-row>
            <el-input v-model="formData.remark"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入内容"
            />
          </el-row>
          <el-col :span="18" class="mt-2">
            <el-form ref="formData3" :inline="true" :model="formData" :rules="rules" size="mini">
              <el-form-item>
                <span class="text-danger">订单总金额： {{ productSaleCurrency }}  {{ Number(orderAmount).toFixed(2) }}</span>
              </el-form-item>
              <el-form-item :label="'客付运费（'+ productSaleCurrency +'）'" label-width="150px" prop="freightChargesAmount">
                <el-input v-model="formData.freightChargesAmount" oninput="value=value.replace(/[^0-9.]/g,'')" />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6" class="mt-2">
            <el-row type="flex" class="row-bg" justify="end">
              <el-button size="mini" @click="reset">重置</el-button>
              <el-button type="primary" size="mini" :loading="loading" @click="creatHander">创建</el-button>
            </el-row>
          </el-col>
        </el-col>
      </el-row>
    </basic-container>
    <el-dialog ref="dialog" :append-to-body="true" :close-on-click-modal="false" width="30%" title="从原订单丰富" :visible.sync="dialogFormVisible">
      <el-form :model="form" size="mini" label-width="100px">
        <el-row>
          <el-col>
            <el-form-item label="平台">
              <el-select v-model="form.plat" filterable class="width-100" placeholder="请选择">
                <el-option v-for="(item) in platformList"
                           :key="item.platformCode"
                           :value="item.platformCode"
                           :label="item.platformName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="平台单号">
              <el-input v-model="form.platOrderId" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseCountry, saveManualOrder, Currency, getOriginalOrderDetail } from '@/api/platformOrder'
import { getPlatformList, getStoreByPlatform } from '@/api/common.js'
import { deepClone } from '@/util/util'
import orderImportModal from './amazon/modal/orderImportModal'
import addProductModal from './amazon/modal/addProductModal'
export default {
  name: 'OmsPlatformOrdersImport',
  data() {
    const validateMoney = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入客付运费'))
      } else if (value.indexOf('.') !== -1 && value.split('.').length > 2) {
        callback(new Error('请输入正确格式的金额')) // 防止输入多个小数点
      } else if (value.indexOf('.') !== -1 && value.split('.')[1].length > 2) {
        callback(new Error('仅限保留两位小数'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        platOrderId: '',
        transactionId: '',
        sourceOrderId: '',
        buyerId: '',
        platformCode: '',
        storeCode: '',
        platTrackingNo: '',
        deliveryDeadline: '',
        receiveFullName: '',
        countryName: '',
        receiveCountryCode: '',
        receiveZip: '',
        phoneNumber: '',
        mobileNo: '',
        receiveEmail: '',
        socialContact: '',
        receiveDeltaProvince: '',
        receiveCity: '',
        receiveAddressOne: '',
        receiveAddressTwo: '',
        taxNumber: '',
        remark: '',
        freightChargesAmount: '',
        goodList: []
      },
      siteId: '',
      storeList: [],
      disabled: false,
      tableData: [],
      dialogFormVisible: false,
      form: {
        plat: '',
        platOrderId: ''
      },
      platformList: [],
      rules: {
        platOrderId: [
          { required: true, message: '请输入平台订单号' }
        ],
        storeCode: [
          { required: true, message: '请选择销售店铺' }
        ],
        buyerId: [
          { required: true, message: '请输入买家账号' }
        ],
        receiveFullName: [
          { required: true, message: '请输入收货人' }
        ],
        countryName: [
          { required: true, message: '请选择国家全称' }
        ],
        receiveZip: [
          { required: true, message: '请输入邮编' }
        ],
        receiveDeltaProvince: [
          { required: true, message: '请输入省/州' }
        ],
        receiveCity: [
          { required: true, message: '请输入市' }
        ],
        receiveAddressOne: [
          { required: true, message: '请输入街道1' }
        ],
        freightChargesAmount: [
          { required: true, validator: validateMoney }
        ],
        platformCode: [
          { required: true, message: '请输入销售平台' }
        ]
      },
      countryList: [],
      currencyList: [],
      productSaleCurrency: '',
      loading: false
    }
  },
  computed: {
    orderAmount: function() {
      let result = 0
      this.formData.goodList && this.formData.goodList.forEach(item => {
        result = this.Add(item.productSaleMoney, result)
      })

      return this.Add(result, this.formData.freightChargesAmount || 0)
    }
  },
  watch: {
    'formData.platformCode'() {
      if (this.formData.platformCode === '') return
      getStoreByPlatform(this.formData.platformCode).then(res => {
        this.storeList = res.data
      })
    }
  },
  mounted() {
    this.getCurrency()
    this.getBaseCountry()
    getPlatformList().then(res => {
      this.platformList = res.data.filter(item => item.platformCode !== 'AM')
    })
  },
  methods: {
    save() {
      getOriginalOrderDetail(this.form).then(res => {
        this.siteId = res.data.siteCode
        this.formData = res.data
        this.formData.goodList && this.formData.goodList.forEach(item => {
          item.productSaleMoney = this.Mul(item.productSalePrice, item.productQuantity)
        })
        this.productSaleCurrency = (this.formData.goodList?.length && this.formData.goodList[0].productSaleCurrency) || ''
        this.formData.sourceOrderId = this.formData.platOrderId
        this.formData.platOrderId = ''
        this.dialogFormVisible = false
      })
    },
    getCurrency() {
      Currency().then(res => {
        this.currencyList = res.data
      })
    },
    getBaseCountry() {
      baseCountry().then(res => {
        this.countryList = res.data
      })
    },
    orderModal() {
      this.$modal({
        title: '订单导入',
        width: '30%',
        component: orderImportModal,
        callback: (bool) => {
        }
      })
    },
    orderPlump() {
      // this.form.omsOrderId = ''
      this.form.plat = ''
      this.form.platOrderId = ''
      this.dialogFormVisible = true
    },
    addProduct() {
      let { currencyList, productSaleCurrency } = this
      if (this.formData.goodList?.length) {
        productSaleCurrency = this.formData.goodList[0].productSaleCurrency
      } else {
        productSaleCurrency = ''
      }
      this.$modal({
        title: '增加产品',
        width: '40%',
        component: addProductModal,
        data: { currencyList, productSaleCurrency, len: this.formData.goodList.length >= 1 ? 0 : 2 },
        callback: (close, data) => {
          if (data) {
            data.sellerSku = data.pmsSku
            this.formData.goodList.push(data)
            this.productSaleCurrency = data.productSaleCurrency
          }
        }
      })
    },
    proChange(row, index) {
      let { currencyList, productSaleCurrency } = this
      if (this.formData.goodList?.length) {
        productSaleCurrency = this.formData.goodList[0].productSaleCurrency
      }
      this.$modal({
        title: '修改产品',
        width: '40%',
        component: addProductModal,
        data: { currencyList, type: 'edit', index, row, productSaleCurrency, len: this.formData.goodList.length },
        callback: (close, data, i) => {
          if (data) {
            this.$set(this.formData.goodList, i, data)
            this.productSaleCurrency = data.productSaleCurrency
          }
        }
      })
    },
    proDel(index) {
      this.formData.goodList.splice(index, 1)
    },
    creatHander(formName) {
      const params = deepClone(this.formData)
      params.orderAmount = this.orderAmount
      delete params.omOrderId
      Promise.all(this.batchValidate(['formData1', 'formData2', 'formData3'])).then(res => {
        if (!this.formData.goodList?.length) {
          this.$message.warning('商品信息不能为空')
          return false
        }
        this.loading = true
        saveManualOrder(params).then(res => {
          res.success && (this.$message.success('手工订单创建成功')) && (this.reset())
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      })
    },
    countryCodeChange() {
      this.formData.receiveCountryCode = this.formData.countryName
    },
    batchValidate(valiArr) {
      let proArr = []
      proArr = valiArr.map(item => {
        return new Promise((resolve, reject) => {
          this.$refs[item].validate((valid) => {
            valid && resolve()
          })
        })
      })
      return proArr
    },
    reset() {
      this.$refs.formData1.resetFields()
      this.$refs.formData2.resetFields()
      this.$refs.formData3.resetFields()
      this.formData.goodList = []
      this.formData.remark = ''
      this.productSaleCurrency = ''
      this.siteId = ''
      this.formData.storeCode = ''
    },
    // 乘法兼容
    Mul(arg1, arg2) {
      const r1 = arg1.toString()
      const r2 = arg2.toString()
      const d = arguments[2]
      const m = (r1.split('.')[1] ? r1.split('.')[1].length : 0) + (r2.split('.')[1] ? r2.split('.')[1].length : 0)
      const resultVal = Number(r1.replace('.', '')) * Number(r2.replace('.', '')) / Math.pow(10, m)
      return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)))
    },
    // 加法兼容
    Add(arg1, arg2) {
      arg1 = arg1.toString()
      arg2 = arg2.toString()
      const arg1Arr = arg1.split('.')
      const arg2Arr = arg2.split('.')
      const d1 = arg1Arr.length === 2 ? arg1Arr[1] : ''
      const d2 = arg2Arr.length === 2 ? arg2Arr[1] : ''
      const maxLen = Math.max(d1.length, d2.length)
      const m = Math.pow(10, maxLen)
      const result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen))
      const d = arguments[2]
      return typeof d === 'number' ? Number((result).toFixed(d)) : result
    }

  }
}
</script>

<style lang="scss" scoped>
.width-100{
  width:100%;
}
::v-deep .el-col{
  margin-bottom: 0;
}
</style>
