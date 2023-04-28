<template>
  <!-- 新增库存代销 -->
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
        <el-button style="float: right; padding: 5px 7px;margin-left:20px" size="mini" @click="$emit('close')">返回</el-button>
        <el-button style="float: right; padding: 5px 7px" size="mini" type="primary" @click="define()">确认</el-button>
      </div>
      <el-form ref="rulesForm" label-width="100px" size="mini" :model="openData" :rules="rules">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item prop="productAuthId" label="授权方(货权)">
              <el-select v-model="openData.productAuthId" clearable placeholder="请选择" filterable style="width:80%" :disabled="!isAdd" @input="getproductOwner">
                <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isAdd" :span="8">
            <el-form-item label="授权方(货主)" class="is-required">
              <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:80%" :options="options" />
            </el-form-item>
          </el-col>
          <el-col v-else :span="8">
            <el-form-item label="授权方(货主)" class="is-required">
              <el-input :value="openData.productOwnerName" style="width:80%" disabled />
            </el-form-item>
          </el-col>
          <el-col v-if="isAdd" :span="8">
            <el-form-item prop="warehouseId" label="授权仓库">
              <el-select v-model="openData.warehouseId" clearable placeholder="请选择" filterable style="width:80%">
                <el-option v-for="item in warehouseList" :key="item.id" :label="item.warehouseName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-else :span="8">
            <el-form-item label="授权仓库" class="is-required">
              <el-input :value="openData.warehouse.warehouseName" style="width:80%" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">代销明细</span>
      </div>
      <el-table :data="openData.productProxySaleDetailList" size="mini" max-height="350px" stripe style="width: 100%" border>
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="110" />
        <el-table-column prop="imageUrl" label="产品图片" align="center" width="70">
          <template slot-scope="scope">
            <g-thumb class="d-table-cell" :url="scope.row.skuInfo.imageUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="skuInfo.productName" label="产品名称" align="center" min-width="120">
          <template v-slot="{row}">
            <g-text-ellipsis :lines="2">{{ row.skuInfo.productName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="skuInfo.categoryPath" label="产品类目" align="center" min-width="90">
          <template v-slot="{row}">
            <g-text-ellipsis :lines="2">{{ row.skuInfo.categoryPath }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="authQty" label="授权数量" align="center" min-width="70">
          <template slot-scope="scope">
            <span>{{ isHas(scope.row.authQty) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productAuthName" label="代销方(货权)" align="center" min-width="120">
          <template v-slot="{row}">
            <g-text-ellipsis :lines="2">{{ row.productAuthName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="productOwnerName" label="代销方(货主)" align="center" min-width="110">
          <template v-slot="{row}">
            <g-text-ellipsis :lines="2">{{ row.productOwnerName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="priceBeforeAuth" label="授权前价格" align="center" min-width="70">
          <template slot-scope="scope">
            <span>{{ isHas(scope.row.priceBeforeAuth) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="priceAfterAuth" label="授权后价格" align="center" min-width="70">
          <template slot-scope="scope">
            <span>{{ isHas(scope.row.priceAfterAuth) }}</span>
          </template>
        </el-table-column>
        <el-table-column type="index" width="120" align="center">
          <template slot="header">
            <el-button icon="el-icon-plus" size="mini" type="primary" circle @click="addProductsBtn()" />
          </template>
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="addProductsBtn(scope)">编辑</el-button>
            <el-button type="text" size="mini" @click="removeProducts(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </basic-container>
</template>

<script>
import { getOrg, getAllEnableWarehouse } from '@/api/public/public.js'
import { save, update, getQueryForEdit } from '@/api/handle/consignment.js'
import productsAdd from './productsAdd.vue'
import { deepClone } from '@/util/util'

export default {
  name: 'ConsignmentAdd',
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
      rules: {
        productAuthId: [{ required: true, message: '请选择共享方(货权)！', trigger: 'change' }],
        warehouseId: [{ required: true, message: '请选择共享仓库！', trigger: 'change' }]
      },
      openData: {
        warehouse: {
          warehouseName: ''
        },
        productAuthId: '',
        warehouseId: '',
        productOwnerId: '',
        productProxySaleDetailList: []
      },
      isTable: false
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
      getAllEnableWarehouse().then(res => {
        this.warehouseList = res.data
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
    isHas(val) {
      if (val === -1 || !val) {
        return ''
      } else {
        return val
      }
    },
    addProductsBtn(val) {
      if ((!this.openData.productAuthId || !this.openData.warehouseId || !this.productOwnerIdList.length) && this.isAdd) {
        this.$message.error('请先选择授权方(货权)、授权方(货主)、授权仓库！')
      } else {
        if (val) {
          this.isTable = false
        } else {
          this.isTable = true
        }
        const obj = {
          productAuthId: this.openData.productAuthId,
          warehouseId: this.openData.warehouseId,
          productOwnerId: this.isAdd ? this.productOwnerIdList[1] : this.openData.productOwnerId,
          productSku: ''
        }
        this.$modal({
          title: (this.isTable ? '新增代销明细' : '编辑代销明细'),
          component: productsAdd,
          data: {
            isTable: this.isTable,
            orgList: this.orgList,
            parsData: obj,
            tableData: this.isTable ? {} : val.row
          },
          callback: (el) => {
            if (el) {
              if (this.isTable) {
                const arr = this.openData.productProxySaleDetailList.find(o => o.productSku === el.productSku && o.productOwnerId === el.productOwnerId && o.productAuthId === el.productAuthId)
                if (arr) {
                  this.$message.error('该代销产品已存在！')
                } else {
                  this.openData.productProxySaleDetailList.unshift(el)
                }
              } else {
                this.openData.productProxySaleDetailList.splice(val.$index, 1, el)
              }
            }
          }
        })
      }
    },
    removeProducts(val) {
      this.openData.productProxySaleDetailList.splice(val.$index, 1)
    },
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (!this.productOwnerIdList.length && this.isAdd) {
            this.$message.error('请选择授权方(货主)！')
          } else if (!this.openData.productProxySaleDetailList.length) {
            this.$message.error('请填写相对应的代销产品明细！')
          } else {
            if (!this.isAdd) {
              this.openData.productProxySaleDetailUpdateDTO = this.openData.productProxySaleDetailList
            } else {
              this.openData.productOwnerId = this.productOwnerIdList[1]
            }
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
        this.openData = deepClone(this.aditData)
        getQueryForEdit(this.aditData.id).then(res => {
          this.openData.productProxySaleDetailList = res.data
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
