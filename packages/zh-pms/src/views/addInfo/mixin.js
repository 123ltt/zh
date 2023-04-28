
export default {
  data() {
    return {
      submitting: false
    }
  },
  methods: {
    // 过滤传入的字段名。并过滤掉值为 null 和 undefined 的字段
    filterFieldHandler(obj = {}, fields = []) {
      const data = {}
      for (const key in obj) {
        const d = obj[key]
        if (d !== null && d !== undefined && fields.indexOf(key) === -1) {
          data[key] = obj[key]
        }
      }
      return data
    },
    // 提取传入的字段名。并过滤掉值为 null 和 undefined 的字段
    pickFieldHandler(obj = {}, fields = []) {
      const data = {}
      for (const key in obj) {
        const d = obj[key]
        if (d !== null && d !== undefined && fields.indexOf(key) > -1) {
          data[key] = obj[key]
        }
      }
      return data
    },
    // 表单验证
    validate() {
      if (this.submitting) return
      this.submitting = true
      return new Promise(resolve => {
        let formRef = this.$refs.formRef
        if (!formRef && this.$children.length > 0 && this.$children[0].$options.name === 'ElForm') {
          formRef = this.$children[0]
        }

        if (!formRef) {
          return console.error(new Error('请将 el-form 组件添加属性 ref="formRef"'))
        }

        formRef.validate(valid => {
          if (!valid) {
            this.$message.error('请根据提示完成表单')
            this.submitting = false
          }
          resolve(valid)
        })
      })
    },
    // 发送请求
    submit(request, params) {
      return request(params).then((res) => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        if (res.success && this.isEdit) {
          this.$emit('update', true)
        }
      }).finally(() => {
        this.submitting = false
      })
    }
  }
}
