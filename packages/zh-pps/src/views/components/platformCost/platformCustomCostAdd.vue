<template>
  <!-- 自定义成本新增，编辑 -->
  <el-form v-if="showData" ref="rulesForm" size="mini" :model="openData" label-width="120px">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item prop="categoryId" label="产品类目" :rules="{ required: false, message: '产品类目不能为空', trigger: 'change' }">
          <category-cascader v-model="openData.categoryId" check-strictly :multiple="false" style="width:80%;" @input="getCategory" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="productSku" label="产品编码" :rules="{ required: false, message: '请输入产品编码', trigger: 'blur' }">
          <el-input v-model="openData.productSku" clearable placeholder="请输入名称" style="width:80%;" @input="getProduct" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="costName" label="费用名称" :rules="{ required: true, message: '请输入费用名称', trigger: 'blur' }">
          <el-input v-model="openData.costName" clearable placeholder="请输入名称" style="width:80%;" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="costType" label="费用类型" :rules="{ required: true, message: '请选择费用类型', trigger: 'change' }">
          <el-select v-model="openData.costType" placeholder="请选择" filterable style="width:80%;">
            <el-option v-for="item in costTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="costValue" label="费用值" :rules="{ required: true, message: '请输入费用值', trigger: 'blur' }">
          <el-input v-model="openData.costValue" v-input.positive clearable placeholder="请输入费用值" style="width:58%;" @input="changeCostValue" />
          <el-select v-if="openData.costType === '1'" v-model="openData.costCurrency" placeholder="请选择" filterable style="width:22%" @change="$forceUpdate()">
            <el-option v-for="item in costCurrencyList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
          <span v-if="openData.costType === '2'" style="width:15%">%</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item style="text-align: right;padding-right: 20px;">
          <el-button size="mini" icon="el-icon-circle-close" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="define()">{{ isAdd ? '添加' : '修改' }}</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import CategoryCascader from '@/components/category-cascader/index.vue'
import { searchSkuTopN, getByIds } from '@/api/commonApi.js'
export default {
  name: 'PlatformCustomCostAdd',
  components: { CategoryCascader },
  props: {
    costTypeList: Array,
    costCurrencyList: Array,
    isAdd: Boolean,
    openData: Object
  },
  data() {
    return {
      showData: false,
      skuList: [],
      productCategory: '',
      productName: '',
      categoryName: ''
    }
  },
  mounted() {
    this.getData()
  },
  created() {
    this.dealWith()
  },
  methods: {
    getData() {
    },
    // 封装判断函数
    bool(val) {
      if (val == null || val === '') {
        return true
      }
      return false
    },
    // 确认新增
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          this.openData.platformCostType = 1
          this.costTypeList.forEach(item => {
            if (this.openData.costType === item.dictKey) {
              this.openData.costTypeName = item.dictValue
            }
          })
          this.costCurrencyList.forEach(item => {
            if (this.openData.costCurrency === item.dictKey) {
              this.openData.costCurrencyName = item.dictValue
            }
          })
          if (this.isAdd) {
            this.$parent.$emit('close', this.openData)
          } else {
            this.$parent.$emit('close', this.openData)
          }
        }
      })
    },
    // 编辑处理
    dealWith() {
      if (this.isAdd) {
        this.showData = true
        // 新增时，默认费用类型为固定值
      } else {
        // 编辑
        // 在新增时，由于categoryIds为空 所以需要重新查询对应的id
        getByIds(this.openData.categoryId).then(res => {
          console.log('res.data', res.data)
          if (res.data.length !== 0) {
            this.openData.categoryIds = res.data[0].categoryPathId.split(',')
            if (this.openData.categoryIds && this.openData.categoryIds.length > 0) {
              this.openData.categoryId = this.openData.categoryIds
            }
          }
          this.showData = true
        })
        // }
        this.openData.costType = this.openData.costType + ''
        this.openData.costCurrency = this.openData.costCurrency + ''
      }
    },
    // 根据类目id 查到类目名称
    getCategory(categoryId) {
      // const obj = {
      //   data: {
      //     categoryIds: [categoryId],
      //     lstStatus: [2]
      //   }
      // }
      // searchSkuTopN(obj).then(res => {
      //   const data = res.data.records
      //   if (data.length !== 0) {
      //     this.openData.categoryName = data[0].categoryName
      //   } else {
      //     this.openData.categoryName = ''
      //   }
      // })
      getByIds(this.openData.categoryId).then(res => {
        const data = res.data
        if (data.length !== 0) {
          this.openData.categoryName = data[0].name
        } else {
          this.openData.categoryName = ''
        }
      })
    },
    changeCostValue(val) {
      if (val.indexOf('.') !== -1 && val.split('.')[1].length > 2) {
        this.openData.costValue = this.oldValue
      } else {
        this.oldValue = val
      }
    },

    getProduct(sku) {
      const obj = {
        data: {
          lstProductSku: [sku],
          lstStatus: [2]
        }
      }
      searchSkuTopN(obj).then(res => {
        if (res.code === 200) {
          const data = res.data.records
          if (data.length !== 0) {
            // this.openData.categoryId = data[0].categoryId
            // this.openData.categoryName = data[0].categoryName
            this.openData.productSku = data[0].productSku
            this.openData.productName = data[0].productName
          } else {
            this.$message.error('当前产品编码无效！')
          }
        } else {
          this.$message.error('当前产品编码无效！')
        }
      })
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
