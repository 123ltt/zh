<template>
  <div v-loading="loading">
    <el-form
      ref="formRef"
      :model="dialogForm"
      :rules="rules"
      :disabled="viewOnly"
      size="mini"
      label-width="70px"
      :class="{'form-readonly': viewOnly}"
      class="search-form"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="问题标题" prop="title">
            <el-input
              v-model="dialogForm.title"
              :rows="3"
              :disabled="replyOnly"
              type="textarea"
              style="width:100%;"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="问题描述" prop="problemDesc">
            <el-input v-model="dialogForm.problemDesc" :rows="5" :disabled="replyOnly" type="textarea" />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="问题答复" prop="replyContent">
            <el-input v-model="dialogForm.replyContent" :rows="5" :maxlength="LIMIT.content" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn">
      <el-button v-if="!viewOnly" type="primary" size="mini" @click="onSubmit">回复</el-button>
      <el-button type="primary" size="mini" @click="close(false)">{{ viewOnly?'确认': '取消' }}</el-button>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { reply, getDetail } from '@/api/purchasingIssues'
import { LIMIT } from '@/config/form'
export default {
  name: 'PurchasingIssuesModal',
  props: {
    brandStatusOptions: Array,
    queryBrand: Function,
    id: [Number, String],
    viewOnly: {
      type: Boolean,
      defalut: false
    },
    replyOnly: {
      type: Boolean,
      defalut: false
    }
  },
  data() {
    return {
      LIMIT,
      dialogForm: {
        title: '',
        problemDesc: '',
        replyContent: ''
      },
      loading: false,
      problemData: null,
      rules: {
        replyContent: {
          required: true,
          message: '请输入问题答复',
          trigger: 'blur'
        }
      }
    }
  },
  computed: {},
  created() {
    this.loading = true
    getDetail(this.id).then(res => {
      Object.keys(this.dialogForm).forEach(item => {
        this.problemData = res.data
        if (res.data[item]) this.dialogForm[item] = res.data[item]
      })
    }).finally(() => { this.loading = false })
  },
  mounted() {
  },
  methods: {
    onSubmit() {
      this.$refs.formRef.validate(async(bool, obj) => {
        if (!bool) return
        const { dialogForm: { replyContent }, problemData: { id, number } } = this
        reply({ id, number, replyContent }).then(res => {
          this.$message.success('操作成功')
        })
        this.close(true)
      })
    },
    close(falg = false) {
      // 关闭弹窗
      this.$parent.$emit('close', falg)
    }
  }
}
</script>

<style scoped lang="scss">
.btn {
  text-align: right;
}
</style>
