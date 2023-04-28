<template>
  <el-form :ref="refName" :model="formModel" :label-width="labelWidth" :size="size" v-bind="$attrs" v-on="$listeners">
    <el-row type="flex" justify="start" style="flex-wrap:wrap;" :gutter="gutter">
      <el-col v-for="(col, index) in formCols"
              :key="col.prop"
              :span="(col.span||24/cols)"
              :offset="col.offset||0"
              :pull="col.pull||0"
              :push="col.push||0"
              :style="col.offsetright ? { marginRight: col.offsetright / 24 * 100 + '%' } : ''"
      >
        <el-form-item v-if="!col.slot" :label="col.label" :prop="col.prop" :label-width="col.labelWidth">
          <form-item :model="formModel" :col="col" />
        </el-form-item>
        <!-- 是否使用自定义具名slot -->
        <template v-else>
          <v-render :key="index"
                    :v-nodes="$slots[col.slot]"
          />
        </template>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import FormItem from './form-item.vue'
const VRender = {
  props: ['vNodes'],
  render() {
    return this.vNodes
  }
}
export default {
  name: 'FormGroup',
  components: { VRender, FormItem },
  props: {
    cols: {
      type: [String, Number],
      default: 4
    },
    size: {
      type: String,
      default: 'mini'
    },
    labelWidth: {
      type: String,
      default: '60px'
    },
    gutter: Number,
    model: {
      type: Object,
      default: () => ({})
    },
    formAttrs: Array
  },
  data() {
    return {
      refName: new Date().getTime(),
      formModel: this.model
    }
  },
  computed: {
    ref() {
      return this.$refs[this.refName]
    },
    formCols() {
      const list = Object.assign([], this.formAttrs)
      const hasItmesType = ['GSelect', 'select', 'checkbox', 'radio']
      return list.map(item => {
        if (hasItmesType.includes(item.type)) {
          const type = Object.prototype.toString.call(item.items).slice(8, -1).toLowerCase()
          if (type === 'function') {
            item.items(data => { item.items = data })
          } else if (type !== 'array') {
            throw new Error(`${item.prop}的items不是一个数组或者promise函数`)
          }
        }
        return item
      })
    }
  }
  // mounted() {
  //   console.log(this.formModel)
  //   debugger
  // }
}
</script>

<style lang="scss" scoped>
.radio-group ::v-deep {
  .el-radio{
    margin-right: 15px;
    .el-radio__label{
      padding-left: 5px;
    }
  }
}
</style>
