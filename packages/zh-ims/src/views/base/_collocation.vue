<template>
  <!-- 基础管理/仓库配置-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form ref="formRef" :model="submit" label-width="100px" size="mini" class="no-message">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item prop="warehouseName" label="虚拟仓名称">
                <g-select v-model="submit.id" style="width:80%;" :items="warehouseTypeList" key-field="id" label-field="warehouseName" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="warehouseCode" label="虚拟仓代码">
                <el-input v-model.trim="submit.warehouseCode" clearable placeholder="请填写" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="status" label="状态" label-width="50px">
                <el-select v-model="submit.status" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
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
      <el-table-column slot="warehouseName" label="虚拟仓名称" min-width="130" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <g-link v-if="row.status != 0" color="primary" @click="detailBtn(row)">{{ row.warehouseName }}</g-link>
          <span v-else>{{ row.warehouseName }}</span>
        </template>
      </el-table-column>

      <!-- 国家编码 -->
      <el-table-column slot="countryCode" label="国家编码" min-width="150" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <span>{{ row.countryCode }}  ( {{ row.countryName }} )</span>
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
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="130">
        <template v-slot="{row}">
          <el-button v-if="row.status == 0" type="text" @click="enableBtn(row)">启用</el-button>
          <el-button v-if="row.status == 0" type="text" @click="addBtn(row)">编辑</el-button>
          <el-button v-if="row.status == 0" type="text" @click="removeBtn(row)">删除</el-button>
          <el-button v-if="row.status == 1" type="text" @click="addBtn(row)">调整</el-button>
          <el-button v-if="row.status == 1" type="text" @click="disableBtn(row)">停用</el-button>
          <el-button v-if="row.status != 0" type="text" @click="detailBtn(row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>

  </basic-container>
</template>

<script>
import { getList, remove, start, stop, getVirtualWarehouse } from '@/api/base/collocation.js'
import { getDictBiz, getAllEnableWarehouse } from '@/api/public/public.js'
import collocationAdd from './components/collocationAdd'
import collocationDetail from './components/collocationDetail'
export default {
  name: 'ImsBaseCollocation',
  data() {
    return {
      warehouseTypeList: [],
      warehouseBelongList: [],
      submit: {
        warehouseCode: '',
        id: '',
        status: ''
      },
      searchData: [],
      statusList: [],
      warehouseList: [],
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'warehouseName'
        },
        {
          label: '虚拟仓代码',
          prop: 'warehouseCode',
          minWidth: '150px',
          align: 'center',
          showOverflowTooltip: true
        },
        {
          slot: true,
          slotName: 'countryCode'
        },
        {
          label: '创建人',
          prop: 'createUserName',
          minWidth: '110px',
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
          slotName: 'status'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      addData: {
        warehouseName: '',
        warehouseCode: '',
        countryCode: '',
        warehouseRelationDTOList: []
      },
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
      // 虚拟仓名称
      getVirtualWarehouse().then(res => {
        this.warehouseTypeList = res.data
      })
      // 状态
      getDictBiz('virtual_warehouse_status').then(res => {
        this.statusList = res.data
      })
      // 仓库
      getAllEnableWarehouse().then(res => {
        this.warehouseList = res.data
      })
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
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    //   重置
    reset() {
      Object.keys(this.submit).forEach(item => {
        this.submit[item] = ''
      })
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
      this.$modal({
        title: (this.isAdd ? '新增虚拟仓信息' : '编辑虚拟仓信息'),
        component: collocationAdd,
        data: {
          isAdd: this.isAdd,
          warehouseList: this.warehouseList,
          addData: (this.isAdd ? this.addData : val)
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
      this.confirm('启用', { id: val.id }, start)
    },
    // 删除
    removeBtn(val) {
      this.confirm('删除', val.id, remove)
    },
    // 停用
    disableBtn(val) {
      this.confirm('停用', { id: val.id }, stop)
    },
    // 详情
    detailBtn(val) {
      this.$modal({
        title: '虚拟仓详情',
        component: collocationDetail,
        data: {
          id: val.id
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
    margin-left: 0px!important;
  }
}

</style>
