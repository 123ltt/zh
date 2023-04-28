<template>
  <basic-container>
    <g-table ref="tableRef" :fetch="fetch" :headers="headers" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
      <template #header>
        <cols-form ref="formRef" :cols="4" :form-item="formItem" :form-info="formInfo" :form-handler="formHandler" />
      </template>
      <template v-slot:status>
        <el-table-column label="状态">
          <template v-slot="{row}">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeStatus($event,row)"
            />
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="170">
          <template v-slot="{row}">
            <el-button type="text" @click="showDetail(row)">详情</el-button>
            <el-button type="text" @click="addPermission(row)">编辑</el-button>
            <auto-button auto-confirm @confirm="delDetail(row)">
              删除
            </auto-button>
          </template>
        </el-table-column>
      </template>
    </g-table>
  </basic-container>
</template>

<script>
import colsForm from '@/views/components/colsForm'
import autoButton from '@/views/components/autoButton.vue'
import addOrEditPermission from './components/addOrEditPermission.vue'
import { getPlatformListUnlimit } from '@/api/common'
import { getPermissionList, getPermissionRemove, getPermissionSubmit } from '@/api/system/permission'
import permissionDetail from './components/detailPermission.vue'
export default {
  name: 'Permission',
  components: { colsForm, autoButton },
  data() {
    return {
      headers: [
        { label: '平台名称', prop: 'platformCode' },

        { label: '店铺编码', prop: 'storeCode' },
        { label: '成员数量', prop: 'memberNum' },
        { label: '创建人', prop: 'createUser' },
        { label: '创建时间', prop: 'createTime' },
        { slot: true, slotName: 'status' },
        { slot: true, slotName: 'operation' }
      ],
      formInfo: {},

      formItem: [
        {
          type: 'gselect',
          label: '平台名称',
          prop: 'platformCode',
          options: [],
          optionValue: 'platformCode',
          optionLabel: 'platformName'
        },
        {
          type: 'select',
          label: '状态',
          prop: 'status',
          options: [{ key: '', value: '全部' }, { key: 1, value: '启用' }, { key: 0, value: '禁用' }],
          formWidth: '800px'
        }
      ],
      formHandler: [{
        label: '查询',
        handler: () => {
          this.search()
        }

      },
      {
        label: '重置',
        handler: () => {
          this.reset()
        },
        type: 'plan'
      },
      {
        label: '新增',
        handler: () => {
          this.addPermission()
        }
      }
      ]
    }
  },
  mounted() {
    this.init()
    this.getData()
  },
  methods: {
    showDetail(row) {
      console.log({ row })
      this.$newTab({
        path: '/system/permission/detail',
        title: '系统权限配置详情',
        component: permissionDetail,
        clearCache: true,
        data: { id: row.id }
      })
    },
    changeStatus(value, row) {
      getPermissionSubmit({ id: row.id, status: value }).then(res => {
        this.$message.success(res.msg)
        this.init()
      })
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    getData() {
      getPlatformListUnlimit().then(res => {
        this.formItem[0].options = res.data
      })
    },
    reset() {
      this.formInfo = {}
      this.init()
    },
    search() {
      this.init()
    },
    delDetail(row) {
      getPermissionRemove({ ids: row.id }).then(
        res => {
          this.$message.success(res.msg)
          this.init()
        }
      )
    },
    addPermission(row) {
      console.log(row, !row)
      this.$modal({
        title: row ? '编辑' : '新增',
        data: {
          isAdd: !row,
          row: { ...row }
        },
        width: '50%',
        component: addOrEditPermission,
        callback: (val) => {
          val && this.init()
        }
      })
    },
    fetch({ current, size }, params) {
      return getPermissionList(current, size, params).then((res) => {
        // filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    }
  }
}
</script>
