
import selectSkuModal from '../../components/selectSkuModal/selectSkuModal.vue'
import { storeOptionsWithPlatformCode } from '@/api/sams'
import { getIndex } from '../../components/utils.js'

export default {
  data() {
    return {
      headers: [
        {
          type: 'select',
          prop: 'account',
          label: '店铺名称',
          data: [],
          attrs: {
            class: 'w-100',
            options: { label: 'displayName', value: 'displayName' }
          },
          disabled: () => this.isEdit,
          selectList: () => storeOptionsWithPlatformCode({ platformCode: 'SP' }),
          event: { change: () => { this.accountChange() } }
        },
        { type: 'selectBtn', prop: 'productSpu', inputDisble: () => this.isEdit, btnDisable: () => this.isEdit, label: 'SKU', components: this.returnCom(), event: { blur: () => { this.getSkuDetail(this.baseProductInfo.productSpu) } } },
        { slotName: 'zskuSlot' },
        { type: 'input', prop: 'name', label: '标题', attrs: { maxlength: 128, showWordLimit: true } },
        { type: 'input', prop: 'productCatePath', label: '产品类目', disabled: true },
        { slotName: 'cateSlot' },
        { type: 'select', prop: 'condition', label: 'Condition', disabled: () => false, data: [], selectList: [{ label: 'NEW', value: 0 }] }
      ]
    }
  },
  methods: {
    accountChange() {
      const setData = ['productSpu', 'name', 'productCatePath', 'categoryId', 'sellerSku', 'platCategoryPath']
      setData.forEach(item => {
        this.baseProductInfo[item] = ''
      })
      this.cateDisabled = false
      this.headers[0].data.forEach(item => {
        if (item.value === this.baseProductInfo.account) {
          this.baseProductInfo.accountCode = item.candidateDisplayName
          this.baseProductInfo.accountPrefix = item.externalSkuPrefix
          if (!this.isVariation) {
            this.$refs.variantAttr.$refs.oneListing.setForm('profitRate', item.publishGrossProfitRate)
          }
        }
      })
    },
    returnCom() {
      return {
        component: selectSkuModal,
        title: '选择产品',
        width: '1100px',
        data: () => {
          return {
            platformCode: this.platformCode,
            account: this.baseProductInfo.account,
            showType: this.listingType === 'Variation' ? 'spu' : 'sku'
          }
        },
        callback: (row) => {
          if (row) {
            this.baseProductInfo.productSpu = row.productSku
            const type = ['Variation', 'Normal', 'Combo']
            this.listingType = type[row.type - 1]
            this.getSkuDetail(row.productSku)
          }
        }
      }
    }
  }
}
