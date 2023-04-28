export default [
  {
    title: '订单信息',
    items: [
      { label: '销售平台', prop: 'platformCode' },
      { label: '平台单号', prop: 'platOrderId' },
      { label: 'OMS单号', prop: 'omOrderId', path: 'oms/orderManagement/details' },
      { label: '订单来源', prop: 'orderType' },
      { label: '销售店铺', prop: 'storeName' },
      { label: '平台订单状态', prop: 'platOrderStatus' },
      { label: 'OMS订单状态', prop: 'omOrderStatus' },
      { label: '预售订单', prop: 'ifPreSale' },
      { label: '销售站点', prop: 'siteCode' },
      { label: 'COD订单', prop: 'ifCashOnOelivery' }
    ]
  },
  {
    title: '费用详情',
    currency: 'orderCurrency',
    items: [
      { label: '订单总金额', prop: 'totalOrderAmount', isPrice: true },
      { label: '平台交易费', prop: 'platformTradeAmount', isPrice: true },
      { label: '买家实付金额', prop: 'buyerPaymentAmount', isPrice: true },
      { label: '卖家实收金额（除税）', prop: 'sellerIncomeAmount', labelWidth: '120px', isPrice: true },
      { label: '税费', prop: 'escrowTax', isPrice: true },
      { label: '客付运费', prop: 'buyerPaysFreight', isPrice: true },
      { label: '调整金额', prop: 'adjustmentAmount', isPrice: true },
      { label: '补贴', prop: 'freightSubsidyAmount', labelWidth: '120px', isPrice: true }
    ]
  },
  {
    title: '收货地址',
    items: [
      { label: '收件人', prop: 'buyerName' },
      { label: '国家', prop: 'countryName' },
      { label: '省/州', prop: 'buyerState' },
      { label: '城市', prop: 'buyerCity' },
      { label: '移动电话', prop: 'buyerTel' },
      { label: '固定电话', prop: 'buyerTel' },
      { label: '邮编', prop: 'buyerZipcode' },
      { label: '买家邮箱', prop: 'buyerEmail' },
      { label: '地址一', prop: 'buyerAddress', grow: 1 },
      { label: '地址二', prop: '', grow: 1 }
    ]
  },
  {
    title: '物流信息',
    items: [
      { label: '线上渠道', prop: 'carrierCode' },
      { label: '线上渠道跟踪号', prop: 'trackingNo', labelWidth: '90px' }
    ]
  },
  {
    title: '时间信息',
    items: [
      { label: '订单创建时间', prop: 'orderTime' },
      { label: '订单付款时间', prop: 'payTime' },
      { label: '抓单时间', prop: 'firstGrabDate' },
      { label: '平台订单最后更新时间', prop: 'orderUpdateTime', labelWidth: '120px' },
      { label: '标记时间', prop: 'omsMarkDate' },
      { label: '实际发货时间', prop: 'deliveryTime' }
    ]
  }
]
