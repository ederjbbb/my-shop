import { HomeContainer, Product } from "../styles/pages/home"
import  Link from "next/link"
import Image from 'next/image'

import { useKeenSlider } from 'keen-slider/react'
import { stripe } from "../lib/stripe"
import {  GetStaticProps } from "next"
import Stripe from "stripe"
import  Head from 'next/head';




interface HomeProps {
  products :{
    id: string,
    name: string,
    imageUrl: string,
    price: string,
    description: string,
  }[]
}

export default function Home({products}: HomeProps) {

  const [sliderRef] = useKeenSlider({
    slides:{
      perView: 3,
      spacing: 48,
      
    }
  })
  return (
    <>
     <Head>
        <title>Home Shop</title>
      </Head>
    <HomeContainer ref={sliderRef} className='keen-slider'>
     
      {
        products.map(product => {
          return (
            <Link key={product.id} href={`/product/${product.id}`}>
               <Product className="keen-slider__slide" >
          <img 
          
          src={product.imageUrl} 
          alt="" 
          width={520} 
          height={480} 
        
          /> 
          <footer>
            <strong>{product.name}</strong>  
            <span>{product.price}</span>
          </footer>  
          
      </Product>
            </Link>
           
          )
        })
      }
      
      
    </HomeContainer>
    </>
    
   
  )
}



export const getStaticProps : GetStaticProps = async () => {
    const response = await stripe.products.list({
      expand: ['data.default_price']
    });

    const products = response.data.map(product => {
      const price= product.default_price as Stripe.Price;

      return{
        id:product.id,
        name:product.name,
        imageUrl: product.images,
        price: new Intl.NumberFormat('pt-BR',{
          style: 'currency',
          currency: 'BRL',
        }).format(price.unit_amount / 100,),
        description: product.description,

      }
    })

    console.log(response.data)
  return{
    props :{
      products,
    },
    revalidate: 60*60*24 // days
  }
}
