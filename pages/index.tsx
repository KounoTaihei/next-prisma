import type { NextPage } from 'next';
import { useSession } from "next-auth/client";
import { CircularProgress, Typography } from '@material-ui/core';
import { PrismaClient } from '@prisma/client';
import { useEffect } from 'react';
import { useRouter } from 'next/dist/client/router';
import { createStyles, makeStyles } from '@material-ui/styles';

const Home: NextPage = () => {
  const [ session, loading ] = useSession();
  const router = useRouter();

  const useStyles = makeStyles(() =>
      createStyles({
          typography: {
            fontSize: "0.8em"
          }
      })
  );
  const classes = useStyles();

  useEffect(() => {
    if(!loading) {
      if(session) {
        router.replace(`/profile/${session.user.id}`);
      } else {
        router.replace('/login');
      }
    }
  },[loading])

  return (
    <>
      <div className="text-center py-8">
        <CircularProgress
          color="primary"
        />
        <Typography className={classes.typography}>ログイン情報を確認中...</Typography>
      </div>
    </>
  )
}

export default Home

declare global {
  var prisma: PrismaClient;
}