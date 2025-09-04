import React, { useContext } from 'react'
import StylistProductsContext from '../Context/StylistProductsContext';
import { useParams } from 'react-router-dom';
import { Breadcrum } from '../components/Breadcrum/Breadcrum';
import { ProductDisplay } from '../components/ProductDisplay/ProductDisplay';

export const Product = () => {
    const {collections_data} = useContext(StylistProductsContext);
    const {productId} = useParams();
    const product = collections_data.find((e)=> e.id === Number(productId))
    if (!product) {
      return <div>Product not found</div>;
    }
  return (
    <div>
        <Breadcrum product={product}/>
        <ProductDisplay product={product}/>
    </div>
  )
}
