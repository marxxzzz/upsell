export const config = {
  amount: Number(process.env.AMOUNT || 58.36),
  productKey: process.env.PRODUCT_KEY || 'main',
  city: process.env.CITY || 'Curitiba',
  state: process.env.STATE || 'PR',
  cpfLookupNonce: process.env.CPF_LOOKUP_NONCE || 'bde6818eeddc0201f9b6d80e17acb948',
  customerFlowNonce: process.env.CUSTOMER_FLOW_NONCE || 'e8581726cd6c71ddf21852cfe43c867d',
  checkoutCpfNonce: process.env.CHECKOUT_CPF_NONCE || '92e3e85ff8d687d36f46624b1bfc10b6',
  demoPixPaidAfterSeconds: Number(process.env.DEMO_PIX_PAID_AFTER_SECONDS || 45),
  chargeSecret: process.env.CHARGE_SECRET || 'troque-este-secret-na-vercel',
  cpfDatabase: {
    '52998224725': 'João Silva',
    '11144477735': 'Maria Souza',
    '39053344705': 'Carlos Mendes',
  },
};
