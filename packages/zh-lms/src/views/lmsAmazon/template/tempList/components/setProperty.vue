<template>
  <basic-container>
    <div class="head">
      <el-button type="primary" size="mini" @click="getOneLeave(true)">添加顶层属性</el-button>
    </div>
    <el-row>
      <el-col :span="8" class="head-p">属性名称</el-col>
      <el-col :span="8" class="head-p">设置默认值</el-col>
      <el-col :span="8" class="head-p" style="text-align:right;padding-right:16px">操作</el-col>
    </el-row>
    <el-form ref="form" :model="form" label-width="200px" class="attr-form" label-position="left">
      <el-tree :data="form.tableList"
               :props="defaultProps"
               node-key="id"
               default-expand-all
               :expand-on-click-node="false"
      >
        <div slot-scope="{node,data}" class="custom-tree-node">
          <template v-if="!data.isLeaf">
            <span>{{ data.attrName }}</span>
            <el-button size="mini" icon="el-icon-plus" style="margin-right:7px;" @click.native.prevent="append(node,data)" />
          </template>
          <el-row v-else class="attr-box">
            <!-- select选择器 多选 :prop="data.attrName" :prop="'defaultValueList.'+index+'.attrName'"  :prop="data.defaultValueListForMulSelect"-->
            <el-form-item v-if="data.type == 'mulSelect'"
                          :prop="data.attrName"
                          :label="data.attrName"
                          :rules="data.required ? [{ required: true, message: '不能为空', trigger: 'change,blur' }] : []"
            >
              <el-row>
                <el-col :span="data.unitList && data.unitList.length?12:24">
                  <el-select v-model="data.defaultValueListForMulSelect" :placeholder="data.attrName" multiple filterable :multiple-limit="data.occurs" size="mini">
                    <el-option v-for="(opt,index) in data.optionValueList" :key="index" :label="opt" :value="opt" />
                  </el-select>
                </el-col>
                <el-col v-if="data.unitList && data.unitList.length" :span="11" class="fr mb0">
                  <!-- 单位选择器 -->
                  <el-select v-model="data.defaultUnit" placeholder="单位" filterable>
                    <el-option v-for="unit in data.unitList" :key="unit" :label="unit" :value="unit" />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- 其他类型 -->
            <el-row v-else>
              <el-col :span="data.unitList && data.unitList.length ? 11 : 20" class="mb0">
                <div v-for="(valueObj, idx) in data.defaultValueList" :key="idx">
                  <!-- {{ 'defaultValueList.' + idx + '.value' }}
                  {{ `${data.id}_${idx}` }}
                  :rules="data.required ? [{ required: true, message: '不能为空', trigger: 'blur,change' }] : []"-->
                  <el-form-item
                    :prop="data.attrName"
                    :label="idx === 0 ? data.attrName : ''"
                    :class="data.required?'is-required':''"
                  >
                    <!-- <i v-if="data.required" class="text-danger me-2">*</i> -->
                    <!-- number输入框 -->
                    <el-input v-if="data.type == 'number'" v-model="valueObj.value" v-input.number.positive size="mini" class="w260" :placeholder="data.attrName" />
                    <!-- text输入框 -->
                    <el-input v-if="data.type == 'text'" v-model="valueObj.value" size="mini" class="w260" :placeholder="data.attrName" @input="valueObj.value=valueObj.value.replace(/[\u4E00-\u9FA5]/g,'')" />
                    <!-- select选择器 单选 -->
                    <el-select v-if="data.type == 'select'" v-model="valueObj.value" size="mini" :placeholder="data.attrName" filterable style="width:260px">
                      <el-option v-for="opt in data.optionValueList" :key="opt" :label="opt" :value="opt" />
                    </el-select>
                    <!-- radio组单选框 -->
                    <el-radio-group v-if="data.type==='radio'" v-model="valueObj.value" size="mini">
                      <el-radio label="true" name="true">是</el-radio>
                      <el-radio label="false" name="false">否</el-radio>
                    </el-radio-group>
                    <!-- date时间选择器 -->
                    <el-date-picker v-if="data.type == 'date'" v-model="valueObj.value" size="mini" :placeholder="data.attrName" type="date" class="w260" value-format="yyyy-MM-dd" />
                    <!-- datetime时间选择器 -->
                    <el-date-picker v-if="data.type == 'datetime'" v-model="valueObj.value" size="mini" :placeholder="data.attrName" type="datetime" class="w260" value-format="yyyy-MM-dd HH:mm:ss" />
                  </el-form-item>
                </div>
              </el-col>
              <el-col v-if="!data.required" :span="4" style="height:40px;min-height:40px;text-align:right" class="fr mb0">
                <el-button size="mini" icon="el-icon-minus" class="icon-btn" @click="remove(node,data)" />
              </el-col>
              <el-col v-if="data.unitList && data.unitList.length" :span="8" class="fr mb0">
                <!-- 单位选择器 -->
                <el-select v-model="data.defaultUnit" size="small" placeholder="单位" class="unit-yy" filterable>
                  <el-option v-for="unit in data.unitList" :key="unit" :label="unit" :value="unit" />
                </el-select>
              </el-col>
            </el-row>
          </el-row>
        </div>
      </el-tree>
      <div class="pt-4 text-end mt-4 me-2">
        <el-button size="mini" @click="$emit('close')">取 消</el-button>
        <el-button size="mini" type="primary" @click="handlerSeve">确 定</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { getTemplateAttrList, saveSetting } from '@/api/amazon/templateList'
import AddAttr from './addAttr'
import { deepClone } from '@/util/util'
export default {
  name: 'TemplateSetProperty',
  props: {
    row: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      loading: false,
      oldTableList: [],
      form: { tableList: [] },
      defaultProps: {
        children: 'children',
        label: 'attrName'
      }

    }
  },
  mounted() {
    this.getTemplateName()
  },
  methods: {
    getTemplateName() {
      // this.loading = true
      getTemplateAttrList({ templateName: this.row.name, attrType: 1, isShow: true }).then(res => {
        // this.loading = false
        const data = res.data
        data.forEach((item, idx) => {
          item.requiredOption = item.required ? 1 : 0
        })
        // function getTemplateNameNode(attr) {
        //   attr.forEach((item, idx) => {
        //     item.requiredOption = item.required ? 1 : 0
        //     item.index = idx + '.children'
        //     if (item.children && item.children.length) {
        //       getTemplateNameNode(item.children)
        //     }
        //   })
        // }
        // getTemplateNameNode(data)

        this.form.tableList = data
        this.oldTableList = deepClone(data)
      }).finally(() => {
        // this.loading = false
      })
    },
    getOneLeave() {
      const idList = this.form.tableList.filter(item => item.id).map(acc => acc.id)
      this.$modal({
        title: '添加顶层属性',
        component: AddAttr,
        data: {
          form: null,
          tempName: this.row.name,
          idList: idList
        },
        callback: (bool, formItem) => {
          if (bool) {
            if (this.form.tableList.length) {
              // 相同
              const oldList = this.form.tableList.filter(item1 => {
                return formItem.every(item2 => {
                  return item1.id === item2.id
                })
              })
              // 不等
              const newList = formItem.filter(item1 => {
                if (!oldList.length) {
                  return item1
                } else {
                  return oldList.every(item2 => {
                    return item1.id !== item2.id
                  })
                }
              })
              this.form.tableList = [...oldList, ...newList]
            } else {
              this.form.tableList = formItem
            }
          }
        }
      })
    },
    // 获取属性有值的叶子节点
    getAttrHasValueLeafNode(attr) {
      const attrList = deepClone(attr) // arr  tree
      // 获取属性有值的叶子节点
      const leafNodeList = []
      function getHasValueLeafNode(attr) {
        attr.forEach(item => {
          if ((!item.children || !item.children.length) && leafNodeList.findIndex(a => a.id === item.id) === -1) {
            // const hasValue = false
            if (item.isLeaf && item.isShow) {
              leafNodeList.push(item)
            }
            // if (item.type === 'mulSelect') {
            //   hasValue = (item.defaultValueListForMulSelect && item.defaultValueListForMulSelect.length)
            // }
            // hasValue = (item.defaultValueList && item.defaultValueList.length && item.defaultValueList.find(valObj => valObj.value))
            // if (hasValue) { // 没有叶子节点
            //   leafNodeList.push(item)
            // }
          }
          if (item.children && item.children.length) {
            getHasValueLeafNode(item.children)
          }
        })
      }
      getHasValueLeafNode(attrList)
      return leafNodeList
    },
    handlerSeve() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const list = this.getAttrHasValueLeafNode(this.form.tableList)
          const templateName = !list.length ? this.row.name : ''
          let isBoolean = true
          let isNull = true
          const unitListName = []
          const attrNameList = []
          if (list.length) {
            list.forEach(item => {
              if (item.type !== 'mulSelect' && item.required) { // 其他类型
                item.defaultValueList.forEach(acc => {
                  if (acc.value !== '') {
                    if (item.unitList.length && !item.defaultUnit) {
                      isBoolean = false
                      unitListName.push(item.attrName)
                    }
                  } else {
                    isNull = false // 必填值为空
                    attrNameList.push(item.attrName)
                    if (item.unitList.length && item.defaultUnit) {
                      item.defaultUnit = ''
                    }
                  }
                })
              }
            })
          }
          if (!isNull) {
            return this.$message.warning(`必填项${attrNameList.join(',')}不能为空`)
          } else if (!isBoolean) {
            return this.$message.warning(`${unitListName.join(',')}的单位不能为空`)
          } else {
            saveSetting({ templateName: templateName }, list).then(res => {
              this.$message.success(res.msg)
              this.$emit('close', true)
            })
          }
        }
      })
    },
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    // 添加
    append(node, data) {
      this.$modal({
        title: '添加下级属性',
        component: AddAttr,
        data: {
          form: data,
          tempName: this.row.name
        },
        callback: (bool, formItem) => {
          if (bool) {
            this.$nextTick(() => {
              if (this.form.tableList.length) { // 有顶级
                if (!data.children) {
                  data.children = []
                }
                if (!data.children.length) {
                  data.children = formItem
                } else {
                  // 相同
                  const oldList = []
                  formItem.forEach(item => {
                    const children = data.children.find(item2 => item2.id === item.id)
                    if (children) {
                      oldList.push(children)
                    }
                  })
                  // 不等
                  const newList = formItem.filter(item1 => {
                    if (!oldList.length) {
                      return item1
                    } else {
                      return oldList.every(item2 => {
                        return item1.id !== item2.id
                      })
                    }
                  })

                  data.children = [...oldList, ...newList]
                }
              } else {
                this.form.tableList = formItem
              }
            })
          }
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
    // width: 100%;
    // display: flex;
    // justify-content: space-between;
}
::v-deep .el-tree-node__content{
  min-height: 40px !important;
  height: auto;

}
// .attr-form{
//   width: 80%;
// }
::v-deep .el-form-item{
  margin-bottom: 0;
}
.el-form-item--small.el-form-item, .unit-yy{
  margin-bottom: 0;
  margin-top: 2px;
  margin-left:10px;
}
.load-attr{
  margin-left: 20px;
}
.el-col{
  min-height: 40px;
}
.attr-box{
  width:100%;
  max-height: 550px;
  overflow-y: scroll;
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
.icon-btn{
  margin-top: 6px;
  margin-left: 10px;
}
.head{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}
.w260{
  width: 260px;
}
.head-p{
  font-size: 12px;
  line-height: 36px;
  color: #606266;
}
</style>
