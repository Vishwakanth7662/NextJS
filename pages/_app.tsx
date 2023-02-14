import '../styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery'
import 'popper.js'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Header from '../components/shared/header'
import Footer from '../components/shared/footer'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js" integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB" crossOrigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossOrigin="anonymous"></script>
      </Head>
      <div className="d-flex flex-column h-100">
        <Header />
        <Component {...pageProps} />
        <div className="align-self-end w-100">
          <Footer />
        </div>

      </div>

    </>

  )
}
