type ContentAreaProps = {
    itemList: Product[];
}

type Product = {
    id: number;
    name: string;
    price: number;
    category: string;
    quantity: number;
    rating: number;
    image_link: string;
}



export const ProductList = ({ itemList }: ContentAreaProps) => {
    return (
        <div id="productList">
            {itemList.map((item) => (
                <div key={item.id} className="product">
                    <div className="product-top-bar">
                        <h2>{item.name}</h2>
                        <p>£{item.price.toFixed(2)} ({item.rating}/5)</p>
                    </div>
                    <img src={`./src/Assets/Product_Images/${item.image_link}`} alt={item.name}></img>
                    {item.quantity > 0 ? (
                        <button value={item.id}>Add to basket</button>
                    ) : (
                        <button disabled={true}>Out of stock</button>
                    )}
                </div>
            ))}
        </div>
    );
}
