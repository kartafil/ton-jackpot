"use client";

import Header from './components/Header';
import Search from './components/Search';
import LotteryGrid from './components/LotteryGrid';
import LotteryForm from './components/LotteryForm';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-4 lg:p-24">
        <div className="main-content z-10 w-full max-w-5xl flex flex-col items-center justify-between font-mono text-sm lg:flex lg:items-start">
          <div className="mt-16 w-full flex flex-col items-center lg:flex-row lg:justify-between">
            <h2 className="text-4xl text-emerald-500 font-semibold mb-4 lg:mb-0">NFT Lotteries:</h2>
            <Search />
          </div>
          <LotteryGrid />
        </div>
        <LotteryForm />
      </main>
        <Footer />
    </>
  );
}
