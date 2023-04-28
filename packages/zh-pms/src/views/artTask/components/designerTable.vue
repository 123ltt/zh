<template>
  <g-table ref="table"
           v-loading="loading"
           :fetch="fetch"
           :headers="columns"
           :diff-height="0"
           :fixed-height="fixedHeight"
           show-order
           @sort-change="changeSort"
  >
    <template slot="header">
      <slot name="header" />
    </template>

    <el-table-column slot="taskTitle" show-overflow-tooltip label="任务标题">
      <template slot-scope="{row}">
        <g-link @click="showDialogBtn(row,0)">{{ row.taskTitle }}</g-link>
      </template>
    </el-table-column>
    <el-table-column slot="handler" label="操作" width="55px">
      <template slot-scope="{row}">
        <el-button v-if="row.ifCanSubmitFlow" type="text" @click="showDialogBtn(row,1)">操作</el-button>
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { queryArtTask } from '@/api/artTask'
import HandleTask from './handleTask.vue'

export default {
  name: 'DesignerTable',
  props: {
    // 列表类型, 1我的任务列表 2任务池列表 3美工任务列表
    tasktype: {
      type: Number
    },
    submitForm: { // 搜索条件
      type: Object
    },
    createArtTaskType: { // 创建美工type
      type: String,
      default: ''
    },
    // 产品id（维护信息页面的标签页用到）
    productId: [Number, String],
    // 是否固定高度
    fixedHeight: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      sortByRequireFinishedTime: null, // 升序
      loading: false,
      tableData: [],
      columns: [
        { label: '任务类型', prop: 'taskType', width: 100 },
        { label: '价格等级', prop: 'priceLevel', width: 160, 'show-overflow-tooltip': true },
        { slot: true, slotName: 'taskTitle' },
        { label: '要求完成时间', sortable: 'custom', prop: 'requireFinishedTime', width: 140 },
        { label: '当前处理人', prop: 'currentUserAccount', 'show-overflow-tooltip': true, width: 120 },
        { label: '当前状态', prop: 'bizStatusName', width: 120 },
        { label: '数量', prop: 'number', width: 60 },
        { slot: true, slotName: 'handler' }
      ]
    }
  },
  mounted() {
    this.load(1)
  },
  methods: {
    load(pageIndex = 1) {
      // tabType 1我的任务列表 2任务池列表 3美工任务列表
      const params = {
        type: this.tasktype,
        ...this.submitForm,
        sortByRequireFinishedTime: this.sortByRequireFinishedTime
      }
      if (this.productId) params.productId = this.productId
      this.$refs.table.load(pageIndex, params)
    },
    fetch({ current, size }, params) {
      return queryArtTask({ params, current, size }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    changeSort({ column, prop, order }) {
      // ascending 升序 2  descending 降序 1
      this.sortByRequireFinishedTime = { ascending: 2, descending: 1 }[order]
      this.load(1)
    },
    // 操作 查看
    showDialogBtn(row, taskViewType) {
      this.$newTab({
        path: '/art-task/handler',
        title: taskViewType ? '操作任务' : '查看任务详情',
        component: HandleTask,
        data: {
          id: row.id,
          taskViewType: taskViewType
        },
        clearCache: true,
        callback: refresh => {
          const val = refresh && this.createArtTaskType === 'createDesigner' ? 3 : 1
          this.$emit('update:tasktype', val)
          if (refresh) {
            this.$refs.table.load(0)
          }
        }
      })
    }
  }
}
</script>
