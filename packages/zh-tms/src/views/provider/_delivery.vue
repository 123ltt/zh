<!-- 标发货配置 -->
<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form ref="formRef" :model="formData" size="mini" label-width="100px" class="no-message form-col">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="channelCode" label="渠道名称：">
                <g-select v-model.trim="formData.channelCode"
                          :items="channelList"
                          key-field="channelCode"
                          :label-field="getLabel"
                          value-field="channelCode"
                          placeholder="请选择"
                          style="width:80%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="启用状态：" prop="status">
                <el-radio-group v-model="formData.status" @change="init">
                  <el-radio-button
                    v-for="item in statusList"
                    :key="item.dictKey"
                    :label="item.dictKey"
                  >
                    {{ item.dictValue }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-flex justify-content-start pb-2 ">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="init">搜索</el-button>
              <el-button class="ms-3" size="mini" icon="el-icon-delete" @click="reset">重置</el-button>
              <el-button type="primary" class="ms-3" size="mini" icon="el-icon-plus" @click="addpoPup()">新增</el-button>
            </el-col>
          </el-row>
        </el-form>
        <!-- 表体 -->
      </template>
      <el-table-column slot="status" label="启用状态" width="100px" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="2"
            @change="onChangeStaus(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column slot="remark" label="备注" align="center" min-width="120px">
        <template v-slot="{row}">
          <g-text-ellipsis>
            {{ row.remark }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <el-table-column slot="handler" label="操作" width="180px" align="center">
        <template v-slot="{row}">
          <el-button type="text" size="mini" @click="addpoPup(row)">编辑</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import AddEdit from './deliveryModal/addEdit'
import { logisticsChannel, dictionary } from '@/api/common'
import { getList, EnableOrDisable } from '@/api/deliveryConfiguration'
export default {
  name: 'TmsProviderDelivery',
  data() {
    return {
      current: 1,
      formData: {
        channelCode: '',
        status: '1'
      },
      channelList: [],
      statusList: [],
      headers: [
        { prop: 'channelName', label: '渠道名称', minWidth: '90px', align: 'center' },
        { prop: 'url', label: '物流查询网站', minWidth: '90px', align: 'center' },
        { slot: true, slotName: 'status' }, // 启用状态
        { slot: true, slotName: 'remark' },
        { slot: true, slotName: 'handler' } // 操作
      ]
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.init()
  },
  methods: {
    getData() {
      Promise.all([
        dictionary('status'),
        logisticsChannel()
      ]).then(res => {
        res[0].data.unshift({ dictKey: '', dictValue: '全部' })
        this.statusList = res[0].data

        this.channelList = res[1].data
      })
    },

    getLabel(item) {
      return `${item.name} (${item.channelCode})`
    },

    init(originalRefresh = true) {
      const current = originalRefresh ? 1 : this.current
      this.$refs.table.load(current, this.formData)
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

    /* 状态调整 */
    onChangeStaus(row) {
      EnableOrDisable(row.id, row.status).then(res => {
        this.$message.success(res.msg)
        this.init(false)
      })
    },

    addpoPup(row) {
      this.$modal({
        title: !row ? '新增标发货配置' : '编辑标发货配置',
        width: '50%',
        component: AddEdit,
        data: {
          row,
          channelList: this.channelList
        },
        callback: (bool) => {
          if (bool) {
            !row ? this.reset(false) : this.init(false)
          }
        }
      })
    },

    reset() {
      this.formData.channelCode = ''
      this.formData.status = '1'
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-radio-group{
  width:80%;
  display:flex;
  .el-radio-button.el-radio-button--mini{
   flex:1;
    ::v-deep .el-radio-button__inner{
      padding:0!important;
      width:100%;
      height:28px;
      line-height:28px;
    }
  }
}
</style>
