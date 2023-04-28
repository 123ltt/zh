<template>
  <basic-container>
    <g-table ref="table"
             :headers="headers"
             :fetch="fetch"
             row-key="id"
             @selection-change="handleSelectionChange"
    >
      <template slot="header">
        <el-form ref="formRef" :model="form" size="mini" label-width="120px" class="no-message form-col">
          <el-row>
            <el-col :span="9">
              <el-form-item prop="channelId" label="渠道名称：">
                <g-select v-model.trim="form.channelId"
                          :items="channelList"
                          key-field="id"
                          :label-field="getLabel"
                          value-field="id"
                          placeholder="请选择"
                          style="width:100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="计费项：" prop="chargeType">
                <el-select
                  v-model.trim="form.chargeType"
                  filterable
                  clearable
                  placeholder="请选择计费项"
                  style="width:100%;"
                >
                  <el-option
                    v-for="item in surchargeTypeList"
                    :key="item.dictKey"
                    :value="item.dictKey"
                    :label="item.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9">
              <el-form-item label="批次：" prop="editionNumber">
                <el-input v-model="form.editionNumber" clearable class="w-100" />
              </el-form-item>
            </el-col>
            <el-col :span="9" class="d-flex justify-content-end align-items-end pb-2">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
              <el-button size="mini" icon="el-icon-delete" @click="reset">重置</el-button>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addEditBtn()">新增</el-button>
              <el-button type="danger" plain size="mini" icon="el-icon-close" @click="deldata(deleteRows)">批量删除</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <el-table-column slot="channelId" label="渠道名称" min-width="120px" align="center">
        <template v-slot="{row}">
          <span>{{ channelObj[row.channelId] }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="chargeType" label="费用类型" align="center" width="90px">
        <template v-slot="{row}">
          <span>{{ surchargeTypeObj[row.chargeType] }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="chargeUnit" label="计费单位" align="center" width="70px">
        <template v-slot="{row}">
          {{ chargeUnitObj[row.chargeUnit] }}
        </template>
      </el-table-column>
      <el-table-column slot="conditionName" label="适用条件" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis max-length="10">{{ row.conditionName }}</g-text-ellipsis>
        </template>
      </el-table-column>

      <el-table-column slot="time" label="时间" align="center" width="240px">
        <template v-slot="{row}">
          <g-list-group label-width="50px" align="left">
            <g-list-group-item label="生效时间">
              <g-text-ellipsis>{{ row.forever?'永久有效':row.startTime+' 至 '+row.endTime }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="旺季时间">
              <g-text-ellipsis>{{ row.peeks[0]?row.peeks[0].peakStart+' 至 '+row.peeks[0].peakEnd :'' }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>

        </template>
      </el-table-column>

      <el-table-column slot="charge" label="金额" align="center" width="125px">
        <template v-slot="{row}">
          <g-list-group label-width="60px" align="left">
            <g-list-group-item label="附加费金额">
              <g-text-ellipsis>   {{ row.chargeType===4?parseFloat(row.fuelCharge):parseFloat(row.charge) }}  </g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="旺季金额">
              <g-text-ellipsis>{{ row.peeks.length?parseFloat(row.peeks[0].peakCharge):'' }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>

        </template>
      </el-table-column>

      <el-table-column slot="remark" label="备注" align="center" width="240px">
        <template v-slot="{row}">

          <g-text-ellipsis>
            {{ row.remark }}</g-text-ellipsis>

        </template>
      </el-table-column>

      <el-table-column slot="handler" label="操作" align="center" width="100px">
        <template v-slot="{row}">
          <el-button type="text" size="mini" @click="addEditBtn(row)">修改</el-button>
          <el-button type="text" size="mini" @click="deldata(row)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>

import { dictionary, logisticsChannel } from '@/api/common'
import { queryData, removeRule } from '@/api/logisticsSurcharge.js'
import surchargeAddEdit from './surchargeModal/addEdit'
export default {
  name: 'TmsProviderSurcharge',
  props: {},
  data() {
    return {

      form: {},
      current: 1,
      surchargeTypeList: [],
      surchargeTypeObj: {},
      chargeUnitObj: {},
      chargeUnitList: [],
      channelList: [],
      channelObj: {},
      deleteRows: [],
      headers: [
        { type: 'selection', width: 55, align: 'center' },
        { label: '批次号', prop: 'editionNumber', minWidth: '120px', align: 'center' },
        { slot: true, slotName: 'channelId' },
        { slot: true, slotName: 'chargeType' },
        { slot: true, slotName: 'chargeUnit' },
        { slot: true, slotName: 'conditionName' },
        { slot: true, slotName: 'time' },
        { slot: true, slotName: 'charge' },
        { slot: true, slotName: 'remark' },
        { slot: true, slotName: 'handler' }
      ]
    }
  },

  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      Promise.all([
        dictionary('logistics_surcharge_type'),
        dictionary('logistics_addition_unit'),
        logisticsChannel()
      ]).then(result => {
        this.surchargeTypeList = result[0].data
        this.surchargeTypeList.forEach(item => {
          this.surchargeTypeObj[item.dictKey] = item.dictValue
        })

        this.chargeUnitList = result[1].data
        this.chargeUnitList.forEach(item => {
          this.chargeUnitObj[item.dictKey] = item.dictValue
        })

        this.channelList = result[2].data
        result[2].data.forEach(item => {
          this.channelObj[item.id] = item.name
        })

        this.init()
      })
    },
    getLabel(item) {
      return `${item.name} (${item.channelCode})`
    },

    init() {
      this.$refs.table.load(this.current, this.form)
    },
    fetch({ current, size }, params) {
      return queryData(current, size, params).then(res => {
        this.current = res.data.current
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.pageSize
        }
      })
    },
    search() {
      this.current = 1
      this.init()
    },
    reset() {
      this.form = {}
      this.current = 1
      this.init()
    },
    addEditBtn(row) {
      const {
        channelList,
        surchargeTypeList,
        chargeUnitList,
        channelObj
      } = this
      this.$modal({
        title: !row ? '新增附加费' : '修改附加费',
        width: '60%',
        component: surchargeAddEdit,
        data: {
          isAdd: !row,
          id: row ? row.id : '',
          channelList: Object.assign([], channelList),
          surchargeTypeList: Object.assign([], surchargeTypeList),
          chargeUnitList: Object.assign([], chargeUnitList),
          channelObj: Object.assign({}, channelObj)
        },
        callback: (close) => {
          if (close) {
            !row ? this.reset() : this.init()
          }
        }
      })
    },

    handleSelectionChange(val) {
      this.deleteRows = val
    },

    deldata(rows) {
      if (Array.isArray(rows) && !rows.length) {
        return this.$message.error('请点击要批量删除的选项')
      }
      const ids = !Array.isArray(rows) ? [rows.id] : rows.map(item => item.id)
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeRule(ids).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.init()
        })
      }).catch(() => {})
    }

  }
}
</script>

<style scoped lang="scss">
::v-deep.flex-box{
  display:flex;
  border: solid 2px #eee;
  margin-bottom:5px;
}
::v-deep.flex-box div{
  width: 50%;
  text-align: right;
}
</style>
