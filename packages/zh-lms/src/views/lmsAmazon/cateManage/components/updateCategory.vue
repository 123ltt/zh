<template>
  <basic-container style="min-width: 0">
    <el-form ref="dialogForm" :model="form" size="mini" label-width="60px" :rules="rules">
      <el-form-item label="站点" prop="amazonSite">
        <el-select v-model="form.amazonSite" clearable filterable placeholder="请选择站点" style="width:100%;" popper-class="select-site-option">
          <el-option v-for="(item, index) in sites" :key="index" :value="item.displayName" :label="item.displayName" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="店铺" prop="mark">
        <el-select v-model="form.mark" clearable filterable placeholder="请选择店铺" style="width:100%;" popper-class="select-mark-option">
          <el-option v-for="item in marks" :key="item.value" :value="item.value" :label="item.name" />
        </el-select>
      </el-form-item> -->
      <div style="text-align: right; margin-top: 120px">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" @click="submitDialog('dialogForm')">保存</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { updateCategory } from '@/api/amazon/category'
import { optionsSiteCode } from '@/api/amazon/amazon'
// import { optionsWithPlatformCode } from '@/api/sams'

export default {
  name: 'EditGrossProfit',
  data() {
    return {
      form: {},
      rules: {
        amazonSite: [{ required: true, message: '请选择站点', trigger: 'change' }]
        // mark: [{ required: true, message: '请选择店铺', trigger: 'change' }]
      },
      sites: [],
      marks: []
    }
  },
  created() {
    this.listAllSite()
    // this.listAllStore()
  },
  methods: {
    listAllSite() {
      optionsSiteCode({ platformCode: 'AM' }).then(res => {
        this.sites = res.data
      })
    },
    // listAllStore() {
    //   optionsWithPlatformCode().then(res => {
    //     this.marks = res.data
    //   })
    // },
    cancel() {
      this.$parent.$emit('close')
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { amazonSite } = this.form
          updateCategory({ amazonSite }).then((res) => {
            this.$message.success('操作成功')
            this.$parent.$emit('close', true)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.select-site-option {
  .el-select-dropdown__wrap {
    max-height: 150px;
  }
}
.select-mark-option {
  .el-select-dropdown__wrap {
    max-height: 148px;
  }
}
</style>
