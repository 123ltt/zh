<template>
  <div style="width:160px;">
    <InputTree v-model="values"
               multiple
               class="w-100"
               :collapse-tags="true"
               node-checked
               :data="list"
               @change="change"
    />
    <el-button size="mini" @click.once="add">add</el-button>
    <pre>{{ JSON.stringify(values,'',2) }}</pre>
  </div>
</template>

<script>
import InputTree from '@/components/import/input-tree/index.vue'
import data from './data.js'

export default {
  components: { InputTree },
  data() {
    return {
      values: ['495'],
      list: data.data
    }
  },
  methods: {
    add() {
      this.values.push('510')
    },
    change(values) {
      console.log(values)
    }
  }
}
</script>
