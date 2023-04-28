<template>
  <!-- 基础管理/安全天数-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form ref="formRef" :model="submit" label-width="80px" size="mini" class="no-message">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item prop="productSku" label="产品编码">
                <el-input v-model.trim="submit.productSku" clearable placeholder="请填写" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="productAuthId" label="货权">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:80%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="货主">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:80%" :options="options" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="btnBox">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="addBtn()">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="productSku" label="产品编码" min-width="110" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <g-link v-if="row.status != 0" color="primary" @click="detailBtn(row)">{{ row.productSku }}</g-link>
          <span v-else>{{ row.productSku }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="90" align="center">
        <template v-slot="{row}">
          <span v-if="row.status == 0">草稿</span>
          <span v-if="row.status == 1">启用</span>
          <span v-if="row.status == 2">停用</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template v-slot="{row}">
          <el-button v-if="row.status == 0" type="text" @click="enableBtn(row)">启用</el-button>
          <el-button v-if="row.status == 0" type="text" @click="addBtn(row)">编辑</el-button>
          <el-button v-if="row.status == 0" type="text" @click="removeBtn(row)">删除</el-button>
          <el-button v-if="row.status == 1" type="text" @click="addBtn(row)">调整</el-button>
          <el-button v-if="row.status == 1" type="text" @click="detailBtn(row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>

  </basic-container>
</template>

<script>
import { getList, remove, start } from '@/api/base/safetyDays.js'
import { getOrg } from '@/api/public/public.js'
import safetyDaysAdd from './components/safetyDaysAdd.vue'
import safetyDaysDetail from './components/safetyDaysDateil.vue'

export default {
  name: 'ImsBaseSafetyDays',
  data() {
    return {
      orgList: [], // 货权
      productOwnerIdList: [],
      warehouseBelongObj: {},
      submit: {
        productSku: '',
        productAuthId: '',
        productOwnerId: ''
      },
      cascaderKey: 0,
      searchData: [],
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'productSku'
        },
        {
          label: '产品名称',
          prop: 'skuInfo.productName',
          showOverflowTooltip: true,
          minWidth: '200px',
          align: 'center'
        },
        {
          label: '产品类目',
          prop: 'skuInfo.categoryName',
          showOverflowTooltip: true,
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '货权',
          prop: 'productAuthName',
          showOverflowTooltip: true,
          minWidth: '200px',
          align: 'center'
        },
        {
          label: '货主',
          prop: 'productOwnerName',
          showOverflowTooltip: true,
          minWidth: '130px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          label: '操作人',
          prop: 'updateUserName',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '操作时间',
          prop: 'updateTime',
          minWidth: '130px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      options: [],
      isAdd: false
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.initialization()
  },
  methods: {
    // 获取下拉数据
    getData() {
      // 获取货权
      getOrg().then(res => {
        this.orgList = res.data
      })
    },
    getproductOwner(val) {
      this.cascaderKey = ++this.cascaderKey
      this.submit.productOwnerId = ''
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
    // 初始化数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    initialization() {
      this.$refs.table.load(1, this.searchData)
    },
    search() {
      this.submit.productOwnerId = this.productOwnerIdList.length && this.submit.productAuthId ? this.productOwnerIdList[1] : ''
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    //   重置
    reset() {
      Object.keys(this.submit).forEach(item => {
        this.submit[item] = ''
      })
      this.cascaderKey = ++this.cascaderKey
      this.options = []
      this.productOwnerIdList = []
      this.searchData = []
      this.initialization()
    },
    // 新增
    addBtn(val) {
      if (val) {
        this.isAdd = false
      } else {
        this.isAdd = true
      }
      this.$newTab({
        title: (this.isAdd ? '新增安全天数' : '编辑安全天数'),
        path: '/base/safetyDays/add',
        clearCache: true,
        component: safetyDaysAdd,
        data: {
          isAdd: this.isAdd,
          aditData: this.isAdd ? {} : val
        },
        callback: (bool) => {
          if (bool) {
            this.isAdd ? this.reset() : this.initialization()
          }
        }
      })
    },
    // 信息确认
    confirm(title, obj, fn) {
      this.$confirm(`确定要${title}该条记录吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fn(obj).then(() => {
          this.initialization()
          this.$message.success('操作成功!')
        })
      })
    },
    // 启用
    enableBtn(val) {
      this.confirm('启用', val.id, start)
    },
    // 删除
    removeBtn(val) {
      this.confirm('删除', val.id, remove)
    },
    // 详情
    detailBtn(val) {
      this.$newTab({
        title: '安全天数详情',
        path: '/base/safetyDays/detail',
        clearCache: true,
        component: safetyDaysDetail,
        data: {
          dateil: val
        },
        callback: () => {}
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.btnBox{
  ::v-deep .el-form-item__content{
    margin-left:20px!important;
  }
}

</style>
