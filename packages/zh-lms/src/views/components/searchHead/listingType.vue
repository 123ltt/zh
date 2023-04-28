<template>
  <el-button-group v-model="searchData[prop]" style="display:flex">
    <el-button v-for="(item,index) in listingTypeOption" :key="index" :type="item.isActive?'primary':''" :value="item.value" @click="toggleListingType(item)">{{ item.label }}</el-button>
  </el-button-group>
</template>

<script>
export default {
  name: 'ListingType',
  props: {
    list: Object,
    searchData: {
      type: Object
    },
    prop: {
      type: String
    }
  },
  data() {
    return {
      listingTypeOption: [
        { label: 'Normal', value: 'Normal', isActive: false },
        { label: 'Variation', value: 'Variation', isActive: false },
        { label: 'Combo', value: 'Combo', isActive: false }
      ]
    }
  },
  mounted() {
    if (this.list.items) {
      this.listingTypeOption = this.list.items()
    }
    if (this.searchData[this.prop]) {
      this.listingTypeOption.forEach(item => { item.isActive = this.searchData[this.prop] === item.value })
    }
  },
  methods: {
    toggleListingType(list) {
      this.listingTypeOption.find(item => {
        item.isActive = item.value === list.value && !list.isActive
      })
      const val = this.listingTypeOption.find(item => item.isActive)
      this.searchData[this.prop] = val?.value || ''
      this.$emit('toggleListingType')
    },
    resetForm() {
      this.searchData[this.prop] = ''
      this.listingTypeOption.forEach(item => { item.isActive = false })
    }
  }

}
</script>

<style>

</style>
