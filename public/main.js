
// ================= CART =================

function getCart() {
    try {
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('cart='));

        if (!cookie) return [];

        return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
    } catch (e) {
        console.log('Cart parse error:', e);
        return [];
    }
}

function setCart(cart) {
    document.cookie =
        "cart=" + encodeURIComponent(JSON.stringify(cart)) +
        "; path=/; max-age=" + (60 * 60 * 24 * 7);
}

function updateCartCount() {
    const cart = getCart();
    $('#cart-count').text(cart.length);
}

// ================= INIT =================

$(document).ready(function () {
    const cart = getCart();

    updateCartCount();

    if (cart.length > 0) {
        $('.OpenCart p').remove();
    }

    cart.forEach(item => {
        axios.get(`/paska-id/${item}`)
            .then(response => {
                $('.CartProductContainer').append(`
                    <div class="card" id="${response.data._id}">
                        <div class="img">
                            <img src="${response.data.image}" alt="">
                        </div>
                        <p class="name">${response.data.name}</p> 
                        <p class="price">${response.data.price}$</p>
                        <button class="remove-from-cart" id="${response.data._id}">x</button>
                    </div>
                `);
            });
    });
});

// ================= ADD TO CART =================

function addToCart(productId) {
    let cart = getCart();

    productId = String(productId);

    if (!cart.includes(productId)) {
        cart.push(productId);
    }

    setCart(cart);

    console.log('NEW CART:', cart);
    console.log('COOKIE:', document.cookie);
}

// ================= REMOVE FROM CART =================

function removeFromCart(productId) {
    let cart = getCart();

    productId = String(productId);

    cart = cart.filter(id => id !== productId);

    setCart(cart);

    updateCartCount();
}

// ================= LOAD PRODUCTS =================

axios.get('/pasky')
    .then(response => {
        for (const paska of response.data) {
            $('.products').append(`
                <div class="card" id="${paska._id}">
                    <div class="img">
                        <img src="${paska.image}" alt="">
                    </div>
                    <p class="name">${paska.name}</p> 
                    <p class="price">${paska.price}$</p>
                    <button class="addToCart" id="${paska._id}">Add to cart</button>
                </div>
            `);
        }
    });

// ================= CLICK CARD =================

$(document).on('click', '.card', function () {
    axios.get(`/paska-id/${this.id}`)
        .then(response => {
            $('.paskyall').css('display', 'none');

            $('.container').append(`
                <div class="showcard" id="showcard${this.id}"> 
                    <div class="backRow">
                        <button class="back" id="${this.id}"><-Go Back</button>
                    </div>
                    <div class='row'>
                        <img src="${response.data.image}" alt=""> 
                        <h4>${response.data.name}</h4>
                        <p>${response.data.description}</p>
                        <p class="price">${response.data.price}$</p>
                        <button class="addToCart" id="${response.data._id}">Add to cart</button>
                    </div>
                </div>
            `);
        });
});

// ================= ADD CLICK =================

$(document).on('click', '.addToCart', function (e) {
    e.stopPropagation();

    const id = this.id;

    console.log('CLICKED ID:', id);

    addToCart(id);
    let value = parseInt($('#cart-count').text())+1
   $('#cart-count').text(value)
     axios.get(`/paska-id/${this.id}`)
            .then(response => {
                $('.CartProductContainer').append(`
                    <div class="card" id="${response.data._id}">
                        <div class="img">
                            <img src="${response.data.image}" alt="">
                        </div>
                        <p class="name">${response.data.name}</p> 
                        <p class="price">${response.data.price}$</p>
                        <button class="remove-from-cart" id="${response.data._id}">x</button>
                    </div>
                `);
            });
    
    

});

// ================= REMOVE CLICK =================

$(document).on('click', '.remove-from-cart', function (e) {
    e.stopPropagation();

    const id = this.id;

    $(this).closest('.card').remove();

    removeFromCart(id);
});

// ================= BACK =================

$(document).on('click', '.back', function () {
    $(`#showcard${this.id}`).remove();
    $('.paskyall').css('display', 'flex');
});

// ================= CART OPEN / CLOSE =================

$('.cart').click(function () {
    $('.openCart').css('display', 'flex');
    $('.OpenCart').css('right', '40px');
});

$('.x').click(function () {
    $('.OpenCart').css('right', '-400px');
});

// ================= NAV ACTIVE =================

$('.nav-bar button').click(function () {
    $('.nav-bar button').removeClass('active');
    $(this).addClass('active');
    if(this.id==2){
        $('#downContainer').css('display','none')
          $('.about').css('display','flex')
          $('.contacts').css('display', 'none');
            $('.socials').css('display', 'none');
              $('.paskaSearchContainer').css('display', 'none');
    }
      if(this.id==1){
        $('#downContainer').css('display','none')
        $('.about').css('display','none')
          $('.paskyall').css('display','flex')
          $('.contacts').css('display', 'none');
            $('.socials').css('display', 'none');
              $('.paskaSearchContainer').css('display', 'none');
               $('.products').empty()
               axios.get('/pasky')
    .then(response => {
        for (const paska of response.data) {
            $('.products').append(`
                <div class="card" id="${paska._id}">
                    <div class="img">
                        <img src="${paska.image}" alt="">
                    </div>
                    <p class="name">${paska.name}</p> 
                    <p class="price">${paska.price}$</p>
                    <button class="addToCart" id="${paska._id}">Add to cart</button>
                </div>
            `);
        }
    });
    }
    if(this.id == 4){
          $('#downContainer').css('display','none')
            $('.about').css('display','none')
          $('.contacts').css('display', 'flex');
           $('.socials').css('display', 'none');
             $('.paskaSearchContainer').css('display', 'none');
    }
    if(this.id ==6){
           $('#downContainer').css('display','none')
        $('.about').css('display','none')
          $('.paskyall').css('display','none')
          $('.contacts').css('display', 'none');
           $('.socials').css('display', 'flex');
           $('.paskaSearchContainer').css('display', 'none');
    }
    if(this.id=="send"){

    }
});
$('#send').click(function(e){
    e.preventDefault(); 
    e.stopPropagation();

    if (
        $('#ContactsInput1').val().length > 3 &&
        $('#emailContacts').val().length > 3 &&
        $('#messageContacts').val().length > 3
    ) {
        $('#ContactsInput1').val("");
        $('#emailContacts').val("");
        $('#messageContacts').val("");
    } else {
        alert("Заповни всі поля (мінімум 3 символи)");
    }
});
$('#search').click(function () {
   
    if ($('#paskaSearch').val().length > 0) {
       $('.products').empty()
        $('#downContainer').css('display', 'none');
        $('.about').css('display', 'none');
        $('.paskyall').css('display', 'flex');
        $('.contacts').css('display', 'none');
        $('.socials').css('display', 'none');
       

        $('.paskaSearchContainer').html('');

        axios.get('/search', {
            params: {
                query: $('#paskaSearch').val()
            }
        })
        .then(response => {

            const pasky = response.data;

            if (pasky.length > 0) {

                pasky.forEach(id => {

    axios.get(`/paska-id/${id}`)
    .then(response => {

        $('.products').append(`
            <div class="card" id="${response.data._id}">
                <div class="img">
                    <img src="${response.data.image}" alt="">
                </div>

                <p class="name">${response.data.name}</p> 
                <p class="price">${response.data.price}$</p>

                <button class="addToCart" id="${response.data._id}">
                    Add to cart
                </button>
            </div>
        `);

    });

});

            } else {
alert('нічого не знайдено')

            }

        })
        .catch(error => {
            console.log(error);
        });

    }

});
const regexUA = /^(?:\+380|380|0)\d{9}$/;
$('.confirm').click(function(){
  if($('#cartNumber').val().length>0){
    if(regexUA.test($('#cartNumber').val())==true){
      alert('замовлення оформлено!')
      setCart([]);
      $('.CartProductContainer .card').remove()

    }
   else{alert('введіть справжній номер')}

  }
  else{
    alert('поле номеру телефону пусте')
  }
  
})



