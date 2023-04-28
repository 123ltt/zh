<template>
  <div>
    <el-form ref="formRef" :model="row" size="mini" label-width="80px">
      <el-form-item label="模板名称" prop="templateNameList">
        <el-select v-model="row.templateName" filterable clearable placeholder="请选择" style="width:90%;" popper-class="select-template-option">
          <el-option v-for="item in templateChangeList" :key="item.value" :value="item.value" :label="item.name" :title="item.name" />
        </el-select>
      </el-form-item>
      <div style="padding-top: 20px; text-align: right; margin-top: 120px">
        <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
        <el-button size="medium" type="primary" :disabled="submitBtnEnable" @click="handlerSeve">确 定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { tempOption, saveRelationCategory } from '@/api/amazon/templateList'
import { deepClone } from '@/util/util'
export default {
  name: 'SetCategory',
  props: {
    row: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      oldRow: {},
      templateChangeList: []
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldRow) === JSON.stringify(this.row))
    }
  },
  created() {
    if (this.row) {
      this.oldRow = deepClone(this.row)
    }
  },
  mounted() {
    this.getTemplateNameOption()
  },
  methods: {
    // 获取模板下拉列表
    getTemplateNameOption() {
      tempOption().then(res => {
        this.templateChangeList = res.data
      })
    },
    handlerSeve() {
      saveRelationCategory({ id: this.row.id, templateName: this.row.templateName }).then(res => {
        this.$message.success(res.msg)
        this.$parent.$emit('close', true)
      })
    }
  }

}
</script>

<style lang="scss">
.select-template-option {
  width: 10%;
  .el-select-dropdown__wrap {
    max-height: 220px;
  }
}
</style>
