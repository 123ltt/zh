<template>
  <!-- 库存预警新增 -->
  <el-form ref="rulesForm" v-loading="loading" size="mini" :model="openData" label-width="120px">
    <div class="bigBox">
      <el-row :gutter="10" class="inputBox">
        <el-col :span="24">
          <el-form-item label="产品编码" prop="productSku" :rules="{required:true,message:'请填写产品编码',trigger:'blur'}">
            <el-input v-model.trim="openData.productSku" placeholder="请输入" :disabled="!isAdd" @change="getInfo" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="产品名称" prop="category">
            <el-input v-model="productName" disabled placeholder="请先输入产品编码" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="产品类目" prop="category">
            <el-input v-model="categoryName" disabled placeholder="请先输入产品编码" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="imgBox">
        <el-image style="width: 40%;border: 1px solid #cccccc;" :src="url?url:'https://img.zcool.cn/community/017bcb58b4db5fa801219c7719b5ff.jpg@1280w_1l_2o_100sh.jpg'" />
      </div>
    </div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item prop="productAuthId" label="货权" :rules="isAdd?{ required: true, message: '请输入货权', trigger: 'change' }:{required: false}">
          <el-select v-if="isAdd" v-model="openData.productAuthId" clearable placeholder="请选择" filterable :disabled="!isAdd" style="width:100%" @input="getproductOwner">
            <el-option v-for="item in formData.orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
          </el-select>
          <el-input v-else v-model="openData.productAuthName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="productOwnerPathIds" label="货主" :rules="isAdd?{ required: true, message: '请选择货主', trigger: 'change' }:{required: false}">
          <el-cascader v-if="isAdd" :key="cascaderKey" v-model="openData.productOwnerPathIds" :disabled="!isAdd" clearable placeholder="请先选择货权" filterable :options="options" style="width:100%" />
          <el-input v-else v-model="openData.productOwnerName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="warehouseId" label="仓库名称" :rules="{ required: true, message: '请输入仓库名称', trigger: 'change' }">
          <g-select v-model="openData.warehouseId" style="width:100%;" :disabled="!isAdd" :items="formData.warehouseNameList" key-field="id" label-field="warehouseName" value-field="id" @change="getWarehouse" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="仓库类型" prop="category">
          <el-input :value="warehouseType" disabled placeholder="请先选择仓库名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="仓库归属" prop="category">
          <el-input :value="warehouseBelongObj[warehouseBelong]" disabled placeholder="请先选择仓库名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="stockUpperLimit" label="库存上限" :rules="{ required: true, message: '请输入库存上限', trigger: 'blur' }">
          <el-input v-model.trim="openData.stockUpperLimit" v-input.numeric.positive maxlength="8" clearable placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="stockLowerLimit" label="库存下限" :rules="{ required: true, message: '请输入库存下限', trigger: 'blur' }">
          <el-input v-model.trim="openData.stockLowerLimit" v-input.numeric.positive maxlength="8" placeholder="请输入" />
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

import { update, save, updateDetail, getProductInfo } from '@/api/base/imsWarehouseWarn.js'
export default {
  name: 'ImsWarehouseAdd',
  props: {
    isAdd: Boolean,
    addData: Object,
    formData: Object,
    warehouseBelongObj: Object
  },
  data() {
    return {
      loading: false,
      test: '',
      cascaderKey: 0,
      openData: {},
      orgList: [],
      productOwnerList: [],
      url: '',
      options: [],
      categoryName: '',
      productName: '',
      warehouseType: '',
      warehouseBelong: '',
      getYes: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.rulesForm.clearValidate() // 先清空校验
    })
    this.dealWith()
  },
  methods: {
    getproductOwner(val) {
      this.openData.productOwnerIdList = []
      this.cascaderKey = ++this.cascaderKey
      this.options = []
      if (val) {
        this.getArr(val)
      }
    },
    getArr(val) {
      const orgArr = this.formData.orgList.filter(ele => ele.tenantId === val)[0].orgTreeNodeList
      orgArr.forEach(item => {
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
    },
    // 获取产品信息
    getInfo(val) {
      if (val) {
        getProductInfo(val).then(res => {
          this.productName = res.data.productName
          this.categoryName = res.data.categoryName
          this.url = res.data.imageUrl
          this.getYes = true
        }).catch(() => {
          this.productName = ''
          this.categoryName = ''
          this.url = ''
          this.getYes = false
        })
      }
    },
    // 根据仓库名称获取仓库类型
    getWarehouse(val) {
      this.warehouseBelong = val.data.warehouseBelong
      this.warehouseType = val.data.warehouseType.desc
    },
    // 确认新增
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (!this.getYes) {
            this.$message.error('请填写正确的产品编码！')
          } else if (+this.openData.stockLowerLimit > +this.openData.stockUpperLimit) {
            this.$message.error('库存上限不能低于库存下限，请重新填写！')
          } else {
            if (this.isAdd) {
              this.openData.productOwnerId = this.openData.productOwnerPathIds[1]
            }
            (this.isAdd ? save : update)(this.openData).then(() => {
              this.$parent.$emit('close', true)
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            })
          }
        }
      })
    },
    // 编辑处理
    dealWith() {
      this.loading = true
      if (this.isAdd) {
        this.openData = JSON.parse(JSON.stringify(this.addData))
        this.loading = false
      } else {
        updateDetail(this.addData.id).then(res => {
          this.openData = res.data
          this.getInfo(this.openData.productSku)
          const wareObj = this.formData.warehouseNameList.filter(item => item.id === this.openData.warehouseId)[0]
          this.warehouseBelong = wareObj.warehouseBelong
          this.warehouseType = wareObj.warehouseType.desc
          this.loading = false
        })
      }
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

.bigBox{
  display: flex;
  align-items: flex-start;
  .inputBox{
    width: 50%;
  }
  .imgBox{
    width: 50%;
    display: flex;
    justify-content: center;
    align-items:flex-start;
  }
}

</style>
