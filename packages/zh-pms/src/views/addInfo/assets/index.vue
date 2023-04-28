<template>
  <div class="asserts-container">
    <div :class="['d-flex'][formData.mode]">
      <div class="flex-grow-1">
        <el-card v-for="item in imagesGroup" :key="item.value" class="border mx-1 my-2" :body-style="bodyStyle">
          <div slot="header" class="d-flex justify-content-between">
            <b>{{ item.label }}</b>
            <span>共<span class="mx-1 text-primary">{{ item.images.length }}</span>张图</span>
          </div>
          <div class="d-flex flex-wrap">
            <div v-if="item.images.length===0" class="text-muted text-center">暂无图片</div>
            <template v-for="img in item.images">
              <ThumbBig v-if="formData.mode===0"
                        :key="'a'+img.uid"
                        :url="img.url"
                        :tags="img.tags"
                        :disabled="disabled"
                        @remove="onRemoveImg(img,0)"
                        @select="tags=>onSelectTag(img,tags)"
              />
              <ThumbSmall v-else
                          :key="'b'+img.uid"
                          :url="img.url"
                          :tags="img.tags"
                          class="py-1 px-2 mx-1"
                          :disabled="disabled"
                          @remove="onRemoveImg(img,0)"
                          @select="tags=>onSelectTag(img,tags)"
              />
            </template>
          </div>
        </el-card>
      </div>
      <div :class="['right-box flex-shrink-0 ms-1','d-flex'][formData.mode]">
        <div v-for="el in others" :key="el.field" class="w-100">
          <el-card class="border mx-1 my-2 file-box" :body-style="bodyStyle">
            <div slot="header" class="clearfix">
              <b>{{ el.title }}</b>
            </div>
            <div v-if="$data[el.field].length===0" class="text-center my-4 text-muted">暂无{{ el.title }}</div>
            <div v-for="item in $data[el.field]" :key="item.url">
              <FileItem :title="item.name" :url="item.url" @remove="onRemoveFile(el.field,item.url)" />
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div v-if="!disabled" class="px-1 py-2 position-sticky bottom-0 bg-white text-center">
      <el-button size="small" :icon="['el-icon-s-grid','el-icon-menu'][formData.mode]" class="mx-1" @click="formData.mode=Number(!formData.mode)">切换显示模式</el-button>
      <UploaderBtn class="mx-1" @select="files=>queueList=files" />
      <el-button size="small" type="primary" class="mx-1" @click="save">保存</el-button>
    </div>
    <UploaderQueue ref="queue" class="position-fixed end-0 bottom-0 m-2" :files="queueList" @uploaded="onUploaded" />
  </div>
</template>

<script>
import { getDict } from '@/api/common/dict'
import ThumbBig from './thumbBig.vue'
import ThumbSmall from './thumbSmall.vue'
import FileItem from './fileItem.vue'
import UploaderBtn from './uploaderBtn.vue'
import UploaderQueue from './uploaderQueue.vue'
import { pick, omit } from '@/util/util'
import { updateFilesInfo } from '@/api/info'

export default {
  name: 'Assets',
  components: { ThumbBig, ThumbSmall, FileItem, UploaderBtn, UploaderQueue },
  inject: ['addInfo'],
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    readonly: Boolean
  },
  data() {
    return {
      dimensions: [],
      images: [],
      videos: [],
      attachments: [],
      queueList: [],
      submitting: false
    }
  },
  computed: {
    disabled() {
      return this.readonly || this.formData.ifCanUpdate === false
    },
    bodyStyle() {
      return { padding: '1rem' }
    },
    imagesGroup() {
      return this.dimensions.map(item => {
        return {
          ...item,
          images: this.images.filter(el => el.widthHeight === item.value).map(el => {
            return {
              uid: el.id || el._uid,
              id: el.id,
              url: el.imageUrl,
              name: el.imageName,
              tags: el.imageTags ? el.imageTags.split(',') : [],
              primary: !!el.isPrime
            }
          })
        }
      })
    },
    others() {
      return [{ title: '视频', field: 'videos' }, { title: '附件', field: 'attachments' }]
    }
  },
  created() {
    this.images = (this.formData.img || [])
    this.videos = this.formData.video
    this.attachments = this.formData.attachment

    getDict('dimensions', 'pms').then(dimensions => {
      this.dimensions = dimensions.map(item => {
        item.dimension = /^\d+\*\d+$/.test(item.value) ? item.value.split('*').map(Number) : []
        return item
      })
    })
  },
  methods: {
    // 移除图片0
    onRemoveImg(data) {
      this.images = this.images.filter(item => {
        if (data.id === undefined) return data.uid !== item._uid // 新增的图片还没id
        return item.id !== data.id
      })
    },
    onSelectTag(data, tags) {
      const d = this.images.find(el => data.url === el.imageUrl)
      const v = tags.map(el => el.value)
      d.imageTags = v.join(',')
      data.tags = v
    },
    // 删除视频或附件
    onRemoveFile(field, url) {
      this[field] = this[field].filter(item => item.url !== url)
    },
    isDiyDimension(w, h) {
      return !this.dimensions.some(item => item.dimension[0] === w && item.dimension[1] === h)
    },
    onUploaded(uploadedFile, allUploadedFiles) {
      const { filename, url, _uid, filetype } = uploadedFile
      if (filetype === 'image') {
        const isDiy = this.isDiyDimension(uploadedFile.width, uploadedFile.height)
        this.images.push({
          _uid,
          imageName: filename,
          imageUrl: url,
          widthHeight: isDiy ? 'DIY' : [uploadedFile.width, uploadedFile.height].join('*'),
          tags: []
        })
      } else if (filetype === 'video') {
        this.videos.push({ _uid, name: filename, url })
      } else if (filetype === 'attachment') {
        this.attachments.push({ _uid, name: filename, url })
      }
    },
    save() {
      if (this.submitting) return
      const valid = this.$refs.queue.validate()
      if (!valid) return

      this.submitting = true
      const attachment = this.attachments.map(item => pick(item, ['name', 'url']))
      const video = this.videos.map(item => pick(item, ['name', 'url']))
      const img = this.images.map(item => omit(item, ['_uid', 'tags']))
      updateFilesInfo({ productId: this.formData.id, img, video, attachment })
        .then(res => {
          this.addInfo.getDetail()
          this.$refs.queue.reset()
          this.$message.success(res.msg)
        }).finally(() => {
          this.submitting = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
$tagBoxWidth: 340px;
::v-deep {
  .el-card__header {
    background: #efefef;
  }
}
.asserts-container {
  transition: all 0.3s;
  .right-box {
    width: 400px;
  }
  .file-box ::v-deep {
    .el-card__body {
      min-height: 60px;
    }
  }
}
</style>
