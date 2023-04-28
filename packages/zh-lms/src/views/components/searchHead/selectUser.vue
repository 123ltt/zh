<template>
  <g-select v-model="searchData[prop]" :items="createUserOption" key-field="id" label-field="nameJobNumber" value-field="id" @change="changeUser" />
</template>

<script>
import { getUserList } from '@/api/amazon/amazon.js'
export default {
  name: 'SelectUser',
  props: {
    searchData: {
      type: Object
    },
    prop: {
      type: String,
      default: 'createUser'
    }
  },
  data() {
    return {
      createUserOption: []
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    changeUser(val) {
      this.searchData[this.prop] = val && val.id
    },
    // 创建人列表
    getUserList(query) {
      this.loadingUser = true
      getUserList({ name: query, current: 1, size: 9999 }).then(res => {
        this.loadingUser = false
        const records = res.data?.records
        records.forEach(item => {
          item.nameJobNumber = `${item.name}${item.jobNumber}`
        })
        this.createUserOption = records
      }).finally(() => {
        this.loadingUser = false
      })
    },
    resetForm() {
      this.searchData[this.prop] = ''
    }
  }

}
</script>

<style>

</style>
