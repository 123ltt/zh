<template>
  <el-tabs>
    <el-tab-pane v-for="item in langs" :key="item.id" :label="item.country">
      <el-form ref="formRef"
               label-width="120px"
               size="small"
               disabled
               class="form-readonly"
               @submit.native.prevent
      >
        <el-form-item label="名称">
          <el-input v-model="item.productName" />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="item.keywords" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="item.description" />
        </el-form-item>
        <el-form-item label="feature描述">
          <el-input v-model="item.feature" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getLangs } from '@/api/info'
import { multiLangInfoFields } from './fields'
import infoMixin from './mixin'

export default {
  mixins: [infoMixin],
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      langs: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getLangs().then(res => {
        if (res.success) {
          this.langs = res.data.map(item => {
            const d = this.formData.list.find(el => el.countryCode === item.countryCode) || multiLangInfoFields()
            return { ...item, ...d }
          })
        }
      })
    }
  }
}
</script>
