<template>
  <!-- 基础管理/季节周期-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form ref="formRef" :model="submit" label-width="100px" size="mini" class="no-message">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="seasonNatureCode" label="季节属性">
                <el-select v-model="submit.seasonNatureCode" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in seasonNatureList" :key="item.seasonNatureCode" :label="item.seasonNatureName" :value="item.seasonNatureCode" />
                </el-select>
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

      <!-- 季节属性详情 -->
      <el-table-column slot="seasonNatureName" label="季节属性" min-width="110" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <g-link v-if="row.status != 0" color="primary" @click="detailBtn(row)">{{ row.seasonNatureName }}</g-link>
          <span v-else>{{ row.seasonNatureName }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="seasonPeriodDate" label="季节周期" min-width="200" align="center">
        <template v-slot="{row}">
          <span>{{ replaceDate(row.seasonPeriodStartDate) }} ~ {{ replaceDate(row.seasonPeriodEndDate) }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="90" align="center">
        <template v-slot="{row}">
          <span>{{ statusObj[row.status] }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template v-slot="{row}">
          <el-button v-if="row.status == 0" type="text" @click="enableBtn(row)">启用</el-button>
          <el-button v-if="row.status == 0" type="text" @click="addBtn(row)">编辑</el-button>
          <el-button v-if="row.status == 0" type="text" @click="removeBtn(row)">删除</el-button>
          <el-button v-if="row.status == 1" type="text" @click="addBtn(row)">调整</el-button>
          <el-button v-if="row.status != 0" type="text" @click="detailBtn(row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>

  </basic-container>
</template>

<script>
import { getList, remove, start, getSeasonPeriodList } from '@/api/base/seasonPeriod.js'
import { getDictBiz } from '@/api/public/public.js'
import seasonPeriodAdd from './components/seasonPeriodAdd'
import seasonPeriodDetail from './components/seasonPeriodDetail'
export default {
  name: 'ImsBaseImsWarehouse',
  data() {
    return {
      seasonNatureList: [],
      submit: {
        seasonNatureCode: '',
        status: ''
      },
      searchData: [],
      statusList: [],
      statusObj: {},
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'seasonNatureName'
        },
        {
          slot: true,
          slotName: 'seasonPeriodDate'
        },
        {
          label: '时长(天)',
          prop: 'days',
          minWidth: '110px',
          align: 'center',
          showOverflowTooltip: true
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
      // 状态
      getDictBiz('season_period_status').then(res => {
        this.statusList = res.data
        this.statusList.forEach(item => {
          this.statusObj[item.dictKey] = item.dictValue
        })
      })
      // 季节属性
      getSeasonPeriodList().then(res => {
        this.seasonNatureList = res.data
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
        title: (this.isAdd ? '新增季节周期' : '编辑季节周期'),
        component: seasonPeriodAdd,
        width: '25%',
        data: {
          isAdd: this.isAdd,
          upData: (this.isAdd ? {} : val)
        },
        callback: (bool) => {
          if (bool) {
            this.isAdd ? this.reset() : this.initialization()
          }
        }
      })
    },
    replaceDate(val) {
      if (val) {
        const strA = val.split('-')[0]
        const strB = val.split('-')[1]
        return `${strA}月 ${strB}日`
      }
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
      this.$modal({
        title: '季节周期详情',
        component: seasonPeriodDetail,
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
    margin-left: 40px!important;
  }
}

</style>
