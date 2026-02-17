var cart = [];
var cart_id = null;

var products = [];
$(document).ready(function () {
    if (localStorage.getItem('cart_id') !== null) {
        cart_id = localStorage.getItem('cart_id');
        $.ajax({
            url: "http://localhost:8080/cart/" + cart_id,
            type: "GET",
            contentType: "application/json",
            data: JSON.stringify({
            }),

            success: function (res) {
                console.log("Respuesta del servidor:", res);
                cart = res.productos
                updateCartUI();
            },

            error: function (error) {
                console.log("Ocurrió un error:", error);
            }
        });
    } else {
        $.ajax({
            url: "http://localhost:8080/cart",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
            }),

            success: function (res) {
                console.log("Respuesta del servidor:", res);
                if (res._id) {
                    localStorage.setItem('cart_id', res._id);
                    cart_id = localStorage.getItem('cart_id'); 
                }
                else console.log("Error en la creacion del carrito");
                updateCartUI();
            },

            error: function (error) {
                console.log("Ocurrió un error:", error);
            }
        });
    }
    
    // carga de productos
    $.ajax({
        url: "http://localhost:8080/product/",
        type: "GET",
        contentType: "application/json",
        data: JSON.stringify({
        }),

        success: function (res) {
            console.log("Respuesta del servidor:", res);
            if (res.payload) {
                products = res.payload.map(p => ({
                    id: p._id,
                    name: p.nombre,
                    category: p.categoria,
                    price: p.precio,
                    img: "https://placehold.co/400x300"
                }));   
            }
            // Initial render
            renderProducts(products);
        },

        error: function (error) {
            console.log("Ocurrió un error:", error);
        }
    });

    //localStorage.getItem('cart_id');

});




// Cart state


async function addToCart(productId) {
    //console.log(productId);
    //var product = products.find(function(p) { return p._id === productId; });
    //if (!product) return;

    /*var existing = cart.find(function(item) { return item.id === productId; });
    if (existing) {
    existing.qty += 1;
    } else {
    cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });
    }*/
 
    await $.ajax({
        url: "http://localhost:8080/cart/" + cart_id + "/product/" + productId,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
        }),

        success: function (res) {
            console.log("Respuesta del servidor:", res);
        },

        error: function (error) {
            console.log("Ocurrió un error:", error);
        }
    });

    cart = await getCartData(cart_id);
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(function(item) { return item.id !== productId; });
    updateCartUI();
}

function changeQty(productId, delta) {
    var item = cart.find(function(i) { return i.id === productId; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
    removeFromCart(productId);
    return;
    }
    updateCartUI();
}

function clearCart() {
    cart = [];
    $.ajax({
        url: "http://localhost:8080/cart",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
        }),

        success: function (res) {
            //console.log("Respuesta del servidor:", res);
            if (res._id) {
                localStorage.setItem('cart_id', res._id);
                cart_id = localStorage.getItem('cart_id'); 
            }
            else console.log("Error en la creacion del carrito");
            updateCartUI();
        },

        error: function (error) {
            console.log("Ocurrió un error:", error);
        }
    });
    updateCartUI();
}

function updateCartUI() {
    var badge = document.getElementById("cartBadge");
    var cartEmpty = document.getElementById("cartEmpty");
    var cartItems = document.getElementById("cartItems");
    var cartFooter = document.getElementById("cartFooter");
    var cartTotal = document.getElementById("cartTotal");

    var totalItems = cart.reduce(function(sum, item) { return sum + item.cantidad; }, 0);
    badge.textContent = totalItems;

    if (cart.length === 0) {
        cartEmpty.style.display = "block";
        cartItems.innerHTML = "";
        cartFooter.style.display = "none";
        return;
    }

    cartEmpty.style.display = "none";
    cartFooter.style.display = "block";

    var total = 0;
    var html = "";
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var lineTotal = item.producto.precio * item.cantidad;
        total += lineTotal;
        html += '<div class="d-flex align-items-start gap-3 p-3 border-bottom">';
        html += '  <img src="https://placehold.co/50x50" alt="' + item.producto.nombre + '" style="width:56px;height:56px;object-fit:cover;border-radius:.375rem;background:var(--surface);">';
        html += '  <div class="flex-grow-1">';
        html += '    <h6 class="mb-0 fw-semibold" style="font-size:.875rem;">' + item.producto.nombre + '</h6>';
        html += '    <span style="font-size:.8rem;color:var(--text-secondary);">$' + item.producto.precio.toFixed(2) + ' each</span>';
        html += '    <div class="d-flex align-items-center gap-2 mt-1">';
        //html += '      <button class="btn btn-sm btn-outline-secondary py-0 px-1" onclick="changeQty(' + item.producto.id + ',-1)" style="font-size:.75rem;line-height:1.4;">−</button>';
        html += '      <span style="font-size:.8rem;font-weight:600;min-width:18px;text-align:center;">' + item.cantidad + '</span>';
        //html += '      <button class="btn btn-sm btn-outline-secondary py-0 px-1" onclick="changeQty(' + item.id + ',1)" style="font-size:.75rem;line-height:1.4;">+</button>';
        html += '    </div>';
        html += '  </div>';
        html += '  <div class="text-end">';
        html += '    <span class="fw-bold d-block" style="font-size:.875rem;color:var(--brand);">$' + lineTotal.toFixed(2) + '</span>';
        html += '    <button class="btn btn-sm p-0 mt-1" onclick="removeFromCart(' + item.producto.id + ')" style="color:var(--text-secondary);font-size:.75rem;" title="Remove"><i class="bi bi-trash"></i></button>';
        html += '  </div>';
        html += '</div>';
    }
    cartItems.innerHTML = html;
    cartTotal.textContent = "$" + total.toFixed(2);
}

// Sample product data
/*var products = [
    { id: 1,  name: "Wireless Headphones",    category: "electronics",  price: 79.99,  img: "https://placehold.co/400x300" },
    { id: 2,  name: "Running Shoes",          category: "sports",       price: 129.99, img: "https://placehold.co/400x300" },
    { id: 3,  name: "Cotton T-Shirt",         category: "clothing",     price: 24.99,  img: "https://placehold.co/400x300" },
    { id: 4,  name: "Desk Lamp",              category: "home",         price: 45.00,  img: "https://placehold.co/400x300" },
    { id: 5,  name: "Leather Wallet",         category: "accessories",  price: 39.99,  img: "https://placehold.co/400x300" },
    { id: 6,  name: "Smart Watch",            category: "electronics",  price: 249.99, img: "https://placehold.co/400x300" },
];*/

function renderProducts(list) {
    var grid = document.getElementById("productGrid");
    var noResults = document.getElementById("noResults");
    var resultsCount = document.getElementById("resultsCount");

    if (list.length === 0) {
    grid.innerHTML = "";
    noResults.style.display = "block";
    resultsCount.textContent = "No products found";
    return;
    }

    noResults.style.display = "none";
    resultsCount.textContent = "Showing " + list.length + " product" + (list.length !== 1 ? "s" : "");

    var html = "";
    for (var i = 0; i < list.length; i++) {
    var p = list[i];
    html += '<div class="col-sm-6 col-md-4 product-item" data-id="' + p.id + '">';
    html += '  <div class="product-card h-100">';
    html += '    <img src="' + p.img + '" alt="' + p.name + '" loading="lazy">';
    html += '    <div class="card-body d-flex flex-column">';
    html += '      <span class="product-category mb-1">' + p.category + '</span>';
    html += '      <h6 class="card-title">' + p.name + '</h6>';
    html += '      <div class="d-flex align-items-center justify-content-between mt-auto pt-2">';
    html += '        <span class="product-price">$' + p.price.toFixed(2) + '</span>';
    html += `        <button class="btn btn-sm btn-brand" onclick="addToCart('${p.id}')">Add to Cart</button>`;
    html += '      </div>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
    }
    grid.innerHTML = html;
}

function getSelectedCategories() {
    var checks = document.querySelectorAll('.form-check-input[type="checkbox"]:checked');
    var cats = [];
    for (var i = 0; i < checks.length; i++) {
        cats.push(checks[i].value);
    }
    return cats;
}

function filterProducts() {
    // Despues se le agrega para nombres
    //var search = (document.getElementById("searchInput").value || "").toLowerCase();
    //var name = (document.getElementById("nameFilter").value || "").toLowerCase();
    var categories = getSelectedCategories();
    var page = parseFloat(document.getElementById("page").value) || 1;
    var limit = parseFloat(document.getElementById("limit").value) || 10;
    var sortBy = document.getElementById("sortSelect").value;

    callFilterProducts({
        //name: search ? search : (name ? name : ""),
        categoria: categories,
        sort_price: sortBy,
        page: page,
        limit: limit
    });

    /*var filtered = products.filter(function(p) {
    var matchSearch = p.name.toLowerCase().indexOf(search) !== -1;
    var matchName = p.name.toLowerCase().indexOf(name) !== -1;
    var matchCategory = categories.length === 0 || categories.indexOf(p.category) !== -1;
    var matchPrice = p.price >= minPrice && p.price <= maxPrice;
    return matchSearch && matchName && matchCategory && matchPrice;
    });

    // Sort
    if (sortBy === "price-asc") {
    filtered.sort(function(a, b) { return a.price - b.price; });
    } else if (sortBy === "price-desc") {
    filtered.sort(function(a, b) { return b.price - a.price; });
    } else if (sortBy === "name-asc") {
    filtered.sort(function(a, b) { return a.name.localeCompare(b.name); });
    } else if (sortBy === "name-desc") {
    filtered.sort(function(a, b) { return b.name.localeCompare(a.name); });
    }

    renderProducts(filtered);*/
}

function syncSearch(el) {
    document.getElementById("searchInput").value = el.value;
    filterProducts();
}

function resetFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("searchInputMobile").value = "";
    //document.getElementById("nameFilter").value = "";
    document.getElementById("page").value = "";
    document.getElementById("limit").value = "";
    document.getElementById("sortSelect").value = "default";

    var checks = document.querySelectorAll('.form-check-input[type="checkbox"]');
    for (var i = 0; i < checks.length; i++) {
    checks[i].checked = false;
    }

    filterProducts();
}

async function callFilterProducts(params) {
    //http://localhost:8080/product/?name=remera&categoria=ropa&sort_price=asc&limit=2&page=2
    var url = "http://localhost:8080/product/?";
    //if (params.name) url += "name="+params.name+"&"
    if (params.categoria) url += "categoria="+params.categoria+"&"
    if (params.sort_price) url += "sort_price="+params.sort_price+"&"
    if (params.page) url += "page="+params.page+"&"
    if (params.limit) url += "limit="+params.limit+"&"
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json",
        data: JSON.stringify({
        }),

        success: function (res) {
            //console.log("Respuesta del servidor:", res);
            if (res.payload) {
                products = res.payload.map(p => ({
                    id: p._id,
                    name: p.nombre,
                    category: p.categoria,
                    price: p.precio,
                    img: "https://placehold.co/400x300"
                }));   
            }
            // Initial render
            renderProducts(products);
        },

        error: function (error) {
            console.log("Ocurrió un error:", error);
        }
    });
}

function onlyOne(checkbox) {
    const checkboxes = document.getElementsByName('category');
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false;
    });
}

async function getCartData(cartId) {
    try {
        const res = await $.ajax({
            url: "http://localhost:8080/cart/" + cartId,
            type: "GET",
            // Eliminamos contentType y data porque es un GET
        });

        console.log("Respuesta del servidor:", res);
        cartData = res.productos;
        
        // Aquí el código ya "esperó" y puedes seguir usando cartData
        return cartData;

    } catch (error) {
        console.error("Ocurrió un error:", error);
    }
}
