const containerEl = document.querySelector('div.featured-items');

const blockTitleEl = document.createElement('div');
blockTitleEl.classList.add('featured__block__title');

const titleHeadingEl = document.createElement('h2');
titleHeadingEl.classList.add('featured__title');
titleHeadingEl.innerHTML = 'Fetured Items';
const textHeadingEl = document.createElement('p');
textHeadingEl.classList.add('featured__text');
textHeadingEl.innerHTML = 'Shop for items based on what we featured in this week';

const blockCardEl = document.createElement('div');
blockCardEl.classList.add('featured__block__card');

const btnContainerEl = document.createElement('div');
btnContainerEl.classList.add('btn_container');

const btnAddCardEl = document.createElement('button');
btnAddCardEl.classList.add('btn__add__card');
btnAddCardEl.innerHTML = 'Browse All Product';

btnContainerEl.appendChild(btnAddCardEl);


const cardData = JSON.parse(dataInfo);
let displayedCards = 6; // Первоначально отображаемые карточки
const cardsToAdd = 4; // Количество карточек, добавляемых за раз

// Инициализация карточек
function initializeCards() {
  const allData = [...cardData]; 
  addCards(allData.slice(0, displayedCards)); // Отображение начального набора карточек
};

// Функция для добавления карточек
function addCards(dataSubset) {
    dataSubset.forEach(element => {
    const cardEl = document.createElement('div');
    cardEl.classList.add('card');
    const imgCardEl = document.createElement('img');
    imgCardEl.classList.add('img__card')
    imgCardEl.src = element.src;
    imgCardEl.setAttribute('alt', 'photo');
    imgCardEl.style.width = element.width + "px";
    imgCardEl.style.height = element.height + "px";
    const titleCardEl = document.createElement('h3');
    titleCardEl.classList.add('title__card');
    titleCardEl.innerHTML = element.title;
    const textCardEl = document.createElement('p');
    textCardEl.classList.add('text__card');
    textCardEl.innerHTML = element.text;
    const priceCardEl = document.createElement('span');
    priceCardEl.classList.add('price__card');
    priceCardEl.innerHTML = element.price;
    const btnByeEl = document.createElement('button');
    btnByeEl.classList.add('add__to__cart');
    btnByeEl.dataset.id = element.id;
    const iconByeEl = document.createElement('img');
    iconByeEl.src = '/img/basket.svg';
    iconByeEl.style.marginRight = '11px';
    const textByeEl = document.createElement('span');
    textByeEl.innerHTML = 'Add to Cart';

    btnByeEl.appendChild(iconByeEl);
    btnByeEl.appendChild(textByeEl);


    cardEl.appendChild(imgCardEl);
    cardEl.appendChild(titleCardEl);
    cardEl.appendChild(textCardEl);
    cardEl.appendChild(priceCardEl);
    cardEl.appendChild(btnByeEl);

    blockCardEl.appendChild(cardEl);
      });
};

 

  btnContainerEl.appendChild(btnAddCardEl);
  containerEl.appendChild(blockCardEl); 
  containerEl.appendChild(btnContainerEl);



blockTitleEl.appendChild(titleHeadingEl);
blockTitleEl.appendChild(textHeadingEl);

containerEl.appendChild(blockTitleEl);
containerEl.appendChild(blockCardEl);
containerEl.appendChild(btnContainerEl);


btnAddCardEl.addEventListener('click', () => {
  const allData = [...cardData];
  displayedCards += cardsToAdd; // Увеличиваем количество отображаемых карточек
  blockCardEl.innerHTML = ''; // Очистка текущих карточек (опционально)
  addCards(allData.slice(0, displayedCards)); // Перерендеринг карточек

  // Скрытие кнопки, если все карточки отображены
  if (displayedCards >= allData.length) {
    btnAddCardEl.style.display = 'none';
  }
});

// Добавление товара в корзину //
document.addEventListener('DOMContentLoaded', () => {
  initializeCards(); // Инициализируем начальный набор карточек
  renderCart();
  updateCartCounter();

   // Установка обработчика событий на контейнер карточек товаров
  containerEl.addEventListener('click', (event) => {
    // Проверяем, что клик был совершен по кнопке "Добавить в корзину"
    if (event.target.closest('.add__to__cart')) {
      const productId = event.target.closest('.add__to__cart').dataset.id;
      addToCart(productId);
    }
  });
});

// Счетчик количества товаров в корзине
function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  // Используем метод reduce для подсчета общего количества товаров
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartCounter = document.getElementById('cartCounter');
  
  if (totalQuantity > 0) {
    cartCounter.style.display = 'inline';
    // Отображаем общее количество товаров вместо количества карточек
    cartCounter.textContent = totalQuantity;
  } else {
    cartCounter.style.display = 'none';
  }
};

// Добавление товара по данной карточке товара
function addToCart(productId) {
  const product = cardData.find(item => item.id == productId); // Ищем товар в cardData
  if (!product) {
    console.error('Product not found:', productId);
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProductIndex = cart.findIndex(item => item.id == productId);

  if (existingProductIndex !== -1) {
    const existingProduct = cart[existingProductIndex];
    // Увеличиваем количество, не превышая maxQuantity
    if (existingProduct.quantity < product.maxQuantity) {
      existingProduct.quantity += 1;
    } else {
      alert(`Достигнуто максимальное количество товара ${product.title}`);
    }
  } else {
    // Если товара нет, добавляем его в корзину с начальным количеством 1
    const newProduct = {...product, quantity: 1};
    cart.push(newProduct);
  }

localStorage.setItem('cart', JSON.stringify(cart));

  updateCartCounter(); // Обновляем счетчик товаров в корзине, если функция есть
  renderCart(); // Перерисовываем корзину, если функция есть
};

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const emptyCartMessage = document.querySelector('.cart_container');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  cartItems.innerHTML = ''; // Очищаем текущее содержимое
  
  if (cart.length === 0) {
           emptyCartMessage.style.display = 'none'
  } else {
           emptyCartMessage.style.display = 'block'
    cart.forEach((item, index) => {
      const cardItem = document.createElement('div');
      cardItem.classList.add('card__product');
      const quantity = item.quantity || 1;
      cardItem.innerHTML = `
      <img src="${item.src}" alt="photo" style="width: ${item.widthCart}px; height: ${item.heightCart}px;">
      <div class="card__info_product">
        <h3 class"cart__title">${item.title}</h3>
        <p class="cart__price">Price:<span class="cart__price__span">${item.price}</span></p>
        <p class="cart__color">Color:<span class="cart__color__span">${item.color}</span></p>
        <p class="cart__size">Size:<span class="cart__size__span">${item.size}</span></p>
        <p class="cart__quantity">Quantity:<input class="cart__input" type="number" value="${quantity}" min="1"></p>
      </div>
      `;
      
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('btn_delite');
      deleteButton.onclick = () => removeFromCart(index); // Используйте индекс для удаления
      
      cardItem.querySelector('.card__info_product').appendChild(deleteButton);
      cartItems.appendChild(cardItem);
      emptyCartMessage.appendChild(cartItems);
      return
    });
  }
};

function removeFromCart(indexToRemove) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(indexToRemove, 1); // Удаляем товар по индексу
  localStorage.setItem('cart', JSON.stringify(cart));
  
  renderCart(); // Перерисовываем корзину
  updateCartCounter(); // Обновляем счетчик
};




// показывает скрытые блоки при нажатиии на кнопку //

// const btnVisibleEl = document.querySelector('.btn__add__card');

// btnVisibleEl.addEventListener('click', function () {
//     const hIddenCardsEl = document.querySelectorAll('.visible__hidden', '.card');

//     for (let i = 0; i < hIddenCardsEl.length && i < 4; i++) {
//         hIddenCardsEl[i].classList.remove('visible__hidden');
//     }

// });



const hamburgerContainerEl = document.querySelector('div.container__hamburger');

hamburgerContainerEl.addEventListener('click', function () {
 const hamburgerLineEl = hamburgerContainerEl.querySelectorAll('div.ham__item');
 const hamburgerMenuEl = document.querySelector('.hamburger__menu');
 if (hamburgerLineEl[0].classList.contains('rotate45')) {
  hamburgerLineEl[0].classList.remove('rotate45');
  hamburgerLineEl[1].classList.remove('rotate-45');
  hamburgerLineEl[2].style.display = 'block';
  hamburgerMenuEl.style.opacity = '0';
  hamburgerMenuEl.style.maxHeight = '0';

 } else {
  hamburgerLineEl[0].classList.add('rotate45');
  hamburgerLineEl[1].classList.add('rotate-45');
  hamburgerLineEl[2].style.display = 'none';
  hamburgerMenuEl.style.opacity = '1';
  hamburgerMenuEl.style.maxHeight = '634px';
 }
 
});
console.log(hamburgerContainerEl)