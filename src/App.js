import React, { useEffect, useState } from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase, ref, set, child, get } from "firebase/database";

export default function App() {
  const getUserFromLS = () => {
    const found = localStorage.getItem('shop_user')
    if (found) {
      return JSON.parse(found)
    }
    return {}
  };


  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({size: 0})
  const [user, setUser] = useState(getUserFromLS())


  const getProducts = async () => {
    const res = await fetch('https://api.stripe.com/v1/products', {
      method: "GET",
      headers: { Authorization: `Bearer sk_test_51LaSpGAOPmNTqh49ym0T8zsBS31YhIt9tXSPkODHp50B2iUSTYs98TOG59hQFGWZYg884LqQKhdhE9pnAQ75V0UF00hit063Z6` }
    });
    const data = await res.json();
    console.log(data)
    setProducts(data.data)
  };

  useEffect(() => {
    getProducts()
  }, [])


  const showProducts = () => {
    return products.map(p => (
      <div key={p.id} style={{width: '18rem', border: '1px solid grey'}}>
        <h1>{p.name}</h1>
        <p>{p.description}</p>
        <button onClick={()=>{addToCart(p)}}>Add To Cart</button>
      </div>
    ))
  }

  const addToDB = (cart) => {
    const db = getDatabase();
    set(ref(db, `/carts/${user.uid}`), cart)
  }

  const addToCart = (item) => {
    const newCart = {...cart}
    if (item.id in newCart) {
      newCart[item.id].quantity ++
    }
    else {
      newCart[item.id] = item
      newCart[item.id].quantity = 1 
    }
    newCart.size ++
    setCart(newCart)
    if (user.uid){
      addToDB(newCart)
    }
  }

  const getCart = async (user) => {
    const dbRef = ref(getDatabase())
    const snapshot = await get(child(dbRef, `/carts/${user.uid}`))
    if (snapshot.exists()) {
      setCart(snapshot.val())
    }
    else {
      setCart({size:0})
    }
  }

  useEffect(()=>{getCart(user)}, [user])
  

  const createPopup = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user;
    localStorage.setItem('shop_user', JSON.stringify(user))
    setUser(user)
  }

  const addInput = () => {
    return Object.keys(cart).map(key=>(
      (key!=='size'? <input key={key} hidden name={cart[key].default_price} defaultValue={cart[key].quantity}/>:'')
    ))
  }


  return (

    <div>
      <h1>{user.uid?user.displayName:"GUEST"} | {cart.size}</h1>
      <div style={{display: 'flex'}}>
        {showProducts()}
      </div>

      {user.uid
      ?
      <button onClick={()=>{setUser({}); localStorage.removeItem('shop_user')}}>Log Out</button>
      :
      <button onClick={()=>{createPopup()}}>Sign in with Google</button>
      }
      <form action='http://localhost:5000/stripe-checkout' method='POST'>
        {addInput()}
        <button>Check Out</button>
      </form>
    </div>
  )
}
