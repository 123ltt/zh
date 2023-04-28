<template>
  <el-col :span="span">
    <el-form-item ref="formItem" :label="label" :prop="prop" :rules="rules">
      <el-select v-model="form[prop]"
                 @blur="selectBlur('formItem')"
      >
        <el-option v-for="item in statusOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"
        />
      </el-select>
    </el-form-item>
  </el-col>
</template>

<script>
import { getDict } from '@/api/common/dict'
import mixin from './mixin'

export default {
  name: 'FormItemsStatus',
  mixins: [mixin],
  props: {
    prop: {
      type: String,
      default: 'status'
    },
    label: {
      type: String,
      default: '状态'
    }
  },
  data() {
    return {
      statusOptions: []
    }
  },
  created() {
    const canUpdateStatusList = ['2', '3']
    getDict('sku_status', 'pms').then(res => {
      this.statusOptions = res.filter(item => {
        return canUpdateStatusList.indexOf(item.value) > -1
      })
    })
  }
}
</script>
