<template>
  <div>
    <el-form ref="formValid" size="mini" label-width="140px" :rules="rules" :model="formData">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="请选择要引用的角色" prop="roleIds">
            <el-select v-model="formData.roleIds" filterable multiple placeholder="请选择角色" class="w-75">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="`${item.roleName}（${item.roleAlias}）`"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="grantType">
            <el-radio-group v-model="formData.grantType">
              <el-radio :label="'SAVE'">添加权限</el-radio>
              <el-radio :label="'DELETE'">删除权限</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div style="text-align:right">
            <el-button size="mini" @click="$parent.$emit('close', false)">取消</el-button>
            <el-button type="primary" size="mini" @click="save">确定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { batchUpdatePermission } from '@/api/role'
export default {
  props: {
    tableData: Array,
    roleList: Array,
    menuArr: Array
  },
  data() {
    return {
      formData: {
        grantType: 'SAVE'
        // menuIds: []
      },
      rules: {
        roleIds: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
        grantType: [{ required: true, message: '角色不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    // this.getCheckList(this.tableData)
  },
  methods: {
    // 递归获取菜单子节点
    getCheckList(tableData) {
      tableData.forEach(item => {
        if (item.children?.length) {
          this.getCheckList(item.children)
        } else {
          if (item.buttons || item.pageCheck) {
            item.buttons && item.buttons.forEach(its => {
              its.buttonCheck && this.formData.menuIds.push(its.id)
            })
            item.pageCheck && this.formData.menuIds.push(item.id)
          }
        }
      })
      // console.log(this.formData.menuIds, 'this.formData.menuIds')
    },
    save() {
      this.$refs.formValid.validate(valid => {
        if (valid) {
          this.$set(this.formData, 'menuIds', this.menuArr)
          if (this.formData.grantType === 'DELETE') {
            this.$confirm('确认删除?', '', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              batchUpdatePermission(this.formData).then(res => {
                this.$message.success(res.msg)
                this.$parent.$emit('close', true)
              })
            })
          } else {
            batchUpdatePermission(this.formData).then(res => {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
