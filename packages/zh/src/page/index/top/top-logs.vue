<template>
  <span @click="logsFlag?'':handleOpen()">
    <el-badge :value="logsFlag?'':logsLen"
              :max="99"
    >
      <i class="icon-rizhi1" />
    </el-badge>
    <el-dialog :visible.sync="box"
               title="日志"
               fullscreen
               width="100%"
               append-to-body
    >
      <logs />
    </el-dialog>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
import logs from '@/page/logs/index'
export default {
  name: 'TopLogs',
  components: { logs },
  data() {
    return {
      box: false
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(['logsFlag', 'logsLen'])
  },
  props: [],
  methods: {
    handleOpen() {
      this.box = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
