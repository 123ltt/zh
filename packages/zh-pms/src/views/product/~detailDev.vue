// 产品开发审核详情（只读）
<script>
import AddInfo from '../addInfo/index.vue'

export default {
  props: {
    routeQuery: Object
  },
  render(h) {
    return h(AddInfo, {
      props: Object.assign(this.routeQuery, {
        readonly: true,
        mode: 'page',
        auditType: 2,
        type: 3
      })
    })
  }
}
</script>
