// 上传队列
<template>
  <div v-show="files.length>0" class="up-queue text-end" :style="show?'height: calc(100% - 45px);':'width:auto;'">
    <el-card v-show="show" class="shadow-lg border h-100" :body-style="{padding:'0'}">
      <div slot="header" class="d-flex justify-content-between">
        <span>
          <b class="text-primary">{{ panelName }}</b>
          {{ panelTitle }}
        </span>
        <el-button type="text" size="mini" class="py-0" icon="el-icon-minus" @click="show=false" />
      </div>
      <div class="up-files">
        <div v-for="item in list" :key="item._uid" class="bg-gray w-100 position-relative my-1">
          <div class="up-progress py-3 d-flex justify-content-end" :class="'up-bg-'+item.status" :style="{width: item.percent + '%'}" />
          <div class="position-absolute start-0 top-0 h-100 d-flex align-items-center w-100">
            <span class="text-truncate text-start flex-grow-1 mx-2">{{ item.filename }}</span>
            <el-button v-if="item.percent<100&&item.status==='uploading'"
                       type="text"
                       size="mini"
                       @click="cancelReq(item._uid)"
            >取消</el-button>
            <i v-else-if="item.status==='success'" class="el-icon-circle-check text-success mx-2" />
            <span v-else-if="['cancel','fail'].includes(item.status)" class="flex-shrink-0 mx-1 text-danger">{{ item.status==='cancel'?'已取消':'失败' }}</span>
          </div>
        </div>
      </div>
    </el-card>
    <el-button v-show="!show" class="m-2" size="mini" @click="show=true">
      <i v-if="total.done<list.length" class="el-icon-loading" />
      {{ panelName }} {{ panelTitle }}</el-button>
  </div>
</template>

<script>
import upload from '@/api/common/upload'

export default {
  name: 'UploaderQueue',
  inject: ['addInfo'],
  props: {
    files: Array
  },
  data() {
    return {
      panelName: '上传队列',
      show: true,
      list: [],
      uploaded: [],
      cancelExcutors: [] // 存储每个上传的取消方法
    }
  },
  computed: {
    total() {
      const o = { success: 0, fail: 0, cancel: 0 }

      this.list.forEach(item => {
        if (o[item.status] !== undefined) {
          o[item.status]++
        }
      })
      o.done = o.success + o.fail + o.cancel
      return o
    },
    panelTitle() {
      return `( 成功${this.total.success} / 失败${this.total.fail} / 取消${this.total.cancel} / 共${this.list.length} )`
    }
  },
  watch: {
    files: {
      handler(val) {
        if (Array.isArray(val)) {
          this.list.unshift(...val)
          val.forEach(this.doUpload)
        }
      },
      immediate: true
    }
  },
  methods: {
    doUpload(data) {
      data.status = 'uploading'
      upload({
        filename: 'file',
        file: data.file,
        appName: 'pms/' + this.addInfo.code,
        onProgress(e) {
          data.percent = e.percent
        },
        onSuccess: (res) => {
          data.status = 'success'
          data.url = res.data
          this.setImgDimension(data.file, data).then(() => {
            this.uploaded.push(data)
            this.$emit('uploaded', data, this.uploaded)
          })
        },
        onError(err) {
          if (err.message !== 'Cancel') {
            data.status = 'fail'
            data.percent = 100
          }
        },
        onFinish: () => {
          this.removeCancel(data._uid)
        },
        cancel: (c) => {
          this.cancelExcutors.push({ _uid: data._uid, cancel: c })
        }
      })
    },
    // 设置图片的尺寸
    setImgDimension(file, data) {
      return new Promise(resolve => {
        if (/^image\//i.test(file.type)) {
          const img = new Image()
          img.onload = () => {
            data.width = img.width
            data.height = img.height
            resolve()
          }
          const URL = window.URL || window.webkitURL
          img.src = URL.createObjectURL(file)
        } else {
          resolve()
        }
      })
    },
    removeCancel(uid) {
      const index = this.cancelExcutors.findIndex(item => item._uid === uid)
      if (index > -1) {
        return this.cancelExcutors.splice(index, 1)[0]
      }
      return null
    },
    cancelReq(uid) {
      // 取消请求
      const d = this.removeCancel(uid)
      d && d.cancel()

      // 修改状态
      const q = this.list.find(item => item._uid === uid)
      if (q) {
        q.status = 'cancel'
        q.percent = 100
      }
    },
    // 外部调用，重置数据
    reset() {
      this.list = []
      this.uploaded = []
      this.show = false
    },
    // 外部调用，检查队列中是否还有上传中的文件
    validate() {
      if (this.total.done < this.list.length) {
        this.$message.error(`队列中还有${this.list.length - this.total.done}个文件正在上传中`)
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.up-queue {
  width: 40%;
  max-width: 400px;
  max-height: 400px;
  ::v-deep .el-card__body {
    height: 100%;
  }
  .up-progress {
    height: 1rem;
  }
  .up-bg-uploading, .up-bg-success {
    background: #68c23a30;
  }
  .up-bg-fail, .up-bg-error {
    background: #f1949450;
  }
  .up-bg-cancel {
    background: #99999950;
  }
  .up-files {
    height: calc(100% - 30px);
    overflow: auto;
  }
}
</style>
