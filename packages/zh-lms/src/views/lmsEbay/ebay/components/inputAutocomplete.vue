<template>
  <el-autocomplete
    v-model="value"
    :fetch-suggestions="querySearch"
    :placeholder="placeholder"
    :disabled="disabled"
    class="inline-input"
    popper-class="ebay-vary-attr-select"
    :clearable="item && !item.required"
    size="mini"
    @blur="handleBlur"
    @select="handleSelect"
  />
</template>

<script>
export default {
  name: 'InputAutocomplete',
  props: {
    placeholder: String,
    disabled: Boolean,
    val: String,
    list: Array,
    item: Object
  },
  data() {
    return {
      value: this.val,
      restList: []
    }
  },
  watch: {
    val(value) {
      this.value = value
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

<style lang="scss">
.ebay-vary-attr-select{
  width:auto !important;
}
</style>
