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
    return h(AddInfo, {
      props: Object.assign(this.routeQuery, {
        readonly: false,
        mode: 'page'
      })
    })
  }
}
</script>
