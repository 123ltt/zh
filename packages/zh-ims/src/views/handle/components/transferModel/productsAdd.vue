<template>
  <!-- 新增转移产品 -->
  <el-form ref="rulesForm" v-loading="loading" size="mini" :model="productData" label-width="100px" :rules="rules">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item prop="productAuthId" label="接受方(货权)">
          <el-select v-model="productData.productAuthId" clearable placeholder="请选择" filterable style="width:100%" @input="getproductOwner">
            <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="接受方(货主)" prop="ownerPathList">
          <el-cascader :key="cascaderKey" v-model="productData.ownerPathList" clearable placeholder="请先选择货权" filterable style="width:100%" :options="options" @change="getOwner" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="productSku" label="产品编码">
          <el-input v-model.trim="productData.productSku" clearable placeholder="请输入" @change="getInfo" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="productName" label="产品名称" class="is-required">
          <el-input v-model="productName" disabled placeholder="由产品编码自动生成" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="产品类目" class="is-required">
          <el-input v-model="categoryPath" disabled placeholder="由产品编码自动生成" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="warehouseId" label="仓库名称">
          <el-select v-model="productData.warehouseId" clearable placeholder="请先填写产品编码！" filterable style="width:100%" @change="getWarehouse">
            <el-option v-for="item in warehouseList" :key="item.warehouseVO.id" :label="item.warehouseVO.warehouseName" :value="item.warehouseVO.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="stockLocationOutsideCode" label="产品库位号">
          <el-select v-model="productData.stockLocationOutsideCode" clearable placeholder="请先选择仓库名称！" filterable style="width:100%" @change="getOutside">
            <el-option v-for="item in outsideList" :key="item.stockLocationOutsideCode" :label="item.stockLocationOutsideCode" :value="item.stockLocationOutsideCode" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="转移数量" prop="changeQty">
          <el-tooltip :disabled="ishas" :content="hasCantent" placement="top" effect="dark">
            <el-input v-model.trim="productData.changeQty" v-input.positive.numeric :placeholder="ishas?'请先通过产品库位号来获取可用数量':hasCantent" style="width:100%" @input="getNum" />
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="转移前成本" prop="priceBeforeChange" class="is-required">
          <el-input v-model.trim="productData.priceBeforeChange" disabled style="width:100%" placeholder="请先选择仓库名称！">
            <template slot="append">RMB</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="转移后成本" prop="priceAfterChange">
          <el-input v-model.trim="productData.priceAfterChange" v-input.positive placeholder="请输入" style="width:100%" @input="afterPrice">
            <template slot="append">RMB</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item style="text-align: right;padding-right: 20px;">
          <el-button size="mini" icon="el-icon-circle-close" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="define()">保存</el-button>
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>
</template>

<script>

import { getAvailableCount } from '@/api/handle/transfer.js'
import { deepClone } from '@/util/util'

export default {
  name: 'ProductsAdd',
  props: {
    parsData: Object,
    isTable: Boolean,
    orgList: Array,
    tableData: Object
  },
  data() {
    return {
      loading: false,
      cascaderKey: 0,
      rules: {
        productAuthId: [{ required: true, message: '请选择接受方(货权)！', trigger: 'change' }],
        ownerPathList: [{ required: true, message: '请选择接受方(货主)！', trigger: 'change' }],
        productSku: [{ required: true, message: '请填写产品编码！', trigger: 'blur' }],
        warehouseId: [{ required: true, message: '请选择仓库名称！', trigger: 'change' }],
        stockLocationOutsideCode: [{ required: true, message: '请选择产品库位号！', trigger: 'change' }],
        changeQty: [{ required: true, message: '请填写转移数量！', trigger: 'blur' }],
        priceAfterChange: [{ required: true, message: '请填写转移后成本！', trigger: 'blur' }]

      },
      options: [],
      oldBeforeValue: '',
      oldAfterValue: '',
      productData: {
        skuInfo: {
          productName: '',
          categoryPath: '',
          imageUrl: ''
        },
        warehouseId: '',
        stockLocationOutsideCode: '',
        warehouse: {},
        productAuthName: '',
        ownerPathList: [],
        productOwnerId: '',
        productOwnerName: '',
        productAuthId: '',
        productSku: '',
        changeQty: '',
        priceBeforeChange: '',
        priceAfterChange: ''
      },
      categoryPath: '',
      productName: '',
      getYes: true,
      hasCantent: '',
      ishas: true,
      availableStock: '',
      oldval: '',
      outsideList: [],
      warehouseList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 清除校验
      this.$refs.rulesForm.clearValidate()
    })
    this.dealWith()
  },
  methods: {
    getproductOwner(val) {
      this.cascaderKey = ++this.cascaderKey
      this.ownerPathList = []
      this.options = []
      if (val) {
        const orgArr = this.orgList.filter(ele => ele.tenantId === val)[0]
        this.productData.productAuthName = orgArr.tenantName
        orgArr.orgTreeNodeList.forEach(item => {
          if (item.hasChildren) {
            item.children.forEach(ele => {
              if (!ele.hasChildren) {
                this.options.push({
                  value: ele.id,
                  label: ele.title,
                  disabled: true
                })
              } else {
                const chidrenArr = []
                ele.children.forEach(e => {
                  chidrenArr.push({
                    value: e.id,
                    label: e.title
                  })
                })
                this.options.push({
                  value: ele.id,
                  label: ele.title,
                  children: chidrenArr
                })
              }
            })
          }
        })
      }
    },
    getOwner(val) {
      if (val) {
        const ownerArr = this.options.filter(ele => ele.value === val[0])[0].children
        const childrenArr = ownerArr.filter(ele => ele.value === val[1])
        this.productData.productOwnerName = childrenArr[0].label
      }
    },
    // 获取产品信息
    getInfo(val) {
      this.productData.changeQty = ''
      if (val) {
        this.parsData.productSku = val
        getAvailableCount(this.parsData).then(res => {
          if (res.data) {
            this.productName = res.data.skuInfo.productName
            this.categoryPath = res.data.skuInfo.categoryPath
            this.productData.skuInfo.imageUrl = res.data.skuInfo.imageUrl
            this.warehouseList = res.data.productInfoList
            this.getYes = true
          } else {
            this.clear()
          }
        }).catch(() => {
          this.clear()
        })
      } else {
        this.clear()
      }
    },
    getWarehouse(val) {
      this.productData.stockLocationOutsideCode = ''
      this.productData.changeQty = ''
      if (val) {
        const arr = this.warehouseList.filter(item => {
          return item.warehouseVO.id === val
        })[0]
        this.outsideList = arr.availableDetailVO
        this.productData.priceBeforeChange = arr.priceBeforeChange
        this.productData.warehouse = arr.warehouseVO
      } else {
        this.outsideList = []
        this.productData.priceBeforeChange = ''
        this.productData.warehouse = {}
      }
    },
    getOutside(val) {
      this.productData.changeQty = ''
      if (val) {
        const arr = this.outsideList.filter(item => {
          return item.stockLocationOutsideCode === val
        })[0]
        this.availableStock = arr.availableQty !== -1 ? arr.availableQty : '0'
        this.hasCantent = `不能超过可用数量${this.availableStock}`
        this.ishas = false
      } else {
        this.availableStock = ''
        this.hasCantent = ''
        this.ishas = true
      }
    },
    getNum(val) {
      if (val) {
        if (this.availableStock || this.availableStock === 0) {
          if (+val > +this.availableStock) {
            this.$message.error(this.hasCantent)
            this.productData.changeQty = this.oldval
          } else {
            this.oldval = val
          }
        } else {
          this.$message.error('请先通过产品编码来获取可用数量')
          this.productData.changeQty = this.oldval
        }
      } else {
        this.oldval = ''
      }
    },
    clear() {
      this.warehouseList = []
      this.productData.stockLocationOutsideCode = ''
      this.productData.changeQty = ''
      this.outsideList = []
      this.productData.priceBeforeChange = ''
      this.productData.warehouse = {}
      this.availableStock = ''
      this.ishas = true
      this.hasCantent = ''
      this.productName = ''
      this.categoryPath = ''
      this.productData.skuInfo.imageUrl = ''
      this.getYes = false
    },
    // 确认新增
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (!this.getYes) {
            this.$message.error('请填写正确的产品编码！')
          } else {
            this.productData.skuInfo.productName = this.productName
            this.productData.productOwnerId = this.productData.ownerPathList[1]
            this.productData.skuInfo.categoryPath = this.categoryPath
            this.$parent.$emit('close', this.productData)
          }
        }
      })
    },
    isYes(val) {
      if (val.indexOf('.') !== -1) {
        if (val.split('.')[1].length > 2) {
          return true
        }
      } else {
        if (val.length > 6) {
          return true
        }
      }
      return false
    },
    // 控制输入两位小数
    afterPrice(val) {
      if (this.isYes(val)) {
        this.productData.priceAfterChange = this.oldAfterValue
      } else {
        this.oldAfterValue = val
      }
    },
    dealWith() {
      if (!this.isTable) {
        this.productData = deepClone(this.tableData)
        this.productData.warehouseId = this.productData.warehouseId + ''
        this.categoryPath = this.productData.skuInfo.categoryPath
        this.productName = this.productData.skuInfo.productName
        this.getproductOwner(this.productData.productAuthId)
        this.getDealWith()
      }
    },
    async getDealWith() {
      this.loading = true
      this.parsData.productSku = this.productData.productSku
      await getAvailableCount(this.parsData).then(res => {
        this.warehouseList = res.data.productInfoList
        this.getYes = true
      })
      const arr1 = this.warehouseList.filter(item => {
        return item.warehouseVO.id === this.productData.warehouseId
      })[0]
      this.outsideList = arr1.availableDetailVO
      const arr2 = this.outsideList.filter(item => {
        return item.stockLocationOutsideCode === this.productData.stockLocationOutsideCode
      })[0]
      this.availableStock = arr2.availableQty !== -1 ? arr2.availableQty : '0'
      this.hasCantent = `不能超过可用数量${this.availableStock}`
      this.ishas = false
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
::v-deep .el-card__body{
    padding-bottom: 0!important;
  }

.divider{
  display: inline-block;
  width: 10%;
  text-align: center;
  color: #c4c7cf;
}

.redStar{
  color: red;
  font-size: 12px;
}
.imgBox{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items:flex-start;
  }
</style>
