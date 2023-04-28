<!-- 标发货新增编辑 -->
<template>
  <basic-container v-loading="loading" class="deliveryAdd">
    <el-form ref="addEdit" label-width="120px" size="mini" :model="formData" :rules="rules">
      <el-form-item prop="type" label="分销渠道">
        <el-radio-group v-if="!row" v-model="formData.type" @change="changeFunc">
          <el-radio-button v-for="item in statusList" :key="item.dictKey" :label="item.dictKey">{{ item.dictValue }}</el-radio-button>
        </el-radio-group>
        <span v-else>{{ formData.typeName }}</span>
      </el-form-item>

      <template v-if="!isFenXiao">
        <el-form-item prop="channelCodes" label="渠道名称">
          <g-select
            v-if="!row"
            v-model.trim="formData.channelCodes"
            :items="channelList"
            key-field="channelCode"
            :label-field="getLabel"
            value-field="channelCode"
            placeholder="请选择"
            class="w-90"
          />
          <span v-else>{{ getChannelName }}</span>
        </el-form-item>
        <el-form-item label="物流查询网站" prop="url">
          <el-input v-model="formData.url" class="w-90" type="text" t maxlength="50" clearable />
        </el-form-item>
      </template>

      <template v-if="isFenXiao">
        <el-form-item label="分销平台" prop="thirdPlatformCode">
          <el-select v-if="!row" v-model="formData.thirdPlatformCode" clearable placeholder="请选择" filterable class="w-90">
            <el-option v-for="item in thirdPlatformCodeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
          <span>
            {{ formData.thirdPlatformName }}
          </span>
        </el-form-item>
        <el-form-item prop="channelName" label="渠道名称">
          <el-input v-if="!row" v-model="formData.channelName" class="w-90" maxlength="50" clearable />
          <span v-else>{{ formData.channelName }}</span>
        </el-form-item>
        <el-form-item label="渠道代码" prop="channelCode">
          <el-input v-if="!row"
                    v-model="formData.channelCode"
                    class="w-90"
                    type="text"
                    maxlength="50"
                    clearable
                    :disabled="row"
          />
          <span v-else>{{ formData.channelCode }}</span>
        </el-form-item>
        <el-form-item label="查询网站" prop="url">
          <el-input v-model="formData.url" class="w-90" type="text" maxlength="100" />
        </el-form-item>
      </template>

      <el-table :data="formData.detailDTOS" stripe border size="mini" class="mx-3 w-95 mb-4 g-table g-table-dense">
        <el-table-column align="center" prop="platformCode">
          <template slot="header">
            <span class="text-danger">*</span> 平台
          </template>
          <template v-slot="scope">
            <el-select v-model="scope.row.platformCode" size="mini" filterable @change="platformChange(scope.row,scope.$index)">
              <el-option
                v-for="item in sourcePlatformList"
                :key="item.name"
                :label="item.fullName"
                :value="item.name"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="国家" prop="country" align="center">
          <template v-slot="scope">
            <g-select
              ref="countryRef"
              v-model="scope.row.country"
              :items="countryList"
              key-field="countryNameShort"
              :label-field="getCountryLabel"
              value-field="countryNameShort"
              placeholder="请选择"
              :item-title="true"
              style="width:100%"
              @change="countryChange(scope.row,scope.$index)"
            />

          </template>
        </el-table-column>
        <el-table-column prop="shortName" align="center">
          <template slot="header">
            <span class="text-danger">*</span> 标记简称
          </template>
          <template v-slot="scope">
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
        <el-table-column prop="signValue" align="center">
          <template slot="header">
            <span class="text-danger">*</span> 标记值
          </template>
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

      <el-form-item label="备注" prop="remark">
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
import { dictionary, getCountryList } from '@/api/common'
import { getDictVal } from '@/views/until'
export default {
  name: 'DeliveryAddEdit',
  props: {
    row: Object,
    channelList: Array
  },
  data() {
    return {
      loading: false,
      statusList: [],
      formData: {
        type: '',
        detailDTOS: [{ platformCode: '', shortName: '', signValue: '', country: '', list: [] }]
      },
      rules: {
        channelCode: [
          { required: !this.row, message: '渠道代码不能为空', trigger: 'blur' }
        ],
        channelCodes: [
          { required: !this.row, message: '渠道名称不能为空', trigger: 'change' }
        ],
        type: [
          { required: !this.row, message: '分销渠道不能为空', trigger: 'change' }
        ],
        thirdPlatformCode: [
          { required: !this.row, message: '分销平台不能为空', trigger: 'change' }
        ],
        channelName: [
          { required: !this.row, message: '渠道名称不能为空', trigger: 'blur' }
        ]
      },
      thirdPlatformCodeList: [],
      countryList: [],
      sourcePlatformList: [],
      signValueList: []
    }
  },
  computed: {
    getChannelName() {
      const item = this.channelList.find(i => i.channelCode === this.row.channelCode)
      return item ? `${item.name} (${item.channelCode})` : ''
    },
    isFenXiao() {
      return this.formData.type + '' === '1'
    }
  },

  mounted() {
    if (!this.row) this.formData.type = '2'
    this.getData()
  },

  methods: {
    getCountryLabel(item) {
      return `${item.countryNameCn} ${item.countryName}(${item.countryNameShort})`
    },
    getLabel(item) {
      return `${item.name} (${item.channelCode})`
    },
    changeFunc(val) {
      const detailDTOS = this.formData.detailDTOS
      const remark = this.formData.remark
      this.formData = {
        type: val,
        channelCode: '',
        detailDTOS,
        remark
      }
    },

    getData() {
      Promise.all([
        shipmentMark(),
        getCountryList(),
        dictionary('common_order_number_type'),
        dictionary('tms_base_third_platform_code'),
        dictionary('yes_or_no')
      ]).then(res => {
        this.sourcePlatformList = res[0].data
        this.countryList = res[1].data
        this.signValueList = res[2].data
        this.thirdPlatformCodeList = res[3].data
        this.statusList = res[4].data.reverse()
        this.row && this.getParentData()
      })
    },
    /** 去除><符号 */
    remarkBlur(val) {
      if (/[<>]/g.test(val)) val = val.slice(0, val.length - 1)
      this.formData.remarks = val
    },

    platformChange(row, index) {
      row.shortName = ''
      row.list = this.sourcePlatformList.find(item => row.platformCode === item.name).children

      // 校验国家和平台是否重复
      if (row.platformCode && this.checkRepeat(row, index)) {
        row.platformCode = ''
      }
    },

    countryChange(row, index) {
      // 校验国家和平台是否重复
      if (row.country && this.checkRepeat(row, index)) {
        row.country = ''
      }
    },

    checkRepeat(row, index) {
      let indexError = ''
      this.formData.detailDTOS
        .forEach((item, i) => {
          if (item.platformCode === row.platformCode && item.country === row.country) {
            if (i !== index) indexError = i + 1
          }
        })
      if (indexError) {
        this.$message.error(`注意：第${indexError}行已填写过该平台+国家，不可重复!`)
        return true
      }
    },
    getVisible(row) {
      if (!row.platformCode) return this.$message.error('请先选择平台')
    },

    /* 编辑-新增相关操作 */
    getParentData() {
      TableDetail(this.row.id).then(({ data }) => {
        this.formData = {
          ...data,
          thirdPlatformName: getDictVal(this.thirdPlatformCodeList, data.thirdPlatformCode),
          typeName: data.type + '' === '1' ? '是' : '否'
        }
        this.formData.detailDTOS.forEach(item => {
          if (item.platformCode) {
            item.list = this.sourcePlatformList.find(e => item.platformCode === e.name).children
          }
        })
      })
    },
    // 增加列表项
    addColumn() {
      const item = { platformCode: '', shortName: '', signValue: '', country: '', list: [] }
      this.formData.detailDTOS.push(item)
    },
    // 删除列表项
    delColumn(i) {
      if (this.formData.detailDTOS.length <= 1) {
        this.$message.error('注意：最后一行数据不可删除！')
      } else {
        this.formData.detailDTOS.splice(i, 1)
      }
    },
    cancel(refreshPage) {
      this.$parent.$emit('close', refreshPage)
    },
    // 保存操作
    save() {
      this.$refs.addEdit.validate(validate => {
        if (validate) {
          const detailDTOS = this.formData.detailDTOS

          const index = detailDTOS.findIndex(item =>
            (!item?.platformCode) || (!item?.shortName) || (!item?.signValue)
          )
          if (index !== -1) {
            return this.$message.error(`注意：请将表格第${index + 1}行数据填写完整！`)
          }

          detailDTOS.forEach(item => {
            item.list.forEach(i => {
              if (item.shortName === i.name) {
                item.shortValue = i.fullName
              }
            })
          })
          this.loading = true

          this.formData.channelCode = this.formData.channelCode || this.formData.channelCodes
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
    .is-error{
      border-color: #F56C6C;
    }
  }
}

</style>
