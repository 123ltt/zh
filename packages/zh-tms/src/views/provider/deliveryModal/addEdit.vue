<!-- 标发货新增编辑 -->
<template>
  <basic-container v-loading="loading" class="deliveryAdd">
    <el-form ref="addEdit" label-width="120px" size="mini" :model="formData" :rules="rules">
      <el-form-item prop="channelCode" label="渠道名称：">
        <g-select
          v-if="!row"
          v-model.trim="formData.channelCode"
          :items="channelList"
          key-field="channelCode"
          :label-field="getLabel"
          value-field="channelCode"
          placeholder="请选择"
          class="w-90"
        />
        <span v-else>{{ getChannelName }}</span>
      </el-form-item>

      <el-form-item label="物流查询网站：" prop="url">
        <el-input v-model="formData.url" class="w-90" type="text" show-word-limit maxlength="100" />
      </el-form-item>

      <el-table :data="formData.detailDTOS" stripe border size="mini" class="mx-3 w-95 mb-4 g-table g-table-dense">
        <el-table-column label="平台" prop="platformCode" align="center">
          <template v-slot="scope">
            <el-select v-model="scope.row.platformCode" size="mini" filterable @change="platformChange(scope.row)">
              <el-option
                v-for="item in sourcePlatformList"
                :key="item.name"
                :label="item.fullName"
                :value="item.name"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="标记简称" prop="shortName" align="center">
          <template v-slot="scope">
            <!-- <span v-if="scope.row.ebPlatform">{{ scope.row.shortName }}</span> -->
            <el-select v-model="scope.row.shortName" size="mini" filterable @focus="getVisible(scope.row)">
              <el-option
                v-for="(sitem,sindex) in scope.row.list"
                :key="sindex"
                :value="sitem.name"
                :label="sitem.fullName"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="标记值" prop="signValue" align="center">
          <template v-slot="scope">
            <el-select v-model="scope.row.signValue" size="mini">
              <el-option
                v-for="(item,index) in signValueList"
                :key="index"
                :value="item.dictKey"
                :label="item.dictValue"
              />
            </el-select>

          </template>
        </el-table-column>
        <el-table-column width="100" align="center">
          <template slot="header">
            <i class="el-icon-circle-plus icon-color text-primary fs-2" @click="addColumn" />
          </template>
          <template v-slot="slot">
            <i class="el-icon-remove icon-del fs-2 text-danger" @click="delColumn(slot.$index)" />
          </template>
        </el-table-column>
      </el-table>

      <el-form-item label="备注：" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="2" class="w-90" maxlength="200" @input="remarkBlur" />
      </el-form-item>
    </el-form>
    <div class="text-end">
      <el-button size="mini" @click="cancel()">取消</el-button>
      <el-button size="mini" type="primary" @click="save">保存</el-button>
    </div>

  </basic-container>
</template>
<script>

import { AddData, SaveData, TableDetail, shipmentMark } from '@/api/deliveryConfiguration'
import { dictionary } from '@/api/common'
export default {
  name: 'DeliveryAddEdit',
  props: {
    row: Object,
    channelList: Array
  },
  data() {
    return {
      loading: false,
      formData: {
        detailDTOS: [{ platformCode: '', shortName: '', signValue: '', list: [] }]
      },
      rules: {
        channelCode: [
          { required: !this.row, message: '渠道名称不能为空', trigger: 'change' }
        ]
      },
      sourcePlatformList: [],
      signValueList: []
    }
  },
  computed: {
    getChannelName() {
      const item = this.channelList.find(i => i.channelCode === this.row.channelCode)
      return item ? `${item.name} (${item.channelCode})` : ''
    }
  },

  watch: {
    // 'formData.channelCode'(newVal, oldVal) {
    //   this.formData.detailDTOS.forEach(item => {
    //     if (item.platformCode === 'EB') {
    //       const singlecChannel = this.channelList.find(i => i.channelCode === newVal)
    //       item.shortName = singlecChannel?.externalChannelCode
    //     }
    //   })
    // }
  },

  mounted() {
    this.getData()
  },

  methods: {
    getLabel(item) {
      return `${item.name} (${item.channelCode})`
    },
    getData() {
      Promise.all([
        shipmentMark(),
        dictionary('common_order_number_type')
      ]).then(res => {
        this.sourcePlatformList = res[0].data
        this.signValueList = res[1].data

        this.row && this.getParentData()
      })
    },
    /** 去除><符号 */
    remarkBlur(val) {
      if (/[<>]/g.test(val)) val = val.slice(0, val.length - 1)
      this.formData.remarks = val
    },
    platformChange(row) {
      // row.ebPlatform = false
      // if (row.platformCode === 'EB') {
      //   if (!this.formData.channelCode) {
      //     row.platformCode = ''
      //     return this.$message.error('选择ebay平台前需先选择渠道名称')
      //   }
      //   row.ebPlatform = true
      //   const item = this.channelList.find(i => i.channelCode === this.formData.channelCode)
      //   row.shortName = item.externalChannelCode
      //   row.shortValue = item.externalChannelCode
      //   return
      // }
      row.shortName = ''
      row.list = this.sourcePlatformList.find(item => row.platformCode === item.name).children
    },

    getVisible(row) {
      if (!row.platformCode) return this.$message.error('请先选择平台')
    },

    /* 编辑-新增相关操作 */
    getParentData() {
      TableDetail(this.row.id).then(res => {
        this.formData = res.data
        this.formData.detailDTOS.forEach(item => {
          if (item.platformCode) {
            item.list = this.sourcePlatformList.find(e => item.platformCode === e.name).children
            // item.ebPlatform = item.platformCode === 'EB'
          }
        })
      })
    },
    // 增加列表项
    addColumn() {
      const length = this.formData.detailDTOS.length - 1
      const lastData = this.formData.detailDTOS[length]
      const item = { platformCode: '', shortName: '', signValue: '', list: [] }
      if (length < 0) {
        return this.formData.detailDTOS.push(item)
      }
      if ((!lastData.platformCode) || (!lastData.shortName) || (!lastData.signValue)) {
        return this.$message.warning('请填写完信息再添加新信息')
      }
      this.formData.detailDTOS.push(item)
    },
    // 删除列表项
    delColumn(i) {
      this.formData.detailDTOS.splice(i, 1)
    },
    cancel(refreshPage) {
      this.$parent.$emit('close', refreshPage)
    },
    // 保存操作
    save() {
      this.$refs.addEdit.validate(validate => {
        if (validate) {
          const detailDTOS = this.formData.detailDTOS
          let emptyFlag = false
          detailDTOS.forEach(item => {
            if ((!item?.platformCode) || (!item?.shortName) || (!item?.signValue)) {
              emptyFlag = true
            }
          })
          if (emptyFlag) {
            return this.$message.error('请将表格数据填写完整')
          }

          detailDTOS.forEach(item => {
            item.list.forEach(i => {
              if (item.shortName === i.name) {
                item.shortValue = i.fullName
              }
            })
          })
          this.loading = true
          const ct = this.row ? SaveData(this.row.id, this.formData) : AddData(this.formData)
          ct.finally(() => {
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
.deliveryAdd{
  &.basic-container{
    min-width:600px!important;
    .w-90{
      width:90%
    }
    .w-95{
      width:95%
    }
  }
}

</style>
