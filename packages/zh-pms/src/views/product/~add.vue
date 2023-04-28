<script>
import AddInfo from '../addInfo/index.vue'

export default {
  props: {
    routeQuery: Object
  },
  render(h) {
    return h(AddInfo, {
      props: Object.assign(this.routeQuery, {
        readonly: false,
        id: '',
        code: '',
        mode: 'page',
        type: 0
      })
    })
  }
}
</script>
