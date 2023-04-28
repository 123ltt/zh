<template>
  <!-- 新增库存共享 -->
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
            <el-form-item prop="info.productAuthId" label="共享方(货权)">
              <el-select v-model="openData.info.productAuthId" clearable placeholder="请选择" filterable style="width:80%" :disabled="!isAdd" @input="getproductOwner">
                <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isAdd" :span="8">
            <el-form-item label="共享方(货主)" class="is-required">
              <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:80%" :options="options" />
            </el-form-item>
          </el-col>
          <el-col v-else :span="8">
            <el-form-item label="共享方(货主)" class="is-required">
              <el-input :value="openData.info.productOwnerName" style="width:80%" disabled />
            </el-form-item>
          </el-col>
          <el-col v-if="isAdd" :span="8">
            <el-form-item prop="info.warehouseId" label="共享仓库">
              <el-select v-model="openData.info.warehouseId" clearable placeholder="请选择" filterable style="width:80%">
                <el-option v-for="item in warehouseList" :key="item.id" :label="item.warehouseName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-else :span="8">
            <el-form-item label="共享仓库" class="is-required">
              <el-input :value="openData.info.warehouse.warehouseName" style="width:80%" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="共享租户范围" prop="info.sharingTenantsScope" class="is-required">
              <el-radio-group v-model="openData.info.sharingTenantsScope" @change="changeTenants">
                <el-radio label="ALL">全部租户</el-radio>
                <el-radio label="PART">部分租户</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="共享产品范围" class="is-required" prop="info.sharingProductsScope">
              <el-radio-group v-model="openData.info.sharingProductsScope" @change="changeProducts">
                <el-radio label="ALL">全部产品</el-radio>
                <el-radio label="PART">部分产品</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card v-if="hasTenants">
      <div slot="header">
        <span style="font-weight: 600;">共享租户范围</span>
      </div>
      <div style="width:50%">
        <el-table :data="openData.tenants" size="mini" max-height="350px" stripe style="width: 100%" border>
          <el-table-column prop="productAuthName" label="分销方(货权)" align="center" min-width="130" />
          <el-table-column prop="productOwnerId" label="分销方(货主)" align="center" min-width="130">
            <template slot-scope="scope">
              <span>{{ scope.row.productOwnerId==-1?'全部':'' }}</span>
            </template>
          </el-table-column>
          <el-table-column type="index" width="70" align="center">
            <template slot="header">
              <el-button icon="el-icon-plus" size="mini" type="primary" circle @click="addTenantsBtn()" />
            </template>
            <template slot-scope="scope">
              <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeTenants(scope)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card v-if="hasProducts">
      <div slot="header">
        <span style="font-weight: 600;">共享产品范围</span>
      </div>
      <el-table :data="openData.products" size="mini" max-height="350px" stripe style="width: 100%" border>
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="110" />
        <el-table-column prop="imageUrl" label="产品图片" align="center" width="70">
          <template slot-scope="scope">
            <g-thumb class="d-table-cell" :url="scope.row.skuInfo.imageUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="skuInfo.productName" label="产品名称" align="center" min-width="120">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2">{{ scope.row.skuInfo.productName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="skuInfo.categoryPath" label="产品类目" align="center" min-width="90">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2">{{ scope.row.skuInfo.categoryPath }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="sharingQuantity" label="共享数量" align="center" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.sharingQuantity ==-1?'全部': scope.row.sharingQuantity }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="priceBeforeSharing" label="共享前价格" align="center" min-width="90">
          <template slot-scope="scope">
            <span>{{ isHas(scope.row.priceBeforeSharing) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="priceAfterSharing" label="共享后价格" align="center" min-width="90">
          <template slot-scope="scope">
            <span>{{ isHas(scope.row.priceAfterSharing) }}</span>
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
import { save, update, getDetail } from '@/api/handle/shared.js'
import tenantsAdd from './tenantsAdd.vue'
import productsAdd from './productsAdd.vue'

export default {
  name: 'SharedAdd',
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
        'info.productAuthId': [{ required: true, message: '请选择共享方(货权)！', trigger: 'change' }],
        'info.warehouseId': [{ required: true, message: '请选择共享仓库！', trigger: 'change' }],
        'info.sharingTenantsScope': [{ required: true, message: '请选择共享租户范围！', trigger: 'change' }],
        'info.sharingProductsScope': [{ required: true, message: '请选择共享产品范围！', trigger: 'change' }]
      },
      openData: {
        info: {
          warehouse: {
            warehouseName: ''
          },
          productAuthId: '',
          warehouseId: '',
          productOwnerId: '',
          sharingProductsScope: '',
          sharingTenantsScope: ''
        },
        products: [],
        tenants: []
      },
      tableData: {},
      isTable: false,
      hasTenants: true,
      hasProducts: true
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
    changeTenants(val) {
      if (val === 'ALL') {
        this.hasTenants = false
        this.openData.tenants = []
      } else {
        this.hasTenants = true
      }
    },
    changeProducts(val) {
      if (val === 'ALL') {
        this.hasProducts = false
        this.openData.products = []
      } else {
        this.hasProducts = true
      }
    },
    addTenantsBtn() {
      this.$modal({
        title: '新增分销方',
        component: tenantsAdd,
        width: '300px',
        data: {},
        callback: (val) => {
          if (val) {
            const arr = this.openData.tenants.find(o => o.productAuthId === val.productAuthId)
            if (arr) {
              this.$message.error('该分销方已被选择！')
            } else {
              this.openData.tenants.unshift(val)
            }
          }
        }
      })
    },
    removeTenants(val) {
      this.openData.tenants.splice(val.$index, 1)
    },
    addProductsBtn(val) {
      if (val) {
        this.isTable = false
      } else {
        this.isTable = true
      }
      this.$modal({
        title: (this.isTable ? '新增共享产品' : '编辑共享产品'),
        component: productsAdd,
        data: {
          tableData: this.isTable ? {} : val.row,
          isTable: this.isTable
        },
        callback: (el) => {
          if (el) {
            if (this.isTable) {
              const arr = this.openData.products.find(o => o.productSku === el.productSku)
              if (arr) {
                this.$message.error('该共享产品已被选择！')
              } else {
                this.openData.products.unshift(el)
              }
            } else {
              this.openData.products.splice(val.$index, 1, el)
            }
          }
        }
      })
    },
    removeProducts(val) {
      this.openData.products.splice(val.$index, 1)
    },
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (!this.productOwnerIdList.length && this.isAdd) {
            this.$message.error('请选择共享方(货主)！')
          } else if (this.openData.info.sharingProductsScope === 'PART' && !this.openData.products.length) {
            this.$message.error('请填写相对应的共享产品！')
          } else if (this.openData.info.sharingTenantsScope === 'PART' && !this.openData.tenants.length) {
            this.$message.error('请填写相对应的分销方！')
          } else {
            this.openData.info.productOwnerId = this.productOwnerIdList[1];
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
        getDetail(this.aditData.id).then(res => {
          this.openData = res.data
          this.changeTenants(this.openData.info.sharingTenantsScope)
          this.changeProducts(this.openData.info.sharingProductsScope)
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
