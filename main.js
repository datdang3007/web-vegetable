import productsDB from './products.json' assert {type: 'json'};

const products = document.querySelector(".products")
const items = document.querySelector(".items")
const total = document.querySelector(".total")
const modalWrapper = document.querySelector(".modal-wrapper")
const cartIcon = document.querySelector(".cart-icon")
const cartPreviewItems = document.querySelector(".cart-preview-items")
const searchInput = document.querySelector(".search-input")
const btnSearch = document.querySelector(".search")
const checkOut = document.querySelector(".checkout")
const productInCart = []
let productRemove = []

btnSearch.addEventListener("click", function(e) {
    e.preventDefault()
    let searchProducts = []
    for (const prd of productsDB) {
        const itemBasicName = prd.name.split("- 1 Kg")[0].split("- 1/4 Kg")[0].toLowerCase().split("")
        const itemName = prd.name.split("- 1 Kg")[0].split("- 1/4 Kg")[0].split("")
        let correctly = 0
        for (const srch of searchInput.value.split("")) {
            if (itemName.includes(srch) || itemBasicName.includes(srch)) {
                correctly++
                if (!searchProducts.includes(prd) && correctly === searchInput.value.split("").length) {
                    searchProducts.push(prd)
                }
            }
        }
    }
    if (!searchProducts[0]) {
        renderProducts(productsDB)
        return
    }
    renderProducts(searchProducts)
})

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

renderProducts(productsDB)

const product = document.querySelectorAll(".product")

product.forEach(element => {
    const decrement = element.querySelector(".decrement")
    const increment = element.querySelector(".increment")
    const buttonAddToCart = element.querySelector(".btn-addToCart")
    const image = element.querySelector("img")

    // tăng giảm số lượng hàng (khi giảm thì ko thể giảm số lượng xuống thấp hơn 1)
    decrement.addEventListener("click", function(e) {
        e.preventDefault()
        if (element.querySelector(".quantity").value > 1) {
            element.querySelector(".quantity").value--
        }
    })
    increment.addEventListener("click", function(e) {
        e.preventDefault()
        element.querySelector(".quantity").value++
    })

    // nút mua hàng khi click sẽ tăng items lên 1 nếu mặt hàng đó đc mua lần đầu, tổng số tiền phải trả sẽ bằng số lượng hàng mua nhân giá tiền của sản phẩm
    buttonAddToCart.addEventListener("click", function(e) {
        e.preventDefault()
        total.textContent = +total.textContent + element.querySelector(".quantity").value * +element.querySelector(".price").textContent
        buttonAddToCart.textContent = "✔ ADDED"
        buttonAddToCart.classList.add("added");
        const item = {
            name: element.children[1].textContent,
            price: element.children[2].children[0].textContent,
            image: element.children[0].children[0].src,
            quantity: element.querySelector(".quantity").value,
        };
        if (productInCart[0]){
            let flag = 0
            productInCart.filter(val => {
                if (val.name === element.children[1].textContent){
                    flag = 1
                    val.quantity = +val.quantity + +element.querySelector(".quantity").value
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
        const btnClose = document.querySelector(".close")
        btnClose.addEventListener("click", function(event) {
            event.preventDefault()
            modalWrapper.classList.remove("active");
        })
    })
})

// khi bấm vào icon giỏ hàng sẽ xổ ra các mặt hàng trong giỏ (nếu không có thì sẽ làm empty)
let clicked = false
cartIcon.addEventListener("click", function(e) {
    e.preventDefault()
    const cartPreview = document.querySelector(".cart-preview")
    if (!clicked) {
        clicked = true
        cartPreview.classList.add("active")
    } else if (clicked) {
        clicked = false
        cartPreview.classList.remove("active")
    }
})