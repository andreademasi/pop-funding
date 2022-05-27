import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Footer from '../components/molecules/footer/footer'
import Hero from '../components/molecules/hero/hero'

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>PoP! Crowdfunding</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />

      <Footer />
    </div>
  )
}

export default Home
