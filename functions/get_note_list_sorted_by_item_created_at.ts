
import { NoteWithItems, NoteWithUserAndItems } from "../types/note";
import { getLatestDate } from "./get_latest_date";

export const getNoteListSortedByItemCreatedAt = (notes: NoteWithUserAndItems[] | NoteWithItems[]): any[] => {
    return notes.sort(function(a, b) {
        if(!b.items.length) {
            return -1
        }
        const a_dates = a.items.map(item => item.createdAt);
        const b_dates = b.items.map(item => item.createdAt);
        if(getLatestDate(a_dates) > getLatestDate(b_dates)) {
            return -1;
        } else {
            return 1;
        }
    });
}