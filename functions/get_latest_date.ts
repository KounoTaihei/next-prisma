export const getLatestDate = (dates: Date[]) => {
    const datas = dates.map(date => new Date(date).getTime());
    const latest = Math.max.apply(null, datas);
    return new Date(latest);
}