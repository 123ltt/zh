<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="80px">
      <el-form-item label="销售平台" prop="platformCode">
        <el-select v-model="form.platformCode" class="width-100">
          <el-option label="amazon" value="AM" />
        </el-select>
      </el-form-item>
      <el-form-item label="国家" prop="shippingAddressCountryCode">
        <el-select v-model="form.shippingAddressCountryCode" class="width-100" @change="changeSiteId">
          <el-option v-for="(item,index) in siteOption"
                     :key="index"
                     :label="item.displayName"
                     :value="item.hiddenValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="店铺名称" prop="storeName">
        <el-select v-model="form.storeName" class="width-100" :disabled="form.shippingAddressCountryCode === ''">
          <el-option v-for="(item,index) in storeCodeOption"
                     :key="index"
                     :label="item.displayName"
                     :value="item.displayName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="单号">
        <g-multiple-input v-model="form.searchContent" return-type="string" :reg-exp="/\s+/" />
      </el-form-item>
      <el-form-item label="" label-width="0" class="w-100">
        <div class="d-flex align-items-center">
          <DropdownLabel v-model="form.timeType" width="80px" label-class="text-center" :list="list" />
          <el-date-picker
            ref="picker"
            v-model="getTime"
            class="w-100"
            :picker-options="pickerOptions"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', new Date(new Date().getTime() - 1800 * 1000).toTimeString().slice(0, 8)]"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <div class="remark">
          备注：数据抓取需要5-10分钟且最大时间为当前时间前半小时，请提交抓取申请后到列表页面通过单号重新查询抓取结果。
        </div>
      </el-form-item>
      <el-row type="flex" class="row-bg" justify="end">
        <el-button size="mini" @click="close">取消</el-button>
        <el-button type="primary" size="mini" @click="submit">确定</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import DropdownLabel from '../../../components/dropdown-label/index.vue'
import { synBatch } from '@/api/platformOrder'
import { getSiteList } from '@/api/common.js'
export default {
  components: {
    DropdownLabel
  },
  props: {
    siteOption: Array,
    type: String
  },
  data() {
    return {
      list: [
        { label: '创建时间', value: 'create' },
        { label: '更新时间', value: 'update' }
      ],
      form: {
        timeType: 'create',
        platformCode: 'AM',
        searchContent: '',
        shippingAddressCountryCode: '',
        storeName: ''
      },
      getTime: null,
      rules: {
        platformCode: [{ required: true, message: '不能为空' }],
        storeName: [{ required: true, message: '不能为空' }],
        shippingAddressCountryCode: [{ required: true, message: '不能为空' }]
      },
      startTimePicker: '',
      storeCodeOption: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() + 30 * 60 * 1000 > Date.now()
        }
      }
    }
  },
  methods: {
    changeSiteId() {
      this.form.storeName = ''
      getSiteList({
        platformCode: this.form.platformCode,
        siteId: this.form.shippingAddressCountryCode
      }).then(res => {
        this.storeCodeOption = res.data
      })
    },
    searchEnter() {
      const data = this.form.searchContent
      const arr = data.split(/[\n]/)
      if (arr.length > 100) {
        this.$message.error('单号不能超过100个')
        const len = this.form.searchContent.length
        this.form.searchContent = this.form.searchContent.slice(0, len - 1)
        return false
      }
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if ((!this.getTime) && (!this.form.searchContent)) {
            this.$message.error('抓单时间和单号必填一个')
            return false
          }
          if (this.getTime) {
            const starTime = new Date(this.getTime[0]).getTime()
            const endTime = new Date(this.getTime[1]).getTime()
            const { dd, hours, minutes, mm } = this.getHHmm(new Date(endTime - starTime).getTime())
            if ((dd === 3 && (hours > 0 || minutes > 0 || mm > 0)) || dd > 3) {
              this.$message.warning('抓单时间间隔不能超过三天,请重新选择')
              return false
            }
          }
          const params = Object.assign({}, this.form)
          if (this.form.timeType === 'update') {
            params.firstGrabDateStart = (this.getTime && this.getTime[0]) || ''
            params.firstGrabDateEnd = (this.getTime && this.getTime[1]) || ''
          } else {
            params.createdAfter = (this.getTime && this.getTime[0]) || ''
            params.createdBefore = (this.getTime && this.getTime[1]) || ''
          }
          delete params.platformCode
          delete params.timeType
          synBatch(params, this.type).then(res => {
            if (res.success) {
              this.$message.success(res.data)
              this.close(true)
            }
          })
        } else {
          return false
        }
      })
    },
    getHHmm(data) {
      const dd = parseInt((data / (1000 * 60 * 60 * 24)))
      const hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60))
      const mm = parseInt((data % (1000 * 60)) / (1000))
      return { dd, hours, minutes, mm }
    },
    close(type = false) {
      // 关闭弹窗
      this.$parent.$emit('close', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.remark{
    font-size: 12px;
}
.width-100{
  width: 100%;
}
</style>
