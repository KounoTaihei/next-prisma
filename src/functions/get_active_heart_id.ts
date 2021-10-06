import { ItemWithHearts } from "../../types/item";

export const getActiveHeartId = (item: ItemWithHearts, userId: string): string => {
    if(!item.hearts) {
        return "";
    }

    let result: string = "";

    for(let heart of item.hearts) {
        if(heart.userId === userId) {
            result = heart.id
        }
    }

    return result;
}