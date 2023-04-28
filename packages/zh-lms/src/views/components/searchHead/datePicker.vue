<template>
  <div class="d-flex">
    <el-date-picker v-model="searchData[dateTimeStart]" type="datetime" default-time="00:00:00" value-format="timestamp" :picker-options="pickerOptionsCreateTimeStart" placeholder="开始时间" @change="changeCreateTime" /><span class="ms-1 me-1">-</span>
    <el-date-picker v-model="searchData[dateTimeEnd]" type="datetime" default-time="23:59:59" value-format="timestamp" :picker-options="pickerOptionsCreateTimeEnd" placeholder="结束时间" @change="changeEndTime" />
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
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
      pickerOptionsCreateTimeStart: {
        disabledDate: time => {
          if (this.searchData[this.dateTimeEnd]) {
            return (
              time.getTime() > new Date(this.searchData[this.dateTimeEnd]).getTime()
            )
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsCreateTimeEnd: {
        disabledDate: time => {
          if (this.searchData[this.dateTimeStart]) {
            return (
              time.getTime() > Date.now() ||
              time.getTime() < new Date(this.searchData[this.dateTimeStart]).getTime()
            )
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
    }
  },
  methods: {
    changeCreateTime(val) {
      this.searchData[this.dateTimeStart] = JSON.parse(JSON.stringify(val))
    },
    changeEndTime(val) {
      this.searchData[this.dateTimeEnd] = val
    },
    resetDatePicker() {
      this.searchData[this.dateTimeEnd] = ''
      this.searchData[this.dateTimeStart] = ''
    }
  }

}
</script>

<style>

</style>
