<template>
  <div :key="value" class="radio-box">
    <el-radio-group v-model="active" @change="onChange">
      <template v-if="isRadio">
        <template v-for="(item,index) in typeList">
          <el-radio v-if="item.isDeleted!==1" :key="index" :label="''+item.value">{{ item.label }}</el-radio>
        </template>
      </template>
      <el-radio-button v-for="item in typeList" v-else :key="item.typeCode" :label="''+item.typeCode">
        {{ showMsg(item) }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: 'BtnsGroup',
  props: {
    typeList: {
      type: Array,
      default: () => []
    },
    isRadio: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    change: Function
  },
  data() {
    return {
      active: this.value
    }
  },
  watch: {
    value(newVal) {
      this.active = newVal
    }
  },
  methods: {
    onChange() {
      this.$emit('update:value', this.active)
      this.$emit('change')
    },
    showMsg(item) {
      return `${item.typeDescribe} (${item.typeCount})`
    }
  }
}
</script>

<style lang="scss" scoped>
.radio-box ::v-deep {
  .el-radio-button__inner{
    border-radius: 0 !important;
    border: none !important;
  }
}
</style>
