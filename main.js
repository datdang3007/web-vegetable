import productsDB from './products.json' assert {type: 'json'};

const products = document.querySelector(".products")
const items = document.querySelector(".items")
const total = document.querySelector(".total")
const modalWrapper = document.querySelector(".modal-wrapper")
const cartIcon = document.querySelector(".cart-icon")
const cartPreviewItems = document.querySelector(".cart-preview-items")
const cartPreview = document.querySelector(".cart-preview")
const searchInput = document.querySelector(".search-input")
const checkOut = document.querySelector(".checkout")
const productInCart = []
let productRemove = []

function renderProducts(list) {
    let listString = ""
    for (const todo of list) {
        listString += `
            <div class="product">
                <div class="image">
                    <img src=${todo.image} alt="">
                </div>
                <h4>${todo.name}</h4>
                <div class="price-items f-center-center">
                    <p class="price">${todo.price}</p>
                </div>
                <div class="stepper-input">
                    <a class="decrement" href="#">–</a>
                    <input type="number" class="quantity" value="1">
                    <a class="increment" href="#">+</a>
                </div>
                <div class="product-action">
                    <button class="btn-addToCart">ADD TO CART</button>
                </div>
            </div>
        `
    }
    products.innerHTML = listString
}

function updateRenderProducts(list) {
    let listString = ""
    for (const todo of list) {
        listString += `
            <div class="product">
                <div class="image">
                    <img src=${todo.image} alt=${todo.name}>
                </div>
                <h4>${todo.name}</h4>
                <div class="price-items f-center-center">
                    <p class="price">${todo.price}</p>
                </div>
                <div class="stepper-input">
                    <a class="decrement" href="#">–</a>
                    <input type="number" class="quantity" value="${todo.quantity}">
                    <a class="increment" href="#">+</a>
                </div>
                <div class="product-action">
                    <button class="btn-addToCart">ADD TO CART</button>
                </div>
            </div>
        `
    }
    products.innerHTML = listString
}

renderProducts(productsDB)
var product = document.querySelectorAll(".product")
productEvent()
 
function renderCart(list) {
    let listString = `<ul class="cart-items">`
    for (const todo of list) {
        listString += `
            <li class="cart-item">
                <img class="product-image" src=${todo.image}>
                <div class="product-info">
                    <p class="product-name">${todo.name}</p>
                    <p class="product-price">${todo.price}</p>
                </div>
                <div class="product-total">
                    <p class="quantity">${todo.quantity} Nos. </p>
                    <p class="amount">${+todo.price * todo.quantity}</p>
                </div>
                <a class="product-remove" href="#">×</a>
            </li>
        `
    }
    cartPreviewItems.innerHTML = listString + "</ul>"
}

searchInput.addEventListener("input", function(e) {
    e.preventDefault()
    const searchValue = searchInput.value.toLowerCase()
    let flag = false
    if (e.target.value) {
        let searchProducts = []
        for (const prd of productsDB) {
            const itemLowerName = prd.name.split("- 1 Kg")[0].split("- 1/4 Kg")[0].toLowerCase()
            if (itemLowerName.indexOf(searchValue) !== -1) {
                flag = true
                product.forEach(element => {
                    if (element.children[1].textContent.split("- 1 Kg")[0].split("- 1/4 Kg")[0] === prd.name.split("- 1 Kg")[0].split("- 1/4 Kg")[0]) {
                        prd["quantity"] = element.children[3].children[1].value
                    }
                })
                searchProducts.push(prd)
            }
        }
        if (flag) {
            updateRenderProducts(searchProducts)
            product = document.querySelectorAll(".product")
            productEvent()
        } else {
            products.innerHTML = `
                <div class="no-results">
                    <img src="https://res.cloudinary.com/sivadass/image/upload/v1494699523/icons/bare-tree.png" alt="Empty Tree">
                    <h2>Sorry, no products matched your search!</h2>
                    <p>Enter a different keyword and try.</p>
                </div>
            `
        }
    } else if (e.target.value === "") {
        flag = false
        updateRenderProducts(productsDB)
        product = document.querySelectorAll(".product")
        productEvent()
    }
})

function productEvent () {
    product.forEach(element => {
        const decrement = element.querySelector(".decrement")
        const increment = element.querySelector(".increment")
        const buttonAddToCart = element.querySelector(".btn-addToCart")
        const quantity =element.querySelector(".quantity")
        const image = element.querySelector("img")

        // Khi input vào ô quantity mà value bé hơn 1 thì sẽ set về 1
        quantity.addEventListener("input", function(e) {
            if(e.target.value) {
                if(e.target.value <= 0) {
                    alert("isvalid value!")
                    e.target.value = 1
                }
            }
        })
    
        // tăng giảm số lượng hàng (khi giảm thì ko thể giảm số lượng xuống thấp hơn 1)
        decrement.addEventListener("click", function(e) {
            e.preventDefault()
            if (quantity.value > 1) {
                quantity.value--
            }
        })
        increment.addEventListener("click", function(e) {
            e.preventDefault()
            quantity.value++
        })
    
        // nút mua hàng khi click sẽ tăng items lên 1 nếu mặt hàng đó đc mua lần đầu, tổng số tiền phải trả sẽ bằng số lượng hàng mua nhân giá tiền của sản phẩm
        buttonAddToCart.addEventListener("click", function(e) {
            e.preventDefault()
            total.textContent = +total.textContent + quantity.value * +element.querySelector(".price").textContent
            buttonAddToCart.textContent = "✔ ADDED"
            buttonAddToCart.classList.add("added");
            const item = {
                name: element.children[1].textContent,
                price: element.children[2].children[0].textContent,
                image: element.children[0].children[0].src,
                quantity: quantity.value,
            };
            if (productInCart[0]){
                let flag = 0
                productInCart.filter(val => {
                    if (val.name === element.children[1].textContent){
                        flag = 1
                        val.quantity = +val.quantity + +quantity.value
                    }
                })
                if (!flag) {
                    productInCart.push(item)
                }
            } else {
                productInCart.push(item)
            }
            items.textContent = productInCart.length
            renderCart(productInCart)
            productRemove = document.querySelectorAll(".product-remove")
            productRemove.forEach(btnRemoveProduct => {
                btnRemoveProduct.addEventListener("click", function(e) {
                    e.preventDefault()
                    total.textContent = +total.textContent - +e.path[1].children[2].children[1].textContent
                    e.path[1].parentNode.removeChild(e.path[1]);
                    productInCart.length--
                    items.textContent = productInCart.length
                    if (!productInCart.length) {
                        checkOut.classList.add("disabled")
                        cartPreviewItems.innerHTML = `
                            <div class="empty-cart">
                                <img src="https://res.cloudinary.com/sivadass/image/upload/v1495427934/icons/empty-cart.png" alt="empty-cart">
                                <h2>You cart is empty!</h2>
                            </div>
                        `
                    }
                })
            })
            if (productInCart.length) {
                checkOut.classList.remove("disabled")
            } else {
                checkOut.classList.add("disabled")
            }
            cartIcon.querySelector("img").classList.add("shake")
            setTimeout(function(){
                cartIcon.querySelector("img").classList.remove("shake")
            }, 200);
            setTimeout(function(){
                buttonAddToCart.textContent = "ADD TO CART"
                buttonAddToCart.classList.remove("added");
            }, 3500);
        })
    
        image.addEventListener("click", function(e) {
            e.preventDefault()
            modalWrapper.classList.add("active");
            const quickView = document.querySelector(".quick-view")
            const idx = productsDB.findIndex(val => val.image === image.src)
            quickView.innerHTML = `
                <div class="quickview-image">
                    <img src=${productsDB[idx].image} alt=${productsDB[idx].name}>
                </div>
                <div class="quickview-details">
                    <span class="product-name">${productsDB[idx].name}</span>
                    <span class="product-price">${productsDB[idx].price}</span>
                </div>
            `
            const modal = document.querySelector(".modal-wrapper")
            modal.addEventListener("click", function(e) {
                if(e.target === modal) {
                    modalWrapper.classList.remove("active");
                }
            })
            const btnClose = document.querySelector(".close")
            btnClose.addEventListener("click", function(event) {
                event.preventDefault()
                modalWrapper.classList.remove("active");
            })
        })
    })
}

// khi bấm vào icon giỏ hàng sẽ xổ ra các mặt hàng trong giỏ (nếu không có thì sẽ làm empty)
let hide = false
let clicked = false
cartIcon.addEventListener("click", function(e) {
    e.preventDefault()
    if (clicked) {
        clicked = false
        return
    }
    if (!hide) {
        hide = true
        cartPreview.classList.add("active")
    }
})

document.addEventListener("mousedown", (event) => {
    if (hide) {
        if (cartIcon.contains(event.target)) {
            hide = false
            clicked = true
            cartPreview.classList.remove("active")
        } else if (!cartPreview.contains(event.target)) {
            hide = false
            cartPreview.classList.remove("active")
        }
    }
});