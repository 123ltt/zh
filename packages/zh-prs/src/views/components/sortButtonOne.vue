<template>
  <div>
    <el-button-group v-if="sortType">
      <el-button v-for="item in list" :key="item.value" :type="buttonIndex===item.value?'primary':''" size="mini" @click="buttonSort(item.value)">
        {{ item.label }}
        <span class="d-inline-flex flex-column align-top">
          <i class="el-icon-caret-top sort-button " :class="buttonStyle===1&&buttonIndex===item.value?'buttonStyle':''" @click.stop="buttonIndex===item.value&&selfClick(1,item.value)" />
          <i class="el-icon-caret-bottom  sort-button" :class="buttonStyle===2&&buttonIndex===item.value?'buttonStyle':''" @click.stop="buttonIndex===item.value&&selfClick(2,item.value)" />
        </span>
      </el-button>
    </el-button-group>
    <div v-else>
      <el-select v-model="sortValue" size="mini" placeholder="排序方式" style="width:100px">
        <el-option v-for="item in list" :key="item.label" :value="item.value" :label="item.label" />
      </el-select>
      <span class="d-inline-flex flex-column align-top ">
        <i class="el-icon-caret-top sort-select " :class="buttonStyle===1?'buttonStyle ':''" @click.stop="selfClick(1,sortValue)" />
        <i class="el-icon-caret-bottom  sort-select" :class="buttonStyle===2?'buttonStyle':''" @click.stop="selfClick(2,sortValue)" />
      </span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SortButtonOne',
  props: {
    list: {
      type: Array,
      default: () => {}
    },
    sortType: {
      type: Boolean,
      default: true// false下拉选择  true按钮选择
    }
  },
  data() {
    return {
      // 选择下拉的value
      sortValue: '',
      // 1正序 2 逆序 0无序
      buttonStyle: 0,
      // botton样式索引判断变量
      buttonIndex: ''

    }
  },
  watch: {
    sortValue() {
      // 清空上下箭头样式
      !this.sortType && (this.buttonStyle = 0)
    }
  },
  methods: {
    resetSort() {
      this.buttonStyle = 0
      this.buttonIndex = ''
      !this.sortType && (this.sortValue = '')
    },

    // 上下箭头点击排序  value 点击的按钮具体字段
    selfClick(val, value) {
      if (!this.sortType && this.sortValue === '') {
        return this.$message.warning('请选择排序方式')
      }

      this.buttonStyle === val ? (this.buttonStyle = 0) : (this.buttonStyle = val)
      this.$emit('sortClick', value, ['', true, false][this.buttonStyle])
    },
    // button点击排序
    buttonSort(value) {
      if (this.buttonStyle === 2) {
        this.buttonStyle = -1
      }
      this.buttonIndex !== value && (this.buttonStyle = 0)
      this.buttonIndex = value
      this.buttonStyle++
      this.$emit('sortClick', value, ['', true, false][this.buttonStyle], this.buttonStyle)
    }
  }
}
</script>

  <style scoped lang="scss">
.sort-button{
 line-height: 0.6;
  }
 .sort-select{
 line-height: 1.2;
  }
.buttonStyle{
  color:#3300ff;

}
</style>
