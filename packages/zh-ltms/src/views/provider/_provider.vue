<template>
  <basic-container>
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch">
      <!-- header插槽 （位于表格的上面，通常放搜索条件） -->
      <template slot="header">
        <el-form ref="form" :model="searchData" label-width="100px" size="mini" class="form-col no-message">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="物流商简称：" prop="id">
                <g-select v-model.trim="searchData.id"
                          :items="providerList"
                          key-field="id"
                          :item-title="true"
                          label-field="lpAbbreviation"
                          value-field="id"
                          placeholder="请选择"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商编号：" prop="supplierNumber">
                <el-input v-model="searchData.supplierNumber" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="审核状态：" prop="auditStatus">
                <el-radio-group v-model="searchData.auditStatus" @change="changeFunc">
                  <el-radio-button v-for="item in statusList" :key="item.dictKey" :label="item.dictKey">{{ item.dictValue }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="9" class="d-flex justify-content-end pb-2">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="initialization">搜索</el-button>
              <el-button class="ms-3" icon="el-icon-delete" size="mini" @click="reset">重置</el-button>
              <el-button type="primary" class="ms-3" icon="el-icon-plus" size="mini" @click="addEditVerifyBtn()">新增</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 物流商跳转详情 -->
      <el-table-column slot="lpAbbreviation" label="物流商简称" align="center" min-width="120px">
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row)">{{ row.lpAbbreviation }}</g-link>
        </template>
      </el-table-column>

      <!-- 状态开关改动 -->
      <el-table-column slot="status" label="启用状态" align="center" width="100px">
        <template v-slot="{row}">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="2"
            @change="onChangeStaus(row)"
          />
        </template>
      </el-table-column>

      <!-- 审核状态 -->
      <el-table-column slot="auditStatus" label="审核状态" align="center" width="100px">
        <template v-slot="{row}">
          {{ statusList && getauditStatusDesc(row.auditStatus) }}
        </template>
      </el-table-column>

      <!-- 备注 -->
      <el-table-column slot="remarks" label="备注" align="center" min-width="120px">
        <template v-slot="{row}">
          <g-text-ellipsis>
            {{ row.remarks }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 自定义插槽 ：操作 -->
      <el-table-column slot="handler" label="操作" align="center" width="180px">
        <template v-slot="{row}">
          <el-button v-if="row.auditStatus === 0" type="text" @click="allowBtn(row)">通过</el-button>
          <el-button v-if="row.auditStatus === 3 || row.auditStatus === 2" type="text" @click="addEditVerifyBtn(row)">修改</el-button>
          <el-button v-if="row.auditStatus === 0" type="text" @click="disallowBtn(row)">驳回</el-button>
          <el-button v-if="row.auditStatus === 3 || row.auditStatus === 2" type="text" @click="deleteBtn(row)">删除</el-button>
        </template>
      </el-table-column>

    </g-table>
  </basic-container>
</template>

<script>
import { getList, remove, update } from '@/api/logisticsManagement'
import addEditLogistic from './providerModal/addEdit.vue'
import detailLogistic from './providerModal/detail.vue'
import { getLogisticsProvider, dictionary } from '@/api/common'
export default {
  name: 'TmsProviderProvider',

  data() {
    return {
      searchData: {
        id: '', // 物流商简称
        supplierNumber: '', // 供应商编码
        auditStatus: '' // 审核状态
      },
      statusList: [],
      providerList: [],
      headers: [
        { label: '编码', prop: 'supplierNumber', minWidth: '120px', align: 'center' },
        { slot: true, slotName: 'lpAbbreviation' },
        { label: '更新日期', prop: 'updateTime', minWidth: '100px', align: 'center' },
        { slot: true, slotName: 'status' },
        { slot: true, slotName: 'remarks' },
        { slot: true, slotName: 'auditStatus' },
        { slot: true, slotName: 'handler' }
      ]
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.initialization(true)
  },
  methods: {
    getData() {
      // 审核状态：''->全部,'0'->待审核,'1'->审核通过,'2'->'审核不通过','3'->'草稿'
      Promise.all([
        dictionary('audit_status'),
        getLogisticsProvider()
      ]).then(res => {
        res[0].data.unshift({ dictKey: '', dictValue: '全部' })
        this.statusList = res[0].data

        this.providerList = res[1].data
      })
    },

    getauditStatusDesc(val) {
      return this.statusList.filter(element => element.dictKey === val + '')[0]?.dictValue
    },

    changeFunc(val) {
      this.initialization(true)
    },

    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        this.current = res.data.current
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },

    // 刷新列表页 flag-> true:原始刷新 false:原地刷新
    initialization(flag) {
      const current = flag ? 1 : this.current
      this.$refs.table.load(current, this.searchData)
    },

    reset(flag) {
      this.searchData.id = ''
      this.searchData.supplierNumber = ''
      this.searchData.auditStatus = ''
      if (flag === 1) this.searchData.auditStatus = ''
      this.initialization(flag)
    },

    // 行间状态更改
    onChangeStaus(row) {
      const params = {
        id: row.id,
        status: row.status
      }
      update({ ...row, params }).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }
        this.initialization(false)
      }, () => {
        this.initialization(false)
      })
    },

    allowBtn(row) {
      this.addEditVerifyBtn(row, 1)
    },

    disallowBtn(row) {
      this.addEditVerifyBtn(row, 2)
    },

    // 新增编辑审核 direction -> 1:通过 2:反驳
    addEditVerifyBtn(row, direction) {
      const title = !row ? '新增物流商信息' : (direction ? '审核物流商信息' : '修改物流商信息')
      this.$modal({
        title,
        component: addEditLogistic,
        width: '950px',
        data: {
          isAdd: !row,
          detailInfo: row || '',
          direction
        },
        callback: (bool) => {
          if (bool) {
            // 原则：刷新看到操作的数据
            const isAdd = !row
            !direction && getLogisticsProvider().then(res => {
              this.providerList = res.data
            })
            isAdd ? this.reset(1) : this.initialization(false)
          }
        }
      })
    },

    deleteBtn(row) {
      if (row.status === 1) return this.$message.error('该物流商已启用，不能直接删除!')
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(row.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.initialization(false)
        })
      }).catch(() => {})
    },

    detailBtn(row) {
      this.$newTab({
        path: '/logistics/info/detail',
        title: '物流商信息详情',
        component: detailLogistic,
        clearCache: true,
        data: {
          detailInfo: row || ''// 行内信息
        },
        callback: (bool) => {
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-radio-group{
  width:95%;
  display:flex;
  .el-radio-button.el-radio-button--mini{
   flex:1;

  }
}
.el-input{
 width:85%!important;
}
 ::v-deep  .el-radio-button__inner{
      padding:0!important;
      width:100%;
      height:28px;
      line-height:28px;
    }
    .g-select{
      width:87%
    }

</style>
<style>
</style>
