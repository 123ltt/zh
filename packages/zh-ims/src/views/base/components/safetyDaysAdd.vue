<template>
  <!-- 新增库存共享 -->
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
        <el-button style="float: right; padding: 5px 7px;margin-left:20px" size="mini" @click="$emit('close')">返回</el-button>
        <el-button style="float: right; padding: 5px 7px" size="mini" type="primary" @click="define()">保存</el-button>
      </div>
      <el-form ref="rulesForm" label-width="100px" size="mini" :model="openData" :rules="rules">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item prop="productAuthId" label="货权">
              <el-select v-model="openData.productAuthId" clearable placeholder="请选择" filterable :disabled="!isAdd" style="width:100%" @input="getproductOwner">
                <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isAdd" :span="8">
            <el-form-item label="货主" class="is-required">
              <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable :options="options" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col v-else :span="8">
            <el-form-item label="货主" class="is-required">
              <el-input :value="openData.productOwnerName" disabled style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="产品编码" prop="productSku">
              <el-input v-model.trim="openData.productSku" placeholder="请输入" :disabled="!isAdd" style="width:100%" @change="getInfo" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品类目" prop="category">
              <el-input v-model="openData.skuInfo.categoryName" disabled placeholder="请先输入产品编码" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称" prop="category">
              <el-input v-model="openData.skuInfo.productName" disabled placeholder="请先输入产品编码" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="分仓配置" prop="divWarehouseSet" class="is-required">
              <el-radio-group v-model="openData.divWarehouseSet" :disabled="!isAdd" @change="changeVal">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安全天数" :rules="hasTenants?{required: false}:{required: true, message: '安全天数不能为空', trigger: 'blur'}">
              <el-input v-model.trim="openData.safeDay" v-input.numeric.positive placeholder="请输入" :disabled="hasTenants" style="width:100%" maxlength="6" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card v-if="hasTenants">
      <div slot="header">
        <span style="font-weight: 600;">分仓安全库存</span>
      </div>
      <el-form ref="formRef" :model="submit" label-width="100px" size="mini">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item prop="warehouseId" label="仓库名称" class="is-required">
              <g-select v-model="submit.warehouseId" :items="warehouseList" key-field="id" label-field="warehouseName" value-field="id" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="addBtn()">添加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="openData.divWarehouseDetailList" size="mini" max-height="350px" stripe style="width: 100%" border>
        <el-table-column prop="warehouseType" label="仓库类型" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ warehouseTypeObj[row.warehouse.warehouseType.value] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="warehouseBelong" label="仓库归属" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ warehouseObj[row.warehouse.warehouseBelong] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="warehouseId" label="仓库名称" align="center" min-width="120">
          <template slot-scope="{row}">
            <span>{{ warehouseListObj[row.warehouseId] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="safeDay" label="安全天数" align="center" min-width="120">
          <template slot-scope="{row}">
            <el-input v-model.trim="row.safeDay" v-input.numeric.positive placeholder="请输入" maxlength="6" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="90" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="remove(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </basic-container>
</template>

<script>
import { getOrg, getAllEnableWarehouse, getDictBiz } from '@/api/public/public.js'
import { save, update, getEditDetail, getProductInfo } from '@/api/base/safetyDays.js'

export default {
  name: 'SafetyDaysAdd',
  props: {
    aditData: Object,
    isAdd: Boolean
  },
  data() {
    return {
      loading: false,
      cascaderKey: 0,
      productOwnerIdList: [],
      orgList: [],
      options: [], // 货主数组
      warehouseList: [],
      warehouseListObj: {},
      warehouseBelongList: [],
      warehouseObj: {},
      warehouseTypeList: [],
      warehouseTypeObj: {},
      rules: {
        productAuthId: [{ required: true, message: '请选择货权！', trigger: 'change' }],
        productSku: [{ required: true, message: '请填写sku！', trigger: 'blur' }],
        divWarehouseSet: [{ required: true, message: '请选择分仓配置！', trigger: 'change' }]
      },
      openData: {
        skuInfo: {
          productName: '',
          categoryName: ''
        },
        productAuthId: '',
        productSku: '',
        divWarehouseSet: '',
        safeDay: '',
        divWarehouseDetailList: []
      },
      submit: {
        warehouseId: ''
      },
      getYes: false,
      hasTenants: true
    }
  },
  mounted() {
    this.dealWith()
  },
  methods: {
    // 获取下拉数据
    getData() {
      // 获取货权
      getOrg().then(res => {
        this.orgList = res.data
      })
      // 仓库类型
      getDictBiz('warehouse_type').then(res => {
        this.warehouseTypeList = res.data
        this.warehouseTypeList.forEach(item => {
          this.warehouseTypeObj[item.dictKey] = item.dictValue
        })
      })
      // 仓库归属
      getDictBiz('warehouse_belong').then(res => {
        this.warehouseBelongList = res.data
        this.warehouseBelongList.forEach(item => {
          this.warehouseObj[item.dictKey] = item.dictValue
        })
      })
      // 仓库名称
      getAllEnableWarehouse().then(res => {
        this.warehouseList = res.data
        this.warehouseList.forEach(item => {
          this.warehouseListObj[item.id] = item.warehouseName
        })
      })
    },
    getproductOwner(val) {
      this.cascaderKey = ++this.cascaderKey
      this.productOwnerIdList = []
      this.options = []
      if (val) {
        const orgArr = this.orgList.filter(ele => ele.tenantId === val)[0].orgTreeNodeList
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
      }
    },
    changeVal(val) {
      if (val === '0') {
        this.hasTenants = false
        this.openData.divWarehouseDetailList = []
        this.submit.warehouseType = ''
        this.submit.warehouseBelong = ''
        this.submit.warehouseId = ''
      } else {
        this.hasTenants = true
        this.openData.safeDay = ''
      }
    },
    // 获取产品信息
    getInfo(val) {
      if (val) {
        getProductInfo(val).then(res => {
          this.openData.skuInfo.productName = res.data.productName
          this.openData.skuInfo.categoryName = res.data.categoryName
          this.getYes = true
        }).catch(() => {
          this.openData.skuInfo.productName = ''
          this.openData.skuInfo.categoryName = ''
          this.productName = false
        })
      }
    },
    addBtn() {
      if (this.submit.warehouseId) {
        const checkObj = this.warehouseList.filter(item => { return item.id === this.submit.warehouseId })[0]
        const repeatObj = this.openData.divWarehouseDetailList.filter(item => {
          return item.warehouseId === this.submit.warehouseId
        })
        if (repeatObj.length) {
          this.$message.error('不能添加重复的分仓安全库存信息！')
        } else {
          const obj = {
            warehouse: {
              warehouseType: {
                value: checkObj.warehouseType.value
              },
              warehouseBelong: checkObj.warehouseBelong
            },
            warehouseId: this.submit.warehouseId,
            safeDay: ''
          }
          this.openData.divWarehouseDetailList.push(obj)
          this.submit.warehouseId = ''
        }
      } else {
        this.$message.error('请选择完整的分仓安全库存信息！')
      }
    },
    remove(val) {
      this.openData.divWarehouseDetailList.splice(val.$index, 1)
    },
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          const emptyArr = this.openData.divWarehouseDetailList.filter(item => { return item.safeDay === '' })
          if (!this.productOwnerIdList.length && this.isAdd) {
            this.$message.error('请选择共享方(货主)！')
          } else if (this.openData.divWarehouseSet === '1' && !this.openData.divWarehouseDetailList.length) {
            this.$message.error('请填写相对应的分仓安全库存！')
          } else if (emptyArr.length) {
            this.$message.error('请填写分仓安全库存的安全天数！')
          } else {
            this.openData.productOwnerId = this.productOwnerIdList[1];
            (this.isAdd ? save : update)(this.openData).then(res => {
              this.$emit('close', true)
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            })
          }
        }
      })
    },
    dealWith() {
      this.getData()
      if (!this.isAdd) {
        this.loading = true
        getEditDetail(this.aditData.id).then(res => {
          this.openData = res.data
          this.openData.divWarehouseSet = this.openData.divWarehouseSet + ''
          if (this.openData.divWarehouseSet === '0') {
            this.hasTenants = false
          }
          if (this.openData.safeDay === -1) {
            this.openData.safeDay = ''
          }
          this.loading = false
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-table .warning-row {
    color: #ccc;
  }

</style>
