import { useState, useEffect } from 'react'
import { ProductList } from './Components/ProductList'
import itemList from './Assets/random_products_175.json';
import './e-commerce-stylesheet.css'

type Product = {
  id: number
  name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

function App() {
  const originalProducts = itemList;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(sort(originalProducts, 'AtoZ'));
  const [sortOrder, setSortOrder] = useState<string>('AtoZ');
  const [inStock, setInStock] = useState<boolean>(false);
  const [BasketItems, setBasketItems] = useState<Product[]>([]);

  // ===== Hooks =====
  useEffect(() => {
    updateSearchedProducts();
  }, [sortOrder, searchTerm, inStock]);
  useEffect(() => {
    console.log(BasketItems);
    updateBasketArea();
  }, [BasketItems]);



  // ===== Basket management =====
  function showBasket() {
    let areaObject = document.getElementById('shopping-area');
    if (areaObject !== null) {
      areaObject.style.display = 'block';
    }
  }

  function hideBasket() {
    let areaObject = document.getElementById('shopping-area');
    if (areaObject !== null) {
      areaObject.style.display = 'none';
    }
  }

  // ===== Search =====
  function updateSearchedProducts() {
    let filteredProducts = itemList.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const inStockCheck = !inStock || (inStock && product.quantity > 0);
      return matchesSearch && inStockCheck;
    });

    const sortedProducts = sort(filteredProducts, sortOrder);

    setSearchedProducts(sortedProducts);

    updateResultsIndicator(sortedProducts.length, searchTerm);
  }

  function updateResultsIndicator(resultsCount: number, search: string) {
    const resultsIndicator = document.getElementById('results-indicator');
    let resultsText = resultsCount === 1 ? '1 result' : `${resultsCount} results`;
    if (search === '') {
      resultsText = resultsCount === 1 ? '1 product' : `${resultsCount} products`;
    } else if (resultsCount === 0) {
      resultsText = 'No search results found';
    }
    if (resultsIndicator) {
      resultsIndicator.innerText = resultsText;
    }
  }


  function sort(products: Product[], sortOrder: string) {
    switch (sortOrder) {
      case 'AtoZ':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'ZtoA':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case '£LtoH':
        products.sort((a, b) => a.price - b.price);
        break;
      case '£HtoL':
        products.sort((a, b) => b.price - a.price);
        break;
      case '*LtoH':
        products.sort((a, b) => a.rating - b.rating);
        break;
      case '*HtoL':
        products.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return products;
  }


  function addToBasket(product: Product) {
    console.log('Adding to basket:', product)
    setBasketItems(currentItems => {
      const itemExists = currentItems.find(item => item.id === product.id);
      if (itemExists) {
        return currentItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...currentItems, { ...product, quantity: 1 }];
      }
    });
    console.log(BasketItems);
  }


  function updateBasketArea() {
    const shoppingArea = document.getElementById('basket-products-area');

    if (shoppingArea !== null) {
      shoppingArea.innerHTML = '';

      if (BasketItems.length === 0) {
        shoppingArea.innerHTML = '<p>Your basket is empty</p>';
      } else {
        BasketItems.forEach(item => {
          const shoppingRow = document.createElement('div');
          shoppingRow.className = 'shopping-row';

          // [P roductname]([P roductprice]) − [P roductquantity]
          const shoppingInformation = document.createElement('div');
          shoppingInformation.className = 'shopping-information';
          shoppingInformation.innerText = `${item.name} (£${item.price}) - ${item.quantity}`;

          const removeButton = document.createElement('button');
          removeButton.innerText = 'Remove';
          removeButton.onclick = () => removeFromBasket(item);


          shoppingRow.appendChild(shoppingInformation);
          shoppingRow.appendChild(removeButton);
          shoppingArea.appendChild(shoppingRow);
        });
      }
      // At the bottom of the shopping −area div should be a paragraph tag with the total cost of the shopping
      // basket. This should be in the form of T otal : [T otalbasketcost]. This value should be shown to 2 decimal places.
      const totalCost = BasketItems.reduce((total, item) => total + item.price * item.quantity, 0);
      const totalCostParagraph = document.createElement('p');
      totalCostParagraph.innerText = `Total: £${totalCost.toFixed(2)}`;
      shoppingArea.appendChild(totalCostParagraph);
    }
  }

  function removeFromBasket(product: Product) {
    console.log('Removing from basket:', product)
    setBasketItems(currentItems => {
      const itemExists = currentItems.find(item => item.id === product.id);
      if (itemExists) {
        if (itemExists.quantity > 1) {
          return currentItems.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
          );
        } else {
          return currentItems.filter(item => item.id !== product.id);
        }
      } else {
        return currentItems;
      }
    });
    console.log(BasketItems);
  }



  return (
    <><div id="container">
      <div id="logo-bar">
        <div id="logo-area">
          <img src="./src/assets/logo.png"></img>
        </div>
        <div id="shopping-icon-area">
          <img id="shopping-icon" onClick={showBasket} src="./src/assets/shopping-basket.png"></img>
        </div>
        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={hideBasket}>x</p>
          </div>
          <div id="basket-products-area">
            <p>Your basket is empty</p>
          </div>
        </div>
      </div>
      <div id="search-bar">
        <input type="text" placeholder="Search..." onChange={changeEventObject => setSearchTerm(changeEventObject.target.value)}></input>
        <div id="control-area">
          <select onChange={(e) => setSortOrder(e.target.value)}>
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>
          <input id="inStock" type="checkbox" onChange={(e) => setInStock(e.target.checked)}></input>
          <label htmlFor="inStock">In stock</label>
        </div>
      </div>
      <p id="results-indicator"></p>
      <ProductList itemList={searchedProducts} onAddToBasket={addToBasket} />
    </div>
    </>
  )

}

export default App
