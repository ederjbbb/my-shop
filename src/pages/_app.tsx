import { AppProps } from "next/app"
import { globalStyles } from "../styles/global"
import logo from '../assets/logo.svg'
import { Container, Header } from "../styles/pages/app"
import Image from 'next/future/image'

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  

  return(
    <>
    
    <Container>
      <Header>
      <Image
      src={logo}
      alt="Picture of the author"
    />
      </Header>
    </Container>
      <Component {...pageProps} />
    </>
  )
   
}

 
