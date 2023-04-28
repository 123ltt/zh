<template>
  <el-form ref="form" :model="form" label-width="80px" :rules="rules" size="mini">
    <template v-for="(item,index) in headers">
      <slot v-if="item.slotName" :name="item.slotName" />
      <el-col v-else :key="index" :span="item.span||12">
        <el-form-item :prop="item.prop" :label="item.label">
          <el-input v-if="item.type==='input'" :key="index" v-model="form[item.prop]" :disabled="item.disabled" v-bind="item.attrs" />
          <el-select v-if="item.type==='select'" v-model="form[item.prop]" :disabled="item.disabled" v-bind="item.attrs" v-on="item.event">
            <el-option v-for="list in item.data" :key="list.value" :label="list.label" :value="list.value" />
          </el-select>
          <el-radio-group v-if="item.type==='radio'" v-model="form[item.prop]" v-bind="item.attrs" v-on="item.event">
            <el-radio v-for="rList in item.radioList" :key="rList.label" :label="rList.label">{{ rList.label }}</el-radio>
          </el-radio-group>
          <template v-if="item.type==='selectBtn'">
            <div class="d-flex">
              <el-input v-model="form[item.prop]" :disabled="item.inputDisble()" v-bind="item.attrs" v-on="item.event" />
              <el-button :disabled="item.btnDisable()" class="mx-2" size="mini" type="primary" @click="openModal(item)">select</el-button>
            </div>
          </template>
        </el-form-item>
      </el-col>
    </template>
  </el-form>
</template>

<script>
export default {
  props: {
    form: Object,
    rules: Object,
    headers: Array
  },
  created() {
    this.init()
  },
  methods: {
    // 初始值赋值
    init() {
      this.headers.forEach(item => {
        if (Object.keys(this.form).indexOf(item.prop) > -1) {
          this.form[item.prop] = item.value
        }
        if (item?.disabled && typeof item.disabled === 'function') {
          item.disabled = item.disabled()
        } else {
          item.disabled = item.disabled || false
        }
        if (item.type === 'select' && typeof item.selectList === 'function') {
          item.selectList().then(res => {
            const { label, value } = item.attrs.options
            item.data = res.data.map(result => {
              return { label: result[label], value: result[value], ...result }
            })
          })
        } else {
          item.data = item.selectList
        }
      })
    },
    openModal(item) {
      const { component, width, callback, title, data } = item.components
      this.$modal({
        component: component,
        width,
        callback,
        title,
        data: data()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cate-change{
  position: absolute;
  right: 10px;
  top: 0;
  z-index: 9;
  opacity: 0;
}
.el-dropdown-menu ::v-deep{
  padding: 0;
}
</style>
