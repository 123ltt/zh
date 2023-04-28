<template>
  <!-- 新增滞销规则 -->
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
        <el-button style="float: right; padding: 5px 7px;margin-left:20px" size="mini" @click="$emit('close')">返回</el-button>
        <el-button style="float: right; padding: 5px 7px" size="mini" type="primary" @click="define()">确认</el-button>
      </div>
      <el-form ref="rulesForm" label-width="100px" size="mini" :model="openData" :rules="rules" :class="isAdd?'':'no-message'">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item prop="productAuthId" label="货权">
              <el-select v-model="openData.productAuthId" clearable placeholder="请选择" filterable style="width:80%" :disabled="!isAdd" @input="getproductOwner">
                <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isAdd" :span="8">
            <el-form-item label="货主" class="is-required">
              <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:80%" :options="options" />
            </el-form-item>
          </el-col>
          <el-col v-else :span="8">
            <el-form-item label="货主" class="is-required">
              <el-input :value="openData.productOwnerName" style="width:80%" disabled />
            </el-form-item>
          </el-col>
          <el-col v-if="!isAdd" :span="8">
            <el-form-item label="仓库类型" class="is-required">
              <el-input :value="openData.warehouse.warehouseType.desc" style="width:80%" disabled />
            </el-form-item>
          </el-col>
          <el-col v-if="!isAdd" :span="8">
            <el-form-item label="仓库归属" class="is-required">
              <el-input :value="warehouseBelongObj[openData.warehouse.warehouseBelong]" style="width:80%" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="warehouseId" label="仓库名称">
              <g-select v-model="openData.warehouseId" style="width:80%;" :items="warehouseNameList" key-field="id" label-field="warehouseName" value-field="id" :disabled="!isAdd" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">滞销规则</span>
      </div>
      <el-table :data="openData.unsalableRuleDetailList" size="mini" max-height="350px" stripe style="width: 100%" border>
        <el-table-column prop="productCycleType" label="产品周期性" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.productCycleType == 'in_season'?'应季产品':'非应季产品' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="seasonNatureName" label="季节属性" align="center" min-width="100" />
        <el-table-column prop="seasonPeriod" label="季节周期" align="center" min-width="130">
          <template slot-scope="{row}">
            <span v-if="row.seasonPeriodBegin">{{ replaceDate(row.seasonPeriodBegin) }}  ~  {{ replaceDate(row.seasonPeriodEnd) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="unsalableDate" label="滞销日期" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ replaceDate(row.unsalableDate) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="productAgeValue" label="产品库龄" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ characterObj[row.productAgeOperate] }}  {{ row.productAgeValue }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productTurnoverDayValue" label="产品周转天数" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ characterObj[row.productTurnoverDayOperate] }}  {{ row.productTurnoverDayValue }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productSalesValue" label="产品销量" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ characterObj[row.productSalesOperate] }}  {{ row.productSalesValue }}</span>
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
import { getOrg, getAllEnableWarehouse, getDictBiz } from '@/api/public/public.js'
import { save, update, getEditDetail } from '@/api/base/unsalableRules.js'
import ruleAdd from './ruleAdd.vue'

export default {
  name: 'UnsalableRulesAdd',
  props: {
    aditData: Object,
    warehouseBelongObj: Object,
    isAdd: Boolean
  },
  data() {
    return {
      loading: false,
      productOwnerIdList: [],
      warehouseNameList: [],
      cascaderKey: 0,
      characterObj: {},
      orgList: [],
      options: [], // 货主数组
      rules: {
        productAuthId: [{ required: true, message: '请选择货权！', trigger: 'change' }],
        warehouseId: [{ required: true, message: '请选择仓库名称！', trigger: 'change' }]
      },
      openData: {
        warehouseId: '',
        productAuthId: '',
        productOwnerId: '',
        warehouse: {
          warehouseType: {}
        },
        unsalableRuleDetailList: []
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
      // 仓库名称
      getAllEnableWarehouse().then(res => {
        this.warehouseNameList = res.data
      })
      // 操作符
      getDictBiz('operator').then(res => {
        res.data.forEach(item => {
          this.characterObj[item.dictKey] = item.dictValue
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
      if (val) {
        this.isTable = false
      } else {
        this.isTable = true
      }
      this.$modal({
        title: (this.isTable ? '新增滞销规则' : '编辑滞销规则'),
        component: ruleAdd,
        width: '25%',
        data: {
          isTable: this.isTable,
          tableData: this.isTable ? {} : val.row
        },
        callback: (el) => {
          if (el) {
            if (this.isTable) {
              if (el.productCycleType === 'not_season') {
                const arr = this.openData.unsalableRuleDetailList.filter(item => {
                  return item.productCycleType === 'not_season'
                })
                if (arr.length) {
                  this.$message.error('请勿添加重复的非应季产品！')
                } else {
                  this.openData.unsalableRuleDetailList.unshift(el)
                }
              } else if (el.productCycleType === 'in_season') {
                const arr = this.openData.unsalableRuleDetailList.filter(item => {
                  return item.seasonNatureCode === el.seasonNatureCode
                })
                if (arr.length) {
                  this.$message.error('请勿添加重复季节属性的产品！')
                } else {
                  this.openData.unsalableRuleDetailList.unshift(el)
                }
              }
            } else {
              this.openData.unsalableRuleDetailList.splice(val.$index, 1, el)
            }
          }
        }
      })
    },
    removeProducts(val) {
      this.openData.unsalableRuleDetailList.splice(val.$index, 1)
    },
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (!this.productOwnerIdList.length && this.isAdd) {
            this.$message.error('请选择授权方(货主)！')
          } else if (!this.openData.unsalableRuleDetailList.length) {
            this.$message.error('请填写相对应的滞销规则！')
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
    removeNum(arr) {
      arr.forEach(item => {
        Object.keys(item).forEach(el => {
          if (item[el] === -1) {
            item[el] = ''
          }
        })
      })
    },
    replaceDate(val) {
      if (val) {
        const strA = val.split('-')[0]
        const strB = val.split('-')[1]
        return `${strA}月 ${strB}日`
      }
    },
    dealWith() {
      this.getData()
      if (!this.isAdd) {
        this.loading = true
        getEditDetail(this.aditData.id).then(res => {
          this.openData = res.data
          this.openData.warehouseId = this.openData.warehouseId + ''
          this.removeNum(this.openData.unsalableRuleDetailList)
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
