<template>
  <basic-container v-loading="loading">
    <el-card class="cardBox">
      <div slot="header" style="heigt:20px;line-height:20px;">
        <span style="font-weight: 600;">基本信息</span>
        <div style="float: right">
          <el-button size="mini" type="primary" @click="$emit('close')">返回</el-button>
          <el-button size="mini" type="primary" @click="saveData">保存</el-button>
        </div>
      </div>
      <el-form ref="rulesForm" :model="openData" size="mini" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item prop="productSku" label="产品编码" :rules="{ required: true, message: '请输入产品编码', trigger: 'blur' }">
              <el-input v-model.trim="openData.productSku" clearable :disabled="!isAdd" placeholder="请输入" @change="toget" />
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
        </el-row>
      </el-form>
    </el-card>
    <el-card class="caozuo">
      <div slot="header">
        <span style="font-weight: 600;">供应商商品</span>
      </div>
      <el-form size="mini" :model="goodsData" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item prop="name">
              <span slot="label"><span class="redStar">*</span>供应商名称:</span>
              <g-select v-model="goodsData.name" style="width:100%;" :items="nameList" key-field="supplierId" label-field="supplierName" value-field="supplierId" @input="getSuppliers()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="goodsType">
              <span slot="label"><span class="redStar">*</span>商品类目:</span>
              <category-cascader v-model="goodsData.goodsType" check-strictly :multiple="false" style="width:100%" @input="getTypeList" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="goodsName">
              <span slot="label"><span class="redStar">*</span>商品名称:</span>
              <el-select v-model="goodsData.goodsName" clearable placeholder="请先选择供应商" filterable style="width:100%;">
                <el-option v-for="item in goodsNameList" :key="item.id" :label="item.goodsName" :value="item.goodsCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="btnBox">
              <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="addGoods">添加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="goodsTable" size="mini" max-height="400px" class="g-table" stripe style="width: 100%" border>
        <el-table-column label="主供应商" align="center" min-width="80">
          <template slot-scope="scope">
            <el-radio v-model="mainSupplier" :label="scope.row.supplierCode"><i /></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="supplierCode" label="供应商编码" align="center" min-width="100" />
        <el-table-column prop="supplierName" label="供应商名称" align="center" min-width="200" />
        <el-table-column prop="category" label="商品类目" align="center" min-width="150" />
        <el-table-column prop="goodsName" label="商品名称" align="center" min-width="150" show-overflow-tooltip />
        <el-table-column prop="goodsCode" label="商品编码" align="center" min-width="100" />
        <el-table-column label="操作" align="center" fixed="right" min-width="150">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="removeBtn(scope.$index)">删除</el-button>
            <el-button type="text" size="mini" @click="addBtn(scope.row)">报关</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </basic-container>
</template>

<script>

import { searchSkuTopN, update, getSupplier, getSupplierGoods, save, getDetail } from '@/api/basicManagement/product.js'
import CategoryCascader from '@/components/category-cascader'
import productAddDeclare from './productAddDeclare.vue'

export default {
  name: 'ProductAdd',
  components: { CategoryCascader },
  props: {
    isAdd: Boolean,
    editData: Object
  },
  data() {
    return {
      loading: false,
      openData: {
        productSku: '',
        goodsList: ''
      },
      productCategory: '',
      productName: '',
      flg: false,
      goodsData: {
        name: '',
        goodsType: '',
        goodsName: ''
      },
      nameList: [],
      goodsTypeList: [],
      props: {
        expandTrigger: 'click',
        label: 'name',
        value: 'id'
      },
      goodsNameList: [],
      goodsTable: [],
      mainSupplier: '',
      priceListId: '',
      spanArr: [],
      pos: ''
    }
  },
  mounted() {
    this.getData()
    this.dealWith()
  },
  methods: {
    // 获取数据
    getData() {
      getSupplier().then(res => {
        this.nameList = res.data
      })
    },
    getSuppliers(val) {
      this.goodsData.goodsName = ''
      this.goodsData.goodsType = ''
      if (val !== '') {
        const obj = {
          status: 1,
          supplierId: this.goodsData.name,
          categoryId: ''
        }
        getSupplierGoods(1, 200, obj).then(res => {
          this.goodsNameList = res.data.records
        })
      } else {
        this.goodsTypeList = []
        this.goodsNameList = []
      }
    },
    getTypeList(val) {
      this.goodsData.goodsName = ''
      if (val !== '') {
        const obj = {
          status: 1,
          supplierId: this.goodsData.name,
          categoryId: val
        }
        getSupplierGoods(1, 200, obj).then(res => {
          this.goodsNameList = res.data.records
        })
      } else {
        const obj = {
          status: 1,
          supplierId: this.goodsData.name,
          categoryId: ''
        }
        getSupplierGoods(1, 200, obj).then(res => {
          this.goodsNameList = res.data.records
        })
      }
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
            this.$message.error('无效SKU，请重写填写！')
          }
        })
      } else {
        this.productCategory = ''
        this.productName = ''
      }
    },
    addGoods() {
      if (this.goodsData.goodsName === '') {
        this.$message.error('请填写必填项!')
      } else {
        let obj = {}
        this.goodsNameList.forEach(item => {
          if (this.goodsData.goodsName === item.goodsCode) {
            obj = JSON.parse(JSON.stringify(item))
          }
        })
        console.log(121, obj)
        console.log(12123, this.goodsTable)
        const copyArr = this.goodsTable.filter(item => { return item.supplierCode === obj.supplierCode })
        if (copyArr.length) {
          this.$message.error('供应商重复！请重新添加！')
        } else {
          this.goodsTable.push(obj)
        }
      }
    },
    removeBtn(val) {
      this.goodsTable.splice(val, 1)
    },
    saveData() {
      if (!this.flg) {
        this.$message.error('请填写正确产品编码!')
      } else if (this.goodsTable.length === 0) {
        this.$message.error('请填写供应商商品!')
      } else if (!this.mainSupplier) {
        this.$message.error('请选择供应商商品的主供应商!')
      } else {
        const arr = []
        this.goodsTable.forEach(item => {
          const obj = { goodsId: item.id, id: item.goodsId ? item.goodsId : '' }
          arr.push(obj)
        })
        this.openData.goodsList = arr
        this.openData.mainSupplierCode = this.mainSupplier
        if (this.isAdd) {
          save(this.openData).then(res => {
            this.$emit('close', true)
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        } else {
          update(this.openData).then(res => {
            this.$emit('close', true)
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        }
      }
    },
    addBtn(val) {
      this.$modal({
        title: '报关信息',
        component: productAddDeclare,
        width: '25%',
        data: {
          id: val.id
        },
        callback: () => {}
      })
    },
    dealWith() {
      if (!this.isAdd) {
        this.loading = true
        getDetail(this.editData.id).then(res => {
          const data = res.data
          this.openData.productSku = data.productSku
          this.openData.id = data.id
          this.productCategory = data.categoryName
          this.productName = data.productName
          this.mainSupplier = data.mainSupplierCode
          data.goodsList.forEach(item => {
            const obj = {
              supplierCode: item.supplierCode,
              category: item.categoryName,
              supplierName: item.supplierName,
              goodsName: item.goodsName,
              goodsCode: item.goodsCode,
              id: item.goodsId,
              goodsId: item.id
            }
            this.goodsTable.push(obj)
          })
          this.flg = true
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
.cardBox{
  ::v-deep .el-card__body{
    padding-bottom: 0;
  }
}
.btnBox{
        ::v-deep .el-form-item__content{
            margin-left: 40px!important;
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
</style>
