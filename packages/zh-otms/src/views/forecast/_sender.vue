<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form label-width="100px" size="mini" class="form-col no-message">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="仓库名称：" prop="warehouseCodeList">
                <el-cascader v-model="formData.warehouseCodeList"
                             :options="warehouseList"
                             :props="options"
                             collapse-tags
                             style="width:80%"
                             filterable
                             clearable
                             @change="getChangeData"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发件人名称：" prop="name">
                <el-input v-model.trim="formData.name" placeholder="请输入" clearable style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <div class="blockRight pb-2">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button size="mini" icon="el-icon-delete" @click="reset">重置</el-button>
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addEdit('add')">新增</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="warehouse" label="仓库" align="center">
        <template #default="{row}">
          <g-text-ellipsis max-length="10">{{ row.warehouseName }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="remark" label="备注" align="center">
        <template #default="{row}">
          <g-text-ellipsis max-length="10">{{ row.remark }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" width="120px" align="center">
        <template #default="slot">
          <el-button type="text" size="mini" @click="addEdit('edit',slot.row)">编辑</el-button>
          <el-button type="text" size="mini" @click="deleModal(slot.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import addEdit from './senderModal/addEdit'
import { getList, deleConfiguration } from '@/api/forecast/senderInfomation'
import { getWarehouseTypeTree } from '@/api/common'
export default {
  name: 'TmsForecastSender',
  data() {
    return {
      current: 1,
      formData: {
        warehouseCode: ''
      },
      warehouseList: [],
      options: {
        value: 'code',
        label: 'desc',
        children: 'warehouseChildVOList'
      },
      headers: [
        { slot: true, slotName: 'warehouse' },
        { label: '发件人名称', prop: 'name', align: 'center', width: '130px' },
        { label: '发件人手机', prop: 'phone', align: 'center', width: '130px' },
        { label: '发件人电话', prop: 'tel', align: 'center', width: '130px' },
        { slot: true, slotName: 'remark' },
        { slot: true, slotName: 'handler' }
      ]
    }
  },
  mounted() {
    this.getApiWarehouse()
    this.init()
  },
  methods: {
    init() {
      const params = JSON.parse(
        JSON.stringify(this.formData,
          ['warehouseCode', 'name'])
      )
      this.$refs.table.load(this.current, params)
    },
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        this.current = res.data.current
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    getChangeData(val) {
      val && val.length ? this.$set(this.formData, 'warehouseCode', val[val.length - 1]) : this.$set(this.formData, 'warehouseCode', '')
    },
    getApiWarehouse() {
      getWarehouseTypeTree().then(res => {
        this.warehouseList = this.deleteChildren(res.data)
      })
    },
    // 删除arr列表中索引的children为空
    deleteChildren(arr) {
      const childs = arr
      for (let i = 0; i < arr.length; i++) {
        if (childs[i].warehouseChildVOList && childs[i].warehouseChildVOList.length) {
          this.deleteChildren(childs[i].warehouseChildVOList)
        } else {
          delete childs[i].warehouseChildVOList
        }
      }
      return arr
    },
    deleModal(id) {
      this.$confirm('确定删除该数据?', '提示：', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleConfiguration(id).then(res => {
          this.$message.success(res.msg)
          this.init()
        })
      }).catch(() => {
      })
    },
    addEdit(type, rows) {
      this.$newTab({
        path: '/senderInfomation/addEdit',
        title: type === 'add' ? '新增发件人信息' : '编辑发件人信息',
        component: addEdit,
        clearCache: true,
        data: {
          type,
          rows
        },
        callback: (flag) => {
          if (flag) {
            if (type === 'add') {
              this.current = 1
            }
            this.init()
          }
        }
      })
    },
    search() {
      this.current = 1
      this.init()
    },
    reset() {
      this.formData = {}
      this.current = 1
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
