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
                      :label-field="getLabel"
                      value-field="id"
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
                :value="+item.dictKey"
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

      <el-row v-if="dialogForm.chargeType===5" :gutter="10">
        <el-col :span="8">
          <el-form-item prop="multipleMin" label="头程费常数:">
            <el-input v-model="dialogForm.multipleMin" placeholder="请输入头程常数" />
          </el-form-item>
        </el-col>
        <el-col :span="8" style="position:relative">
          <el-form-item prop="multiple" label="倍数:">
            <el-input v-model="dialogForm.multiple"
                      placeholder="请输入头程倍数"
                      clearable
                      @input="val=>visMultiple =val?true:false"
            />
          </el-form-item>
          <div v-show="visMultiple" class="weight">(体积重大于实重倍数)</div>
        </el-col>
        <el-col :span="8" style="position:relative">
          <el-form-item prop="multipleMax" label="头程费常数1:">
            <el-input v-model="dialogForm.multipleMax"
                      placeholder="请输入头程常数1"
                      clearable
                      @input="val=>visMultipleMax =val?true:false"
            />
          </el-form-item>
          <div v-show="visMultipleMax" class="weight">(体积重大于倍数条件,取值)</div>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item v-if="dialogForm.chargeType!==4 && dialogForm.chargeType!==5" label="附加费:" prop="charge">
            <el-input v-model="dialogForm.charge"
                      v-input.number.postive
                      size="mini"
                      placeholder="请输入附加费"
                      @input="limitDecimal('charge',6)"
            />
          </el-form-item>
        </el-col>
        <!-- 燃油费模板 -->
        <el-col v-if="dialogForm.chargeType===4" :span="8">
          <el-form-item label="燃油费率:" prop="fuelCharge">
            <el-input v-model="dialogForm.fuelCharge" placeholder="请输入燃油费率" @input="forcedInput" />
          </el-form-item>
        </el-col>
        <el-col v-if="dialogForm.chargeType===5" :span="8">
          <el-form-item label="计抛参数:" prop="jpParameter">
            <el-input v-model="dialogForm.jpParameter"
                      v-input.number.numeric.positive
                      placeholder="请输入计抛参数"
            />
          </el-form-item>
        </el-col>
        <!-- 头程费模板 -->
        <el-col v-show="dialogForm.chargeType===5" :span="16">
          <el-form-item prop="warehouseCode" label="可发仓库:">
            <commonCascader v-model="dialogForm.warehouseCode"
                            width="100%"
                            :list="warehouseList"
                            :options="warehouseOpt"
                            @init="newVal =>{startShipmentList = newVal}"
            />
          </el-form-item>
        </el-col>

        <el-col v-show="dialogForm.chargeType===5" :span="8">
          <el-form-item label="最低计抛重量:" prop="minJpWeight">
            <el-input v-model="dialogForm.minJpWeight"
                      v-input.number
                      placeholder="请输入最低计抛重量"
                      maxlength="10"
                      @input="limitDecimal('minJpWeight',3)"
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
      <el-row v-show="dialogForm.chargeType!==5 && dialogForm.chargeType!==4" class="mb-4">
        <el-table :data="dialogForm.peeks" border size="mini" class="g-table g-table-dense">
          <el-table-column label="旺季收费" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.peakCharge"
                        v-input.number.postive
                        size="mini"
                        placeholder="请输入旺季收费"
                        @input="limitDecimalScope(scope)"
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
        <el-col v-if="dialogForm.chargeType!==2" :span="24">
          <el-form-item label="适用条件:" prop="conditionName">
            <el-input
              v-model="dialogForm.conditionName"
              :autosize="{ minRows: 1, maxRows: 3}"
              :disabled="dialogForm.chargeType!==1"
              type="textarea"
              maxlength="200"
              placeholder="请输入适用条件"
            />
            <!-- @blur="checkCondition" -->
          </el-form-item>
        </el-col>
        <el-col v-if="dialogForm.chargeType===1">
          <div class="rules-box">
            (规则定义：长：L、宽：W、高：H、最长边：A、次长边：B、第三长边：C、或者：or、与：and、体积：X、实际重量：K、体积重：D。单位：cm、kg、m^3)
          </div>
        </el-col>
        <el-col v-if="dialogForm.chargeType===2" :span="24">
          <p style="position:absolute;top:-5px;left:30px;color:#F56C6C">*</p>
          <el-form-item label="适用条件">
            <el-button type="primary" @click="importClick">导入邮编</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="dialogForm.chargeType===2" :span="24">
          <el-form-item label="邮编详情" prop="remark">
            <el-table :data="dialogForm.codes" border stripe min-height="100" class="g-table g-table-dense table-box">
              <el-table-column prop="partitionName" label="分区名称" align="center" />
              <el-table-column prop="code" label="邮编段" align="center" />
            </el-table>
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
              @input="remarkBlur"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn">
      <el-button type="primary" size="mini" @click="close()">取 消</el-button>
      <el-button type="primary" size="mini" @click="update">保 存</el-button>
    </div>

  </basic-container>
</template>
<script>
import { updateRule, findRule } from '@/api/logisticsSurcharge.js'
import commonCascader from '../../components/classSelected'
import logisticsImport from './logisticsImportModal.vue'
import { getWarehouseTypeTree } from '@/api/common'
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
      warehouseList: [],
      loading: false,
      visMultiple: true,
      visMultipleMax: true,
      dialogForm: {
        channelId: '',
        chargeType: '',
        charge: '',
        chargeUnit: '',
        fuelCharge: '',
        multiple: '',
        multipleMin: '',
        multipleMax: '',
        jpParameter: '',
        minJpWeight: '',
        time: '',
        conditionName: '',
        forever: false,
        remark: '',
        codes: [],
        peeks: [{ peakTime: '', peakCharge: '' }],
        warehouseCode: []
      },
      startShipmentList: [],
      pickerOptions1: this.processDate(),
      warehouseOpt: {
        childLabel: 'warehouseChildVOList',
        prop: {
          multiple: true,
          value: 'id',
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
          { required: true, message: '适用条件不能为空', trigger: 'blur' }
        ],
        warehouseCode: [
          { required: false, message: '可发仓库不能为空', trigger: 'change' }
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
          { required: false, message: '最低计抛重量不能为空', trigger: 'blur' }
        ]
      },
      conditionType: false
    }
  },
  computed: {
    typeFifth() {
      return this.dialogForm.chargeType === 5
    }
  },
  watch: {
    'dialogForm.chargeType': {
      handler: function(val) {
        if (val !== 1 && val !== 2) {
          this.dialogForm.conditionName = '无限制'
        } else if (val === 5) {
          this.$refs.dialogFormRef.warehouseCode.required = true
          this.$refs.dialogFormRef.minJpWeight.required = true
        }
        this.conditionType = false
      },
      immediate: true
    }
  },
  created() {
    getWarehouseTypeTree().then(res => {
      this.warehouseList = res.data
      this.id && this.getList()
    })
  },
  methods: {
    // 渠道名称label数据展示
    getLabel(item) {
      return `${item.name}`
    },
    remarkBlur(val) {
      val = val.trim()
      if (/[<>]/g.test(val)) val = val.slice(0, val.length - 1)
      this.dialogForm.remark = val
    },

    limitDecimal(data, num) {
      const val = this.dialogForm[data].replace(/[^(0-9|.)]+/, '')
      var reg = '/^\\d+(\\.?\\d{0,' + num + '})/g'
      // eslint-disable-next-line no-eval
      const newVal = val.match(eval(reg))
      this.dialogForm[data] = newVal ? newVal[0] : val
    },
    limitDecimalScope(scope) {
      const val = this.dialogForm.peeks[scope.$index].peakCharge.replace(/[^(0-9|.)]+/, '')
      const newVal = val.match(/^\d+(\.?\d{0,6})/g)
      this.dialogForm.peeks[scope.$index].peakCharge = newVal ? newVal[0] : val
    },

    forcedInput(inputStr) {
      const val = inputStr.replace(/[^(0-9|.)]+/, '')
      if (val[0] !== '1' && val[0] !== '0') {
        this.dialogForm.fuelCharge = ''
      } else if (val[0] === '1') {
        this.dialogForm.fuelCharge = 1
      } else if (val[0] === '0') {
        this.dialogForm.fuelCharge = 0
        if (val[1] === '.') {
          const newVal = val.match(/^\d+(\.?\d{0,})/g)
          this.dialogForm.fuelCharge = newVal ? newVal[0] : val
        }
      }
    },
    selectChange(val) {
      if (val === 1) this.dialogForm.conditionName = ''
    },
    getList() {
      findRule(this.id).then(({ data }) => {
        Object.assign(this.dialogForm, {
          ...data[0],
          warehouseCode: data[0].startShipmentList
        })
        this.dialogForm.forever
          ? this.$refs.dialogFormRef.rules.time[0].required = false
          : this.$set(this.dialogForm, 'time', [this.dialogForm.startTime, this.dialogForm.endTime])

        this.dialogForm.peeks.map(item => {
          this.$set(item, 'peakTime', [item.peakStart, item.peakEnd])
        })
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
        if (bool[i] === false && this.dialogForm.chargeType !== 4) return this.$message.error('旺季时间要在生效时间范围内')
      }
      /** 校验旺季收费时间和收费金额 */
      const check = this.dialogForm.peeks.map(item => {
        if ((!item.peakCharge && item.peakTime.length) || (item.peakCharge && !item.peakTime.length)) {
          return false
        }
      })

      for (let i = 0; i < check.length; i++) {
        if (check[i] === false && this.dialogForm.chargeType !== 4) return this.$message.error('请补全旺季收费和旺季时间字段')
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
      if (this.dialogForm.chargeType === 2 && this.dialogForm.codes.length === 0) {
        this.$message.error('请导入邮编')
        return
      }
      if (this.conditionType) {
        this.$message.error('请输入正确的公式')
        return
      }
      if (this.dialogForm.chargeType !== 2) {
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
        startShipmentList: this.changeCb(this.startShipmentList, 'startShipment'),
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
        }
      })
    },

    close(flag = true) {
      this.$parent.$emit('close', flag)
    },
    addPeek() {
      const length = this.dialogForm.peeks.length - 1
      const item = { peakTime: '', peakCharge: '' }
      if (length < 0) {
        this.dialogForm.peeks.push(item)
        return
      }
      if ((!this.dialogForm.peeks[length].peakTime) || (!this.dialogForm.peeks[length].peakCharge)) {
        this.$message.warning('请填写完信息再添加新信息')
        return
      }
      this.dialogForm.peeks.push(item)
    },

    delPeek(i) {
      this.dialogForm.peeks.splice(i, 1)
    },
    hasIncludes(list, arr) {
      return !!list.filter(item => item[0] === arr[0] && item[1] === arr[1])?.length
    },
    searchCode(list, leaf) {
      list.forEach(item => {
        if (item.id + '' === leaf[1] + '') {
          leaf[2] = item.code
          return true
        }
        item.warehouseChildVOList && this.searchCode(item.warehouseChildVOList, leaf)
      })
    },
    changeCb(val, label) {
      const list = []
      let middleList = []
      val && val.forEach(item => {
        item.reduce((pre, next) => {
          if (!this.hasIncludes(list, [pre, next])) list.push([pre, next])
          return next
        }, 0)
      })
      if (label === 'startShipment') {
        list.forEach(item => {
          this.searchCode(this.warehouseList, item)
        })
        middleList = list.map(item => ({
          startShipmentId: item[1],
          parentId: item[0],
          startShipmentCode: item[2]
        }))
      }
      return middleList
    }
  }
}
</script>
<style lang="scss" scoped>
.logistics-rules{
  &.basic-container{
    min-width:700px!important;
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
  margin:0;
  min-width:0px;
  width:0px;
  flex:0;
}
.weight{
  color:red;
  position: absolute;
  top:26px;
  left: 100px;
  font-size:8px;
  // width:80%;
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
.table-box{
  max-height: 260px;
  overflow-y: auto;
}
.mention-text{
    box-sizing: border-box;
    padding: 5px 15px;
    border: 1px solid #DCDFE6;
}
.rules-box{
  padding-left: 32px;
  color: #F56C6C;
  margin-bottom: 10px;
  font-size: 12px;
}
</style>
