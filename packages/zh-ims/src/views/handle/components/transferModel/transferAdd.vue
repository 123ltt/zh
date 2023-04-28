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
          <el-col :span="9">
            <el-form-item prop="productAuthId" label="转移方(货权)">
              <el-select v-model="openData.productAuthId" clearable placeholder="请选择" filterable style="width:80%" :disabled="!isAdd" @input="getproductOwner">
                <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isAdd" :span="8">
            <el-form-item label="转移方(货主)" class="is-required">
              <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:80%" :options="options" />
            </el-form-item>
          </el-col>
          <el-col v-else :span="9">
            <el-form-item label="转移方(货主)" class="is-required">
              <el-input :value="openData.productOwnerName" style="width:80%" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">转移明细</span>
      </div>
      <el-table :data="openData.productAuthChangeDetailList" size="mini" max-height="350px" stripe style="width: 100%" border>
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
        <el-table-column prop="warehouse.warehouseType.desc" label="仓库类型" align="center" min-width="90" />
        <el-table-column prop="warehouse.warehouseBelong" label="仓库归属" align="center" min-width="90">
          <template slot-scope="scope">
            <span>{{ warehouseBelongObj[scope.row.warehouse.warehouseBelong] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="warehouse.warehouseName" label="仓库名称" align="center" min-width="90" />
        <el-table-column prop="stockLocationOutsideCode" label="库位号" align="center" min-width="90" />
        <el-table-column prop="changeQty" label="转移数量" align="center" min-width="70">
          <template slot-scope="scope">
            <span>{{ isHas(scope.row.changeQty) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productAuthName" label="接受方(货权)" align="center" min-width="120">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2">{{ scope.row.productAuthName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="productOwnerName" label="接受方(货主)" align="center" min-width="110">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2">{{ scope.row.productOwnerName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="priceBeforeChange" label="转移前成本" align="center" min-width="90">
          <template slot-scope="scope">
            <span>{{ isHas(scope.row.priceBeforeChange) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="priceAfterChange" label="转移后成本" align="center" min-width="90">
          <template slot-scope="scope">
            <span>{{ isHas(scope.row.priceAfterChange) }}</span>
          </template>
        </el-table-column>
        <el-table-column type="index" width="120" align="center" fixed="right">
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
import { getOrg, getDictBiz } from '@/api/public/public.js'
import { save, update, getDetail } from '@/api/handle/transfer.js'
import productsAdd from './productsAdd.vue'

export default {
  name: 'TransferAdd',
  props: {
    aditData: Object,
    isAdd: Boolean
  },
  data() {
    return {
      loading: false,
      cascaderKey: 0,
      productOwnerIdList: [],
      warehouseBelongObj: {},
      orgList: [],
      options: [], // 货主数组
      rules: {
        productAuthId: [{ required: true, message: '请选择转移方(货权)！', trigger: 'change' }]
      },
      openData: {
        changeCode: '',
        productAuthId: '',
        productOwnerId: '',
        productAuthChangeDetailList: []
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
      // 仓库归属
      getDictBiz('warehouse_belong').then(res => {
        res.data.forEach(item => {
          this.warehouseBelongObj[item.dictKey] = item.dictValue
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
    isHas(val) {
      if (val === -1 || !val) {
        return ''
      } else {
        return val
      }
    },
    addProductsBtn(val) {
      if ((!this.openData.productAuthId || !this.productOwnerIdList.length) && this.isAdd) {
        this.$message.error('请先选择转移方(货权)、转移方(货主)！')
      } else {
        if (val) {
          this.isTable = false
        } else {
          this.isTable = true
        }
        const obj = {
          productAuthId: this.openData.productAuthId,
          productOwnerId: this.isAdd ? this.productOwnerIdList[1] : this.openData.productOwnerId,
          productSku: ''
        }
        this.$modal({
          title: (this.isTable ? '新增产品转移' : '编辑产品转移'),
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
                const arr = this.openData.productAuthChangeDetailList.find(o => o.productSku === el.productSku && o.productOwnerId === el.productOwnerId && o.productAuthId === el.productAuthId)
                if (arr) {
                  this.$message.error('该转移产品已存在！')
                } else {
                  this.openData.productAuthChangeDetailList.unshift(el)
                }
              } else {
                this.openData.productAuthChangeDetailList.splice(val.$index, 1, el)
              }
            }
          }
        })
      }
    },
    removeProducts(val) {
      this.openData.productAuthChangeDetailList.splice(val.$index, 1)
    },
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (!this.productOwnerIdList.length && this.isAdd) {
            this.$message.error('请选择授权方(货主)！')
          } else if (!this.openData.productAuthChangeDetailList.length) {
            this.$message.error('请填写相对应的转移产品明细！')
          } else {
            if (this.isAdd) {
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
        getDetail(this.aditData.id).then(res => {
          this.openData.changeCode = res.data.changeCode
          this.openData.id = res.data.id
          this.openData.productOwnerId = res.data.productOwnerId + ''
          this.openData.productOwnerName = res.data.productOwnerName
          this.openData.productAuthId = res.data.productAuthId
          this.openData.productAuthChangeDetailList = res.data.productAuthChangeDetailList
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
