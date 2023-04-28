<template>
  <el-form ref="formRef"
           :rules="rules"
           size="mini"
           :model="valueInfo"
           label-width="100px"
           class="pe-4 no-message "
           :class="[isDetail?'':'form-col']"
  >
    <div>
      <el-row v-for="(item,index) in list" :key="index">
        <el-col :span="5" align="center"> {{ item.dictValue }}</el-col>
        <el-col :span="6">
          <el-form-item prop="minRule" label="最小值：">
            <el-input v-model="item.minRule"
                      v-input.number
                      maxlength="20"
                      clearable
                      class="w-70"
                      @input="newVal=>{item.minRule= limitDecimal(newVal)}"
            /> {{ item.unit }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="maxRule" label="最大值: ">
            <el-input v-model="item.maxRule"
                      v-input.number
                      maxlength="20"
                      clearable
                      class="w-70"
                      @input="newVal=>{item.maxRule= limitDecimal(newVal)}"
            /> {{ item.unit }}
          </el-form-item>
        </el-col>
        <el-col v-if="!isDetail" :span="2" align="right">
          <el-button type="text" @click="configBtn(index)">个性化配置</el-button>
        </el-col>

      </el-row>
      <el-row v-if="!isDetail">
        <div class="float-end me-1">
          <el-button size="mini" type="primary" @click="define()">保存</el-button>
        </div>
      </el-row>
    </div>

  </el-form>
</template>
<script>
import { dictionary } from '@/api/common'
import packageConfig from './packageConfig'
import {
  findPackageLimit,
  updatePackageLimit
} from '@/api/channelInformation'
import { limitDecimal } from './../../until'
export default {
  props: { detailInfo: Object },
  inject: ['isDetail'],
  data() {
    return {
      list: [],
      valueInfo: {
        maxRule: '',
        minRule: ''
      },
      rules: {},
      ruleTypeList: [],
      packageLimitList: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    limitDecimal(newVal) {
      return limitDecimal(newVal, 6)
    },
    getData() {
      Promise.all([
        dictionary('package_limit_rule_type'),
        findPackageLimit(
          { channelCode: this.detailInfo.channelCode }
        )
      ]).then(res => {
        this.list = res[0].data.map((element, i) => {
          const unit = ['kg', 'cm', 'cm', 'cm', 'cm', 'cm', 'cm*3', 'kg', ''][i]
          element.unit = unit
          return element
        })

        const data = res[1].data
        data.length && data.forEach(item => {
          this.list.forEach(e => {
            if (item.ruleType === e.dictKey) {
              this.$set(e, 'id', item.id)
              this.$set(e, 'maxRule', item.maxRule !== null ? Number(Number(item.maxRule).toFixed(6)) : '')
              this.$set(e, 'minRule', item.minRule !== null ? Number(Number(item.minRule).toFixed(6)) : '')
            }
          })
        })
      })
    },
    configBtn(index) {
      const row = this.list[index]
      this.$modal({
        title: '个性化配置（' + row.dictValue + '）',
        component: packageConfig,
        width: '950px',
        data: {
          row,
          id: this.detailInfo.id,
          channelCode: this.detailInfo.channelCode
        },
        callback: (bool) => {
          if (bool) {

          }
        }
      })
    },
    define() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const channelCode = this.detailInfo.channelCode
          const hasError = this.list
            .filter(item => item.minRule !== '' && item.maxRule !== '' && Number(item.minRule) >= Number(item.maxRule))
            .map(item => item.dictValue)
            .join(',')
          if (hasError) return this.$message.error(`${hasError}的输入有误，最大值应大于最小值`)
          const list = this.list
            .filter(item =>
              item.minRule || item.maxRule
            ).map(item => ({
              channelCode,
              id: item.id,
              ruleType: item.dictKey,
              minRule: item.minRule,
              maxRule: item.maxRule
            }))
          const params = {
            channelCode,
            dtoList: list
          }
          this.loading = true
          updatePackageLimit(params).finally(() => {
            this.loading = false
          }).then(res => {
            this.$message.success('操作成功!')
            findPackageLimit(
              { channelCode: this.detailInfo.channelCode }
            ).then(res => {
              this.getData()
            })
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.w-70{
  width:70%!important;
}
</style>
