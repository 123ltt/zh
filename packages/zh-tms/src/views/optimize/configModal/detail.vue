<template>
  <basic-container v-loading="loading" class="platform_detail">
    <el-row ref="formRef" class="row">
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <g-list-group v-for="(items,i) in detailRow1" :key="i" :cols="items.length" label-width="110px" label-align="center">
          <g-list-group-item v-for="(item,j) in items" :key="j" :label="item.label" :class="item.class?item.class:''">
            <g-text-ellipsis>{{ configurationDetail&& getValue(item.prop) }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>
      </el-card>
    </el-row>
    <detailTab :id="id+''" type="online_channel_service" />
  </basic-container>
</template>
<script>
import { onlineServiceDetail } from '@/api/serviceConfiguration'
import detailTab from '../../components/detailTab'
export default {
  name: 'ServiceBindingDetail',
  components: { detailTab },
  props: {
    id: String,
    serviceList: Array
  },
  data() {
    return {
      loading: false,
      configurationDetail: [],
      activeName: 'handleRecords',
      detailRow1: Object.freeze(
        [
          [
            { label: '平台', prop: 'platformName' },
            { label: '渠道代码', prop: 'onlineServiceCode' },
            { label: '筛选线下渠道', prop: 'hasFilter' }
          ],
          [
            { label: '线上服务英文名', prop: 'onlineServiceNameEn', class: 'w-33' },
            { label: '线下服务中文名', prop: 'onlineServiceNameCn' }
          ]
        ])

    }
  },
  created() {
    this.getData()
  },

  methods: {
    getData() {
      onlineServiceDetail({ id: this.id }).then(res => {
        this.configurationDetail = res.data
      })
    },
    getValue(prop) {
      return prop === 'hasFilter'
        ? (this.configurationDetail.hasFilter === 1 ? '是' : '否')
        : this.configurationDetail[prop]
    }

  }
}
</script>
<style lang="scss" scoped>
*{
  font-size: 12px;
}
.w-33{
width:33.33%!important
}
::v-deep .py-2 {
  margin-top: -0.275rem!important;
}
.el-card__body {
  padding: 10px !important;
}
</style>
