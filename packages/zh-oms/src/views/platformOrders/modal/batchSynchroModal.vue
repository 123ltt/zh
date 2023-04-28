<template>
  <el-form ref="form" v-loading="loading" :model="form" :rules="rules" size="mini" label-width="80px">
    <el-form-item label="店铺名称" prop="store">
      <el-select v-model="form.store" class="w-100">
        <el-option v-for="(item,index) in storeList"
                   :key="index"
                   :label="item.displayName"
                   :value="item.candidateDisplayName"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="hasSite" label="站点" prop="siteCode">
      <el-select v-model="form.siteCode" class="w-100">
        <el-option v-for="(item,index) in siteCodeList"
                   :key="index"
                   :label="item.displayName"
                   :value="item.displayName"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="单号">
      <g-multiple-input v-model="form.searchContent" :reg-exp="/[,\s]+/" />
    </el-form-item>
    <el-form-item label="" label-width="0" class="w-100">
      <div class="d-flex align-items-center">
        <DropdownLabel v-model="form.timeType" width="80px" :list="list" class="text-center" />
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
      </div>
    </el-form-item>
    <el-form-item label-width="0">
      <div class="remark">
        备注：数据抓取需要5-10分钟，请提交抓取申请后到列表页面通过单号重新查询抓取结果。
      </div>
    </el-form-item>
    <el-row type="flex" class="row-bg" justify="end">
      <el-button size="mini" @click="close()">取消</el-button>
      <el-button type="primary" size="mini" @click="submit">确定</el-button>
    </el-row>
  </el-form>
</template>

<script>
import { batchGrabAndSync } from '@/api/ebay.js'
import DropdownLabel from '@/views/components/dropdown-label/index.vue'
import { getStoreByPlatform } from '@/api/common.js'
import { siteOption } from '@/api/platformOrder.js'

export default {
  name: 'BatchSynchroModal',
  components: { DropdownLabel },
  props: {
    platCode: String,
    hasSite: Boolean,
    type: String,
    params: {
      type: Object,
      default: () => ({})
    },
    interfaceApi: {
      type: Function,
      default: batchGrabAndSync
    }
  },
  data() {
    return {
      list: [
        { label: '创建时间', value: 'create' },
        { label: '更新时间', value: 'update' }
      ],
      form: {
        searchContent: [],
        store: '',
        timeType: 'create',
        siteCode: ''
      },
      getTime: [],
      rules: {
        store: [{ required: true, message: '请选择店铺名称' }],
        siteCode: [{ required: true, message: '请选择站点' }]
      },
      loading: false,
      startTimePicker: '',
      storeCodeOption: [],
      storeList: '',
      siteCodeList: []
    }
  },
  mounted() {
    // 获取对应平台的店铺
    getStoreByPlatform(this.platCode).then(res => {
      this.storeList = res.data
    })
    // 获取对应平台的站点
    this.hasSite && siteOption({ platformCode: this.platCode }).then(res => {
      this.siteCodeList = res.data
    })
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
      if (this.loading) return
      this.$refs.form.validate((bool) => {
        if (bool) {
          this.filterSpace()
          this.getTime ??= []
          if ((!this.getTime.length) && (!this.form.searchContent.length)) {
            return this.$message.error('抓单时间和单号必填一个')
          }

          const { form, params, getTime } = this
          const data = {}
          const sc = form.searchContent.toString()

          if (sc.split(',').length >= 100) {
            return this.$message.error('单号必须小于100个')
          }
          if (getTime.length) {
            // 判断时间间隔时候超过三天
            const startTime = new Date(getTime[0]).getTime()
            const endTime = new Date(getTime[1]).getTime()
            const { dd, hours, minutes, mm } = this.getHHmm(new Date(endTime - startTime).getTime())
            if ((dd === 3 && (hours > 0 || minutes > 0 || mm > 0)) || dd > 3) {
              this.$message.warning('抓单时间间隔不能超过三天,请重新选择')
              return false
            }
            this.loading = true

            // 时间赋值
            data[params.tt || 'timeType'] = form.timeType
            if (this.form.timeType === 'create') {
              data[params.st || 'startTime'] = getTime[0]
              data[params.et || 'endTime'] = getTime[1]
            } else {
              data[params.ust || 'startTime'] = getTime[0]
              data[params.uet || 'endTime'] = getTime[1]
            }
          }

          data[params.store || 'store'] = form.store
          if (sc) data[params.sc || 'searchContent'] = sc
          if (this.hasSite) data.siteCode = form.siteCode

          this.interfaceApi(data).then(res => {
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
