<template>
  <iframe ref="iframe"
          src="/pdf-viewer/index.html"
          style="width:100vw;height:100vh;"
          class="border-0"
          @load="onload"
  />
</template>

<script>
export default {
  props: {
    blob: {
      type: [Blob, Object],
      default: null
    }
  },
  data() {
    return {
      isLoaded: false
    }
  },
  mounted() {
    const unwatch = this.$watch('blob', () => this.loaded())
    this.$once('hook:beforeDestroy', unwatch)
  },
  methods: {
    onload() {
      this.isLoaded = true
      this.loaded()
    },
    loaded() {
      if (this.blob && this.isLoaded) {
        const url = window.URL.createObjectURL(this.blob)
        this.$refs.iframe.contentWindow.PDFViewerApplication.open({ url, originalUrl: url })
      }
    }
  }
}
</script>
