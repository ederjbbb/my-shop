import axios from 'axios';
import {  GetStaticPaths, GetStaticProps, } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Stripe from 'stripe';
import { stripe } from '../../lib/stripe';
import { ImageContainer, ProductContainer, ProductDetails } from '../../styles/pages/product';

interface ProductProps {
    product: {
        id:string,
        name:string,
        imageUrl: string,
        price: string,
        description: string,
        defaultPriceid: string,

    }
    
}

export const getStaticPaths: GetStaticPaths = async () => {

    
    return{
        paths:[
            {params: {id: 'prod_Mdb33r1d6aL0iS'}},
        ],
        fallback: true
    }
}

export default function Product({product}: ProductProps){
    const [isCreatingCheckoutSession, setisCreatingCheckoutSession] = useState(false)

    async function handleBuyProduct (){
        try{

            setisCreatingCheckoutSession(true)

            const response = await axios.post('/api/checkoutSession',{
                priceId: product.defaultPriceid
              
            })
           
            const {checkoutUrl} = response.data;
            window.location.href = checkoutUrl;
        }catch(err){
            // connect to a observer lib , (Datadog orSentry)

            setisCreatingCheckoutSession(false)

            alert('Nao foi fossivel redirecionar ')
        }
    }

    const { isFallback} = useRouter()
    if(isFallback){
        return(
            <p>Loding</p>
        )
    }
    return(
        <ProductContainer>
            <ImageContainer>
                <img src={product.imageUrl} alt={''} width={520} height={480}/>
            </ImageContainer>
            <ProductDetails>
                <h1>{product.name}</h1>
                <span>{product.price}</span>
                <p>{product.description}</p>
                <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>Comprar agora</button>
            </ProductDetails>
        </ProductContainer>
    )
}

export  const  getStaticProps: GetStaticProps<any, {id: string}> = async ({params})  =>{
    const productId = params.id;
    
    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price']
    })

    const price= product.default_price as Stripe.Price;
      
    
    
    return {
        props :{
            product:{
                id:product.id,
                name:product.name,
                imageUrl: product.images,
                price: new Intl.NumberFormat('pt-BR',{
                style: 'currency',
                currency: 'BRL',
                }).format(price.unit_amount / 100,),
                description: product.description,
                defaultPriceid: price.id,
          
              }
        },
    }
}