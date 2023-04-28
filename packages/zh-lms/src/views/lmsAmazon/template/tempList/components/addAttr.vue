<template>
  <div ref="form">
    <div class="addAttr-flex-box" :class="{addattr:tableDate.length>100}">
      <div class="label">{{ form==null?tempName:form.attrName }}：</div>
      <div class="checkbox">
        <el-checkbox v-model="checked" @change="changeAllCheck">全选</el-checkbox>
        <el-checkbox v-for="(item,index) in tableDate" :key="index" v-model="item.isShow" :label="item.attrName" border size="mini" :disabled="item.required" />
      </div>
    </div>
    <div style="padding-top: 20px; text-align: right; margin-top: 20px">
      <el-button size="medium" @click="handlerSeve(false)">取 消</el-button>
      <el-button size="medium" type="primary" :disabled="submitBtnEnable" @click="handlerSeve(true)">确 定</el-button>
      <!-- <el-button v-else size="medium" type="primary" @click="handlerSeve(true)">确 定2</el-button> -->
    </div>
  </div>
</template>

<script>
import { getChildren, getOneLevel } from '@/api/amazon/templateList'
import { deepClone } from '@/util/util'
export default {
  name: 'AddAttr',
  props: {
    form: {
      type: Object,
      default: () => { return {} }
    },
    tempName: { // 模板名称
      type: String,
      default: ''
    },
    idList: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      tableDate: [],
      oldTableDate: [],
      checked: false
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldTableDate) === JSON.stringify(this.tableDate))
    }
  },
  created() {
    if (this.form == null) {
      this.getOneLevel()
    } else {
      this.getChildren()
    }
  },
  methods: {
    changeAllCheck(val) {
      this.tableDate.filter(item => {
        item.isShow = val
      })
    },
    getChildren() {
      const id = this.form.id
      const childIdList = this.form.children && this.form.children.map(item => item.id)
      getChildren({ parentId: id, childIdList: childIdList, templateName: this.tempName }).then(res => {
        this.tableDate = res.data
        this.oldTableDate = deepClone(this.tableDate)
      })
    },
    // 获取模板的第一级属性
    getOneLevel() {
      getOneLevel({ parentId: 0, templateName: this.tempName, idList: this.idList }).then(res => {
        this.tableDate = res.data
        this.oldTableDate = deepClone(this.tableDate)
      })
    },
    handlerSeve(flag = true) {
      // 把当前更新的值 传给父组件
      const list = this.tableDate.filter(item => item.isShow === true)
      this.$parent.$emit('close', flag, list)
    }

  }

}
</script>

<style scoped>
.addattr{
  height: 650px;
  overflow-y:scroll;
}
.addAttr-flex-box{
  display: flex;
}
.label{
  min-width: 100px;
}
.checkbox{
  flex: 1;
}
.el-checkbox.is-bordered{
  margin-right: 10px;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered{
  margin:0 10px 5px 0;
}
</style>
