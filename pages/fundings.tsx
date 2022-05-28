import Head from 'next/head'
import React from 'react'
import Footer from '../components/molecules/footer/footer'
import FundingsHero from '../components/molecules/fundingsHero/fundingsHero'
import NavBar from '../components/molecules/navBar/navBar'

const Fundings = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 text-brown">
      <Head>
        <title>PoP! Fundings</title>
      </Head>
      <NavBar />
      <FundingsHero />

      <Footer />
    </div>
  )
}

export default Fundings
