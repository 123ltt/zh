<template>
  <el-col :span="span">
    <el-form-item :label="label" :prop="prop" :rules="arrRules">
      <CategoryCascader ref="cascader"
                        v-model="form[prop]"
                        :fetch="getLogistics"
                        :props="cascaderProps"
                        class="w-100"
      />
    </el-form-item>
  </el-col>
</template>

<script>
import { getLogisticsList } from '@/api/info'
import CategoryCascader from '@/components/category-cascader/index.vue'
import mixin from './mixin'

export default {
  name: 'FormItemLogisticsCategory',
  components: { CategoryCascader },
  mixins: [mixin],
  props: {
    prop: String,
    label: String
  },
  data() {
    return {
      cascaderProps: {
        multiple: true,
        label: 'name',
        value: 'id',
        leaf: 'isLeaf'
      }
    }
  },
  methods: {
    getLogistics(resolve) {
      getLogisticsList().then(res => {
        resolve(res.data)
      })
    }
  }
}
</script>
