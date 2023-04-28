<template>
  <!-- 物流附加费-新增/修改 -->
  <basic-container v-loading="loading" class="logistics-rules pe-3">
    <el-form
      ref="dialogFormRef"
      :model="dialogForm"
      :rules="rules"
      label-width="100px"
      size="mini"
    >
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item prop="channelId" label="渠道名称:">
            <g-select v-model.trim="dialogForm.channelId"
                      :disabled="!isAdd"
                      :items="channelList"
                      key-field="id"
                      :label-field="item=>`${item.name}(${item.channelCode})`"
                      value-field="id"
                      :item-title="true"
                      placeholder="请选择"
                      style="width:100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="费用类型:" prop="chargeType">
            <el-select
              v-model="dialogForm.chargeType"
              filterable
              clearable
              :disabled="!isAdd"
              placeholder="请选择费用类型"
              style="width:100%;"
              @change="selectChange"
            >
              <el-option
                v-for="item in surchargeTypeList"
                :key="item.dictKey"
                :value="item.dictKey"
                :label="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计费单位:" prop="chargeUnit">
            <el-select
              v-model="dialogForm.chargeUnit"
              filterable
              clearable
              :disabled="!isAdd"
              placeholder="请选择计费单位"
              style="width:100%;"
            >
              <el-option :value="1" label="票" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="typeFifth" :gutter="10">
        <el-col :span="8">
          <el-form-item prop="multipleMin" label="头程费常数:">
            <el-input v-model="dialogForm.multipleMin"
                      v-input.number.positive.!0
                      clearable
                      maxlength="13"
                      placeholder="请输入头程常数"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" style="position:relative">
          <el-form-item prop="multiple" label="倍数:">
            <el-input v-model="dialogForm.multiple"
                      v-input.number.positive.!0
                      placeholder="请输入头程倍数"
                      clearable
                      maxlength="13"
                      @input="val=>visMultiple =val?true:false"
            />
          </el-form-item>
          <div v-show="visMultiple" class="weight">(体积重大于实重倍数)</div>
        </el-col>
        <el-col :span="8" style="position:relative">
          <el-form-item prop="multipleMax" label="头程费常数1:">
            <el-input v-model="dialogForm.multipleMax"
                      v-input.number.positive.!0
                      placeholder="请输入头程常数1"
                      clearable
                      maxlength="13"
                      @input="val=>visMultipleMax =val?true:false"
            />
          </el-form-item>
          <div v-show="visMultipleMax" class="weight">(体积重大于倍数条件,取值)</div>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item v-if="!typeFourth && !typeFifth" label="附加费:" prop="charge">
            <el-input v-model="dialogForm.charge"
                      v-input.number.postive.!0
                      size="mini"
                      placeholder="请输入附加费"
                      maxlength="13"
                      @input="newVal =>{dialogForm.charge = limitDecimal(newVal,6)}"
            />
          </el-form-item>
        </el-col>
        <!-- 燃油费模板 -->
        <el-col v-if="typeFourth" :span="8">
          <el-form-item label="燃油费率:" prop="fuelCharge">
            <el-input v-model="dialogForm.fuelCharge"
                      v-input.number.positive.!0
                      placeholder="请输入燃油费率"
                      @input="newVal=>{dialogForm.fuelCharge = forcedInput(newVal)}"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="typeFifth" :span="8">
          <el-form-item label="计抛参数:" prop="jpParameter">
            <el-input v-model="dialogForm.jpParameter"
                      v-input.number.positive.!0
                      maxlength="10"
                      placeholder="请输入计抛参数"
            />
          </el-form-item>
        </el-col>
        <!-- 头程费模板 -->
        <el-col v-if="typeFifth" :span="16">
          <el-form-item prop="warehouseCode" label="可发仓库:">
            <commonCascader v-model="dialogForm.warehouseCode"
                            width="100%"
                            :list="warehouseList"
                            :options="warehouseOpt"
                            name="startShipment"
                            @init="newVal =>{startShipmentList = newVal}"
            />
          </el-form-item>
        </el-col>

        <el-col v-if="typeFifth" :span="8">
          <el-form-item label="最低计抛重量:" prop="minJpWeight">
            <el-input v-model="dialogForm.minJpWeight"
                      v-input.number.positive.!0
                      placeholder="请输入最低计抛重量"
                      maxlength="10"
                      @input="newVal =>{dialogForm.minJpWeigh =limitDecimal(newVal,3)}"
            />
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item label="生效时间:" prop="time">
            <div class="tiem-type">
              <el-date-picker v-model="dialogForm.time"
                              :disabled="dialogForm.forever"
                              type="daterange"
                              range-separator=" 至 "
                              value-format="yyyy-MM-dd"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              size="mini"
                              style="width:100%;"
              />
              <el-checkbox v-model="dialogForm.forever" @change="timeChange">永久</el-checkbox>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 模板五不显示此字段 -->
      <el-row v-show="!typeFifth && !typeFourth" class="mb-4">
        <el-table :data="dialogForm.peeks" border size="mini" class="g-table g-table-dense">
          <el-table-column label="旺季收费" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.peakCharge"
                        v-input.number.positive.!0
                        size="mini"
                        maxlength="13"
                        placeholder="请输入旺季收费"
                        @input="newVal =>{scope.row.peakCharge=limitDecimal(newVal,6)}"
              />
            </template>
          </el-table-column>
          <el-table-column label="旺季时间" align="center">
            <template slot-scope="scope">
              <div class="tiem-type">
                <el-date-picker v-model="scope.row.peakTime"
                                type="daterange"
                                range-separator=" 至 "
                                value-format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                size="mini"
                                style="width:100%;"
                                :picker-options="pickerOptions1"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column width="100" align="center">
            <template slot="header">
              <i class="el-icon-circle-plus icon-color" @click="addPeek" />
            </template>
            <template slot-scope="scope">
              <i class="el-icon-remove icon-del" @click="delPeek(scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <!-- 适用条件模板二和模板五不显示 -->
        <el-col v-if="!typeSecond" :span="24">
          <el-form-item label="适用条件:" prop="conditionName">
            <el-input
              v-model="dialogForm.conditionName"
              :autosize="{ minRows: 1, maxRows: 3}"
              :disabled="!typeFirst"
              type="textarea"
              maxlength="200"
              placeholder="请输入适用条件"
            />
            <!-- @blur="checkCondition" -->
          </el-form-item>
        </el-col>
        <el-col v-if="typeFirst">
          <div class="rules-box">
            (规则定义：长：L、宽：W、高：H、最长边：A、次长边：B、第三长边：C、或者：or、与：and、体积：X、实际重量：K。单位：cm、kg、cm^3)
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="typeSecond" :span="24">
          <p style="position:absolute;top:-5px;left:30px;color:#F56C6C">*</p>
          <el-form-item label="适用条件">
            <el-button type="primary" @click="importClick">导入邮编</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-show="typeSecond" :span="24">
          <el-form-item label="邮编详情" prop="remark">
            <g-table ref="table"
                     row-key="id"
                     :headers="headers"
                     :fetch="fetch"
                     :page-show="false"
                     :fixed-height="false"
                     :height="height"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="dialogForm.remark"
              :autosize="{ minRows: 2, maxRows: 3}"
              type="textarea"
              maxlength="200"
              placeholder="请输入内容"
              @input="newVal=>{ dialogForm.remark = limitSpaceOrGtLt(newVal) }"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn">
      <el-button size="mini" @click="close()">取 消</el-button>
      <el-button type="primary" size="mini" @click="update">保 存</el-button>
    </div>

  </basic-container>
</template>
<script>
import { updateRule, findRule } from '@/api/logisticsSurcharge.js'
import commonCascader from '../../components/classSelected'
import logisticsImport from './logisticsImportModal.vue'
import { getWarehouseTypeTree } from '@/api/common'
import {
  limitDecimal,
  forcedInput,
  limitSpaceOrGtLt,
  takeWholeNum
} from '@/views/until'

export default {
  name: 'SurchargeAddEdit',
  components: { commonCascader },
  props: {
    isAdd: Boolean,
    id: String,
    channelList: Array,
    surchargeTypeList: Array,
    chargeUnitList: Array,
    channelObj: Object
  },

  data() {
    return {
      height: '100px',
      warehouseList: [],
      loading: false,
      visMultiple: true,
      visMultipleMax: true,
      dialogForm: {
        peeks: [{ peakTime: '', peakCharge: '' }],
        codes: []
      },
      headers: [
        { label: '分区名称', prop: 'partitionName', align: 'center' },
        { label: '邮编段', prop: 'code', align: 'center' }
      ],
      startShipmentList: [],
      pickerOptions1: this.processDate(),
      warehouseOpt: {
        childLabel: 'warehouseChildVOList',
        prop: {
          multiple: true,
          value: 'code',
          label: 'desc',
          children: 'warehouseChildVOList'
        },
        searchParentId: 'startShipmentId'
      },
      rules: {
        channelId: [
          { required: true, message: '渠道名称不能为空', trigger: 'change' }
        ],
        chargeType: [
          { required: true, message: '费用类型不能为空', trigger: 'blur' }
        ],
        chargeUnit: [
          { required: true, message: '计费单位不能为空', trigger: 'blur' }
        ],
        charge: [
          { required: true, message: '附加费不能为空', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '生效时间不能为空', trigger: 'change' }
        ],
        conditionName: [
          { required: true, message: '适用条件不能为空', trigger: ['change', 'blur'] }
        ],
        warehouseCode: [
          { required: true, message: '可发仓库不能为空', trigger: 'change' }
        ],
        fuelRate: [
          { required: true, message: '燃油费率不能为空', trigger: 'blur' }
        ],
        multipleMin: [
          { required: true, message: '头程常数不能为空', trigger: 'blur' }
        ],
        multipleMax: [
          { required: true, message: '头程常数1不能为空', trigger: 'change' }
        ],
        multiple: [
          { required: true, message: '头程倍数不能为空', trigger: 'change' }
        ],
        fuelCharge: [
          { required: true, message: '燃油费率不能为空', trigger: 'blur' }
        ],
        jpParameter: [
          { required: true, message: '计抛参数不能为空', trigger: 'blur' }
        ],
        minJpWeight: [
          { required: true, message: '最低计抛重量不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 超规格被选中
    typeFirst() {
      const key = this.surchargeTypeList.find(item => item.dictValue === '超规格费').dictKey
      return this.dialogForm.chargeType === key
    },
    // 偏远附加费被选中
    typeSecond() {
      const key = this.surchargeTypeList.find(item => item.dictValue === '偏远附加费').dictKey
      return this.dialogForm.chargeType === key
    },
    // 燃油率被选中
    typeFourth() {
      const key = this.surchargeTypeList.find(item => item.dictValue === '燃油费').dictKey
      return this.dialogForm.chargeType === key
    },
    // 头程费被选中
    typeFifth() {
      const key = this.surchargeTypeList.find(item => item.dictValue === '头程费').dictKey
      return this.dialogForm.chargeType === key
    }
  },
  watch: {
    'dialogForm.chargeType': {
      handler: function(val) {
        if (!this.typeFirst && !this.typeSecond) {
          this.$set(this.dialogForm, 'conditionName', '无限制')
        }
        !val && this.$set(this.dialogForm, 'conditionName', '')
      },
      immediate: true
    }
  },

  mounted() {
    getWarehouseTypeTree().then(res => {
      this.warehouseList = res.data
      this.id && this.getList()
    })
  },

  methods: {
    fetch({ current, size }, params) {
      return Promise.resolve(this.dialogForm.codes).then(res => {
        res.length && (this.height = '300px')
        return {
          records: res,
          total: res.length,
          size: res.length
        }
      })
    },

    limitDecimal(newVal, num) {
      return limitDecimal(newVal, num)
    },

    limitSpaceOrGtLt(val) {
      return limitSpaceOrGtLt(val)
    },

    forcedInput(val) {
      return forcedInput(val, 6)
    },

    selectChange(val) {
      if (this.typeFirst) this.dialogForm.conditionName = ''
    },

    getList() {
      findRule(this.id).then(({ data }) => {
        ['multipleMin', 'multiple', 'multipleMax', 'fuelCharge'].forEach(item => {
          data[0][item] = takeWholeNum(data[0][item], 6)
        })
        this.dialogForm = data[0]
        this.dialogForm.warehouseCode = data[0].startShipmentList
        this.dialogForm.forever
          ? this.$refs.dialogFormRef.rules.time[0].required = false
          : this.$set(this.dialogForm, 'time', [this.dialogForm.startTime, this.dialogForm.endTime])
        this.dialogForm.peeks.map(item => {
          this.$set(item, 'peakTime', [item.peakStart, item.peakEnd])
        })
        this.typeSecond && this.$refs.table.load(1, {})
      })
    },

    timeChange(val) {
      this.$refs.dialogFormRef.rules.time[0].required = !val
      val && (this.dialogForm.time = '')
    },

    processDate() {
      const self = this
      return {
        disabledDate(time) {
          const timeStart = self.dialogForm.time && new Date(self.dialogForm.time[0]).getTime() // 生效时间时间戳
          const timeEnd = self.dialogForm.time && new Date(self.dialogForm.time[1]).getTime() // 生效时间时间戳
          if (timeStart) {
            return timeStart > time.getTime() + 8.64e7 || time.getTime() > timeEnd
          }
        }
      }
    },

    update() {
      this.$refs.dialogFormRef.validate((bool) => {
        if (bool) {
          this.modifyOrAddData()
        } else {
          !this.dialogForm.multipleMax && (this.visMultipleMax = false)
          !this.dialogForm.multiple && (this.visMultiple = false)
        }
      })
    },

    modifyOrAddData() {
      const peeks = []
      // 旺季时间在生效时间范围内(可以相等)
      const timeStart = this.dialogForm.time && new Date(this.dialogForm.time[0]).getTime() // 生效时间时间戳
      const timeEnd = this.dialogForm.time && new Date(this.dialogForm.time[1]).getTime() // 生效时间时间戳
      const bool = this.dialogForm.peeks.map(item => {
        const peakStart = new Date(item.peakTime[0]).getTime() // 旺季时间时间戳
        const peakEnd = new Date(item.peakTime[1]).getTime() // 旺季时间时间戳
        if ((peakStart < timeStart || peakEnd > timeEnd) && (timeStart || timeEnd)) return false
      })
      for (let i = 0; i < bool.length; i++) {
        if (bool[i] === false && !this.typeFourth) return this.$message.error('旺季时间要在生效时间范围内')
      }
      /** 校验旺季收费时间和收费金额 */
      const check = this.dialogForm.peeks.map(item => {
        if ((!item.peakCharge && item.peakTime.length) || (item.peakCharge && !item.peakTime.length)) {
          return false
        }
      })

      for (let i = 0; i < check.length; i++) {
        if (check[i] === false && !this.typeFourth) return this.$message.error('请补全旺季收费和旺季时间字段')
      }
      /** 原先逻辑 */
      this.dialogForm.peeks.forEach(item => {
        if ((!item.peakTime) || (item.peakCharge.length === 0)) {
          return
        }
        const obj = {
          peakStart: item.peakTime && item.peakTime[0],
          peakEnd: item.peakTime && item.peakTime[1],
          peakCharge: item.peakCharge && item.peakCharge
        }

        obj.id = !this.isAdd ? item.id : ''
        peeks.push(obj)
      })
      if (this.typeSecond && this.dialogForm.codes.length === 0) {
        this.$message.error('请导入邮编')
        return
      }
      if (!this.typeSecond) {
        this.dialogForm.codes = []
      }
      const params = JSON.parse(
        JSON.stringify(this.dialogForm,
          [
            'channelId',
            'chargeType',
            'charge',
            'chargeUnit',
            'fuelCharge',
            'multiple',
            'multipleMin',
            'multipleMax',
            'remark',
            'jpParameter',
            'minJpWeight'
          ]
        )
      )
      const { channelId, id, conditionName, forever, time, codes } = this.dialogForm
      Object.assign(params, {
        id: id || '',
        peeks: peeks || [],
        codes,
        startShipmentList: this.changeCb(this.startShipmentList),
        channelCode: this.channelList.find(item => item.id === channelId)?.channelCode,
        conditionName: conditionName && encodeURI(conditionName),
        forever: forever ? 1 : 0,
        startTime: forever ? '' : time[0],
        endTime: forever ? '' : time[1]
      })

      this.loading = true
      updateRule(params).finally(res => {
        this.loading = false
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(`${this.isAdd ? '新增' : '修改'}成功`)
          this.close(true)
        }
      })
    },

    importClick() {
      this.$modal({
        title: '邮编导入',
        width: '500px',
        component: logisticsImport,
        data: { },
        callback: (close, data) => {
          if (close) this.$set(this.dialogForm, 'codes', data)
          this.$refs.table.load(1, {})
        }
      })
    },

    close(flag = true) {
      this.$parent.$emit('close', flag)
    },

    addPeek() {
      const item = { peakTime: '', peakCharge: '' }
      this.dialogForm.peeks.push(item)
    },

    delPeek(i) {
      this.dialogForm.peeks.splice(i, 1)
    },

    changeCb() {
      const val = Object.assign([], this.startShipmentList)
      return val && val.map(item =>
        ({
          startShipmentCode: item.slice(item.length - 1)[0]
        })
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.logistics-rules{
  &.basic-container{
    min-width:800px!important;
    .el-row .el-col {
      margin-bottom: 0;
    }
    .table-box{
      max-height: 260px;
      overflow-y: auto;
    }
    .btn{
      text-align: right;
    }
  }
}
::v-deep .el-cascader__search-input{
  margin-bottom:0;
  width:30px;
  line-height:normal;
  height: auto;
  // min-width:0px;
  // width:0px;
  // flex:0;
  // display: none;
}
::v-deep .el-cascader--mini .el-input__inner{
  height:29px;
}
.weight{
  color:red;
  position: absolute;
  top:26px;
  left: 100px;
  font-size:8px;
}
.tiem-type{
  width: 100%;
  display: flex;
  justify-content: space-between;
  div{
    margin-right: 10px;
  }
}
.icon-color{
  font-size: 24px;
  color: dodgerblue;
}
.icon-del{
  font-size: 24px;
  color: #F56C6C;
}

.rules-box{
  padding-left: 32px;
  color: #F56C6C;
  margin-bottom: 10px;
  font-size: 12px;
}
</style>
