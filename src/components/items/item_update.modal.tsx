import { Item } from "@prisma/client"
import { Dispatch, SetStateAction } from "react"

export const ItemUpdateModal = ({
    item,
    modalOpen,
    setModalOpen
}: Props) => {}

interface Props {
    item: Item
    modalOpen: boolean
    setModalOpen: Dispatch<SetStateAction<boolean>>
}