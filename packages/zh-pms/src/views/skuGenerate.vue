// 生成sku
<template>
  <div class="sku-generate">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="mb-1">规格属性列表</div>
        <el-table ref="attrTable" :data="attrs" border highlight-current-row size="mini" class="g-table" @current-change="selectRow">
          <el-table-column label="属性名" prop="fieldName" />
          <el-table-column label="属性类型" prop="configTypeName" />
        </el-table>
      </el-col>
      <el-col :span="12">
        <div class="mb-1">属性值</div>
        <el-card shadow="never" class="overflow-auto" style="max-height:400px">
          <el-checkbox v-for="item in childAttrs" :key="item.code+item.value" v-model="checked" :label="item" @change="checkedEvent">{{ item.value }}</el-checkbox>
          <el-button v-if="childAttrs.length>0" size="mini" icon="el-icon-plus" type="primary" class="btn-xs" @click="addProp" />
        </el-card>
      </el-col>
      <span class="position-absolute" style="top:50%;left:calc(50% - 6px);">
        <i class="el-icon-d-arrow-right" />
      </span>
    </el-row>
    <div class="text-center my-2">
      <template v-if="attrs.length>0">
        <el-button :disabled="!generateBtnStatus" size="mini" type="primary" @click="generate">确定</el-button>
        <el-button size="mini" @click="emptyChecked">清空勾选</el-button>
      </template>
      <el-button v-else size="mini" type="info" @click="autoGenerate">一键生成单品SKU</el-button>
    </div>
    <div>待生成的SKU列表</div>
    <el-table :data="skuList" border size="mini" class="mt-1 g-table">
      <el-table-column v-for="item in skuHeaders" :key="item.label" :label="item.label" :prop="item.field">
        <template slot-scope="scope">
          <el-input v-if="scope.column.property==='productName'" v-model="scope.row[scope.column.property]" size="mini" />
          <span v-else>{{ scope.row[scope.column.property] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="removeItem(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-2 text-end">
      <el-button size="mini" @click="close(false)">取消</el-button>
      <el-button size="mini" type="success" @click="submit">生成SKU</el-button>
    </div>
  </div>
</template>

<script>
import { getDict } from '@/api/common/dict'
import { saveGenerateSku, getAvailableAttrs, autoGenerateSku } from '@/api/sku'
import AddPropValue from './components/addPropValue.vue'

export default {
  props: {
    myData: Object
  },
  data() {
    return {
      loading: false,
      attrs: [],
      currentAttrRowIndex: 0,
      childAttrs: [],
      checked: [],
      childrenChecked: [], // 存储所有勾选的属性值，二维数组，根据attrs的顺序存储
      skuHeaders: [
        { label: 'SKU名称', field: 'productName' }
      ],
      skuList: [],
      generateBtnStatus: false,
      configTypeMapping: {}
    }
  },
  watch: {
    loading(status) {
      this.$parent.$emit('loading', status)
    },
    checked() {
      let count = 0
      this.childrenChecked.forEach(item => {
        if (item.length > 0) count++
      })
      this.generateBtnStatus = count > 0
    }
  },
  created() {
    this.getDicts().then(this.getData)
  },
  methods: {
    getDicts() {
      return getDict('config_type', 'pms').then(list => {
        this.configTypeMapping = list.reduce((prevVal, val) => {
          prevVal[val.value] = val.label
          return prevVal
        }, {})
      })
    },
    comb(arr = []) {
      const d = []
      function recursion(arr = []) {
        if (Array.isArray(arr[0])) {
          return arr.shift().map(el => {
            return recursion(arr.concat(el))
          })
        }
        d.push(arr)
      }
      recursion(arr)
      return d
    },
    close(status = false) {
      this.$parent.$emit('close', status)
    },
    getData() {
      this.loading = true
      getAvailableAttrs(this.myData.id, this).then(list => {
        list.forEach(item => {
          item.configTypeName = this.configTypeMapping[item.configType]
          this.skuHeaders.push({ label: item.fieldName, field: item.attributeId })
        })
        this.attrs = list
      }).finally(() => {
        this.$nextTick(() => {
          this.loading = false
          // 默认选中行
          this.$refs.attrTable.setCurrentRow(this.attrs[this.currentAttrRowIndex])
        })
      })
    },
    selectRow(data) {
      this.currentAttrRowIndex = this.attrs.findIndex(item => item === data)
      this.childAttrs = data.list
      this.checked = this.childrenChecked[this.currentAttrRowIndex] || []
    },
    checkedEvent() {
      if (this.currentAttrRowIndex > -1) {
        this.childrenChecked[this.currentAttrRowIndex] = this.checked
      }
    },
    // 清空勾选的属性值
    emptyChecked() {
      this.childrenChecked = []
      this.checked = []
    },
    generateList(combArr) {
      const list = this.comb(combArr)
      const skuList = list.map(item => {
        const productName = [this.myData.productName, ...item.map(el => el.value).filter(el => el)].join('-')
        const d = item.reduce((prevVal, currentVal, index) => {
          const val = currentVal.value
          const attr = this.attrs[index]
          prevVal[attr.attributeId] = val
          prevVal.id = this.myData.id
          if (!Array.isArray(prevVal.attrValueList)) prevVal.attrValueList = []
          val && prevVal.attrValueList.push({
            attributeId: attr.attributeId,
            fieldId: attr.fieldId,
            fieldValue: JSON.stringify([currentVal.code])
          })
          return prevVal
        }, { productName })
        return d
      }).filter(item => item)
      this.skuList.push(...skuList)
    },
    generate() {
      if (this.childrenChecked.length === 0) return
      // 未勾选的属性补空，确保顺序与attrs一直
      const comb = [...this.childrenChecked].map(item => item || [''])
      this.generateList(comb)
      this.emptyChecked()
    },
    autoGenerate() {
      autoGenerateSku(this.myData.productSpu).then(res => {
        if (res.success) {
          this.close(true)
        }
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
      })
    },
    submit() {
      if (this.loading) return
      if (this.skuList.length === 0) return this.$message.error('待生成SKU列表不能为空')
      this.loading = true
      const data = {
        spuProductId: this.myData.id,
        lstSku: this.skuList.map(item => {
          const { productName, attrValueList } = item
          return { productName, attrValueList }
        })
      }
      saveGenerateSku(data).then(res => {
        if (res.success) {
          this.close(true)
        }
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
      }).finally(() => {
        this.loading = false
      })
    },
    removeItem($index) {
      this.skuList.splice($index, 1)
    },
    addProp() {
      const currentAttr = this.attrs[this.currentAttrRowIndex]
      this.$modal({
        title: `增加 ${currentAttr.fieldName} 属性值`,
        component: AddPropValue,
        width: '400px',
        data: {
          id: currentAttr.fieldId,
          list: this.childAttrs
        },
        callback: list => {
          if (list) {
            this.childAttrs = list
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sku-generate ::v-deep .btn-xs {
  padding: 3px 7px;
}
</style>
