export default [
  {
    title: '订单信息',
    items: [
      { label: '销售平台', prop: 'platformCode' },
      { label: '销售站点', prop: 'siteCode' },
      { label: '平台单号', prop: 'platOrderId' },
      { label: 'OMS单号', prop: 'omOrderId', path: 'oms/orderManagement/details' },
      { label: '销售店铺', prop: 'storeName' },
      { label: '订单来源', prop: 'platOrderStatus' },
      { label: '平台订单状态', prop: 'orderStatus' },
      { label: 'OMS订单状态', prop: 'omOrderStatus' }
    ]
  },
  {
    title: '费用详情',
    items: [
      { label: '订单总金额', prop: 'total', isPrice: true },
      { label: '平台交易费', prop: 'platformTradeAmount', isPrice: true },
      { label: '买家实付金额', prop: 'amountPaid', isPrice: true },
      { label: '卖家实收金额（除税）', prop: 'paymentAmount', labelWidth: '120px', isPrice: true },
      { label: '平台优惠金额', prop: 'platPreferential', isPrice: true },
      { label: '税费', prop: 'tax', isPrice: true },
      { label: '客付运费', prop: 'freightChargesAmount', isPrice: true },
      { label: '调整金额', prop: 'adjustmentAmount', labelWidth: '120px', isPrice: true },
      { label: '交易号', prop: 'transactionId' },
      { label: '付款方式', prop: 'paymentMethod' },
      { label: '收款账号', prop: 'sellerEmail' },
      { label: 'paypal交易费', prop: 'payPalTransactions', labelWidth: '120px', isPrice: true }
    ]
  },
  {
    title: '收货地址',
    items: [
      { label: '收件人', prop: 'shippingAddressName' },
      { label: '国家', prop: 'shippingAddressCountry' },
      { label: '省/州', prop: 'shippingAddressStateOrProvince' },
      { label: '城市', prop: 'shippingAddressCity' },
      { label: '移动电话', prop: 'shippingAddressPhone' },
      { label: '固定电话', prop: 'shippingAddressPhone' },
      { label: '邮编', prop: 'shippingAddressPostalCode' },
      { label: '买家邮箱', prop: 'buyerEmail' },
      { label: '地址一', prop: 'shippingAddressStreet1' },
      { label: '地址二', prop: 'shippingAddressStreet2' }
    ]
  },
  {
    title: '物流信息',
    items: [
      { label: '客选物流', prop: 'shippingServiceSelected' },
      { label: '平台物流渠道', prop: 'logisticsChannel' },
      { label: '跟踪号', prop: 'trackingNumber' }
    ]
  },
  {
    title: '时间信息',
    items: [
      { label: '订单创建时间', prop: 'ebayCreateTime' },
      { label: '订单付款时间', prop: 'paidTime' },
      { label: '抓单时间', prop: 'firstGrabDate' },
      { label: '平台订单最后更新时间', prop: 'lastModifiedTime', labelWidth: '120px' },
      { label: '标记时间', prop: 'omsMarkDate' },
      { label: '实际发货时间', prop: 'deliverDate' }
    ]
  }
]
