export default function coinString(coin: number) {
    return (coin / 100)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        .replace(".", ",");
}