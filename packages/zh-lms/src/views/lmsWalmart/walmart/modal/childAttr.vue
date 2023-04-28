<template>
  <el-form ref="form" :model="form" size="mini" label-width="155px" class="form-col wm-child-attr">
    <el-checkbox-group v-model="checkedList" class="mt-2" style="min-height: 200px">
      <el-col v-for="(item ,index) in form.childAttrList" :key="index" :span="8" class="mb-1">
        <el-checkbox :label="item.attributeName">{{ item.title }}</el-checkbox>
      </el-col>
    </el-checkbox-group>
    <div class="text-end">
      <el-button size="mini" @click="$parent.$emit('close')">取 消</el-button>
      <el-button type="primary" size="mini" :disabled="submitBtnEnable" @click="submit('form')">确 定</el-button>
    </div>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
export default {
  name: 'ChildAttr',
  props: {
    childAttr: Array,
    selected: Array
  },
  data() {
    return {
      form: {
        childAttrList: this.childAttr
      },
      checkedList: this.selected,
      cacheSelected: []
    }
  },
  computed: {
    submitBtnEnable() {
      return JSON.stringify(this.checkedList) === JSON.stringify(this.cacheSelected)
    }
  },
  created() {
    this.cacheSelected = deepClone(this.selected)
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$parent.$emit('close', this.checkedList)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.wm-child-attr {
  .el-checkbox__label,.el-checkbox__input.is-checked+.el-checkbox__label {
      width: 170px;
      overflow-x: hidden;
      white-space: normal;
      vertical-align: text-top;
  }
}
</style>
