<template>
  <div>
    <el-form
      ref="formRef"
      :model="dialogForm"
      :rules="rules"
      size="mini"
      label-width="105px"
      class="search-form"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="品牌名称" prop="brandName">
            <el-input
              v-model="dialogForm.brandName"
              type="text"
              style="width:100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌编号" prop="brandNumber">
            <el-input v-model="dialogForm.brandNumber" type="text" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="dialogForm.status"
              clearable
              placeholder="请选择状态"
              style="width:100%;"
            >
              <el-option
                v-for="item in brandStatusOptions"
                :key="item.value"
                :value="+item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌创建时间" prop="enterTime">
            <el-date-picker
              v-model="dialogForm.enterTime"
              style="width:100%;"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择日期时间"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="维护人" prop="defendName">
            <!-- <el-input v-if="id" v-model="dialogForm.defendName" type="text" /> -->
            <VOrganization ref="vorganizationRef" v-model="dialogForm.defendName" style="width:100%;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="品牌描述" prop="brandDescription">
            <el-input
              v-model="dialogForm.brandDescription"
              :rows="10"
              :maxlength="LIMIT.content"
              type="textarea"
              resize="none"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn">
      <el-button type="primary" size="mini" @click="onSubmit">确认</el-button>
      <el-button type="primary" size="mini" @click="close">取消</el-button>
    </div>
  </div>
</template>

<script>
import { LIMIT } from '@/config/form'
import { modifyBrand, addBrand } from '@/api/brandManagement'
import VOrganization from '@/components/organization/index.vue'
export default {
  name: 'BrandModal',
  components: { VOrganization },
  props: {
    brandStatusOptions: Array,
    queryBrand: Function,
    row: Object
  },
  data() {
    return {
      LIMIT,
      dialogForm: {
        defendName: '',
        brandName: '',
        status: '',
        enterTime: '',
        brandDescription: '',
        brandNumber: ''
      },
      rules: {
        brandName: {
          required: true,
          message: '品牌名称不能为空',
          trigger: ['change', 'blur']
        },
        defendName: {
          required: true,
          message: '请选择维护人',
          trigger: ['change', 'blur']
        },
        status: {
          required: true,
          message: '请选择状态',
          trigger: ['change', 'blur']
        },
        brandNumber: {
          required: true,
          message: '品牌编号不能为空',
          trigger: ['change', 'blur']
        }
      }
    }
  },
  computed: {},
  created() {
    const { row } = this
    if (row) {
      Object.keys(this.dialogForm).forEach(item => {
        this.dialogForm[item] = row[item]
      })
    }
  },
  mounted() {
    if (this.row) {
      this.$refs.vorganizationRef.checked({ name: this.row.defendName })
    }
  },
  methods: {
    onSubmit() {
      this.$refs.formRef.validate(async(bool, obj) => {
        if (!bool) return
        const { row } = this
        let msg = null
        if (row) {
          msg = await this.modifyBrand(row.id)
        } else {
          msg = await this.addBrand()
        }
        msg.code === 0 && this.queryBrand()
        this.$message({
          type: msg.code === 0 ? 'success' : 'error',
          message: msg.msg
        })

        this.close()
      })
    },
    async addBrand() {
      const { enterTime, defendName: names } = this.dialogForm
      const res = await addBrand({ ...this.dialogForm, enterTime, deverId: names.id })
      if (res.code === 200) return { code: 0, msg: '新增品牌成功' }
      else return { code: 1, msg: '新增品牌失败' }
    },
    async modifyBrand(id) {
      const { enterTime, defendName: names } = this.dialogForm

      const res = await modifyBrand({ id, ...this.dialogForm, enterTime, deverId: names.id })
      if (res.code === 200) return { code: 0, msg: '修改品牌成功' }
      else return { code: 1, msg: '修改品牌失败' }
    },
    close() {
      // 关闭弹窗
      this.$parent.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.btn {
  text-align: right;
}
</style>
