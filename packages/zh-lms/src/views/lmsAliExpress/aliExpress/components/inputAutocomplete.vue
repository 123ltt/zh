<template>
  <el-autocomplete
    v-model="value"
    :fetch-suggestions="querySearch"
    placeholder="请输入内容"
    class="inline-input"
    clearable
    @blur="handleBlur"
    @select="handleSelect"
  />
</template>

<script>
export default {
  name: 'InputAutocomplete',
  props: {
    val: String,
    list: Array
  },
  data() {
    return {
      value: this.val,
      restList: []
    }
  },
  created() {
    this.restList = []
    this.list.map(item => {
      this.restList.push({
        value: item.id,
        name: item.name
      })
    })
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(select) {
      this.$emit('update:val', select.value)
    },
    handleBlur(event) {
      this.$emit('update:val', event.target.value)
    }
  }
}
</script>
