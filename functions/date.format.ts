export const formatDate = (datetime: Date) => {
    const newDate = new Date(datetime);

    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const date = newDate.getDate();
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();

    return `${year}/${month}/${date} ${hours}:${minutes}`;
}