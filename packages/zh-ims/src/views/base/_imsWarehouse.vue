<template>
  <!-- 基础管理/仓库信息-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form ref="formRef" :model="submit" label-width="100px" size="mini" class="no-message">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="warehouseType" label="仓库类型">
                <el-select v-model="submit.warehouseType" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in warehouseTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="warehouseBelong" label="仓库归属">
                <g-select v-model="submit.warehouseBelong" style="width:80%;" :items="warehouseBelongList" key-field="dictKey" label-field="dictValue" value-field="dictKey" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="id" label="仓库名称">
                <g-select v-model="submit.id" style="width:80%;" :items="warehouseList" key-field="id" label-field="warehouseName" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="warehouseCode" label="仓库代码">
                <el-input v-model.trim="submit.warehouseNumber" clearable placeholder="请填写" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="status" label="状态">
                <el-select v-model="submit.status" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
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
      <el-table-column slot="warehouseName" label="仓库名称" min-width="110" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <g-link v-if="row.status != 0" color="primary" @click="detailBtn(row)">{{ row.warehouseName }}</g-link>
          <span v-else>{{ row.warehouseName }}</span>
        </template>
      </el-table-column>

      <!-- 仓库归属 -->
      <el-table-column slot="warehouseBelong" label="仓库归属" min-width="95" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <span>{{ warehouseObj[row.warehouseBelong] }}</span>
        </template>
      </el-table-column>

      <!-- 国家编码 -->
      <el-table-column slot="countryCode" label="国家编码" min-width="95" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <span>{{ row.countryCode }}  ({{ row.countryName }})</span>
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
          <el-button v-if="row.status == 1" type="text" @click="disableBtn(row)">停用</el-button>
          <el-button v-if="row.status != 0" type="text" @click="detailBtn(row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>

  </basic-container>
</template>

<script>
import { getList, remove, start, stop, getAllWarehouse } from '@/api/base/imsWarehouse.js'
import { getDictBiz } from '@/api/public/public.js'
import imsWarehouseAdd from './components/imsWarehouseAdd'
import imsWarehouseDetail from './components/imsWarehouseDetail'
export default {
  name: 'ImsBaseImsWarehouse',
  data() {
    return {
      warehouseTypeList: [],
      warehouseBelongList: [],
      submit: {
        warehouseCode: '',
        id: '',
        warehouseType: '',
        warehouseBelong: '',
        status: ''
      },
      searchData: [],
      statusList: [],
      warehouseObj: {},
      warehouseList: [],
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'warehouseName'
        },
        {
          label: '仓库代码',
          prop: 'warehouseNumber',
          minWidth: '110px',
          align: 'center',
          showOverflowTooltip: true
        },
        {
          label: '仓库编码',
          prop: 'warehouseCode',
          minWidth: '110px',
          align: 'center',
          showOverflowTooltip: true
        },
        {
          slot: true,
          slotName: 'warehouseBelong'
        },
        {
          label: '仓库类型',
          prop: 'warehouseType.desc',
          minWidth: '95px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'countryCode'
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
        warehouseUse: '',
        warehouseType: '',
        warehouseBelong: '',
        warehouseName: '',
        warehouseNumber: '',
        contacter: '',
        mobilePhone: '',
        countryCode: '',
        telephone: '',
        address: ''
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
      // 仓库类型
      getDictBiz('warehouse_type').then(res => {
        this.warehouseTypeList = res.data
      })
      // 状态
      getDictBiz('warehouse_status').then(res => {
        this.statusList = res.data
      })
      // 仓库归属
      getDictBiz('warehouse_belong').then(res => {
        this.warehouseBelongList = res.data
        this.warehouseBelongList.forEach(item => {
          this.warehouseObj[item.dictKey] = item.dictValue
        })
      })
      // 仓库名称
      getAllWarehouse().then(res => {
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
        title: (this.isAdd ? '新增仓库信息' : '编辑仓库信息'),
        component: imsWarehouseAdd,
        data: {
          isAdd: this.isAdd,
          addData: (this.isAdd ? this.addData : val),
          warehouseTypeList: this.warehouseTypeList,
          warehouseBelongList: this.warehouseBelongList
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
        title: '仓库信息详情',
        component: imsWarehouseDetail,
        data: {
          id: val.id,
          warehouseObj: this.warehouseObj
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
    margin-left: 40px!important;
  }
}

</style>
