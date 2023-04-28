<template>
  <el-form ref="form" :model="form" size="mini" label-width="180px" class="attr-form  form-col" @submit.native.prevent>
    <div v-if="form.attr.length" class="el-form-item tr">
      <el-button size="mini" @click="resetAttr()">属性重置</el-button>
      <el-button type="primary" size="mini" class="load-attr" @click="dialogVisible = true">加载产品属性</el-button>
    </div>
    <el-row v-if="variationId && id !== variationId">
      <el-col :span="11">
        <span class="el-form-item__label">变体主题</span>
        <div class="el-form-item__content">
          <span v-if="baseProductInfo.variationThemes">{{ baseProductInfo.variationThemes }}</span>
          <span v-else-if="baseProductInfo.skuAttrs">{{ variationThemes }}</span>
          <span v-else>-</span>
        </div>
      </el-col>
      <el-col :span="11">
        <span class="el-form-item__label">变体属性</span>
        <div v-if="baseProductInfo.skuAttrs" class="el-form-item__content">
          <span v-for="(e, index) in baseProductInfo.skuAttrs" :key="index" class="me-2">{{ e.name }} : {{ e.value }} {{ e.unit }}</span>
        </div>
      </el-col>
    </el-row>
    <el-tree
      :data="form.attr"
      :props="{ children: 'children', label: 'attrName' }"
      :highlight-current="false"
      node-key="id"
      default-expand-all
      :expand-on-click-node="true"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span v-if="data.children && data.children.length">{{ data.attrName }}</span>
        <el-row v-else-if="data.isShow" :gutter="10" class="attr-box">
          <!-- select选择器 多选 -->
          <el-form-item
            v-if="data.type == 'mulSelect'"
            :label="data.attrName"
            :prop="'attr.' + data.index + '.defaultValueListForMulSelect'"
            :rules="data.required ? [{ required: true, message: '请输入'+data.attrName, trigger: 'change,blur' }] : []"
          >
            <el-row>
              <el-col :span="data.unitList && data.unitList.length ? 17 : 20">
                <el-select
                  v-model="data.defaultValueListForMulSelect"
                  :placeholder="data.attrName"
                  multiple
                  filterable
                  class="w-100"
                >
                  <el-option v-for="opt in data.optionValueList" :key="opt" :label="opt" :value="opt" />
                </el-select>
              </el-col>
              <el-col v-if="!data.required && data.isShow" :span="data.required ? 4 : 4" style="height:40px;min-height:40px;text-align:right">
                <el-button size="mini" icon="el-icon-minus" class="icon-btn" @click="remove(node,data)" />
              </el-col>
              <el-col v-if="data.unitList && data.unitList.length" :span="data.required ? 8 : 4" class="mb0">
                <!-- 单位选择器 -->
                <el-select v-model="data.defaultUnit" placeholder="单位" class="unit-yy" filterable>
                  <el-option v-for="unit in data.unitList" :key="unit" :label="unit" :value="unit" />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 其他 类型 -->
          <el-row v-else>
            <!-- {{ index }} -->
            <el-col :span="data.unitList && data.unitList.length ? 17 : 20" class="mb0">
              <div
                v-for="(valueObj, idx) in data.defaultValueList"
                :key="idx"
                :class="data.defaultValueList.length > 1 && 'mb-2'"
              >
                <el-form-item
                  :label="idx === 0 ? data.attrName : ''"
                  :prop="'attr.' + data.index + '.defaultValueList.' + idx + '.value'"
                  :rules="data.required ? [{ required: true, message: '请输入'+data.attrName, trigger: 'blur' }] : []"
                >
                  <!-- number输入框 -->
                  <el-input v-if="data.type == 'number'" v-model="valueObj.value" v-input.number.numeric :placeholder="data.attrName" />
                  <!-- text输入框 -->
                  <el-input v-if="data.type == 'text'" v-model="valueObj.value" :placeholder="data.attrName" />
                  <!-- select选择器 单选 -->
                  <el-select
                    v-if="data.type == 'select'"
                    v-model="valueObj.value"
                    :placeholder="data.attrName"
                    filterable
                  >
                    <el-option v-for="opt in data.optionValueList" :key="opt" :label="opt" :value="opt" />
                  </el-select>
                  <!-- radio组单选框 -->
                  <el-radio-group v-if="data.type==='radio'" v-model="valueObj.value">
                    <el-radio label="true" name="true">是</el-radio>
                    <el-radio label="false" name="false">否</el-radio>
                  </el-radio-group>
                  <!-- date时间选择器 -->
                  <el-date-picker
                    v-if="data.type == 'date'"
                    v-model="valueObj.value"
                    :placeholder="data.attrName"
                    type="date"
                    value-format="yyyy-MM-dd"
                  />
                  <!-- datetime时间选择器 -->
                  <el-date-picker
                    v-if="data.type == 'datetime'"
                    v-model="valueObj.value"
                    :placeholder="data.attrName"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col v-if="!data.required && data.isShow" :span="data.required ? 4 : 2" style="height:40px;min-height:40px;text-align:right" class="fr mb0">
              <el-button size="mini" icon="el-icon-minus" class="icon-btn" @click="remove(node,data)" />
            </el-col>
            <el-col v-if="data.unitList && data.unitList.length" :span="data.required ? 8 : 4" class="ms-1 mb0">
              <!-- 单位选择器 -->
              <el-select v-model="data.defaultUnit" size="mini" placeholder="单位" class="unit-yy" filterable>
                <el-option v-for="unit in data.unitList" :key="unit" :label="unit" :value="unit" />
              </el-select>
            </el-col>
          </el-row>
        </el-row>
      </span>
    </el-tree>
    <vue-drag-resize
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :is-active="true"
      :w="500"
      :h="250"
      title="产品属性"
      class="VueDragResize"
    >
      <load-attr :list="productAttrShowList" />
    </vue-drag-resize>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import loadAttr from './loadAttr.vue'
import VueDragResize from '@/components/vue-drag-resize'
export default {
  name: 'TemplateAttr',
  components: { loadAttr, VueDragResize },
  props: {
    labelWidth: {
      type: String,
      default: '120px'
    },
    id: String,
    productAttrShowList: Array,
    variationId: String,
    // 产品详细信息
    baseProductInfo: {
      type: Object,
      default: () => {}
    },
    // 模板属性列表
    templateAttrList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      // 是否折叠
      isCollapse: true,
      form: {
        attr: []
      }
    }
  },
  computed: {
    variationThemes() {
      let themes = ''
      this.baseProductInfo.skuAttrs && this.baseProductInfo.skuAttrs.filter(item => {
        if (item.name.indexOf('Map') === -1) {
          themes = themes + item.name
        }
      })
      return themes
    }
  //   // 是否存在必填项
  //   hasRequired() {
  //     return this.form.attr.find(item => item.required)
  //   },
  //   // 是否存在非必填项
  //   noRequired() {
  //     return this.form.attr.find(item => !item.required)
  //   },
  //   arrtLen() {
  //     return this.form.attr.length
  //   }
  },
  watch: {
    '$route.name'() {
      this.dialogVisible = false
    }

  },
  methods: {
    resetAttr(list) {
      this.form.attr = deepClone(list || this.templateAttrList)
    },
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      if (children.length === 0) {
        const i = this.form.attr.findIndex(p => p.attrName === parent.data.attrName)
        this.form.attr.splice(i, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep  {
  .el-collapse-item__content{
    padding-bottom: 0;
  }
  .el-tree-node__content{
    height: auto;
    padding-right: 10px;
    margin-left: 10px;
  }
  .el-tree-node__children>div{
    width: 50%;
    float: left;
  }
  .el-tree-node__content:hover, .el-tree-node:focus, .el-tree-node.is-current>.el-tree-node__content{
    background: none;
  }
}
// .attr-form{
//   width: 80%;
// }
.el-form-item--mini.el-form-item, .unit-yy{
  margin-bottom: 0;
  margin-top: 0;
}
.load-attr{
  margin-left: 20px;
}
.el-col{
  min-height: 51px;
}
.attr-box{
  max-height: 550px;
  // overflow-y: scroll;
}
.fr{
  float: right;
}
.mb0{
  margin-bottom: 0;
}
.custom-tree-node{
  width: 100%;
}
// ::v-deep .el-form-item__content{
//   width: 250px;
// }
</style>
