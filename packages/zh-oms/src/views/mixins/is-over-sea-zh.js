export const overSearZHMixin = {
  methods: {
    isOverSeaZH(code) {
      const OVERSEA = ['THIRD,ZHHW,', 'OVERSEA,ZHHW,', 'SELF_BUILT,ZH,', 'OVERSEA,ZH,']
      return OVERSEA.some(item => code.startsWith(item))
    }
  }
}
