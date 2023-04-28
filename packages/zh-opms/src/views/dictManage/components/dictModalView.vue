<template>
  <el-form
    ref="dialogForm"
    :model="dialogForm"
    label-width="80px"
  >
    <el-row :gutter="5" style="margin-top: 20px">
      <el-col :span="12">
        <el-form-item
          label="字典编码"
          prop="code"
          size="small"
        >
          <div class="el-form-item__content">{{ dialogForm.code }}</div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="字典键"
          prop="dictKey"
          size="small"
        >
          <div class="el-form-item__content">{{ dialogForm.dictKey }}</div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item
          label="字典值"
          prop="dictValue"
          size="small"
        >
          <div class="el-form-item__content">{{ dialogForm.dictValue }}</div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="上级字典"
          prop="parentName"
          size="small"
        >
          <div class="el-form-item__content">{{ dialogForm.parentName }}</div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item label="租户ID" size="small" prop="tenantId">
          <div class="el-form-item__content">{{ dialogForm.tenantId }}</div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="模块编码" size="small" prop="appCode">
          <div class="el-form-item__content">{{ dialogForm.appCode }}</div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item
          label="排序"
          prop="sort"
          size="small"
        >
          <div class="el-form-item__content">{{ dialogForm.sort }}</div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="备注"
          prop="remark"
          size="small"
        >
          <div class="el-form-item__content">{{ dialogForm.remark }}</div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item label="是否删除" size="small" prop="isDeleted">
          <div v-if="dialogForm.isDeleted" class="el-form-item__content">是</div>
          <div v-else class="el-form-item__content">否</div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getDictParentList } from '@/api/dict'
export default {
  name: 'DictModal',
  props: {
    row: Object
  },
  data() {
    return {
      dialogForm: this.row
    }
  },
  created() {
    this.getParentDictList()
  },
  methods: {
    getParentDictList() {
      getDictParentList({ current: 1, size: 999 }).then(res => {
        this.dictParentList = res.data.records
        this.dictParentList.push({
          id: 0,
          dictValue: '顶级'
        })
        if (!this.dialogForm.parentName) {
          const item = this.dictParentList.find(item => item.id === this.dialogForm.parentId)
          this.$set(this.dialogForm, 'parentName', item.dictValue)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  padding-right: 20px;
}
.el-form-item {
  margin-bottom: 20px;
}
.el-form-item__content {
  color: #999;
  font-size: 12px;
}
</style>

<style lang="scss">
.dict-option-style {
  .el-select-dropdown__wrap {
    max-height: 144px;
  }
}
.dict-option-style-large {
  .el-select-dropdown__wrap {
    max-height: 190px;
  }
}
</style>
