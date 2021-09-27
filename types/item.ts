import { Item, Heart } from '@prisma/client'

export interface ItemWithHearts extends Item {
    hearts: Heart[]
}