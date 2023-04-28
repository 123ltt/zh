<template>
  <!-- 库存新增，编辑 -->
  <el-form ref="rulesForm" v-loading="loading" size="mini" :model="openData" label-width="100px">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item prop="productSku" label="产品编码" :rules="{ required: true, message: '请输入产品编码', trigger: 'blur' }">
          <el-input v-model.trim="openData.productSku" clearable :disabled="!isAdd" placeholder="请输入" @input="toget" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="productName" label="产品名称">
          <el-input v-model.trim="productName" disabled placeholder="由产品编码自动生成" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="productCategory" label="产品类目">
          <el-input v-model.trim="productCategory" disabled placeholder="由产品编码自动生成" />
        </el-form-item>
      </el-col>
      <el-col v-if="isAdd" :span="12">
        <el-form-item prop="supplierId">
          <span slot="label"><span class="redStar">* </span>供应商名称</span>
          <el-select v-model="supplierId" clearable placeholder="请先填写产品编码" filterable style="width:100%" @input="togetGoods">
            <el-option v-for="item in supplierList" :key="item.supplierId" :label="item.supplierName" :value="item.supplierId" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-else :span="12">
        <el-form-item prop="supplierName">
          <span slot="label"><span class="redStar">* </span>供应商名称</span>
          <el-input v-model.trim="supplierName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="goodsName" label="商品名称">
          <el-input v-model.trim="goodsName" disabled placeholder="由供应商名称自动生成" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="stockUpAging" label="备货时效" :rules="{ required: true, message: '请输入备货时效', trigger: 'blur' }">
          <el-input v-model.trim="openData.stockUpAging" v-input.numeric.positive placeholder="请填写" style="width:75%;margin-right:20px" />
          <span>天</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item>
          <span slot="label"><span class="redStar">* </span>配送时效</span>
          <el-table :data="formTable" size="mini" max-height="350px" stripe style="width: 100%" border>
            <el-table-column type="index" width="50" align="center">
              <template slot="header">
                <el-button icon="el-icon-plus" size="mini" type="primary" circle @click="addBtn()" />
              </template>
            </el-table-column>
            <el-table-column prop="status" label="仓库名称" align="center" min-width="90">
              <template slot-scope="scope">
                <el-select v-model="scope.row.warehouseId" clearable placeholder="请选择" filterable @input="change(scope.row.warehouseId,scope)">
                  <el-option v-for="item in warehouseList" :key="item.id" :label="item.warehouseName" :value="item.id" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="运输时效" align="center" min-width="90">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.deliveryAging" v-input.numeric.positive clearable size="mini" />
              </template>
            </el-table-column>
            <el-table-column prop="status" label="操作" align="center" min-width="90">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeBtn(scope)" />
              </template>
            </el-table-column>
          </el-table>
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

import { searchSkuTopN, update, save, getMatchedGoods, getDetail } from '@/api/basicManagement/cycle.js'
import { getAllEnableWarehouse } from '@/api/commonApi.js'
export default {
  name: 'CycleAdd',
  props: {
    isAdd: Boolean,
    editData: Object
  },
  data() {
    return {
      loading: false,
      productCategory: '',
      productName: '',
      flg: false,
      openData: {
        goodsId: '',
        productSku: '',
        stockUpAging: '',
        deliveryList: []
      },
      supplierId: '',
      supplierList: [],
      goodsName: '',
      formTable: [],
      supplierName: '',
      warehouseList: [],
      oldTable: []
    }
  },
  mounted() {
    this.dealWith()
    this.getData()
  },
  methods: {
    getData() {
      getAllEnableWarehouse().then(res => {
        this.warehouseList = res.data
      })
    },
    // 获取产品名称，类目
    toget(val) {
      if (val) {
        const obj = {
          data: {
            lstProductSku: [val],
            lstStatus: [2]
          }
        }
        searchSkuTopN(obj).then(res => {
          const data = res.data.records
          if (data.length !== 0) {
            this.flg = true
            this.productCategory = data[0].categoryName
            this.productName = data[0].productName
          } else {
            this.flg = false
            this.productCategory = ''
            this.productName = ''
          }
        })
        getMatchedGoods(val).then(res => {
          this.supplierList = res.data
        })
      } else {
        this.supplierList = []
        this.productCategory = ''
        this.productName = ''
      }
    },
    togetGoods(val) {
      if (val) {
        this.supplierList.forEach(item => {
          if (item.supplierId === val) {
            this.goodsName = item.goodsName
            this.openData.goodsId = item.goodsId
          }
        })
      } else {
        this.goodsName = ''
        this.openData.goodsId = ''
      }
    },
    addBtn() {
      const obj = {
        deliveryAging: '',
        warehouseId: '',
        id: ''
      }
      this.formTable.push(obj)
    },
    removeBtn(val) {
      this.formTable.splice(val.$index, 1)
    },
    change(val1, val2) {
      this.oldTable = JSON.parse(JSON.stringify(this.formTable))
      this.oldTable.splice(val2.$index, 1)
      this.oldTable.forEach(item => {
        if (item.warehouseId === val1) {
          this.$message.error('列表中已有该仓库，请勿重复添加！')
          this.formTable[val2.$index].warehouseId = ''
        }
      })
    },
    // 确认新增
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (!this.supplierId && this.isAdd) {
            this.$message.error('请选择供应商厂家!')
          } else if (!this.flg) {
            this.$message.error('请填写正确产品编码!')
          } else if (this.formTable.length === 0) {
            this.$message.error('请填写配送时效!')
          } else {
            // 数组去空
            this.formTable = this.formTable.filter(item => item.warehouseId !== '')
            this.openData.deliveryList = JSON.parse(JSON.stringify(this.formTable))
            if (this.isAdd) {
              save(this.openData).then(() => {
                this.$parent.$emit('close', true)
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            } else {
              update(this.openData).then(() => {
                this.$parent.$emit('close', true)
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            }
          }
        }
      })
    },
    // 编辑处理
    dealWith() {
      if (this.isAdd) {
        this.flg = false
      } else {
        this.loading = true
        this.flg = true
        getDetail(this.editData.id).then(res => {
          const data = res.data
          this.openData.productSku = data.productSku
          this.productName = data.productName
          this.supplierName = data.supplierName
          this.prodCategory = data.prodCategoryName
          this.goodsName = data.goodsName
          this.openData.goodsId = data.goodsId
          this.openData.stockUpAging = data.stockUpAging
          this.openData.id = data.id
          this.formTable = JSON.parse(JSON.stringify(data.deliveryList))
          this.formTable.forEach(item => {
            item.warehouseId = item.warehouseId + ''
          })
          this.loading = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item{
  margin-bottom: 10px!important;
}
.redStar{
  color: red;
  font-size: 12px;
}
</style>
