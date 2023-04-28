<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <el-form slot="header"
               ref="formRef"
               :model="form"
               size="mini"
               label-width="90px"
               class="search-form form-col no-message"
               @submit.native.prevent="search"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="属性类型" prop="attrType">
              <el-select v-model="form.attrType" clearable placeholder="请选择" class="w-100">
                <el-option v-for="item in attrTypeOptions"
                           :key="item.value"
                           :value="+item.value"
                           :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="展示类型" prop="showType">
              <el-select v-model="form.showType" clearable placeholder="请选择" class="w-100">
                <el-option
                  v-for="item in showTypeOptions"
                  :key="item.value"
                  :value="+item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="配置类型" prop="configType">
              <el-select v-model="form.configType" clearable placeholder="请选择" class="w-100">
                <el-option
                  v-for="item in configTypeOptions"
                  :key="item.value"
                  :value="+item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="取值类型" prop="cutType">
              <el-select v-model="form.cutType" clearable placeholder="请选择" class="w-100">
                <el-option
                  v-for="item in cutTypeOptions"
                  :key="item.value"
                  :value="+item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" class="w-100">
                <el-option value="" label="全部" />
                <el-option :value="1" label="生效" />
                <el-option :value="2" label="失效" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="属性名称" prop="attrName">
              <el-input v-model="form.attrName" type="text" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="10px">
              <el-button type="primary" native-type="submit">搜索</el-button>
              <el-button @click="reset">重置</el-button>
              <el-button type="primary" icon="el-icon-plus" @click="addAttrBtn">添加属性</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table-column slot="defaultSlot" :formatter="defaultSlotFormatter" label="默认值" />
      <el-table-column slot="cutNameSlot" label="取值列表">
        <template slot-scope="{row}">
          <g-text-ellipsis :content="cutNameSlotFormatter(row)" />
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作">
        <template #default="{row}">
          <template v-if="row.configType !== 1">
            <el-button type="text" size="mini" style="vertical-align:middle;" @click="editAttr(row)">
              编辑</el-button>&nbsp;&nbsp;
            <el-switch v-model="row.status"
                       :active-value="1"
                       :inactive-value="2"
                       @change="switchStatus(row)"
            />
          </template>
          <span v-else style="font-size: 12px;color:#999;">请联系IT进行修改删除</span>
        </template>
      </el-table-column>
    </g-table>
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="dialogTitle"
      width="76vw"
      top="30px"
      style="overflow:hidden;"
      @close="dialogClose"
    >
      <div v-loading="dialogLoading" class="scrollDiv">
        <el-form
          ref="dialogFormRef"
          :model="dialogForm"
          :rules="dialogRules"
          size="mini"
          label-width="80px"
        >
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="属性名称" prop="attrName">
                <el-input v-model="dialogForm.attrName" type="text" @change="dialogAttrNameChange" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文名称" prop="attrNameEn">
                <el-input v-model="dialogForm.attrNameEn" type="text" @change="dialogAttrNameEnChange" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="属性类型" prop="attrType">
                <el-select
                  v-model="dialogForm.attrType"
                  :disabled="isModify"
                  clearable
                  placeholder="请选择属性类型"
                  class="w-100"
                >
                  <el-option
                    v-for="item in attrTypeOptionsDF"
                    :key="item.value"
                    :value="+item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="配置类型" prop="configType">
                <el-select
                  v-model="dialogForm.configType"
                  disabled
                  clearable
                  placeholder="请选择配置类型"
                  class="w-100"
                >
                  <el-option
                    v-for="item in configTypeOptions"
                    :key="item.value"
                    :value="+item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="展示类型" prop="showType">
                <el-select
                  v-model="dialogForm.showType"
                  :disabled="showTypeStatus"
                  clearable
                  placeholder="请选择展示类型"
                  class="w-100"
                >
                  <el-option
                    v-for="item in showTypeOptionsDF"
                    :key="item.value"
                    :value="+item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select
                  v-model="dialogForm.status"
                  :disabled="dialogForm.configType!=2"
                  class="w-100"
                >
                  <el-option :value="1" label="生效" />
                  <el-option :value="2" label="失效" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider class="divider-cutconfig" content-position="left">字段</el-divider>
          <el-row :gutter="10" type="flex">
            <el-col :span="12">
              <el-form-item label="中文名称" prop="fieldName">
                <el-input v-model="dialogForm.fieldName" :disabled="isFieldDisabled" type="text" @change="fieldNameChange" />
              </el-form-item>
              <el-form-item label="英文名称" prop="fieldNameEn">
                <el-input
                  v-model="dialogForm.fieldNameEn"
                  :disabled="isFieldDisabled"
                  type="text"
                />
              </el-form-item>
              <el-form-item label="取值类型" prop="cutTypeField">
                <el-select
                  v-model="dialogForm.cutTypeField"
                  :disabled="cutTypeFieldDisabled"
                  clearable
                  placeholder=""
                  class="w-100"
                >
                  <el-option
                    v-for="item in cutTypeOptions"
                    :key="item.value"
                    :disabled="item.disabled"
                    :value="+item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="是否必填" prop="requiredNo">
                <el-select
                  v-model="dialogForm.requiredNo"
                  :disabled="requiredNoDisabled"
                  placeholder="请选择"
                  class="w-100"
                >
                  <el-option :value="1" label="是" />
                  <el-option :value="0" label="否" />
                </el-select>
              </el-form-item>
              <!-- <div style="margin-bottom:10px;">取值配置：</div> -->
              <el-divider class="divider-cutconfig" content-position="left">取值配置</el-divider>
              <div class="config-values">
                <el-row :gutter="5" class="config-title-row">
                  <el-col :span="5">显示中文名称</el-col>
                  <el-col :span="5">显示英文名称</el-col>
                  <el-col :span="5">编码</el-col>
                  <el-col :span="5" style="min-width:76px;">是否默认值</el-col>
                  <el-col :span="4">操作</el-col>
                </el-row>

                <el-row
                  v-for="(row, i) in cutName"
                  :key="i"
                  :gutter="5"
                  style="margin-bottom:4px;"
                >
                  <el-col :span="5">
                    <el-input
                      v-model="row.value"
                      :disabled="isInput"
                      size="mini"
                      type="text"
                      @blur="handlerBlur('value')"
                    />
                  </el-col>
                  <el-col :span="5">
                    <el-input
                      v-model="row.valueEn"
                      :disabled="isInput"
                      size="mini"
                      type="text"
                      @blur="handlerBlur('valueEn')"
                    />
                  </el-col>
                  <el-col :span="5">
                    <el-input
                      v-model="row.code"
                      :disabled="isInput"
                      size="mini"
                      type="text"
                      @blur="handlerBlur('code')"
                    />
                  </el-col>
                  <el-col :span="5" style="text-align:center;">
                    <el-checkbox
                      v-if="[2, 3, 4, 7].includes(dialogForm.cutTypeField)"
                      v-model="row.ifDefault"
                      :disabled="dialogForm.showType===2||row.value===''||row.code===''"
                      :label="true"
                    >{{ row.ifDefault?'是':'否' }}</el-checkbox>
                    <el-radio
                      v-else
                      v-model="row.ifDefault"
                      :disabled="dialogForm.showType===2||row.value===''||row.code===''"
                      :label="true"
                      style="line-height:28px;"
                      @click.native.prevent="channelClick(row, $event)"
                    >{{ row.ifDefault ? '是': '否' }}</el-radio>
                  </el-col>
                  <el-col :span="4" style="text-align:center;min-width:71px;">
                    <el-button
                      :disabled="[3, 4, ''].includes(dialogForm.cutTypeField)"
                      icon="el-icon-plus"
                      circle
                      size="mini"
                      @click="addConfigVal"
                    />
                    <el-button
                      :disabled="cutName.length===1"
                      icon="el-icon-minus"
                      circle
                      size="mini"
                      @click="delConfigVal(i)"
                    />
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-button
              :disabled="isCanToRight"
              icon="el-icon-d-arrow-right"
              size="mini"
              type="text"
              circle
              style="color:#409EFF;"
              @click="toRightSave"
            />
            <el-col :span="12">
              <el-btp
                key="dialog-btp"
                :data="dialogTableData"
                :columns="dialogColumns"
                :defaultcolumnconfig="defaultColumnConfig"
                :haspage="false"
                :row-style="dialogRowStyle"
                class="hover-class"
                max-height="300px"
                size="mini"
                border
                @row-click="fieldRowClick"
              />
            </el-col>
          </el-row>
        </el-form>
        <el-divider content-position="left">展示效果</el-divider>
        <el-form inline class="show-list" @submit.native.prevent>
          <template v-for="(item, i) in dialogTableData">
            <div :key="i" class="show-item">
              <display-field
                :key="i"
                v-model="item.showVal"
                :label="item.fieldName"
                :label-en="item.fieldNameEn"
                :type="item.cutTypePerson"
                :available-value="item.cutName"
                class="mb-0 w-100"
              />
            </div>
          </template>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="saveAttrConfig">保 存</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import { debounce } from '@/util/util'
import { queryAttr, delAttr, addAttr, querryModifyAttr, modifyAttr, updateStatus, ifCanDeleteField } from '@/api/propertyManagement'
import DisplayField from '@/components/display-field/index.vue'
import { getDicts } from '@/api/common/dict'

export default {
  name: 'PmsPropertyManagement',
  components: { DisplayField },
  props: {},
  data() {
    return {
      dialogTableData: [],
      dialogColumns: [
        {
          label: '字段名称',
          prop: 'fieldName'
        },
        {
          label: '取值配置',
          prop: 'cutName',
          renderC: (h, scope) => {
            const cutName = JSON.parse(scope.row.cutName).reduce((p, c) => {
              p.push(c.value)
              return p
            }, []).toString()
            return <g-text-ellipsis>{cutName}</g-text-ellipsis>
          }
        },
        {
          label: '取值类型',
          prop: 'cutTypePerson',
          width: 90,
          formatter: (row, column, cellValue, index) => this.findName(this.cutTypeOptions, cellValue)
        },
        {
          label: '操作',
          width: 60,
          renderC: (h, scope) => {
            return <el-button type='text' size='mini' style='padding:0;' onClick={(e) => {
              e.stopPropagation()
              if (scope.row.id === undefined) { // 新增未提交的字段可以直接删除
                this.dialogTableData.splice(scope.$index, 1)
                return
              }
              if (this.dialogLoading) return
              this.dialogLoading = true
              ifCanDeleteField(scope.row.id).then((res) => {
                this.dialogTableData.splice(scope.$index, 1)
              }).finally(() => {
                this.dialogLoading = false
              })
            }}>删除</el-button>
          }
        }
      ],
      cutTypeDisabled: false,
      isFieldDisabled: true,
      cutName: [{ value: '', valueEn: '', code: '', ifDefault: false }],
      isSame: false,
      dialogRules: {
        attrName: [{ required: true, message: '属性名称不能为空', trigger: ['change', 'blur'] }],
        attrNameEn: [{ required: true, message: '英文名称不能为空', trigger: ['change', 'blur'] }],
        attrType: [{ required: true, message: '属性类型不能为空', trigger: ['change', 'blur'] }],
        showType: [{ required: true, message: '展示类型不能为空', trigger: ['change', 'blur'] }]
      },
      dialogForm: {
        showType: '', // 展示类型
        cutTypeField: '', // 字段 - 取值类型
        status: 1, // 状态
        attrName: '', // 属性名称
        attrNameEn: '', // 英文名称
        requiredNo: 1, // 是否必填
        attrType: '', // 属性类型
        configType: 2, // 配置类型
        fieldName: '', // 字段名称
        fieldNameEn: '' // 英文名称 - 字段
      },
      isModify: false,
      dialogVisible: false,
      dialogTitle: '新增属性配置',
      rowName: undefined,
      form: {
        attrType: '',
        showType: '',
        configType: '',
        attrName: '',
        status: '',
        cutType: ''
      },
      dialogLoading: false,
      defaultColumnConfig: {
        align: 'center'
      },
      headers: [
        {
          label: '属性类型',
          prop: 'attrType',
          width: '100',
          formatter: (row, column, cellValue, index) => this.findName(this.attrTypeOptions, cellValue)
        },
        {
          label: '展示类型',
          prop: 'showType',
          width: '100',
          formatter: (row, column, cellValue, index) => this.findName(this.showTypeOptions, cellValue)
        },
        {
          label: '配置类型',
          prop: 'configType',
          width: 100,
          formatter: (row, column, cellValue, index) => this.findName(this.configTypeOptions, cellValue)
        },
        {
          label: '属性名称',
          prop: 'attrName',
          width: '120'
        },
        {
          label: '英文名称',
          prop: 'attrNameEn'
        },
        {
          slot: true,
          slotName: 'defaultSlot'
        },
        {
          slot: true,
          slotName: 'cutNameSlot'
        },
        {
          prop: 'cutTypePerson',
          label: '取值类型',
          width: 100,
          formatter: (row, column, cellValue) => {
            const one = this.cutTypeOptions.find(item => item.value - cellValue === 0)
            return one ? one.label : ''
          }
        },
        {
          prop: 'status',
          label: '状态',
          width: 80,
          formatter(row, column, cellValue) {
            return +cellValue === 1 ? '生效' : '失效'
          }
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      attrTypeOptions: [],
      showTypeOptions: [],
      configTypeOptions: [],
      cutTypeOptions: []
    }
  },
  computed: {
    isInput() {
      const { cutTypeField } = this.dialogForm
      return cutTypeField === 3 || cutTypeField === 4
    },
    cutTypeFieldDisabled() {
      const { isModify, dialogForm: { attrType, fieldName } } = this
      if ((isModify && this.isNewFields(fieldName).isSubmited) || attrType === 6) return true
      return false
    },
    requiredNoDisabled() {
      const { isModify, rowName, dialogForm: { fieldName } } = this
      return (isModify && this.isNewFields(fieldName).isSubmited) && (!!rowName)
    },
    isCanToRight() {
      const { dialogForm: { fieldName, cutTypeField, showType }, cutName } = this
      // 文本框可以直接保存到右边
      if ((cutTypeField === 3 || cutTypeField === 4) && showType !== '') return false

      // 非文本框时，显示名称、编码不能为空且不相同
      const isNull = cutName.some(item => item.value === '' || item.valueEn === '' || item.code === '') || this.isSame
      return !fieldName || !showType || !cutTypeField || isNull
    },
    attrTypeOptionsDF() {
      return this.attrTypeOptions.filter(item => item.value !== '0')
    },
    showTypeOptionsDF() {
      return this.showTypeOptions.filter(item => item.value !== '0')
    },
    // 展示类型的禁用状态
    showTypeStatus() {
      // 已添加字段则禁用展示类型下拉框
      const status = this.dialogTableData.length > 0
      return this.isModify || this.dialogForm.attrType === 6 || status
    }
  },
  watch: {
    'dialogForm.showType'(val) {
      if (val === 2) { // 多字段
        this.isFieldDisabled = false
        if (!this.isModify) {
          this.dialogForm.fieldName = ''
          this.dialogForm.fieldNameEn = ''
        }
        this.cutTypeDisabled = true
      } else { // 单字段
        this.isFieldDisabled = true
        if (!this.isModify) {
          this.dialogForm.fieldName = this.dialogForm.attrName
          this.dialogForm.fieldNameEn = this.dialogForm.attrNameEn
        }
        this.cutTypeDisabled = false
      }
    },
    'dialogForm.cutTypeField'(val) {
      this.cutName = [{ value: '', valueEn: '', code: '', ifDefault: false }]
    },
    'dialogForm.attrType'(val) {
      if (val === 6) {
        this.dialogForm.showType = 1
        this.dialogForm.cutTypeField = 1
      }
      if (!this.isModify) {
        this.dialogTableData = []
      }
    }
  },
  mounted() {
    this.getDicts().then(() => {
      this.$refs.table.load(1, {})
    })
  },
  methods: {
    getDicts() {
      return getDicts(['attr_type', 'show_type', 'config_type', 'cut_type'], 'pms').then(res => {
        this.attrTypeOptions = res.attr_type.filter(item => item.isDeleted !== 1)
        this.showTypeOptions = res.show_type
        this.configTypeOptions = res.config_type
        this.cutTypeOptions = res.cut_type.map(item => {
          item.disabled = item.value - 5 === 0
          return item
        })
      })
    },
    fieldNameChange(val) {
      const { isStash, data } = this.isNewFields(val)
      if (isStash) {
        this.rowName = val
        this.reshow(data)
      } else {
        this.rowName = undefined
      }
    },
    defaultSlotFormatter(row) {
      const { cutName, showType } = row
      if (showType === 2) return 'NA' // 复杂取值没有默认值
      try {
        const textArr = []
        JSON.parse(cutName).forEach(obj => {
          obj && obj.ifDefault && textArr.push(obj.value)
        })
        return textArr.toString()
      } catch (e) {
        return ''
      }
    },
    cutNameSlotFormatter(row) {
      const { cutName, showType } = row
      let cutNameArr = null
      try {
        cutNameArr = showType === 1 ? [JSON.parse(cutName)] : JSON.parse(cutName)
      } catch (e) {
        return cutName
      }
      const textArr = []
      cutNameArr.forEach(arr => {
        if (Array.isArray(arr)) {
          arr.forEach(obj => {
            obj && textArr.push(obj.value)
          })
        }
      })
      return textArr.toString()
    },
    handlerBlur(type) {
      const { cutName } = this
      const arr = []
      const name = {
        value: '显示中文名称',
        valueEn: '显示英文名称',
        code: '编码'
      }[type] || ''

      for (let i = 0; i < cutName.length; i++) {
        if (arr.includes(cutName[i][type])) {
          this.$message.error(`已存在${name}'${cutName[i][type]}'`)
          this.isSame = true
          return
        }
        arr.push(cutName[i][type])
      }
      this.isSame = false
    },
    fieldRowClick(row, column) {
      if (this.dialogForm.showType !== 2) return
      if (row.fieldName === this.rowName) {
        this.reshow({ requiredNo: 1 })
        return
      }
      this.reshow(row)
    },
    dialogRowStyle({ row, rowIndex }) {
      if (row.fieldName === this.rowName) return { background: '#ecf5ff' }
    },
    reshow(data) {
      Object.keys(this.dialogForm).forEach((item, index) => {
        switch (item) {
          case 'fieldName':
            this.$nextTick(() => {
              this.rowName = data.fieldName
              this.dialogForm.fieldName = data.fieldName
            })
            break
          case 'cutTypeField':
            this.dialogForm.cutTypeField = data.cutTypePerson
            break
          case 'id':
            break
          case 'fieldNameEn':
          case 'requiredNo':
            this.dialogForm[item] = data[item]
            break
          default:
            if (data[item] !== undefined && data[item] !== null) {
              this.$nextTick(() => {
                this.dialogForm[item] = data[item]
              })
            }
            break
        }
      })

      this.$nextTick(() => {
        data.cutName && (this.cutName = JSON.parse(data.cutName))
      })
    },
    async saveAttrConfig() {
      this.$refs.dialogFormRef.validate((bool, obj) => {
        if (!bool) return
        if (!this.dialogTableData.length) {
          this.$message.error('至少保存一条字段')
          return
        }
        const { attrType, showType, configType, attrName, attrNameEn, id, status } = this.dialogForm
        const productCutItemList = []
        this.dialogTableData.forEach(item => {
          const { fieldName, fieldNameEn, requiredNo, cutName, cutTypePerson } = item
          const obj = { cutTypePerson, fieldName, fieldNameEn, requiredNo, cutName }
          if (item.id) obj.id = item.id
          productCutItemList.push(obj)
        })
        const data = { attrType, showType, configType, attrName, attrNameEn, productCutItemList, status }
        if (this.dialogTitle === '修改属性配置') {
          data.id = id
          modifyAttr(data).then(res => {
            if (res.code === 200) {
              this.$message.success('修改属性成功')
              this.search()
              this.dialogVisible = false
            }
          })
          return
        }
        this.addAttr(data)
      })
    },
    delAttr(row) {
      this.$confirm('确认要删除当前属性？', '删除属性：', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAttr(row.id).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.search()
          }
        })
      }).catch(() => { })
    },
    async addAttr(data) {
      const res = await addAttr(data)
      const { code } = res
      if (code === 200) {
        this.$message.success('新增属性成功')
        this.search()
        this.dialogVisible = false
      } else {
        this.$message.success('新增属性失败')
      }
    },
    addAttrBtn() {
      this.dialogVisible = true
      this.isModify = false
      this.dialogTitle = '新增属性配置'
    },
    editAttr(row) {
      this.dialogVisible = true
      this.dialogLoading = true
      this.isModify = true
      this.dialogTitle = '修改属性配置'
      querryModifyAttr(row.id).then(res => {
        // this.dialogVisible = true
        const { code, data } = res
        if (code !== 200) return
        this.dialogForm.id = data[0].attributeId
        this.reshow(data[0])

        const dialogTableData = []
        data.forEach((item, i) => {
          dialogTableData.push(Object.assign({}, item, { showVal: '' }))
        })
        this.$nextTick(() => {
          this.dialogTableData = dialogTableData
        })
      }).finally(() => { this.dialogLoading = false })
    },
    fetch({ current, size }, params) {
      return queryAttr({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    search() {
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, this.form)
    },
    findName(arr, index) {
      if (!arr.length) return index
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value - index === 0) {
          return arr[i].label
        }
      }
    },
    dialogAttrNameChange(val) {
      if (this.dialogForm.showType !== 2) {
        this.dialogForm.fieldName = val
        this.dialogTableData = []
      }
    },
    dialogAttrNameEnChange(val) {
      if (this.dialogForm.showType !== 2) {
        this.dialogForm.fieldNameEn = val
        this.dialogTableData = []
      }
    },
    delConfigVal(index) {
      this.cutName.splice(index, 1)
    },
    addConfigVal: debounce(function() {
      if (this.isCanToRight) {
        this.$message.error('请先输入正确的取值配置，再进行添加')
        return
      }
      this.cutName.push({ value: '', valueEn: '', code: '', ifDefault: false })
    }, 1000, true),
    toRightSave: debounce(function() {
      const { fieldName, fieldNameEn, requiredNo, cutTypeField, showType, configType } = this.dialogForm
      const { dialogTableData, cutName } = this

      // 添加到右侧的表格中
      const obj = { configType, fieldName, fieldNameEn, requiredNo, cutTypePerson: cutTypeField, cutName: JSON.stringify(cutName) }
      if (showType !== 2) {
        this.dialogTableData.splice(0, 1, obj)
      } else {
        for (let i = 0; i < dialogTableData.length; i++) {
          if (dialogTableData[i].fieldName === fieldName) {
            this.$confirm(`确定覆盖字段：${fieldName}`).then(() => {
              obj.id = dialogTableData[i].id
              this.dialogTableData.splice(i, 1, obj)
            }).catch(() => {})
            return
          }
        }

        this.dialogTableData.push(obj)
      }
    }, 1000, true),
    isNewFields(fieldName) {
      const { dialogTableData } = this
      for (let i = 0; i < dialogTableData.length; i++) {
        if (dialogTableData[i].fieldName === fieldName) {
          const isSubmited = dialogTableData[i].id !== undefined
          return {
            isStash: true,
            isSubmited,
            data: dialogTableData[i]
          }
        }
      }
      return {
        isStash: false,
        isSubmited: false
      }
    },
    dialogClose() {
      this.dialogTableData = []
      this.configValues = {
        fieldName: '',
        cutTypePerson: '',
        cutName: [{ value: '', valueEn: '', code: '', ifDefault: false }]
      }
      this.$refs.dialogFormRef.resetFields()
      Object.keys(this.dialogForm).forEach(item => {
        this.dialogForm[item] = item === 'configType' ? 2 : ''
      })
      this.dialogForm.status = 1
      this.dialogForm.requiredNo = 1
    },
    channelClick: debounce(function(row, e) {
      if (row.value === '' || row.code === '' || this.dialogForm.showType === 2) {
        // this.$message.error(`无法设置''字符为默认值`)
        return false
      }
      this.cutName = this.cutName.map(item => {
        if (item.code === row.code) item.ifDefault = !row.ifDefault
        else item.ifDefault = false
        return item
      })
      e.target.parentElement.blur()
    }, 500, true),
    switchStatus: debounce(function(row) {
      updateStatus(row.id, row.status).then(res => {
        this.$message.success('状态修改成功')
      })
    }, 500),
    reset() {
      this.$refs.formRef.resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dialog__body{
  padding: 16px 20px 6px;
}
::v-deep .el-dialog__footer{
  padding: 10px;
}
.scrollDiv {
  padding-right: 6px;
  max-height: 72vh;
  overflow-x: hidden;
  .hover-class ::v-deep .hover-row > td {
    background-color: #d9ecff;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .divider-cutconfig {
    margin: 16px 0 !important;
  }
  .config-values {
    min-height: 29px;
    max-height: 198px;
    overflow-y: scroll;
    overflow-x: hidden;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 0 0 4px 4px;
    .config-title-row{
      position: sticky;
      top: 0;
      z-index: 99;
      background: #fff;
      text-align: center;
      margin: 0 0 4px!important;
      padding-bottom: 4px;
      border-bottom: 1px solid #ddd;
      .el-col{
        border-right: 1px solid #ddd;
        &:last-child{
          border: none;
        }
      }
    }
    ::v-deep .el-col {
      margin-bottom: 0;
      .el-checkbox__label {
        line-height: 28px;
      }
    }
  }
  .show-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .show-item {
      width: 45%;
      display: flex;
    }
  }
}
</style>
