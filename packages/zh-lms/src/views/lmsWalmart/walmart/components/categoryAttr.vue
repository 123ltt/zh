<template>
  <el-form ref="form" :model="form" size="mini" label-width="200px" class="attr-form form-col">
    <div class="el-form-item tr">
      <el-button v-if="form.property.length" size="mini" @click="resetAttr()">属性重置</el-button>
      <load-attr :product-sku="baseProductInfo.productSku" />
    </div>
    <el-row v-if="form.otherProperty.length" :gutter="10" class="attr-box">
      <div v-for="(item,index) in form.otherProperty" :key="index">
        <el-col :span="12">
          <el-form-item
            :label="item.title"
            :prop="'otherProperty.'+index+'.value'"
            label-width="200px"
          >
            <el-input v-if="['string'].includes(item.type)" v-model="item.value" size="mini" type="text" :placeholder="item.title" class="g-w100" />
            <template>
              <el-select
                v-if="['select'].includes(item.type)"
                v-model="item.value"
                :placeholder="item.title"
                filterable
                clearable
                size="mini"
                class="g-w100"
              >
                <el-option v-for="(opt, i) in item.enums" :key="i" :label="opt" :value="opt" />
              </el-select>
            </template>
            <el-date-picker
              v-if="item.type === 'date'"
              v-model="item.value"
              :placeholder="item.title"
              type="date"
              value-format="yyyy-MM-dd"
              size="mini"
              class="g-w100"
            />
          </el-form-item>
        </el-col>
      </div>
    </el-row>
    <el-row v-if="form.property.length" :gutter="10" class="attr-box">
      <div v-for="(item, index) in form.property" :key="index">
        <!-- 优先展示所有的必填项，必填项不足非必填补上/超过10条折叠 -->
        <el-col v-if="isCollapse ? (!hasRequired && index < 10) || (item.required || index < 10) : true" :span="12">
          <el-row class="ms-0 me-0">
            <el-col :span="20" class="mb-0">
              <el-form-item
                :label="item.title"
                :prop="'property.'+index+'.value'"
                :rules="item.required ? [{ required: true, message: '请输入'+item.title, trigger: ['change', 'blur'] }] : []"
              >
                <!-- number输入框 -->
                <el-input v-if="item.inputType == 'numeric'" v-model="item.value" v-input.positive :placeholder="item.title+'（请输入数字格式）'" class="g-w100" />
                <!-- text输入框  非descrition的richText用text -->
                <el-input v-if="['text', 'richText'].includes(item.inputType)" v-model="item.value" type="text" show-word-limit :maxlength="item.maxLength?item.maxLength:undefined" :placeholder="item.title" class="g-w100" @blur="item.format?patternRule(item):getEmpty;" />
                <!-- 下拉选择框 -->
                <!-- v-if="['multiEnumInput', 'multiSelect', 'singleSelect','enumInput'].includes(item.inputType)" -->
                <template>
                  <inputAutocomplete
                    v-if="item.label == 'Brand' || item.label == 'brand'"
                    :val.sync="item.value"
                    :list="[{name: 'No Brand', id: 'No Brand'}]"
                    :placeholder="item.label"
                    class="g-w100"
                  />
                  <!-- :multiple="['multiEnumInput', 'multiSelect', 'enumInput'].includes(item.inputType)" -->
                  <el-select
                    v-if="['select'].includes(item.inputType)"
                    v-model="item.value"
                    :placeholder="item.title"
                    filterable
                    clearable
                    class="g-w100"
                  >
                    <el-option v-for="(opt, i) in JSON.parse(item.enums)" :key="i" :label="opt" :value="opt" />
                  </el-select>
                </template>
                <template v-if="['isParent'].includes(item.inputType)">
                  <div v-for="(its,key) in item.childs" :key="key">
                    <el-form-item :label="its.title" style="width:100%">
                      <el-input v-if="['text', 'richText'].includes(its.inputType)" v-model="its.value" type="text" show-word-limit :maxlength="its.maxLength?its.maxLength:undefined" :placeholder="its.title" class="g-w100" @blur="its.format?patternRule(its):getEmpty;" />
                      <el-input v-if="its.inputType == 'numeric'" v-model="its.value" v-input.positive :placeholder="its.title+'（请输入数字格式）'" class="g-w100" />
                      <el-select
                        v-if="['select'].includes(its.inputType)"
                        v-model="its.value"
                        :placeholder="its.title"
                        filterable
                        clearable
                        class="g-w100"
                      >
                        <el-option v-for="(opt, i) in JSON.parse(its.enums)" :key="i" :label="opt" :value="opt" />
                      </el-select>
                    </el-form-item>
                    <!-- position:absolute;top:44px;left:25vw -->
                    <el-col v-if="its.handler" :span="2" :style="'position:absolute;top:'+3.85*key+'em'+';left:23.5vw'" class="mb-0">
                      <el-button size="mini" icon="el-icon-plus" class="icon-btn" @click="addBtn(index,'parent',key)" />
                    </el-col>
                    <!-- height:40px;min-height:40px;text-align:right; -->
                    <el-col v-if="its.add" :span="2" :style="'position:absolute;top:'+3.85*key+'em'+';left:26vw'" class="mb-0">
                      <el-button size="mini" icon="el-icon-minus" class="icon-btn" @click="remove(index,'parent',key)" />
                    </el-col>
                  </div>
                </template>
                <!-- date时间选择器 -->
                <el-date-picker
                  v-if="item.inputType == 'date'"
                  v-model="item.value"
                  :placeholder="item.label"
                  type="date"
                  class="g-w100"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <!-- <el-col v-if="!item.required" :span="2" style="height:40px;min-height:40px;text-align:right" class="mb-0">
              <el-button size="mini" icon="el-icon-minus" class="icon-btn" @click="remove(index)" />
            </el-col> -->
            <el-col v-if="item.handler" :span="2" style="height:40px;min-height:40px;text-align:right" class="mb-0">
              <el-button size="mini" icon="el-icon-plus" class="icon-btn" @click="addBtn(index)" />
            </el-col>
            <el-col v-if="item.add" :span="2" style="height:40px;min-height:40px;text-align:right" class="mb-0">
              <el-button size="mini" icon="el-icon-minus" class="icon-btn" @click="remove(index)" />
            </el-col>
          </el-row>
        </el-col>
      </div>
    </el-row>
    <div class="">
      <!-- v-if="(arrtLen > 10 && !hasRequired) || (noRequired && arrtLen > 10)" -->
      <el-button size="mini" type="primary" @click="isCollapse = !isCollapse">{{ isCollapse ? '点我展开' : '点我折叠' }}</el-button>
    </div>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import loadAttr from '@/views/components/loadAttr/loadAttr.vue'
import inputAutocomplete from './inputAutocomplete.vue'
import { getCategoryAttribute } from '@/api/walmart/walmart.js'
import { getChildAttrList } from '@/api/walmart/attribute.js'
import * as addListingHandle from '../addListing.handle.js'
export default {
  name: 'CategoryAttr',
  components: { loadAttr, inputAutocomplete },
  props: {
    labelWidth: {
      type: String,
      default: '120px'
    },
    // 产品详细信息
    baseProductInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      attrList: [],
      // 是否折叠
      isCollapse: true,
      form: {
        property: [],
        otherProperty: []
      },
      diyAttrList: [],
      flagList: [
        { value: 1, label: 'NO' },
        { value: 2, label: 'YES' }
      ],
      categoryId: ''
    }
  },
  computed: {
    // 是否存在必填项
    hasRequired() {
      return this.form.property.find(item => item.required)
    },
    // 是否存在非必填项
    noRequired() {
      return this.form.property.find(item => !item.required)
    },
    arrtLen() {
      return this.form.property.length
    }
  },
  mounted() {
    this.form.otherProperty = deepClone(addListingHandle.defaultAttrList())
  },
  methods: {
    getEmpty() {

    },
    // 验证url格式
    patternRule(item) {
      const reg = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
      if (!reg.test(item.value)) {
        item.value = ''
        this.$message.error('url格式不正确请重新输入')
      }
    },
    resetAttr() {
      this.form.property = deepClone(this.attrList)
      // console.log(this.form.property, '属性值')
    },
    remove(index, type, key) {
      // if (this.form.property[index].diy) {
      //   this.diyAttrList.shift(1)
      // }
      if (type === 'parent') {
        // this.form.property[index].childs.splice(key, 1)
        this.form.property.splice(index, 1)
      } else {
        this.form.property.splice(index, 1)
      }
    },
    // 添加选项
    addBtn(index, type, key) {
      if (type === 'parent') {
        // this.form.property[index].childs.splice(index, 0, deepClone(this.form.property[index].childs[key]))
        // this.form.property[index].childs.forEach(item => { if (item.attributeName === this.form.property[index].childs[key].attributeName) { item.add = 'add'; this.$delete(this.form.property[index].childs[key], 'add') } })
        this.form.property.splice(index, 0, deepClone(this.form.property[index]))
        // this.form.property[index + 1].add = 'add'
        this.form.property[index + 1].childs.forEach(item => {
          if (item.handler) item.add = 'add'
        })
      } else {
        this.form.property.splice(index, 0, deepClone(this.form.property[index]))
        this.form.property[index + 1].add = 'add'
      }
      // 反序列化ohterProperty
      /** const productAttributes = {}
      this.form.otherProperty.forEach(item => {
        if (item.value) {
          productAttributes[item.property] = item.value
        }
      })**/
      // 反序列化property
      // const variantAttributes = {}
      // this.form.property.forEach(item => {
      //   if (item.value) {
      //     if (item.type === 'array') {
      //       variantAttributes[item.attributeName] = variantAttributes[item.attributeName]?.length ? variantAttributes[item.attributeName].concat(item.value) : [].concat(item.value)
      //     } else {
      //       variantAttributes[item.attributeName] = item.value
      //     }
      //   }
      //   // 过滤childs数组
      //   if (item.childs && item.childs.filter(item => !!item.value).length) {
      //     let arr = []
      //     const brr = []
      //     let obj = {}
      //     arr = item.childs.map(its => {
      //       its = Object.assign({
      //         [its.attributeName]: its.value
      //       })
      //       return its
      //     })
      //     for (let i = 1; i < arr.length; i++) {
      //       obj = Object.assign(arr[0], arr[i])
      //     }
      //     brr.push(obj)
      //     variantAttributes[item.title] = variantAttributes[item.title]?.length ? variantAttributes[item.title].concat(brr) : brr
      //   }
      // })
      /**  序列化方法(通用属性-)
      const ohterProperty = []
      const obj = JSON.parse(variantDTOS.extendDTO.productAttributes)
      for (const key in obj) {
        this.form.otherProperty.forEach(item => {
          if(item.attributeName===key){
            item.value = obj[key]
          }
        })
      }
      */

      /**
      序列化方法(动态属性属性-)
      const ohterProperty = []
      const obj = JSON.parse(variantDTOS.extendDTO.variantAttributes)
      for (const key in obj) {
        this.form.property.forEach(item => {
          if (item.attributeName === key) {
            item.value = obj[key]
          }
          if (item.childs) {
            childs.forEach(its => {
              if (its.attributeName === key) {
                its.value = obj[key]
              }
            })
          }
        })
      }**/
    },
    // 获取类目属性列表
    getCateogAttr(categoryName, attributes, isEditInit) {
      if (isEditInit) { // 编辑回显
        const otherProperty = deepClone(this.form.otherProperty)
        otherProperty.forEach(item => {
          if (attributes.normal[item.property]) {
            item.value = attributes.normal[item.property]
          }
        })
        this.form.otherProperty = otherProperty
      }

      if (!categoryName) {
        this.form.property = []
        return
      }
      // 获取子属性
      getChildAttrList({ current: 1, size: 999 }, { categoryNameList: [categoryName] }).then(res => {
        let childAttrList = []
        if (res.data.records.length) {
          const { attributeName } = res.data.records[0]
          childAttrList = attributeName.split(';')
        }
        this.categoryId = categoryName // 解决baseProductInfo.categoryId为空的情况
        this.$emit('productLoadingStart')
        getCategoryAttribute({ categoryName, feedType: 'MP_ITEM' }).then(res => {
          if (res.data) {
            const data = res.data || []
            const { attrList, varAttr, varAttrHead, varChild } = addListingHandle.setAttrValue(data, this, attributes, childAttrList)
            const attrData = deepClone(attrList)
            if (isEditInit) { // 编辑回显
              attrData.forEach(item => {
                // console.log(item, 'item数据')
                for (const key in attributes.variant) {
                  // 父子属性赋值（单个情况）
                  if (item.title === key) {
                    item.childs.forEach(its => {
                      its.value = Object.keys(attributes.variant[key][0])[0] === its.attributeName ? attributes.variant[key][0][Object.keys(attributes.variant[key][0])[0]] : attributes.variant[key][0][Object.keys(attributes.variant[key][0])[1]]
                    })
                  }
                  // 单个动态属性赋值
                  if (item.attributeName === key) {
                    item.value = attributes.variant[key]
                  }
                }
              })
              this.form.property = attrData
            }
            this.attrList = attrData
            // this.baseProductInfo.listingType === 'Variation' && !res.data.isVariation && this.$message.error('该类目不能创建vary 多变体listing，请修改')
            this.$emit('getVarAttr', varAttr, varAttrHead, varChild, isEditInit)
          }
          this.resetAttr()
        }).finally(() => {
          this.$emit('productLoadingEnd')
        })
      })
    },
    // 提交表单获取产品属性值
    getPropertyValue() {
      // 动态属性
      const variantAttributes = {}
      this.form.property.forEach(item => {
        if (item.value) {
          if (item.type === 'array') {
            variantAttributes[item.attributeName] = variantAttributes[item.attributeName]?.length ? variantAttributes[item.attributeName].concat(item.value) : [].concat(item.value)
          } else {
            variantAttributes[item.attributeName] = item.value
          }
        }
        // 过滤childs数组
        if (item.childs && item.childs.filter(item => !!item.value).length) {
          let arr = []
          const brr = []
          let obj = {}
          arr = item.childs.map(its => {
            its = Object.assign({
              [its.attributeName]: its.value
            })
            return its
          })
          for (let i = 1; i < arr.length; i++) {
            obj = Object.assign(arr[0], arr[i])
          }
          brr.push(obj)
          variantAttributes[item.title] = variantAttributes[item.title]?.length ? variantAttributes[item.title].concat(brr) : brr
        }
      })
      // 固定属性
      let productAttributes = {}
      this.form.otherProperty.forEach(item => {
        if (item.value) {
          productAttributes = Object.assign(productAttributes, { [item.property]: item.value })
        }
      })
      // 导出 动态属性 && 固定属性
      return { variantAttributes, productAttributes }
      // return this.form.property.length ? JSON.stringify(variantAttributes) : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.attr-form{
  width: 90%;
}
.item-label {
  margin-top: -5px;
}
::v-deep .el-form-item__label {
    line-height: 15px;
    margin-top: 5px;
}
.load-attr{
  margin-left: 20px;
}
.el-col{
  min-height: 51px;
}
.attr-box{
  max-height: 550px;
  overflow-y: scroll;
}
.text-end{
  ::v-deep input{
    text-align: right;
  }
}
</style>
