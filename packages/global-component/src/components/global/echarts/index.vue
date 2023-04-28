<script>
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, TreeChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'

echarts.use([
  CanvasRenderer,

  BarChart,
  TreeChart,
  LineChart,

  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
])

export default {
  name: 'GCharts',
  props: {
    // 画布宽度。默认`100%`
    width: {
      type: String,
      default: '100%'
    },
    // 画布高度。默认`360px`
    height: {
      type: String,
      default: '360px'
    },
    // 图表的数据配置项，对应传入`setOption`的参数
    option: Object,
    // 对应echarts配置项的tooltip.trigger的参数。可选值：`item`, `axis`, `none`，默认`axis`
    tooltip: {
      type: String,
      default: 'axis'
    },
    // 图表的标题，对应配置项的title
    title: String
  },
  data() {
    return {
      eci: null
    }
  },
  watch: {
    option(val) {
      if (this.eci) {
        this.eci.setOption(Object.assign(this.baseOption(), val))
      }
    }
  },
  mounted() {
    const ec = echarts.init(this.$el)
    this.eci = ec
    if (this.option) {
      this.eci.setOption(this.option)
    }
    const unwatch = this.$watch(() => this.$store.state.common.windowResize, () => {
      ec.resize({
        animation: {
          duration: 200
        }
      })
    })
    this.$once('hook:beforeDestroy', () => {
      ec.dispose()
      unwatch()
    })
  },
  methods: {
    baseOption() {
      const base = {}
      if (this.tooltip) {
        base.tooltip = {
          trigger: this.tooltip,
          axisPointer: {
            type: 'shadow'
          }
        }
      }
      if (this.title) {
        base.title = {
          text: this.title,
          textStyle: {
            fontSize: 14
          }
        }
      }
      return base
    }
  },
  render(h) {
    return h('div', {
      staticClass: 'w-100',
      style: {
        width: this.width,
        height: this.height
      }
    })
  }
}
</script>
