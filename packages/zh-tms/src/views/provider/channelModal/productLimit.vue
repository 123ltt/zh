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
          <el-form-item prop="logisticsProperty" label="属性:">
            <commonCascader v-model="propertyInfo.logisticsProperty"
                            width="93%"
                            :list="propertyList"
                            :options="propertyOpt"
                            name="logisticsProperty"
                            @init="newVal =>{logisticsPropertyMiddleList = newVal}"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="!isDetail" :span="2">
          <el-button type="text" @click="configBtn()">个性化配置</el-button>
        </el-col>
      </el-row>
      <div v-if="!isDetail" class="float-end me-1">
        <el-button size="mini" type="primary" @click="define()">确认</el-button>
      </div>
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
    getData() {
      Promise.all([
        logisticsProperty(),
        findProductLimit({ channelCode: this.detailInfo.channelCode })
      ]).then(res => {
        this.propertyList = res[0].data
        res[1].data.length && (this.propertyInfo.logisticsProperty = res[1].data)
      })
    },
    configBtn() {
      this.$modal({
        title: '个性化配置',
        component: productCofig,
        width: '950px',
        data: {
          id: this.detailInfo.id,
          channelCode: this.detailInfo.channelCode
        },
        callback: (bool) => {
          if (bool) {

          }
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
