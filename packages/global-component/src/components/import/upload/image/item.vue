<template>
  <div class="position-relative">
    <g-thumb :url="file.url||(file.response?file.response.data:file.blobUrl)"
             :width="120"
             :height="120"
             :is-preview="isPreview"
             class="position-relative ui-thumb"
    >
      <div v-if="isFilename" class="ui-title position-absolute bottom-0 start-0 end-0 text-truncate text-white">{{ file.name }}</div>
      <div v-if="primary&&file.primary" class="ui-triangle position-absolute top-0 start-0  d-flex align-items-center">
        <i class="el-icon-check" />
      </div>
    </g-thumb>
    <div v-show="file.status==='success'" class="ui-toolbar position-absolute end-0 top-0">
      <el-tooltip v-show="primary&&!disabled&&!file.primary&&isPrimary" content="设为主图" placement="top">
        <i class="el-icon-check mx-2" @click.stop="$emit('setPrimary',file.uid)" />
      </el-tooltip>
      <el-tooltip v-if="!disabled&&isRemove" content="删除图片" placement="top">
        <i class="el-icon-delete mx-2" @click.stop="$emit('remove',file.uid)" />
      </el-tooltip>
      <el-tooltip v-if="isRaw" content="查看原图" placement="top">
        <a class="el-icon-full-screen mx-2" :href="file.url" target="_blank" @click.stop />
      </el-tooltip>
    </div>
    <div v-if="file.status==='uploading'" class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
      <el-progress type="circle"
                   :stroke-width="3"
                   :percentage="file.percentage"
                   status="success"
                   :width="100"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    file: Object,
    // 是否禁用（即是否只读）
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否需要主图功能
    primary: {
      type: Boolean,
      default: true
    },
    // 是否显示删除按钮
    isRemove: {
      type: Boolean,
      default: true
    },
    // 是否显示设置主图按钮
    isPrimary: {
      type: Boolean,
      default: true
    },
    // 是否显示查看原图按钮
    isRaw: {
      type: Boolean,
      default: true
    },
    // 是否显示图片名
    isFilename: {
      type: Boolean,
      default: true
    },
    // 是否启用预览图
    isPreview: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-thumb {
  .ui-title {
    display: none;
  }
  &:hover {
    .ui-title {
      background-color: rgba(0,0,0,0.4);
      font-size: 1rem;
      display: block;
      line-height: 1.5;
    }
  }
  .ui-triangle {
    background-color: $--color-success;
    height: 20px;
    border-bottom-right-radius: 1rem;
    color: #fff;
  }
}
.ui-toolbar {
  top: 5px;
  display: none;
  i, a {
    background-color: rgba(255,255,255,.7);
    color: #000;
    padding: 3px;
    border-radius: 10px;
    font-weight: 700;
    border: 1px solid #999;
    cursor: pointer;
    &:hover {
      color: var(--color-primary);
    }
  }
}
</style>
