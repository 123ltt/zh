// SPU/SKU审核
<script>
import AddInfo from '../addInfo/index.vue'

export default {
  props: {
    routeQuery: Object,
    routeParams: {
      type: Array,
      default: () => []
    }
  },
  render(h) {
    const [flowId] = this.routeParams
    return h(AddInfo, {
      props: Object.assign(this.routeQuery, {
        readonly: false,
        mode: 'page',
        auditType: 1,
        isAudit: true,
        flowId
      })
    })
  }
}
</script>
