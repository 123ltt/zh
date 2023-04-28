// 配置(spu,sku)属性
<template>
  <div class="d-flex">
    <div class="flex-grow-1 overflow-hidden">
      <g-table ref="table"
               v-loading="loading"
               :headers="headers"
               :fetch="fetch"
               page-layout="total, prev, pager, next, jumper"
               :pager-count="5"
               :diff-height="0"
               @rendered="toggleRowSelection"
               @select="select"
               @select-all="select"
      >
        <el-form slot="header" inline size="mini" class="no-message" @submit.native.prevent="search">
          <el-form-item label="属性名">
            <el-input v-model="form.attrName" placeholder="请输入属性名进行模糊搜索" clearable style="width:200px" />
          </el-form-item>
          <el-form-item v-if="!disabledAttrType" label="属性类型">
            <el-select v-model="form.attrType" clearable placeholder="请选择" style="width:180px">
              <el-option
                v-for="item in attrTypeOptions"
                :key="item.value"
                :value="+item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit">搜索</el-button>
          </el-form-item>
        </el-form>
      </g-table>
    </div>
    <div class="ms-1" style="width:300px;">
      <div class="mt-1" style="padding:6px 0">已选择的属性列表（已选{{ checked.length }}个）</div>
      <el-table :data="checked" border stripe size="small" class="g-table" height="434px">
        <el-table-column v-for="item in headers2" :key="item.label" :label="item.label" :prop="item.prop" :formatter="item.formatter" />
        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="py-0" :disabled="scope.row.source!==3" @click="removeChecked(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-end mt-1">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button :disabled="submitting" :loading="submitting" type="success" size="mini" @click="submit">{{ isCheckedFromProp?'确定':'保存' }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { queryAttr } from '@/api/propertyManagement.js'
import { saveAttrRelation, queryAttrRelation } from '@/api/categoryManagement.js'
import { getDicts } from '@/api/common/dict.js'

export default {
  props: {
    // 关联类型： 0类目 1spu 2sku 3组合sku
    type: Number,
    // 配置类型 标准(1),配置(2)
    configType: {
      type: Number,
      default: 2
    },
    // 属性类型（0为全部，其他值为指定类型）
    attrType: {
      type: Number,
      default: 0
    },
    /**
     * 从外部传入已勾选的属性（如果没有传入则通过接口获取）
     * 从外部传入则不会走保存接口
     * @type {ZHKJ.VueProps<{attrId:string;attrName:string;attrType:number}[]>}
     */
    relationList: Array,
    myData: Object
  },
  data() {
    return {
      loading: true,
      submitting: false,
      disabledAttrType: this.attrType !== 0, // 默认传入的attrType不为0时则禁用属性类型选项
      hiddenAttrs: [], // 如果是指定类型，则将接口获取的其他类型的属性存储到该字段，最后一起保存提交
      form: {
        status: 1, // 取有效的属性
        configType: this.configType,
        attrName: '',
        attrType: this.attrType,
        type: this.type
      },
      headers: [
        { type: 'selection', selectable: this.selectable },
        { label: '属性名', prop: 'attrName', width: '120px', 'show-overflow-tooltip': true },
        { label: '属性类型', prop: 'attrTypeName' },
        { label: '属性大类', prop: 'showTypeName' },
        { label: '取值类型', prop: 'cutTypeName' }
      ],
      headers2: [
        { label: '属性名', prop: 'attrName' },
        { label: '属性类型', prop: 'attrType', formatter: this.formatter }
      ],
      list: [],
      checked: [],
      columnOptions: {
        formatter: this.formatter
      },
      // 默认已经保存的个数
      defaultChecked: 0,
      attrTypeMapping: {},
      showTypeMapping: {},
      configTypeMapping: {},
      cutTypeMapping: {},
      attrTypeOptions: []
    }
  },
  computed: {
    isCheckedFromProp() {
      return Array.isArray(this.relationList)
    }
  },
  created() {
    this.getDicts()
  },
  mounted() {
    this.getData().then(() => {
      this.$refs.table.load(1, this.form)
    })
    // Promise.all([this.getData(), this.getDicts()]).then(() => {
    //   this.$refs.table.load(1, this.form)
    // })
  },
  methods: {
    getDicts() {
      return getDicts(['attr_type', 'show_type', 'config_type', 'cut_type'], 'pms', true, this).then(res => {
        this.attrTypeOptions = res.attr_type.filter(item => {
          const isFilter = this.type > 1 && item.value === '6' // sku、组合sku 需要过滤掉 规格属性
          return item.isDeleted !== 1 && !isFilter
        })
        this.attrTypeMapping = this.getMapping(res.attr_type)
        this.showTypeMapping = this.getMapping(res.show_type)
        this.configTypeMapping = this.getMapping(res.config_type)
        this.cutTypeMapping = this.getMapping(res.cut_type)
      })
    },
    formatter(row, column, cellValue) {
      let str
      switch (column.property) {
        // 属性类型
        case 'attrType':
          str = this.attrTypeMapping[row.attrType]; break
        // 属性大类
        case 'showType':
          str = this.showTypeMapping[row.showType]; break
        // 取值类型
        case 'cutType':
          str = this.cutTypeMapping[row.cutType]; break
        case 'default_value':
          str = row.showType === 2 ? 'NA' : cellValue; break
        default:
          str = cellValue
      }
      return str || '-'
    },
    getMapping(list = []) {
      return list.reduce((prevVal, val) => {
        prevVal[val.value] = val.label
        return prevVal
      }, {})
    },
    fetch(page, params) {
      return queryAttr(Object.assign(page, params), this).then(res => {
        res.data.records.forEach(item => {
          item.attrTypeName = this.attrTypeMapping[item.attrType]
          item.showTypeName = this.showTypeMapping[item.showType]
          item.cutTypeName = this.cutTypeMapping[item.cutTypePerson]
        })
        return res.data
      })
    },
    search() {
      this.$refs.table.load(1, this.form)
    },
    // 获取数据
    getData() {
      if (this.isCheckedFromProp) {
        const list = this.relationList.map(item => this.buildItemData(item, 'attrId'))
        this.checked = list
        this.defaultChecked = list.length
        this.loading = false
        return Promise.resolve()
      }

      this.loading = true
      return queryAttrRelation(this.type, this.myData.id, this).then(res => {
        // 如果是指定属性类型，则根据属性类型进行过滤
        let list = []
        if (this.disabledAttrType) {
          res.data.forEach(item => {
            if (item.attrType === this.attrType) {
              list.push(this.buildItemData(item, 'attrId'))
            } else {
              this.hiddenAttrs.push(this.buildItemData(item, 'attrId'))
            }
          })
        } else {
          list = res.data.map(item => this.buildItemData(item, 'attrId'))
        }
        this.checked = list

        this.defaultChecked = this.checked.length
      }).finally(() => {
        this.loading = false
      })
    },
    // 处理是否可以勾选（source：0-未知, 1-继承SPU，2-继承类目，3-手动关联，4-继承SKU）手动关联才可以删除
    selectable(row) {
      const d = this.checked.find(item => item.id === row.id)
      return d === undefined || d.source === 3
    },
    // 处理勾选（根据已勾选的记录处理list列表勾选状态）
    toggleRowSelection(list) {
      this.checked.forEach(el => {
        const d = list.find(item => item.id === el.id)
        d && this.$refs.table.tableRef.toggleRowSelection(d, true)
      })
    },
    buildItemData(el = {}, idFieldName = 'id') {
      return {
        id: el[idFieldName],
        attrName: el.attrName,
        attrType: el.attrType,
        source: el?.source || 3
      }
    },
    // 勾选
    select(checkedList = [], row) {
      // 单个勾选
      if (row) {
        if (checkedList.includes(row)) {
          this.checked.push(this.buildItemData(row))
        } else {
          this.checked = this.checked.filter(item => {
            return item.id !== row.id
          })
        }
      } else {
        // 不管全选还是返回，都将list中的项全部从checked中移除
        const rest = this.checked.filter(item => {
          // 过滤掉所有在 checked 中的 list
          return this.$refs.table.tableList.findIndex(el => el.id === item.id) === -1
        })

        // 如果是全选，则将list中的项全部插入checked中
        if (checkedList.length > 0) {
          rest.push(...checkedList.map(item => this.buildItemData(item)))
        }

        this.checked = rest
      }
    },
    // 移除勾选项
    removeChecked({ $index, row }) {
      const $this = this.$refs.table
      const i = $this.tableList.findIndex(item => item.id === row.id)
      if (i > -1) {
        $this.tableRef.toggleRowSelection($this.tableList[i], false)
      }
      this.checked.splice($index, 1)
    },
    submit() {
      if (this.submitting) return
      if (this.defaultChecked === 0 && this.checked.length === 0) return this.$message.error('未勾选')
      const params = {
        type: this.type,
        relationId: this.myData.id,
        attrIds: [...this.checked.map(item => item.id), ...this.hiddenAttrs.map(item => item.id)]
      }
      if (this.isCheckedFromProp) {
        this.$parent.$emit('close', true, params.attrIds)
      } else {
        this.submitting = true
        saveAttrRelation(params).then(data => {
          if (data.success) {
            this.$message.success(data.msg)
            this.$parent.$emit('close', true, params.attrIds)
          }
        }).finally(() => {
          this.submitting = false
        })
      }
    },
    cancel() {
      this.$parent.$emit('close')
    }
  }
}
</script>
