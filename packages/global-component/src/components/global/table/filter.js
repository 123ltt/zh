
export default {
  data() {
    return {
      /** @type {{prop:string;values:string[]}[]} */
      excludeRowKeys: [] // 排除的 rowKey
    }
  },
  watch: {
    /** @param {string[]} excludes */
    excludeRowKeys(excludes) {
      if (excludes.length === 0) {
        this.tableList = this.cacheList
        return
      }

      this.tableList = this.cacheList.filter(item => !excludes.includes(item[this.rowKey]))
    }
  }
}
