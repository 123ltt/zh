<template>
  <el-row>
    <el-form ref="propertyInfo"
             size="mini"
             :model="propertyInfo"
             :rules="rules"
             label-width="100px"
             class="no-message form-col"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="logisticsProperty" label="属性" label-width="120px">
            <commonCascader v-model="propertyInfo.logisticsProperty"
                            width="93%"
                            :list="propertyList"
                            :options="propertyOpt"
                            name="logisticsProperty"
                            @init="newVal =>{changeFunc(newVal)}"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="text" style="padding:9px" @click="configBtn()">个性化配置</el-button>
        </el-col>

        <el-col v-if="!isDetail" :span="10">
          <el-button size="mini" type="primary" :disabled="disabled" style="margin-top:1px;float:right" @click="define()">保存</el-button>

        </el-col>
      </el-row>

    </el-form>
  </el-row>
</template>
<script>
import commonCascader from '../../components/classSelected'
import { logisticsProperty } from '@/api/common'
import productCofig from './productCofig'
import {
  findProductLimit,
  saveProductLimit

} from '@/api/channelInformation'
export default {
  components: { commonCascader },
  props: {
    detailInfo: Object
  },
  inject: ['isDetail'],
  data() {
    return {
      locked: false,
      disabled: true,
      propertyList: [],
      logisticsPropertyMiddleList: [],
      propertyInfo: {
        logisticsProperty: []
      },
      propertyOpt: {
        childLabel: 'children',
        prop: {
          multiple: true,
          value: 'id',
          label: 'propertyName'
        },
        searchParentId: 'logisticsPropertyId'
      },
      rules: {
        logisticsProperty: [{ required: true, message: '请选择属性', trigger: 'change' }]

      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    changeFunc(newVal) {
      this.logisticsPropertyMiddleList = newVal
      if (!this.locked) {
        this.oldValue = this.logisticsPropertyMiddleList
        this.locked = true
      }
      this.disabled = JSON.stringify(this.oldValue) === JSON.stringify(newVal)
    },
    getData() {
      Promise.all([
        logisticsProperty(),
        findProductLimit({ channelCode: this.detailInfo.channelCode })
      ]).then(res => {
        this.propertyList = res[0].data
        res[1].data.length && (this.propertyInfo.logisticsProperty = res[1].data)
        this.oldValue = this.propertyInfo.logisticsProperty
        if (!this.oldValue.length) {
          this.locked = true
        }
      })
    },
    configBtn() {
      this.$modal({
        title: '个性化配置',
        component: productCofig,
        width: '950px',
        data: {
          id: this.detailInfo.id,
          channelCode: this.detailInfo.channelCode,
          isDetail: this.isDetail
        },
        callback: (bool) => {

        }
      })
    },
    changeCb() {
      const list = []
      const val = this.logisticsPropertyMiddleList
      val && val.forEach(item => {
        item.reduce((pre, next) => {
          if (!this.hasIncludes(list, [pre, next])) list.push([pre, next])
          return next
        }, 0)
      })
      return list.map(item => ({
        parentId: item[0],
        logisticsPropertyId: item[1]
      }))
    },
    hasIncludes(list, arr) {
      return !!list.filter(item => item[0] === arr[0] && item[1] === arr[1])?.length
    },

    define() {
      this.$refs.propertyInfo.validate(valid => {
        if (valid) {
          const channelCode = this.detailInfo.channelCode

          const params = this.changeCb().map(item => ({
            channelCode,
            ...item,
            id: this.propertyInfo.id || ''
          }))

          this.loading = true
          saveProductLimit(params).finally(() => {
            this.loading = false
          }).then(res => {
            this.$message.success('操作成功!')
          })
        }
      })
    }
  }
}
</script>
