import Footer from '../components/molecules/footer/footer'
import Head from 'next/head'
import Hero from '../components/molecules/hero/hero'
import Image from 'next/image'
import type { NextPage } from 'next'
import algosdk from 'algosdk'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const atoken = {
    'X-API-Key': process.env.NEXT_PUBLIC_API_TOKEN,
  }
  const aserver = 'https://testnet-algorand.api.purestake.io/ps2'
  const aport = ''

  useEffect(() => {
    const algodclient = new algosdk.Algodv2(atoken, aserver, aport)

    ;(async () => {
      const lastround = (await algodclient.status().do())['last-round']
      const block = await algodclient.block(lastround).do()

      const textedJson = JSON.stringify(block, undefined, 4)
      console.log(textedJson)

      console.log(block)
    })().catch((e) => {
      console.log(e)
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>PoP! Crowdfunding</title>
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
