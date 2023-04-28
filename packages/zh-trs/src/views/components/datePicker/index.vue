<template>
  <div class="d-flex">
    <el-date-picker v-model="createDate"
                    type="datetimerange"
                    :value-format="valueFormat"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    :start-placeholder="startPlaceholder"
                    :end-placeholder="endPlaceholder"
                    align="right"
                    unlink-panels
                    class="w-100"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="changeDate"
    />
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    // 绑定值的格式，默认为时间戳
    valueFormat: {
      type: String,
      default: 'timestamp'
    },
    startPlaceholder: {
      type: String,
      default: '开始日期'
    },
    endPlaceholder: {
      type: String,
      default: '结束日期'
    }
  },
  data() {
    return {
      createDate: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  methods: {
    changeDate(val) {
      val && val.length && this.$emit('getVal', val[0], val[1])
    }
  }
}
</script>
