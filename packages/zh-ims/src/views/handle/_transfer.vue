<template>
  <!-- 库存处理/货权转移-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form ref="formRef" :model="submit" label-width="100px" size="mini" class="no-message">
          <el-row>
            <el-col :span="9">
              <el-form-item prop="changeCode" label="转移编码">
                <el-input v-model.trim="submit.changeCode" clearable placeholder="请填写" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="productAuthId" label="转移方(货权)">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:80%" @input="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="转移方(货主)">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择转移方(货权)" filterable style="width:80%" :options="options" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="createUser" label="转移人">
                <el-select v-model="submit.createUser" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
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
      <el-table-column slot="changeCode" label="转移编码" min-width="110" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status == 2" color="primary" @click="detailBtn(row)">{{ row.changeCode }}</g-link>
          <span v-else>{{ row.changeCode }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="70" align="center">
        <template v-slot="{row}">
          <span>{{ statusObj[row.status] }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="140">
        <template v-slot="{row}">
          <el-button v-if="row.status == 0 || row.status == 3" type="text" @click="commitBtn(row)">提交</el-button>
          <el-button v-if="row.status == 0|| row.status == 3" type="text" @click="addBtn(row)">编辑</el-button>
          <el-button v-if="row.status == 0|| row.status == 3" type="text" @click="removeBtn(row)">删除</el-button>
          <el-button v-if="row.status == 1" type="text" @click="verifyBtn(row)">审核</el-button>
          <el-button v-if="row.status == 2" type="text" @click="detailBtn(row)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>
  </basic-container>
</template>

<script>
import { getList, getOrg, remove, verify, commit, getTransferInfo } from '@/api/handle/transfer.js'
import transferDetail from './components/transferModel/transferDetail.vue'
import transferAdd from './components/transferModel/transferAdd.vue'
import { deepClone } from '@/util/util'

export default {
  name: 'ImsHandleTransfer',
  data() {
    return {
      submit: {
        changeCode: '',
        productAuthId: '',
        productOwnerId: '',
        createUser: ''
      },
      cascaderKey: 0,
      isAdd: '',
      aditData: {},
      searchData: [],
      userList: [],
      orgList: [], // 货权数组
      options: [], // 货主数组
      statusObj: { 0: '草稿', 1: '待审核', 2: '转移成功', 3: '转移失败' },
      productOwnerIdList: [],
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'changeCode'
        },
        {
          label: '转移方(货权)',
          prop: 'productAuthName',
          showOverflowTooltip: true,
          minWidth: '130px',
          align: 'center'
        },
        {
          label: '转移方(货主)',
          prop: 'productOwnerName',
          showOverflowTooltip: true,
          minWidth: '130px',
          align: 'center'
        },
        {
          label: '转移人',
          prop: 'createUserName',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '转移数量',
          prop: 'changeQtyTotal',
          minWidth: '70px',
          align: 'center'
        },
        {
          label: '转移前金额',
          prop: 'priceBeforeTotal',
          width: '90px',
          align: 'center'
        },
        {
          label: '转移后金额',
          prop: 'priceAfterTotal',
          width: '90px',
          align: 'center'
        },
        {
          label: '折损/溢价金额',
          prop: 'priceDiff',
          width: '100px',
          align: 'center'
        },
        {
          label: '操作时间',
          prop: 'updateTime',
          width: '130px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ]
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
      getTransferInfo().then(res => {
        this.userList = res.data
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
      this.searchData = {}
      this.initialization()
    },
    // 新增
    addBtn(val) {
      if (val) {
        this.isAdd = false
        this.aditData = deepClone(val)
      } else {
        this.isAdd = true
      }
      this.$newTab({
        path: '/handle/transfer/add',
        title: this.isAdd ? '新增货权转移' : '编辑货权转移',
        component: transferAdd,
        data: {
          isAdd: this.isAdd,
          aditData: this.aditData || {}
        },
        clearCache: true,
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
        }).catch(() => {
          if (title === '审核') {
            this.initialization()
          }
        })
      })
    },
    // 提交
    commitBtn(val) {
      this.confirm('提交', val.id, commit)
    },
    // 审核
    verifyBtn(val) {
      this.confirm('审核', val.id, verify)
    },
    // 删除
    removeBtn(val) {
      this.confirm('删除', val.id, remove)
    },
    // 详情
    detailBtn(val) {
      this.$newTab({
        path: '/transfer/transferDetail',
        title: '货权转移详情',
        component: transferDetail,
        data: {
          id: val.id
        },
        clearCache: true,
        callback: () => {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btnBox{
  ::v-deep .el-form-item__content{
    margin-left: 0!important;
  }
}

</style>
