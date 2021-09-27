import { ItemWithHearts } from "../types/item";

export const getHearted = (item: ItemWithHearts, userId: string): boolean => {
    if(!item.hearts) {
        return false;
    }

    let result = false;

    for(let heart of item.hearts) {
        if(heart.userId === userId) {
            result = true;
        }
    }

    return result;
}