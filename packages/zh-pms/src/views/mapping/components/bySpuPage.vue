<template>
  <div>
    <div class="d-flex align-items-center">
      <span class="flex-shrink-0">当前PMS类目</span>
      <el-input v-model="pmsCategoryName" size="mini" readonly class="mx-2" />
      <span class="flex-shrink-0">SPU编码</span>
      <el-input v-model="spuCode" size="mini" readonly class="mx-2" style="width:200px" />
      <el-button size="mini" type="primary" @click="addSku">批量添加SKU</el-button>
    </div>
    <SkuListWithAttr class="my-2"
                     :sku-list="skuList"
                     @loaded="onSkuAttrLoaded"
                     @removeCol="onRemoveCol"
    />
    <template v-if="plateformSiteList.length>0&&skuList.length>0">
      <SkuAttrMapping v-for="item in plateformSiteList"
                      :key="item.id"
                      :title="item.title"
                      :pms-category-id="pmsCategoryId"
                      :platform-code="item.platformCode"
                      :site-code="item.siteCode"
                      :pms-attrs="pmsAttrs"
                      :sku-list="pmsSkuList"
                      class="my-2"
      />
    </template>
  </div>
</template>

<script>
import AddSkuBySpu from './addSkuBySpu.vue'
import SkuListWithAttr from './skuListWithAttr.vue'
import SkuAttrMapping from './skuAttrMapping.vue'

export default {
  name: 'BySpuPage',
  components: { SkuListWithAttr, SkuAttrMapping },
  props: {
    /** @type {ZHKJ.VueProps<{id:string; title:string; platformCode:string; siteCode:string}[]>} */
    plateformSiteList: Array
  },
  data() {
    return {
      pmsCategoryId: '',
      pmsCategoryName: '',
      spuCode: '',
      skuList: [],
      pmsAttrs: [],
      pmsSkuList: []
    }
  },
  methods: {
    onSkuAttrLoaded(list, headers) {
      if (this.pmsSkuList.length > 0 && this.pmsSkuList[0].spuCode === list[0].spuCode) { // 增量添加sku
        const newAddList = list.filter(item => {
          return !this.pmsSkuList.some(el => el.skuCode === item.skuCode)
        })
        const newAddHeaders = headers.filter(item => {
          return !this.pmsAttrs.some(el => el.prop === item.prop)
        })
        this.pmsSkuList.push(...newAddList)
        this.pmsAttrs.push(...newAddHeaders)
      } else { // 全量增加sku
        this.pmsSkuList = list
        this.pmsAttrs = headers
      }
    },
    onRemoveCol(headers) {
      this.pmsAttrs = headers
    },
    setBaseData(data) {
      this.pmsCategoryId = data.categoryId
      this.pmsCategoryName = data.categoryName
      this.spuCode = data.skuList[0].spuCode
      this.skuList = data.skuList
    },
    addSku() {
      this.$modal({
        title: '批量添加SKU',
        component: AddSkuBySpu,
        width: '860px',
        padding: '10px 10px 0',
        callback: (data) => {
          if (data) {
            if (this.skuList.length > 0 && data.skuList[0].spuCode === this.skuList[0].spuCode) {
              const newSkuList = data.skuList.filter(item => !this.skuList.some(el => el.skuCode === item.skuCode))
              this.skuList.push(...newSkuList)
            } else {
              if (this.skuList.length > 0) {
                this.$alert('您选择了新的SPU，继续操作将会清空已选择的SKU', {
                  title: '操作提示',
                  type: 'warning',
                  confirmButtonText: '继续',
                  showCancelButton: true,
                  cancelButtonText: '取消'
                }).then(() => {
                  this.setBaseData(data)
                  this.$emit('resetTree')
                }).catch(() => {})
              } else {
                this.setBaseData(data)
              }
            }
          }
        }
      })
    }
  }
}
</script>
