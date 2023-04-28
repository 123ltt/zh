<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="80px"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="类目名称" prop="name">
            <el-input
              v-model="form.name"
              type="text"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="英文名称" prop="nameEn">
            <el-input v-model="form.nameEn" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn">
      <el-button type="primary" size="mini" @click="onSubmit">确认</el-button>
      <el-button type="primary" size="mini" @click="close(false)">取消</el-button>
    </div>
  </div>
</template>

<script>
import { addCategory, updateCategory } from '@/api/categoryManagement'
export default {
  name: 'CategoryModal',
  props: {
    parentId: String,
    names: Object
  },
  data() {
    return {
      form: {
        name: '',
        nameEn: ''
      },
      rules: {
        name: { required: true, message: '类目名称不能为空', trigger: 'blur' },
        nameEn: { required: true, message: '英文名称不能为空', trigger: 'blur' }
      }
    }
  },
  created() {
    const { names } = this
    if (names) {
      this.form.name = names.name
      this.form.nameEn = names.nameEn
    }
  },
  methods: {
    onSubmit() {
      this.$refs.formRef.validate(async(bool, obj) => {
        if (!bool) return
        const { form: { name, nameEn }, parentId, names } = this
        if (names) {
          updateCategory(parentId, name, nameEn).then(res => {
            const { code } = res
            if (code === 200) {
              this.$message.success(`修改${name}类目成功`)
              this.close(true, { name, nameEn })
            }
          })
          return
        }
        addCategory(parentId, name, nameEn).then(res => {
          const { code, data } = res
          if (code === 200) {
            const newChild = { id: data.id, fullName: `${name}(${nameEn})`, name, nameEn, children: [] }
            this.$message.success(`新增${name}类目成功`)
            this.close(true, newChild)
          }
        })
      })
    },
    close(falg = false, newChild) {
      // 关闭弹窗
      this.$parent.$emit('close', falg, newChild)
    }
  }
}
</script>

<style scoped lang="scss">
.btn {
  text-align: right;
}
</style>
