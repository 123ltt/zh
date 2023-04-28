<template>
  <el-form ref="form" v-loading="loading" :model="form" :rules="rules" size="mini" label-width="74px">
    <el-form-item label="店铺名称" prop="storeName">
      <el-select v-model="form.storeName" class="w-100">
        <el-option v-for="(item,index) in storeList"
                   :key="index"
                   :label="item.displayName"
                   :value="item.displayName"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="单号">
      <g-multiple-input v-model="form.searchContent" :reg-exp="/[\s]+/" />
    </el-form-item>
    <el-form-item label="更新时间">
      <el-date-picker
        ref="picker"
        v-model="getTime"
        class="w-100"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
      />
    </el-form-item>
    <el-form-item label-width="0">
      <div class="remark">
        备注：数据抓取需要5-10分钟，请提交抓取申请后到列表页面通过单号重新查询抓取结果。
      </div>
    </el-form-item>
    <el-row type="flex" class="row-bg" justify="end">
      <el-button type="primary" size="mini" @click="close()">取消</el-button>
      <el-button type="primary" size="mini" @click="submit">确定</el-button>
    </el-row>
  </el-form>
</template>

<script>
import { whSynBatch } from '@/api/platformOrder'
export default {
  props: {
    storeList: Array,
    type: String
  },
  data() {
    return {
      form: {
        searchContent: [],
        storeName: ''
      },
      getTime: [],
      rules: {
        storeName: [{ required: true, message: '请选择店铺名称' }]
      },
      loading: false,
      startTimePicker: '',
      storeCodeOption: []
    }
  },
  methods: {
    getHHmm(data) {
      const dd = parseInt((data / (1000 * 60 * 60 * 24)))
      const hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60))
      const mm = parseInt((data % (1000 * 60)) / (1000))
      return { dd, hours, minutes, mm }
    },
    filterSpace() {
      this.form.searchContent = this.form.searchContent.filter(item => item !== '')
    },
    submit() {
      this.$refs.form.validate((bool) => {
        if (bool) {
          this.filterSpace()
          this.getTime ??= []
          if ((!this.getTime.length) && (!this.form.searchContent.length)) {
            return this.$message.error('抓单时间和单号必填一个')
          }

          const { form, getTime } = this
          const params = Object.assign({}, form)
          if (form.searchContent.length >= 100) {
            return this.$message.error('单号必须小于100个')
          }
          if (getTime.length) {
            const starTime = new Date(getTime[0]).getTime()
            const endTime = new Date(getTime[1]).getTime()
            const { dd, hours, minutes, mm } = this.getHHmm(new Date(endTime - starTime).getTime())
            if ((dd === 3 && (hours > 0 || minutes > 0 || mm > 0)) || dd > 3) {
              this.$message.warning('抓单时间间隔不能超过三天,请重新选择')
              return false
            }
          }
          params.searchContent = params.searchContent.toString()
          params.firstGrabDateStart = getTime[0] ?? ''
          params.firstGrabDateEnd = getTime[1] ?? ''
          if (this.loading) return
          this.loading = true

          whSynBatch(params).then(res => {
            this.$message.success(res.msg)
            this.close(true)
          }).finally(() => { this.loading = false })
        }
      })
    },
    close(bool = false) {
      this.$parent.$emit('close', bool)
    }
  }
}
</script>
