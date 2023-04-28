<template>
  <div>
    <el-row>
      <el-col :span="6">
        <span>属性名称</span>
      </el-col>
      <el-col :span="4">
        <span>属性级别</span>
      </el-col>
      <el-col :span="6">
        <span>设置默认值</span>
      </el-col>
      <el-col :span="4">
        <span>单位</span>
      </el-col>
    </el-row>
    <div v-loading="loading" class="h70">
      <el-row v-for="(item,index) in tableList" :key="index">
        <el-col :span="6">
          {{ item.attrName }}
        </el-col>
        <el-col :span="4">
          <template v-if="item.platformRequired && item.required">
            <span>Required</span>
          </template>
          <template v-else>
            <el-select v-model="item.requiredOption" clearable placeholder="请选择" style="width:100px;" size="mini">
              <el-option v-for="citem in nameOptions" :key="citem.value" :value="citem.value" :label="citem.label" />
            </el-select>
          </template>
        </el-col>
        <el-col :span="6">
          <div v-for="(citem,sindex) in item.defaultValueList" :key="sindex" class="mb-box">
            <el-input v-if="item.type === 'number' || item.type === 'text'" v-model="citem.value" style="width:200px;" size="mini" placeholder="请输入" @blur="changeValue(item)" />
            <template v-if="item.type === 'datetime'">
              <el-date-picker v-model="citem.value" type="datetime" placeholder="选择日期时间" @blur="changeValue(item)" />
            </template>
            <template v-if="item.type === 'date'">
              <el-date-picker v-model="citem.value" type="date" placeholder="选择日期" @blur="changeValue(item)" />
            </template>
            <template v-if="item.type==='radio'">
              <el-radio-group v-model="citem.value" @change="changeValue(item)">
                <el-radio v-for="(bitem,cindex) in boolOption" :key="cindex" :label="bitem.value">{{ bitem.label }}</el-radio>
              </el-radio-group>
            </template>
            <template v-if="item.type === 'select'">
              <el-select v-model="citem.value" clearable placeholder="请选择" style="width:200px;" size="mini" @change="changeValue(item)">
                <el-option v-for="(oItem,oIndex) in item.optionValueList" :key="oIndex" :value="oItem" :label="oItem" />
              </el-select>
            </template>
          </div>
          <template v-if="item.type === 'mulSelect'">
            <el-select v-model="item.defaultValueListForMulSelect" size="mini" multiple clearable :multiple-limit="item.occurs" placeholder="请选择" style="width:200px;" @change="changeValue(item)">
              <el-option v-for="(oItem,oIndex) in item.optionValueList" :key="oIndex" :value="oItem" :label="oItem" />
            </el-select>
          </template>
        </el-col>
        <el-col v-if="item.unitList.length" :span="4">
          <el-select v-model="item.defaultUnit" clearable placeholder="请选择" style="width:200px;" size="mini">
            <el-option v-for="(oItem,oIndex) in item.unitList" :key="oIndex" :value="oItem" :label="oItem" />
          </el-select>
        </el-col>
      </el-row>
      <div v-if="!tableList.length" class="default-box">
        <p class="default-box-p">暂无数据</p>
      </div>
    </div>
    <div style="padding-top: 20px; text-align: right">
      <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
      <template v-if="tableList.length">
        <el-button size="medium" type="primary" :disabled="submitBtnEnable" @click="handlerSeve">确 定</el-button>
      </template>
    </div>
  </div>

</template>

<script>
import { getTemplateAttrList, saveSetting } from '@/api/amazon/templateList'
import { deepClone } from '@/util/util'
export default {
  name: 'SetProperty',
  props: {
    row: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      findArr: [],
      loading: true,
      nameOptions: [{
        label: 'Required',
        value: 1
      }, {
        label: 'Optional',
        value: 0
      }],
      boolOption: [{
        label: '是',
        value: 'true'
      }, {
        label: '否',
        value: 'false'
      }],
      tableList: [],
      oldTableList: []
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldTableList) == JSON.stringify(this.tableList))
    }
  },
  mounted() {
    this.getTemplateName()
  },
  methods: {
    getTemplateName() {
      this.loading = true
      getTemplateAttrList({ templateName: this.row.name, attrType: 1 }).then(res => {
        this.loading = false
        const data = res.data
        data.forEach(item => {
          item.requiredOption = item.required ? 1 : 0
        })
        this.tableList = data
        this.oldTableList = deepClone(this.tableList)
      }).finally(() => {
        this.loading = false
      })
    },
    changeValue(val) {
      this.findArr.push(val)
      this.findArr.forEach((item, index) => {
        if (item.id === val.id) {
          this.findArr.splice(index, 1)
          this.findArr.push(val)
        }
      })
    },
    handlerSeve() {
      // 去重
      const obj = {}
      const peon = this.findArr.reduce((cur, next) => {
        // eslint-disable-next-line no-unused-expressions
        obj[next.id] ? '' : obj[next.id] = true && cur.push(next)
        return cur
      }, [])
      let isBoolean = true
      const unitListName = []
      peon.forEach(item => {
        if (item.type !== 'mulSelect') {
          item.defaultValueList.forEach(acc => {
            if (acc.value !== '') {
              if (item.unitList.length && !item.defaultUnit) {
                isBoolean = false
                unitListName.push(item.attrName)
              }
            } else {
              if (item.unitList.length && item.defaultUnit) {
                item.defaultUnit = ''
              }
            }
          })
        }
      })
      if (!isBoolean) {
        return this.$message.warning(`${unitListName.join(',')}的单位不能为空`)
      } else {
        saveSetting(peon).then(res => {
          this.$message.success(res.msg)
          this.$parent.$emit('close', true)
        })
      }
    }
  }
}
</script>

<style>
.mb-box{
  margin-bottom: 6px;
}
.h70{
  height: 500px;
  overflow:scroll;
}
.default-box{
  display: flex;
  height: 400px;

}
.default-box-p{
  margin:auto;
  font-size: 16px;
}
</style>
