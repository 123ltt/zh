<template>
  <div>
    <el-form ref="formName" :model="form" label-width="130px" size="mini" class="form-col ">
      <el-form-item label="回复站内信--接收人" class="mt-0">
        <g-text-ellipsis :lines="4">
          {{ Array.isArray(receiveFullName) ?receiveFullName.join(','):receiveFullName }}
        </g-text-ellipsis>
      </el-form-item>
      <el-form-item label="Message模板"
                    prop="tmp"
      >
        <el-select v-model="form.tmp" clearable class="w-100" @change="getTmp">
          <el-option v-for="(item,index) in selectList" :key="index" :label="item.name" :value="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="回复内容" prop="body" :rules="[{ required: true, message: '回复内容不能为空',validator:validabody} ]">
        <el-input v-model="form.body" type="textarea" rows="14" />
      </el-form-item>
      <el-form-item class="mb-0">
        <el-row type="flex" justify="end">
          <el-button :loading="loading" type="primary" @click="save">发站内信</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getTemplate, ebSave, ebSendInfo, addEBSendLog } from '@/api/packOrders.js'
export default {
  props: {
    receiveFullName: {
      type: [String, Array]
    },
    id: Array,
    paramsList: Array
  },
  data() {
    const validabody = (rule, value, callback) => {
      value = value.trim()
      if (!value) {
        return callback(new Error('回复内容不能为空'))
      } else {
        return callback()
      }
    }
    return {
      selectList: [],
      form: {
        body: '',
        tmp: ''
      },
      paramsData: [],
      loading: false,
      validabody: validabody
    }
  },
  mounted() {
    ebSendInfo(this.id).then(res => {
      this.paramsData = res.data
    })
    this.getList()
  },
  methods: {
    getList() {
      getTemplate({ platformCode: 'EB', isFilterUser: true }).then(res => {
        this.selectList = res.data
      })
    },
    getTmp() {
      if (!this.form.tmp) return
      this.form.body = (this.selectList.find(res => res.name === this.form.tmp) || {}).content
    },
    save() {
      this.$refs.formName.validate((valid) => {
        if (valid) {
          this.loading = true
          const ebayMemberMessageAddDTOS = []
          this.paramsData.forEach((item, index) => {
            item.platformProductId.forEach(pItem => {
              const o = {
                $$Buyer_id$$: item.buyerId,
                '$$Shipped _date$$': this.paramsList[index].deliveryTime,
                '$$Delivered _date$$': this.paramsList[index].deliveryTime,
                $$URL$$: '$$URL$$', // 不替换
                '$$tracking code$$': this.paramsList[index].trackCode,
                $$Seller_id$$: this.paramsList[index].sellerId,
                '{Buyername}': item.buyerId,
                '{Track_Code}': this.paramsList[index].trackCode,
                '{Sellerid}': this.paramsList[index].sellerId,
                '{Post_Date}': this.paramsList[index].deliveryTime,
                '{Itemnumber}': item.totalQty,
                '{Seller_Email}': '{Seller_Email}'// 不替换
              }
              ebayMemberMessageAddDTOS.push({
                body: this.form.body.replace(/(\$\$.+?\$\$|\{.+?\})/g, $ => o[$]),
                itemId: pItem,
                orderNo: item.packageCode,
                recipientUserId: item.buyerId,
                recipientUserName: item.buyerId,
                sender: this.paramsList[index].sellerId,
                sendingUserId: this.paramsList[index].sellerId
              })
            })
          })
          ebSave(ebayMemberMessageAddDTOS).then(res => {
            if (res.success) {
              const logPamrams = res.data.map(item => {
                return {
                  packageCode: item.orderNo,
                  ifSuccess: ['', '1', '0'][item.sendStatus],
                  message: item.sendResult
                }
              })
              addEBSendLog(logPamrams)// 添加日志信息
              if (res.data.some(item => item.sendStatus === 2)) {
                this.$message.warning((res.data.find(item => item.sendStatus === 2) || {}).sendResult)
                return
              }
              this.$message.success(res.msg)
              this.loading = false
              this.$parent.$emit('close', true)
            }
          }).finally(_ => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>

</style>
