import Link from "next/link";
import { ImageContainer, SuccessContainer } from "../styles/pages/success";
import {GetServerSideProps } from 'next';
import { stripe } from "../lib/stripe";
import Stripe from "stripe";
import Image from "next/future/image";


interface SuccessProps {
        customerName: string;
        product : {
            name: string;
            image: string;
        }
}
export default function Success({product, customerName}: SuccessProps){
    return (
        <SuccessContainer>
            <h1>Compra efetuada com sucesso</h1>
            <ImageContainer>
                <Image
                    src={product.image}  width={120} height={110} alt=''
                />
            </ImageContainer>
        <p>Uhuu <strong>{customerName}</strong>, sua <strong>{product.name}</strong> ja esta a caminho da sua casa.</p>
        <Link href='/' >
           Voltar ao catalogo
        </Link>
        </SuccessContainer>
    )
}

export const getServerSideProps: GetServerSideProps =  async ({query, params}) =>{

    const sessionId = String(query.session_id);

    const session = await stripe.checkout.sessions.retrieve(sessionId,{
        expand: ['line_items', 'line_items.data.price.product']
    })

    const product = session.line_items.data[0].price.product as Stripe.Product
    const customerName = session.customer_details.name


    return{
        props:{
            customerName,
            product:{
                name: product.name,
                image: product.images[0]
            }
        }
    }
}