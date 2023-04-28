<template>
  <basic-container>
    <el-form ref="form"
             label-width="120px"
             :model="form"
             :rules="rules"
             size="mini"
             :class="{'form-readonly no-message':readonly}"
             @submit.native.prevent="submit"
    >
      <el-form-item label="规则名称" prop="ruleName">
        <el-input v-model="form.ruleName" :disabled="readonly" />
      </el-form-item>
      <el-form-item label="当前状态">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="2" :disabled="readonly" />
      </el-form-item>
      <el-form-item label="开发人员" prop="developers">
        <el-tag v-for="(tag,index) in form.developers"
                :key="tag.id"
                :closable="!readonly"
                size="medium"
                type="info"
                class="m-1"
                @close="removeMember(form.developers,index)"
        > {{ tag.name }}</el-tag>
        <v-organization v-if="!readonly" v-model="form.developers" multiple>
          <el-button type="primary" plain icon="el-icon-plus">添加</el-button>
        </v-organization>
      </el-form-item>
      <el-form-item label="允许销售人员">
        <el-tag v-for="(tag,index) in form.salers"
                :key="tag.id"
                :closable="!readonly"
                size="medium"
                type="info"
                class="m-1"
                @close="removeMember(form.salers,index)"
        > {{ tag.name }}</el-tag>
        <v-organization v-if="!readonly" v-model="form.salers" multiple>
          <el-button type="primary" plain icon="el-icon-plus">添加</el-button>
        </v-organization>
      </el-form-item>
      <el-form-item label="平台店铺列表">
        <v-store-list-panel v-model="form.platforms" :disabled="readonly" />
      </el-form-item>
      <el-form-item label="允许SPU编码">
        <el-input v-model="form.spuCodes"
                  v-input="productCodesHandler"
                  type="textarea"
                  :autosize="{ minRows:2,maxRows:6}"
                  class="w-100"
                  placeholder="多个编码可使用空格、英文逗号、换行隔开"
        />
      </el-form-item>
      <el-form-item label="允许SKU编码">
        <el-input v-model="form.skuCodes"
                  v-input="productCodesHandler"
                  type="textarea"
                  :autosize="{ minRows:2,maxRows:6}"
                  class="w-100"
                  placeholder="多个编码可使用空格、英文逗号、换行隔开"
        />
      </el-form-item>
      <el-form-item v-if="!readonly" class="text-end">
        <el-button :loading="submitting" type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import VOrganization from '@/components/organization/index.vue'
import VStoreListPanel from './storeListPanel.vue'
import { save, detail } from '@/api/publishedConstraints'
import { getPlatforms, getStoresByPlatformAndKeyword } from '@/api/sams'
import { required } from '@/util/formRules'

export default {
  components: { VOrganization, VStoreListPanel },
  props: {
    id: String,
    type: String
  },
  data() {
    return {
      submitting: false,
      form: {
        ruleName: '',
        status: 1,
        developers: [],
        salers: [],
        platforms: [],
        spuCodes: '',
        skuCodes: ''
      },
      rules: {
        ruleName: required(),
        developers: [{ type: 'array', required: true, message: '至少选择1个' }]
      }
    }
  },
  computed: {
    readonly() {
      return this.type === 'detail'
    }
  },
  created() {
    if (this.type !== 'add') this.getDetail()
  },
  methods: {
    removeMember(list, index) {
      list.splice(index, 1)
    },
    getDetail() {
      detail(this.id).then(res => {
        const { ruleName, developerIds, developers, salesmanIds, salesmans, platformStores, status, spuCodes, skuCodes } = res.data
        const developersList = []
        const salersList = []
        developerIds.forEach((item, index) => {
          developersList.push({ id: item, name: developers[index] })
        })
        salesmanIds.forEach((item, index) => {
          salersList.push({ id: item, name: salesmans[index] })
        })
        const platforms = platformStores.map(({ platformCode, accounts, ifAll }) => {
          return { platformCode, storeCode: accounts || [], ifAll }
        })
        Object.assign(this.form, {
          ruleName,
          status,
          developers: developersList,
          salers: salersList,
          platforms,
          spuCodes: (spuCodes || []).join(', '),
          skuCodes: (skuCodes || []).join(', ')
        })
      })
    },
    lazyLoad(node, resolve) {
      if (node.isLeaf) {
        node.loaded = true
        return
      }
      if (node.root) {
        getPlatforms().then(resolve)
      } else {
        getStoresByPlatformAndKeyword(node.data.code).then(list => {
          resolve(list.map(item => {
            item.leaf = true
            return item
          }))
        })
      }
    },
    submit() {
      if (this.readonly) return
      this.$refs.form.validate(valid => {
        if (valid) {
          const { ruleName, developers, salers, platforms, status, spuCodes, skuCodes } = this.form
          let type = 0
          const developerIds = developers.map(item => item.id)
          const salesmanIds = salers.map(item => item.id)
          const platformStores = platforms.map(({ platformCode, storeCode, ifAll }) => {
            return { platformCode, accounts: storeCode, ifAll }
          })

          if (salesmanIds.length === 0 && platformStores.length === 0) {
            return this.$message.error('允许销售人员 和 平台店铺列表 必填其一')
          }

          const conditions = {
            ruleName,
            developerIds,
            salesmanIds,
            platformStores,
            status,
            spuCodes: spuCodes.trim().split(/[\s,]+/),
            skuCodes: skuCodes.trim().split(/[\s,]+/)
          }
          if (this.id) {
            conditions.id = this.id
            type = 1
          }

          this.submitting = true
          save(conditions, type).then(res => {
            this.$message.success(res.msg)
            this.$emit('close', true)
          }).finally(() => {
            this.submitting = false
          })
        }
      })
    },
    productCodesHandler(val) {
      return val.replace(/[^\da-z\s,]+/ig, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-panel.el-cascader-panel ::v-deep {
  .el-cascader-menu__wrap {
    height: 250px;
    .el-scrollbar__view {
      z-index: 1;
    }
  }
  .el-cascader-menu:nth-child(2) {
    min-width: auto;
    .el-scrollbar__view {
      display: flex;
      flex-wrap: wrap;
      min-height: auto;
      height: auto;
      li.el-cascader-node {
        width: 10rem;
      }
    }
  }
}
</style>
