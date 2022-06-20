import Footer from '../components/molecules/footer/footer'
import Head from 'next/head'
import Hero from '../components/molecules/hero/hero'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>PoP! Funding</title>
        <meta
          name="description"
          content="PoP! Funding is a crowdfunding platform based on Algorand Blockchain. Everyone with a wallet can create or contribute to a funding"
        />
        <link rel="icon" href="/favicon.ico" />
        {/* <link rel="manifest" href="/manifest.json" /> */}
        {/* <meta name="theme-color" content="#dfb59c" /> */}
        {/* <link rel="apple-touch-icon" href="/logo-96x96.png" /> */}
        {/* <meta name="apple-mobile-web-app-status-bar" content="#dfb59c" /> */}
      </Head>

      <Hero />

      <Footer />
    </div>
  )
}

export default Home
