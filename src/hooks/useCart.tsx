import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
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
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      console.log(storagedCart);
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const response = await api.get(`products/${productId}`);
      const newProduct = response.data;

      const productAlreadyExists = cart.findIndex((product) => {
        return product.id === newProduct.id;
      });

      if (productAlreadyExists >= 0) {
        const response = await api.get(`stock/${productId}`);
        const newProductStock = response.data.amount;

        if (cart[productAlreadyExists].amount === newProductStock) {
          //toast.error('Quantidade solicitada fora de estoque');
          throw 'Quantidade solicitada fora de estoque';
        } else {
          const updatedCart = cart.map((product) => {
            return product.id === newProduct.id
              ? { ...product, amount: product.amount + 1 }
              : product;
          });

          setCart(updatedCart);
        }
      } else {
        newProduct.amount = 1;
        setCart([...cart, newProduct]);
      }
    } catch (err) {
      if (err) {
        toast.error(err);
      } else {
        toast.error('Erro na adição do produto');
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
    console.log(cart);
  }, [cart]);

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
      const newProductStockresponse = await api.get(`stock/${productId}`);
      const newProductStock = newProductStockresponse.data.amount;
      
      if(amount > newProductStock) {
        throw 'Quantidade solicitada fora de estoque';
      }
      else {
        const cartUpdated = cart.map((product) => {
          return product.id === productId ? {...product, amount} : product
        });

        setCart(cartUpdated);
      }

    } catch (err) {
      toast.error(err);
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
