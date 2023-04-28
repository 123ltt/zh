<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="属性详情" name="propertyDetail" lazy>
        <g-charts :option="option1" :height="height" />
      </el-tab-pane>
      <el-tab-pane label="实体仓详情" name="startShipmentDetail" lazy>
        <g-charts :option="option2" :height="height" />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
export default {
  props: {
    propertyTreeData: Object,
    startShipmentTreeData: Object,
    startActiveName: String
  },
  data() {
    return {
      tabPaneList: [
        {
          label: '属性详情',
          name: 'propertyDetail',
          data: 'chartData'
        },
        {
          label: '实体仓详情',
          name: 'startShipmentDetail',
          data: 'chartData1'
        }
      ],
      activeName: '',
      height: '650px',
      option1: this.getOption(this.propertyTreeData),
      option2: this.getOption(this.startShipmentTreeData)
    }
  },
  created() {
    this.activeName = this.startActiveName
  },
  methods: {
    getOption(data) {
      return {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: {
          type: 'tree',
          data: [data],
          orient: 'horizontal',
          top: '1%',
          left: '12%',
          bottom: '1%',
          right: '20%',
          symbolSize: 7,
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 12
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left'
            }
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      }
    }
  }
}
</script>
