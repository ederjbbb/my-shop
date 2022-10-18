import { HomeContainer, Product } from "../styles/pages/home"
import t1 from '../assets/tshirts/t1.png'
import t2 from '../assets/tshirts/t2.png'
import t3 from '../assets/tshirts/t3.png'
import Image from 'next/image'

import { useKeenSlider } from 'keen-slider/react'
import { stripe } from "../lib/stripe"
import { GetServerSideProps } from "next"
import Stripe from "stripe"



interface HomeProps {
  products :{
    id: string,
    name: string,
    imageUrl: string,
    price: number,
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
    <HomeContainer ref={sliderRef} className='keen-slider'>
      {
        products.map(product => {
          return (
            <Product className="keen-slider__slide" key={product.id}>
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
          )
        })
      }
      
      
    </HomeContainer>
   
  )
}

export const getServerSideProps : GetServerSideProps = async () => {
    const response = await stripe.products.list({
      expand: ['data.default_price']
    });

    const products = response.data.map(product => {
      const price= product.default_price as Stripe.Price;
      return{
        id:product.id,
        name:product.name,
        imageUrl: product.images,
        price: price.unit_amount / 100,
        description: product.description,

      }
    })

    console.log(response.data)
  return{
    props :{
      products,
    }
  }
}
