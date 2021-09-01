import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next-auth/internals/utils";

const options = {
    providers: [
    Providers.Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    //　プロバイダーは何個でも指定できる。
    // https://next-auth.js.org/getting-started/introduction で一覧がみれる
    // 例：
    // Providers.Twitter({
    //   clientId: process.env.TWITTER_CLIENT_ID,
    //   clientSecret: process.env.TWITTER_CLIENT_SECRET,
    // }),
    ],
    adapter: Adapters.Prisma.Adapter({ prisma }),
};
export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);