<template>
  <div>
    <div>
      <el-button size="mini" @click="disabled=!disabled">change status</el-button>
      <el-button size="mini" @click="update">update</el-button>
      <el-input v-model="inputText" size="mini" />
    </div>
    <el-form :disabled="disabled">
      <Conditions ref="conditions"
                  v-model="list"
                  :conditions-request="conditionsRequest"
                  :values-request="valuesRequest"
                  :currency-request="currencyRequest"
                  :extends-field="options"
                  node-type-key="nodeType"
                  operator-key="op"
                  allow-empty
      />

      <el-button size="mini" @click="$refs.conditions.clearValidate()">clear</el-button>
      <pre>{{ JSON.stringify(list,null,2) }}</pre>
    </el-form>
  </div>
</template>

<script>
import Conditions from '@/components/import/conditions/index.vue'
import list from './conditions-list'
import values from './condition-values'
import data from './data'
import cascader from './cascader'

function conditionsRequest() {
  return Promise.resolve(list.map(item => {
    return {
      label: item.fieldName,
      value: item.field,
      type: item.inputType,
      operatorList: (item.opList || []).map(el => {
        return { label: el.name, value: el.type }
      })
    }
  }))
}

function valuesRequest(isTestUpdate = false) {
  const arr = values().map((item, index) => {
    return {
      label: item.name,
      value: item.value + index
    }
  })
  if (isTestUpdate) {
    arr.splice(0, 3, { label: '中国', value: 'CN' })
  }
  return Promise.resolve(arr)
}

function currencyRequest() {
  return Promise.resolve([
    { label: '人民币', value: 'CN' },
    { label: '港币', value: 'HK' }
  ])
}

export default {
  components: { Conditions },
  data() {
    return {
      inputText: '',
      conditionsRequest,
      valuesRequest: this.request,
      currencyRequest,
      list: {},
      disabled: true,
      isTestUpdate: false,
      options: {
        5: {
          platformCode: ''
        }
      }
    }
  },
  watch: {
    inputText(v) {
      this.options['5'].platformCode = v
    }
  },
  created() {
    setTimeout(() => {
      this.list = data
    }, 1000)
  },
  methods: {
    request(value, type) {
      if (type === 4) return Promise.resolve(cascader)
      return valuesRequest(this.isTestUpdate)
    },
    update() {
      this.isTestUpdate = true
      this.$refs.conditions.updateValuesSelect()
    }
  }
}
</script>
