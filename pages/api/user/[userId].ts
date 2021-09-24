import { NextApiRequest, NextApiResponse } from "next";
import { UserWithStarsWithNoteWithUserAndItems } from "../../../types/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse<UserWithStarsWithNoteWithUserAndItems>) {
    const method = req.method;

    switch(method) {
        case 'GET': {
            const userId: string = req.query.userId.toString();
            const user: UserWithStarsWithNoteWithUserAndItems = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                include: {
                    stars: {
                        include: {
                            note: {
                                include: {
                                    user: true,
                                    items: true
                                }
                            }
                        }
                    }
                }
            })
            .then(res => JSON.parse(JSON.stringify(res)));

            res.status(200).json(user);
            break;
        }
        default: {
            res.status(403).end();
        }
    }
}