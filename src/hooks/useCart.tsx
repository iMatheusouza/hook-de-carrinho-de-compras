import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    // const storagedCart = Buscar dados do localStorage

    // if (storagedCart) {
    //   return JSON.parse(storagedCart);
    // }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      console.log(productId);
      const response = await api.get(`products/${productId}`);
      const newProduct = response.data;

      if (cart.length === 0) {
        newProduct.amount = 1;
        setCart([...cart, newProduct]);
      } else {
        const cartUpdated = cart.map((product) => {
          return newProduct.id === product.id
            ? { ...product, amount: product.amount + 1 }
            : { ...newProduct, amount: 1 };
        });
        console.log(cartUpdated);

        setCart(cartUpdated);
      }

      //Usar o setcart para adicionar o produto que chegou pela api
      //setCart();

      //Caso o produto ja esteja no carrinho, apenas aumentar seu amount;

      //Caso o produto esteja fora de estoque, usar um throw error
      if (false) {
        throw new Error();
      }
    } catch {
      //O throw error bate aqui e podemos chamar o toast de produto fora de estoque
      toast.error(`Produto fora de estoque`);
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
