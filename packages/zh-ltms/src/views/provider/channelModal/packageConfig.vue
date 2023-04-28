<!-- 个性化配置 -->
<template>
  <basic-container v-loading="loading" class="packageConfig">
    <el-form ref="addEdit" label-width="120px" size="mini" :model="formData" :rules="rules">

      <el-table :data="formData.detailDTOS" stripe border size="mini" class="mx-3 w-95 mb-4 g-table g-table-dense">
        <el-table-column label="国家" prop="countryCode" align="center">
          <template v-slot="scope">
            <g-select v-if="!isDetail"
                      v-model="scope.row.countryCode"
                      :items="countryList"
                      key-field="countryNameShort"
                      :label-field="getLabel"
                      value-field="countryNameShort"
                      placeholder="请选择"
                      :item-title="true"
            />
            <span v-else>{{ countryObj[scope.row.countryCode] }}</span>
          </template>
        </el-table-column>

        <el-table-column label="最小值" prop="minRule" align="center">
          <template v-slot="scope">
            <el-input v-if="!isDetail"
                      v-model="scope.row.minRule"
                      v-input.number.positive
                      size="mini"
                      filterable
                      clearable
                      @input="newVal=>{scope.row.minRule= limitDecimal(newVal)}"
            />
            <span v-else>{{ scope.row.minRule }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最大值" prop="maxRule" align="center">
          <template v-slot="scope">
            <el-input v-if="!isDetail"
                      v-model="scope.row.maxRule"
                      v-input.number.positive
                      size="mini"
                      filterable
                      clearable
                      @input="newVal=>{scope.row.maxRule= limitDecimal(newVal)}"
            />
            <span v-else>{{ scope.row.maxRule }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="!isDetail" width="100" align="center">
          <template slot="header">
            <i class="el-icon-circle-plus icon-color text-primary fs-2" @click="addColumn" />
          </template>
          <template v-slot="slot">
            <i class="el-icon-remove icon-del fs-2 text-danger" @click="delColumn(slot.$index)" />
          </template>
        </el-table-column>
      </el-table>

      <div v-if="!isDetail" class="text-end">
        <el-button size="mini" @click="cancel()">取消</el-button>
        <el-button size="mini" type="primary" @click="save">保存</el-button>
      </div>

    </el-form></basic-container>
</template>
<script>
import { limitDecimal } from './../../until'
import { getCountryList } from '@/api/common'
import {
  findPackageCustomLimit,
  updatePackageCustomLimit
} from '@/api/channelInformation'

export default {
  name: 'PackageConfig',
  props: {
    row: Object,
    id: String,
    channelCode: String,
    isDetail: Boolean
  },

  data() {
    return {
      loading: false,
      countryList: [],
      countryObj: {},
      formData: {
        detailDTOS: []
      },
      rules: {}
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    limitDecimal(newVal) {
      return limitDecimal(newVal, 6)
    },

    getLabel(item) {
      return `${item.countryNameCn} ${item.countryName}(${item.countryNameShort})`
    },

    getData() {
      Promise.all([
        getCountryList()
      ]).then(res => {
        this.countryList = res[0].data
        res[0].data.forEach(item => {
          this.countryObj[item.countryNameShort] = `${item.countryNameCn} ${item.countryName}(${item.countryNameShort})`
        })
        // 编辑获取详情渲染
        this.channelCode && this.init()
      })
    },

    init() {
      this.loading = true
      findPackageCustomLimit({
        ruleType: this.row.dictKey,
        channelCode: this.channelCode
      }).finally(res => {
        this.loading = false
      }).then(res => {
        if (res.data.length) {
          this.formData.detailDTOS = [...res.data]
          this.formData.detailDTOS.forEach(item => {
            this.$set(item, 'maxRule', item.maxRule !== null ? Number(Number(item.maxRule).toFixed(6)) : '')
            this.$set(item, 'minRule', item.minRule !== null ? Number(Number(item.minRule).toFixed(6)) : '')
          })
        }
      })
    },
    // 增加列表项
    addColumn() {
      this.formData.detailDTOS.push({ countryCode: '', minRule: '', maxRule: '' })
    },
    // 删除列表项
    delColumn(i) {
      this.formData.detailDTOS.splice(i, 1)
    },
    validate() {
      const emptyIndex = this.formData.detailDTOS.findIndex(item => !item.countryCode && !item.minRule && !item.maxRule)
      if (emptyIndex !== -1) {
        return this.$message.error(`注意：第${emptyIndex + 1}行没有填写!`)
      }

      const emptyCountryIndex = this.formData.detailDTOS.findIndex(item => !item.countryCode && (item.minRule || item.maxRule))
      if (emptyCountryIndex !== -1) {
        return this.$message.error(`注意：第${emptyCountryIndex + 1}行的国家为必填选项!`)
      }

      const hasEmptyIndex = this.formData.detailDTOS.findIndex(item => item.maxRule === '0')
      if (hasEmptyIndex !== -1) return this.$message.error(`第 ${hasEmptyIndex + 1} 行的 最大值 输入无效!`)

      const emptyRuleIndex = this.formData.detailDTOS.findIndex(item =>
        item.countryCode && (!item.minRule && !item.maxRule)
      )
      if (emptyRuleIndex !== -1) {
        return this.$message.error(`注意：第${emptyRuleIndex + 1}行的国家已填，最小值、最大值需填写!`)
      }

      const errorIndex = this.formData.detailDTOS.findIndex(item => {
        return item.minRule !== '' && item.maxRule !== '' && Number(item.minRule) >= Number(item.maxRule)
      }
      )
      if (errorIndex !== -1) {
        return this.$message.error(`注意：第${errorIndex + 1}行的最小值应该小于最大值!`)
      }

      return false
    },
    cancel(refreshPage) {
      this.$parent.$emit('close', refreshPage)
    },
    // 保存操作
    save() {
      this.$refs.addEdit.validate(validate => {
        // 做校验
        if (validate && !this.validate()) {
          this.loading = true

          let list = Object.assign([], this.formData.detailDTOS)
          list = list.map(item => ({
            ...item,
            channelCode: this.channelCode,
            ruleType: this.row.dictKey,
            id: item.id
          }))

          updatePackageCustomLimit({
            channelCode: this.channelCode,
            dtoCustomList: list,
            ruleType: this.row.dictKey
          }).finally(() => {
            this.loading = false
          }).then(res => {
            this.$message.success(res.msg)
            this.cancel(1)
          })
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.packageConfig{
  &.basic-container{
    min-width:600px!important;
    .w-90{
      width:90%
    }
    .w-95{
      width:95%
    }
    ::v-deep .g-table.el-table.g-table-dense td .cell {
        line-height: 24px;
    }
  }
}

</style>
