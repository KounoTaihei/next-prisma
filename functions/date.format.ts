export const formatDate = (datetime: Date) => {
    const newDate = new Date(datetime);

    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const date = newDate.getDate();
    const hours = newDate.getHours();

    let minutes;
    if(newDate.getMinutes() < 10) {
        minutes = "0" + newDate.getMinutes();
    } else {
        minutes = newDate.getMinutes();
    }

    return `${year}/${month}/${date} ${hours}:${minutes}`;
}