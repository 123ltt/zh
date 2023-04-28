<template>
  <basic-container>
    <el-table
      :data="tableData"
      :cell-style="addClass"
      style="width: 100%"
      max-height="260"
      border
      @cell-click="handlerCellEnter"
    >
      <el-table-column
        prop="artDesignerName"
        fixed
        label="美工"
        width="120"
        show-overflow-tooltip
      />
      <div
        v-for="item in headersList"
        :key="item.prop"
      >
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          width="100"
        />
      </div>
    </el-table>
    <ul class="roster-footer">
      <li
        v-for="(item,index) in colorList"
        :key="index"
      >
        <div :style="{backgroundColor:item.color}" />
        <p>{{ item.label }}</p>
      </li>
    </ul>
    <div style="text-align: right">
      <el-button
        size="mini"
        icon="el-icon-circle-close"
        @click="onCancel"
      >关 闭</el-button>
    </div>
    <el-dialog
      :visible.sync="dialogTableVisible"
      width="80%"
      append-to-body
      title="美工任务详情"
    >
      <div class="table-box">
        <el-btp
          :data="tableDetails"
          :columns="columns"
          :page="page"
          border
          stripe
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogTableVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getPlanList, getByArtDesignerAndDate } from '@/api/artTask'
export default {
  name: 'ArtRoster',
  data() {
    return {
      dialogTableVisible: false, // 美工详情弹框
      tableDetails: [], // 美工详情
      columns: [{
        label: '任务类型',
        prop: 'taskType'
      }, {
        label: '价格等级',
        prop: 'priceLevel',
        width: 160,
        'show-overflow-tooltip': true // 溢出点点
      }, {
        label: '任务标题',
        prop: 'taskTitle',
        width: 160,
        'show-overflow-tooltip': true // 溢出点点
      }, {
        label: '要求完成时间',
        prop: 'requireFinishedTime',
        width: 160
      }, {
        label: '当前处理人',
        prop: 'currentUserAccount'
      }, {
        label: '当前状态',
        prop: 'bizStatusName'
      }, {
        label: '数量',
        prop: 'number',
        width: 100
      }],
      colorList: [{
        label: '无任务',
        color: 'white'
      }, {
        label: '1个任务',
        color: '#0EEF22'
      }, {
        label: '2-3个任务',
        color: '#F6F524'
      }, {
        label: '4-5个任务',
        color: '#EF130E'
      }, {
        label: '>5个任务',
        color: '#6D1F1F'
      }],
      tableData: [],
      headersList: [],
      handlerName: '', // 美工名称
      currentDate: '', // 选择日期
      page: { // 分页
        'page-sizes': [10, 40, 50, 80],
        'page-size': 10,
        'current-page': 1,
        total: 0,
        'size-change': this.queryTaskDetails,
        'current-change': this.queryTaskDetails
      }
    }
  },
  created() {
  },
  mounted() {
    this.getPlanList()
  },
  methods: {
    // 获取美工详情
    queryTaskDetails() {
      this.getByArtDesignerAndDate(this.handlerName, this.currentDate)
    },
    // 鼠标点击单元格
    handlerCellEnter(row, column, cell, event) {
      if (column.property !== 'artDesignerName') {
        this.handlerName = row.artDesignerId
        this.currentDate = column.property
        this.getByArtDesignerAndDate(row.artDesignerId, column.property)
      }
    },
    // 根据美工和日期查询 详情
    getByArtDesignerAndDate(handler, date) {
      const { 'current-page': current, 'page-size': size } = this.page
      getByArtDesignerAndDate({ current, size, artDesignerId: handler, date }).then(res => {
        const data = res.data
        this.tableDetails = data.records
        this.dialogTableVisible = true
      })
    },
    // 单元格颜色
    addClass({ row, column, rowIndex, columnIndex }) {
      const abc = Object.values(row)[columnIndex]
      let color = '#fff'
      switch (abc) {
        case 1:
          color = '#0EEF22'
          break
        case 2:
        case 3:
          color = '#F6F524'
          break
        case 4:
        case 5:
          color = '#EF130E'
          break
        case 6:
          color = '#6D1F1F'
          break
      }
      return `background:${color}`
    },
    // 关闭
    onCancel() {
      this.$parent.$emit('close')
    },
    // 排班日期处理
    async getPlanList() {
      await getPlanList().then(res => {
        const data = res.data
        this.tableData = data.bizData // 拿到tableData
        if (this.tableData.length > 0) {
          const headers = []
          Object.entries(this.tableData[0]).forEach(([key, value]) => {
            if (key !== 'artDesignerName' && key !== 'artDesignerId') {
              headers.push({
                label: key === 'skill' ? '技能' : key,
                prop: key,
                value
              })
            }
          })
          this.headersList = headers
        }
      })
    }
  }
}
</script>
<style scoped>
.el-dialog {
  width: 80% !important;
}
.roster-footer {
  list-style: none;
  position: relative;
  font-size: 0;
  margin-top: 6px;
  margin-bottom: 20px;
  display: flex;
  padding: 0;
  justify-content: space-around;
}
.roster-footer li {
  width: 160px;
  flex: 1;
  font-size: 14px;
  color: #333;
  display: flex;
}
.roster-footer li div {
  width: 40px;
  height: 20px;
  border: 1px solid #ccc;
}
.roster-footer li p {
  margin: 0;
  padding: 0;
  padding-left: 4px;
}
.table-box {
  width: 100%;
  overflow-x: scroll;
}
</style>
