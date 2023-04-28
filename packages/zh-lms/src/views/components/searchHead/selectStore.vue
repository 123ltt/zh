<template>
  <g-select v-model="searchData[prop]"
            :items="storeList"
            key-field="hiddenValue"
            label-field="displayName"
            :value-field="platformCodeList.includes(platformCode)?'candidateDisplayName':'displayName'"
            placeholder="请选择"
            multiple
            is-checked-all
            class="w-100"
  />
</template>

<script>
export default {
  name: 'SelectStore',
  props: {
    searchData: {
      type: Object
    },
    storeList: {
      type: Array
    },
    prop: {
      type: String,
      default: 'accounts'
    },
    platformCode: { // 平台简称
      type: String,
      default: ''
    }
  },
  data() {
    return {
      platformCodeList: ['EB', 'LZ']
    }
  },
  methods: {
    resetForm() {
      this.searchData[this.prop] = []
    }
  }

}
</script>

<style>

</style>
