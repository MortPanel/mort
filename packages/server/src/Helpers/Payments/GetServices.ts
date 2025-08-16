export default () => {
    let services = [];
    if(process.env.STRIPE_SECRET_KEY?.startsWith("sk_")) services.push({ name: "stripe", isProd: process.env.STRIPE_SECRET_KEY.startsWith("sk_live_") });
    return services;
}