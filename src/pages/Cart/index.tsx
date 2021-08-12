import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

interface ProductFormatted extends Product {
  priceFromatted: string;
  subTotal: string;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted: ProductFormatted[] = cart.map(product => ({
    ...product, 
    priceFromatted: formatPrice(product.price),
    subTotal: formatPrice(product.price * product.amount)
  }))
  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        return sumTotal = sumTotal + (product.amount * product.price);
      }, 0)
    )

  function handleProductIncrement(product: Product) {
    const productId = product.id;
    const newAmount = product.amount +1;
    updateProductAmount({productId, amount: newAmount});
  }

  function handleProductDecrement(product: Product) {
    const productId = product.id;
    const newAmount = product.amount -1;
    updateProductAmount({productId, amount: newAmount});

  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        {cartFormatted.map(product => {
          return(
            <tbody key={product.id}>
          <tr data-testid="product">
            <td>
              <img alt={product.title} src={product.image} />
            </td>
            <td>
              <strong>{product.title}</strong>
              <span>{product.priceFromatted}</span>
            </td>
            <td>
              <div>
                <button
                  type="button"
                  data-testid="decrement-product"
                disabled={product.amount <= 1}
                onClick={() => handleProductDecrement(product)}
                >
                  <MdRemoveCircleOutline size={20} />
                </button>
                <input
                  type="text"
                  data-testid="product-amount"
                  readOnly
                  value={product.amount}
                />
                <button
                  type="button"
                  data-testid="increment-product"
                onClick={() => handleProductIncrement(product)}
                >
                  <MdAddCircleOutline size={20} />
                </button>
              </div>
            </td>
            <td>
              <strong>{product.subTotal}</strong>
            </td>
            <td>
              <button
                type="button"
                data-testid="remove-product"
                onClick={() => handleRemoveProduct(product.id)}
              >
                <MdDelete size={20} />
              </button>
            </td>
          </tr>
        </tbody>
          )
        })}
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
