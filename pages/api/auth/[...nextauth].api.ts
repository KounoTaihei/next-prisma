import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import prisma from "../../../lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextApiRequest, NextApiResponse } from "next-auth/internals/utils";

const options = {
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        session: (session: any, user: any) => {
            // user はデータベースに保存されている user オブジェクト
            session.user.id = user.id;
            return Promise.resolve(session);
        },
    },
};
export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);