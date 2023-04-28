import { dateFormat } from '@/util/date.js'
export default {
  created() {
    if (!this.$route.params.searchContent) { // 不是从其他界面跳转过来的
      const curDate = new Date()
      const curDateEndStr = dateFormat(curDate).slice(0, 11) + '23:59:59'
      curDate.setMonth(curDate.getMonth() - 1)
      const lastMonthDateStartStr = dateFormat(curDate).slice(0, 11) + '00:00:00'
      this.formData.firstGrabDate = [lastMonthDateStartStr, curDateEndStr]
    }
  }
}
