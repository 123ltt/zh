<template>
  <!-- oms 订单管理 - 全部订单 - 详情页 - 添加、修改产品 -->
  <el-form ref="formRef"
           v-loading="updating"
           :model="form"
           :rules="rules"
           size="mini"
           label-width="100px"
           class="form-col"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="SKU编码" prop="pmsSku">
          <el-input v-model="form.pmsSku" type="text" @change="pmsSkuChange">
            <div slot="append" class="text-center text-primary">
              <el-button type="text" @click="analyzeSku">解析</el-button>
            </div>
          </el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="发货数量" prop="productQuantity">
          <el-input v-model="form.productQuantity" v-input.positive.numeric.!0 maxlength="9" type="text" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-row>
          <el-form-item label="SKU名称" prop="productsName">
            <el-input v-model="form.productsName" type="text" disabled />
          </el-form-item>

          <el-form-item label="销售单价" prop="productSalePrice">
            <el-input v-model="form.productSalePrice" v-input.positive.!0 :maxlength="/\.{1}/.test(form.productSalePrice)?9:8" placeholder="保留两位小数" type="text">
              <span slot="suffix" style="color:#606266;">USD</span>
            </el-input>
            <span class="fs-6 text-danger">Note：销售单价如果非USD请自己换算为美元币种填入</span>
          </el-form-item>

          <el-form-item label="PMS成本价格" prop="skuCost">
            <el-input v-model="form.skuCost" v-input.positive type="text" disabled>
              <span slot="suffix" style="color:#606266;">RMB</span>
            </el-input>
          </el-form-item>

          <el-form-item label="发货仓库" prop="warehouseCode">
            <wareCascader :show-all-levels="false" :virtual-rule-data="virtualRuleData" class="w-100" :value.sync="form.warehouseCode" @changeFn="getSkuStock" />
          </el-form-item>

        </el-row>
      </el-col>

      <el-col :span="12">
        <el-form-item label="SKU图片" prop="productPicUrl">
          <el-image :src="form.productPicUrl" style="width:160px;height:160px" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="当前库存量" prop="stock">
          <el-input v-model="form.stock" v-input.positive.numeric type="text" disabled />
        </el-form-item>

      </el-col>
      <el-col :span="12">
        <el-form-item label="关联订单Item" prop="platformProductId">
          <el-select
            v-model="form.platformProductId"
            clearable
            placeholder="请选择关联订单Item"
            class="w-100"
          >
            <el-option v-for="(item, i) in orderItemList"
                       :key="i"
                       :label="item.fullName"
                       :value="item.combId"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>

      <el-col :span="12">
        <el-form-item label="添加原因类型" prop="reasonType">
          <el-select
            v-model="form.reasonType"
            clearable
            placeholder="请选择添加原因类型"
            class="w-100"
            @change="reasonTypeChanged"
          >
            <el-option v-for="item in reasonTypeList"
                       :key="item.value"
                       :label="item.label"
                       :value="+item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="在线SKU编码" prop="originalSkuCode">
          <el-input v-model="form.originalSkuCode" disabled type="text" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>

      <el-col :span="24">
        <el-form-item label="具体原因" prop="reasonDetail">
          <el-input v-model="form.reasonDetail" type="textarea" :autosize="{minRows:2,maxRows:4}" />
        </el-form-item>
      </el-col>
    </el-row>
    <div class="text-end">
      <el-button size="mini" @click="close(false)">取消</el-button>
      <el-button v-if="isCanUpdate" type="primary" size="mini" @click="updateOrderGood">确定</el-button>
    </div>
  </el-form>

</template>

<script>
import { getItemList, getOrderGood, analyzeSku, updateOrderGood, getSkuStock } from '@/api/orderManagement'
import { getPackageGood, updatePackageGood } from '@/api/packageDetails'
import { getDict } from '@/api/common/dict'
import wareCascader from '@/views/components/wareCascader/index.vue'

export default {
  name: 'UpdateProduct',
  components: { wareCascader },
  props: {
    row: Object,
    omOrderId: String,
    packageCode: String,
    detailsType: String,
    proSkuItemList: Array,
    isNewProduct: Boolean, // 是否是包裹详情的新增产品
    storeCode: String,
    virtualRuleData: Object
  },
  data() {
    const pmsSkuValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('SKU编码不能为空'))
      } else if (this.hasPmsSkuChanged) {
        callback(new Error('SKU编码已修改，请重新解析'))
      } else {
        callback()
      }
    }
    const psPriceValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('销售单价不能为空'))
      } else if (+value === 0) {
        callback(new Error('销售单价金额不能为0'))
      } else if (!/^\d+.?\d{0,2}$/.test(value)) {
        callback(new Error('销售单价最多保留2位小数'))
      } else {
        callback()
      }
    }
    return {
      hasPmsSkuChanged: false,
      orderItemList: [],
      reasonTypeList: [],
      form: {
        pmsSku: '',
        productQuantity: '',
        productsName: '',
        productPicUrl: '',
        productSalePrice: '',
        skuCost: '',
        stock: '',
        warehouseCode: [],
        platformProductId: '',
        originalSkuCode: '',
        originalSkuName: '',
        reasonType: '',
        reasonDetail: '',
        grossWeight: '',
        developLeadUserId: '',
        logisticsProperty: '',
        omOrderGoodId: '',
        discount: '',
        productsTransactionNum: null
      },
      rules: {
        pmsSku: [{ required: true, validator: pmsSkuValidator, trigger: 'blur' }],
        productQuantity: [{ required: true, message: '请输入发货数量', trigger: 'blur' }],
        productSalePrice: [{ required: true, validator: psPriceValidator, trigger: 'blur' }],
        warehouseCode: [{ required: true, message: '请选择发货仓库' }],
        productsName: [{ required: true, message: '请解析SKU编码获取SKU名称' }],
        platformProductId: [{ required: true, message: '请选择关联订单Item' }],
        originalSkuCode: [{ required: true, message: '请选择在线SKU编码' }],
        reasonType: [{ required: true, message: '请选择添加原因类型' }],
        reasonDetail: [{ required: true, message: '请输入具体原因' }]
      },
      updating: false,
      isCanUpdate: true
    }
  },
  computed: {
    idAndItems() {
      return {
        id: this.form.platformProductId,
        list: this.orderItemList
      }
    }
  },
  watch: {
    'form.platformProductId'(val) {
      if (val === '') {
        this.form.originalSkuCode = ''
        this.form.originalSkuName = ''
        this.form.productsTransactionNum = null
        return
      }
      this.dealItem(val, this.orderItemList)
    }
  },
  created() {
    const { row: { id, pmsSku, warehouseCode }, isNewProduct, omOrderId, detailsType } = this
    if (id || isNewProduct) { // 有id或isNewProduct为true则为修改进来的，需要回显数据
      this.getGoods(id)
      this.getSkuStock(pmsSku, warehouseCode)
      const unwatch = this.$watch('idAndItems', ({ id, list }) => {
        if (id && list.length) {
          this.isCanUpdate = this.dealItem(id, list)
          this.isCanUpdate || this.$message.error('在线SKU或者平台产品ID已被修改，无法进行修改产品操作')
          unwatch()
        }
      })
    }
    if (detailsType === 'package') this.rules.warehouseCode = null
    this.getList(omOrderId)
  },
  methods: {
    dealItem(val, list) {
      const data = (list || []).find(item => item.combId === val)
      if (data !== undefined) {
        this.form.originalSkuCode = data.originalSkuCode
        this.form.originalSkuName = data.originalSkuName
        this.form.productsTransactionNum = data.productsTransactionNum
      }
      return data !== undefined
    },
    getSkuStock(pmsSku = this.form.pmsSku, wareHouseCode = this.form.warehouseCode) {
      wareHouseCode = wareHouseCode.toString()
      if (pmsSku === '' || wareHouseCode === '') return
      getSkuStock({ pmsSku, wareHouseCode, storeCode: this.storeCode }).then(res => {
        this.form.stock = res.data
      })
    },
    getList(omOrderId) {
      getItemList(omOrderId).then(res => {
        this.orderItemList = (res.data ?? []).map(item => {
          const { originalSkuName, platformProductId, originalSkuCode } = item
          const fullName = (originalSkuName ?? '').length > 50 ? `${originalSkuName.slice(0, 50)}...（${platformProductId}）` : `${originalSkuName}（${platformProductId}）`
          return Object.assign(item, { fullName, combId: platformProductId + originalSkuCode })
        })
        if (res?.data?.length) {
          this.rules.platformProductId = [{ required: true, message: '请选择关联订单Item' }]
          this.rules.originalSkuCode = [{ required: true, message: '请选择在线SKU编码' }]
        } else {
          this.rules.platformProductId = null
          this.rules.originalSkuCode = null
        }
      })

      getDict('reason_type', 'oms').then(data => {
        this.reasonTypeList = data
      })
    },
    reasonTypeChanged(val) {
      const list = this.reasonTypeList
      for (let i = 0; i < list.length; i++) {
        if (val === +list[i].value) {
          this.form.reasonTypeName = list[i].label
          return
        }
      }
    },
    pmsSkuChange() {
      this.hasPmsSkuChanged = true
      this.reShow()
    },
    reShow(data = {}) {
      if (this.detailsType === 'package') { // 包裹详情不再调接口，需保存数据于本地
        Object.assign(this.form, data)
      }
      const arr = ['pmsSku', 'productQuantity', 'productSalePrice', 'warehouseCode', 'platformProductId', 'originalSkuCode', 'originalSkuName', 'reasonType', 'reasonDetail', 'omOrderGoodId']
      Object.keys(this.form).forEach(key => {
        switch (true) {
          case arr.includes(key):
            if (data?.[key] !== undefined && data?.[key] !== null) {
              if (key === 'reasonType' && data.reasonType === -1) {
                this.form.reasonType = ''
                break
              } else if (key === 'warehouseCode') {
                this.form[key] = data[key] ? data[key].split(',') : []
                break
              } else if (key === 'productSalePrice') {
                this.form[key] = Number(data[key]).toFixed(2)
                break
              } else if (key === 'platformProductId') {
                this.form[key] = data[key] + data.originalSkuCode
                break
              }
              this.form[key] = data[key]
            }
            break
          case key === 'stock':
            break
          default:
            this.form[key] = data?.[key]
            break
        }
      })
    },
    updateOrderGood() {
      this.$refs.formRef.validate((bool, obj) => {
        const { updating, row: { id }, packageCode, form, orderItemList, detailsType, omOrderId } = this
        if (!bool || updating) return
        this.updating = true
        const isAdd = !id && !this.isNewProduct
        let [originalSkuName, platformProductId, platOrderId] = ['', '', '']

        orderItemList && orderItemList.forEach(item => {
          if (item.combId === this.form.platformProductId) {
            originalSkuName = item.originalSkuName
            platformProductId = item.platformProductId
            platOrderId = item.platOrderId
          }
        })
        const params = { id, packageCode, ...form, originalSkuName, platformProductId, platOrderId }
        params.warehouseCode = params.warehouseCode.toString()
        if (detailsType === 'order') {
          params.omOrderId = omOrderId
          delete params.packageCode
          delete params.omOrderGoodId
        } else { // 包裹详情页， 先保存数据到本地，此处不调用接口
          params.packageCode ??= packageCode // 新增的商品需要带上packageCode
          if (isAdd) {
            const ifExist = this.proSkuItemList.includes(params.pmsSku + params.platformProductId)
            if (ifExist) {
              setTimeout(() => {
                this.updating = false
                this.$message.error('已存在该商品，请勿重复添加')
              }, 400)
              return
            }
          }
          setTimeout(() => {
            this.updating = false
            this.$message.success('操作成功，请勿刷新当前页面')
            this.close(true, params)
          }, 400)
          return
        }
        this.getQuery(updateOrderGood, updatePackageGood, params, isAdd)
          .then((res) => {
            this.$message.success(res.msg)
            this.close(true)
          }).finally(() => {
            this.updating = false
          })
      })
    },
    analyzeSku() {
      const { pmsSku } = this.form
      if (this.updating) return
      if (pmsSku === '') {
        return this.$message.error('SKU编码不能为空')
      }
      this.updating = true
      analyzeSku(pmsSku).then(({ data }) => {
        if (data === null) this.$message.error('解析失败')
        else this.$message.success('解析成功')

        this.getSkuStock()
        this.reShow(data)
        this.hasPmsSkuChanged = false
        this.$refs.formRef.clearValidate('pmsSku')
      }).finally(() => {
        this.updating = false
      })
    },
    getGoods(id) {
      const { detailsType, row } = this
      if (detailsType === 'package') {
        return this.reShow(row)
      }
      this.getQuery(getOrderGood, getPackageGood, id).then(res => {
        this.reShow(res.data)
      })
    },
    getQuery(orderFn, packageFn, ...arg) {
      const { detailsType } = this
      return { order: orderFn, package: packageFn }[detailsType](...arg)
    },
    close(isUpdate = false, data) {
      this.$parent.$emit('close', isUpdate, data)
    }
  }
}
</script>
