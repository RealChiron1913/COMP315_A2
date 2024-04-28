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

  // ===== Hooks =====
  useEffect(() => {
    updateSearchedProducts();
  }, [sortOrder, searchTerm, inStock]);



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
    // 过滤列表
    let filteredProducts = itemList.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const inStockCheck = !inStock || (inStock && product.quantity > 0);
      return matchesSearch && inStockCheck;
    });
  
    const sortedProducts = sort(filteredProducts, sortOrder);
  
    setSearchedProducts(sortedProducts);
  
    const resultsCount = sortedProducts.length;
    let resultsText = '';
    if (searchTerm === '') {
      if (resultsCount === 1) {
        resultsText = '1product';
      }else{
        resultsText = `${resultsCount}products`;
      }
    }
    else{
      if (resultsCount === 1) {
        resultsText = '1result';
      }else if(resultsCount !== 0){
        resultsText = `${resultsCount}results`;
      }
      else{
        resultsText = 'Nosearchresultsfound';
      }
    }
    setResultsIndicator(resultsText);
  }

  function setResultsIndicator(text: string) {
    const resultsIndicator = document.getElementById('results-indicator');
    if (resultsIndicator !== null) {
      resultsIndicator.innerText = text;
    }
  }


  function sort(products: Product[], sortOrder: string) {
    console.log(sortOrder);
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
          <p>Your basket is empty</p>
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
      <ProductList itemList={searchedProducts} />
    </div>
    </>
  )

}

export default App
