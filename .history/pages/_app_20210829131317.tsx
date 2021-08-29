import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      
    </Layout>
    <Component {...pageProps} />
  )
}
export default MyApp
