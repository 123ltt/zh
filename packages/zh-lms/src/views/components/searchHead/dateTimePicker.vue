<template>
  <el-date-picker v-model="createDate"
                  type="datetimerange"
                  :value-format="valueFormat"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  align="right"
                  unlink-panels
                  class="w-100"
                  :default-time="['00:00:00', '23:59:59']"
                  @change="changeDate"
  />
</template>

<script>
export default {
  name: 'DateTimePicker',
  props: {
    // 绑定值的格式，默认为时间戳
    valueFormat: {
      type: String,
      default: 'timestamp'
    },
    searchData: {
      type: Object
    },
    dateTimeStart: {
      type: String
    },
    dateTimeEnd: {
      type: String
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
      const dateTime = JSON.parse(JSON.stringify(val))
      this.searchData[this.dateTimeStart] = dateTime ? dateTime[0] : ''
      this.searchData[this.dateTimeEnd] = dateTime ? dateTime[1] : ''
    },
    resetForm() {
      this.searchData[this.dateTimeEnd] = ''
      this.searchData[this.dateTimeStart] = ''
      this.createDate = []
    }
  }

}
</script>

<style>

</style>
