
//Selecting DOM elements
let iconCart = document.querySelector('.icon-cart');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
/* const checkoutButton = document.querySelector('.checkout'); */ 

// Arrays to hold product and cart data
let listProducts = [];
let carts = [];

// Event listener for showing/hiding the cart
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
});
closeCart.addEventListener('click', () => {
    body.classList.remove('showCart')
});

//Event Listener for checking out button(just clears the cart)
/* checkoutButton.addEventListener('click', () => {
    checkout();
});

// Function to perform checkout
const checkout = () => {
    console.log("Checkout process initiated!");
    carts = [];
    addCartToHTML();
}; */


// Function to add product data to HTML
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if(listProducts.length > 0){
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id
            newProduct.innerHTML = `
            <img src="${product.image}" alt=""> 
            <h2>${product.name}</h2>
            <div class="price">R${product.price}</div> 
            <button class="addCart">
                Add To Cart
            </button>`;
        listProductHTML.appendChild(newProduct);
        })
    }
}

// Event listener for adding product to cart
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target; 
    if (positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
})


// Function to add product to cart
const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if(carts.length <= 0) {
        carts = [{
            product_id: product_id,
            quantity:1
        }]

    }else if(positionThisProductInCart < 0){
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
       carts [positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}

// Function to add cart data to HTML
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0
    if(carts.length > 0) {
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id)
            let info = listProducts[positionProduct];
            newCart.innerHTML = `
            <div class="image">
            <img src="${info.image}" alt="">
        </div>
        <div class="name">
             ${info.name}
        </div>
        <div class="totalPrice">
            R${info.price * cart.quantity}
        </div>
        <div class="quantity">
            <span class="minus"><</span>
            <span>${cart.quantity}</span>
            <span class="plus">></span>
        </div>
        `;
    listCartHTML.appendChild(newCart);
        })
    }
    iconCartSpan.innerText = totalQuantity;
}
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus'; 
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantity(product_id, type);
    }
});

// Function to initialize the application
const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity++;
                break;
            
            case 'minus':
                let valueChange = carts[positionItemInCart].quantity - 1;
                if (valueChange > 0) {
                    carts[positionItemInCart].quantity = valueChange;
                } else {
                    carts.splice(positionItemInCart, 1);
                }
                break;
        }   
    }
    addCartToMemory();
    addCartToHTML();
};

const initApp = () => {
    // get data from json
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data;
        addDataToHTML();
        
        if(localStorage.getItem('cart')){
                carts = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
        }
    })
    .catch(error => {
        console.error('Error fetching Products',error);
    });
};
initApp();






