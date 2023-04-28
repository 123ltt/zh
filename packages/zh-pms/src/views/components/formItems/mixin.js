import { required, customRule } from '@/util/formRules'

export default {
  props: {
    span: Number,
    form: {
      type: Object,
      required: true
    },
    prop: [Array, String]
  },
  data() {
    return {
      rules: required(),
      arrRules: [customRule(v => v.length === 0)]
    }
  },
  watch: {
    val(v) {
      this.form[this.prop] = v
    }
  },
  methods: {
    selectBlur(ref) {
      setTimeout(() => this.$refs[ref].$emit('el.form.blur'), 150)
    }
  }
}
