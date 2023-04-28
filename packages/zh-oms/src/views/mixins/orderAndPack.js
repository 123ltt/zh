import DetailsTab from '../components/details-tab/index.vue'
import CombineOrder from '../components/combine-order/index.vue'
import { whichTransitionEvent } from '../../utils.js'
import { getCountryList } from '@/api/orderManagement.js'

export default {
  components: { DetailsTab, CombineOrder },
  provide() {
    return {
      virtualRuleData: this.virtualRuleData
    }
  },
  data() {
    return {
      remark: '',
      remarkId: '',
      timeData: [],
      exception: {
        title: '',
        msg: ''
      },
      orderStatus: '',
      orderType: '',
      amountDesc: '',
      exceptionType: 1,
      updating: false,
      isModifyAddres: false,
      activeName: 'productInfo',
      tabPaneList: [],
      buttonInfo: {},
      virtualRuleData: { country: '', platCode: '' },
      isMore: false,
      rowHeight: '100%',
      countryList: []
    }
  },
  mounted() {
    const el = this.$refs.formRef.$el
    this.rowHeight = el.clientHeight + 'px'
    this.getCountryList()
  },
  methods: {
    getCountryList() {
      getCountryList().then(res => {
        this.countryList = (res.data || []).map(({ countryCn, countryCode }) => Object.assign({}, { label: `${countryCode}-${countryCn}`, value: countryCode }))
      })
    },
    changeIsMore() {
      this.isMore = !this.isMore
      const el = this.$refs.formRef.$el
      const updateHeight = this.$refs.detailsTabRef.updateHeight
      const transitionend = whichTransitionEvent()
      el.addEventListener(transitionend, onceListener)
      function onceListener() {
        updateHeight()
        el.removeEventListener(transitionend, onceListener)
      }
    },
    cancelModify() {
      Object.assign(this.form, this.addres)
      this.isModifyAddres = false
    },
    modifyAddres() {
      if (this.isModifyAddres) {
        this.modifyOrderAddres()
        return
      }
      this.isModifyAddres = !this.isModifyAddres
    },
    closeAlert(bool) {
      this.$nextTick(this.$refs.detailsTabRef.updateHeight(bool, 0))
    },
    close() {
      this.$emit('close')
    }
  }
}
