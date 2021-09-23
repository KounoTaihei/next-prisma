import { NoteWithItems, NoteWithUserAndItems } from "../types/note";
import { getLatestDate } from "./get_latest_date";

/** ------ 
 *  props
 *  notes noteの配列
 *  orderBy   0 => アイテムのcreatedAtで並び替え
 *            1 => ノートのcreatedAt
 *            2 => アイテムの数
 *  ascOrDest 0 => 降順
 *            1 => 昇順
 *  ------ */

export const getSortedNotes = (notes: NoteWithUserAndItems[] | NoteWithItems[], orderBy: string, ascOrDesc: string): any[] => {
    if(!notes) {
        return [];
    }

    /** 降順昇順を切り替え */
    let adjust_num: number;

    if(ascOrDesc === "0") {
        adjust_num = 1;
    } else if(ascOrDesc === "1") {
        adjust_num = -1;
    }

    switch(orderBy) {
        case "0": {
            return notes.sort(function(a, b) {
                if(!b.items.length) {
                    return -1 * adjust_num;
                }
                const a_dates = a.items.map(item => item.createdAt);
                const b_dates = b.items.map(item => item.createdAt);
                if(getLatestDate(a_dates) > getLatestDate(b_dates)) {
                    return -1 * adjust_num;
                } else {
                    return 1 * adjust_num;
                }
            });
            break;
        }
        case "1": {
            return notes.sort(function(a, b) {
                if(new Date(a.createdAt) > new Date(b.createdAt)) {
                    return -1 * adjust_num;
                } else {
                    return 1 * adjust_num;
                }
            });
            break;
        }
        case "2": {
            return notes.sort(function(a, b) {
                if(!b.items.length) {
                    return -1 * adjust_num;
                }
                if(a.items.length > b.items.length) {
                    return -1 * adjust_num;
                } else {
                    return 1 * adjust_num;
                }
            });
            break;
        }
        default: {
            return [];
        }
    }
}