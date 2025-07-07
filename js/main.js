// Attendre que le DOM soit complètement chargé
document.addEventListener("DOMContentLoaded", () => {
  // Sélection des éléments du menu et du panier
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const cartShop = document.getElementById('cart-shop');
  const cart = document.getElementById('cart');
  const cartClose = document.getElementById('cart-close');
  const cartContainer = document.querySelector('#cart .cart__container');

  // Fonction utilitaire pour ajouter/retirer une classe
  const toggleClass = (el, cls, add) => el?.classList[add ? 'add' : 'remove'](cls);

  // Ouvrir le menu
  navToggle?.addEventListener('click', () => toggleClass(navMenu, 'show-menu', true));

  // Fermer le menu
  navClose?.addEventListener('click', () => toggleClass(navMenu, 'show-menu', false));

  // Fermer le menu en cliquant sur un lien
  document.querySelectorAll('.nav__link').forEach(link =>
    link.addEventListener('click', () => toggleClass(navMenu, 'show-menu', false))
  );

  // Changer le fond du header au scroll
  window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    header?.classList.toggle('scroll-header', window.scrollY >= 50);
  });

  // Ouvrir le panier
  cartShop?.addEventListener('click', () => toggleClass(cart, 'show-cart', true));

  // Fermer le panier
  cartClose?.addEventListener('click', () => toggleClass(cart, 'show-cart', false));

  // Met à jour le total, le nombre d'articles et sauvegarde dans localStorage
  const updateCart = () => {
    const cards = document.querySelectorAll('.cart__card');
    const countEl = document.querySelector('.cart__prices-item');
    const totalEl = document.querySelector('.cart__prices-total');
    let total = 0, count = 0;
    const items = [];

    cards.forEach(card => {
      const qty = parseInt(card.querySelector('.cart__amount-number')?.textContent || 1);
      const price = parseFloat(card.querySelector('.cart__price')?.textContent.replace(/[^\d]/g, '') || 0);
      const title = card.querySelector('.cart__title')?.textContent;
      const img = card.querySelector('img')?.src;

      total += qty * price;
      count += qty;

      items.push({ title, price, img, qty });
    });

    countEl.textContent = `${count} produit${count > 1 ? 's' : ''}`;
    totalEl.textContent = `${total}€`;

    // Sauvegarder dans le localStorage
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  // Attache les événements de clic à une carte du panier (supprimer, +, -)
  const attachCardEvents = (card) => {
    card.querySelector('.cart__btn-remove')?.addEventListener('click', () => {
      card.remove();
      updateCart();
    });

    card.querySelectorAll('.cart__amount-box').forEach(btn => {
      btn.addEventListener('click', e => {
        const icon = e.target.closest('i');
        const amountEl = card.querySelector('.cart__amount-number');
        let amt = parseInt(amountEl.textContent);
        amt = icon.classList.contains('fa-minus') ? Math.max(amt - 1, 0) : amt + 1;
        amt ? amountEl.textContent = amt : card.remove();
        updateCart();
      });
    });
  };

  // Supprimer manuellement les cartes déjà présentes
  document.querySelectorAll('.cart__btn-remove').forEach(btn =>
    btn.addEventListener('click', e => {
      e.target.closest('.cart__card')?.remove();
      updateCart();
    })
  );

  // Ajouter un produit au panier en cliquant sur "Ajouter au panier"
  document.querySelectorAll('.products__button, .featured__button, .home__button').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.products__card, .featured__card, .home__data');
      const title = card.querySelector('.products__title, .featured__title, .home__title')?.textContent.trim() || 'Produit';
      const priceText = card.querySelector('.products__price, .featured__price, .home__price')?.textContent.trim() || '0€';
      const price = priceText.replace(/[^\d]/g, '');
      const img = card.querySelector('img')?.src || '';

      const newCard = document.createElement('article');
      newCard.className = 'cart__card';
      newCard.innerHTML = `
        <div class="cart__box">
          <img src="${img}" alt="${title}" class="cart__img">
        </div>
        <div class="cart__details">
          <h3 class="cart__title">${title}</h3>
          <span class="cart__price">${price}€</span>
          <div class="cart__amount">
            <div class="cart__amount-content">
              <span class="cart__amount-box"><i class="fa-solid fa-minus"></i></span>
              <span class="cart__amount-number">1</span>
              <span class="cart__amount-box"><i class="fa-solid fa-plus"></i></span>
            </div>
          </div>
          <div class="cart__actions">
            <button class="cart__btn-remove">Supprimer</button>
          </div>
        </div>
      `;

      cartContainer?.appendChild(newCard);
      attachCardEvents(newCard);
      updateCart();
    });
  });

  // Restaurer les données du localStorage
  const savedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  savedItems.forEach(({ title, price, img, qty }) => {
    const newCard = document.createElement('article');
    newCard.className = 'cart__card';
    newCard.innerHTML = `
      <div class="cart__box">
        <img src="${img}" alt="${title}" class="cart__img">
      </div>
      <div class="cart__details">
        <h3 class="cart__title">${title}</h3>
        <span class="cart__price">${price}€</span>
        <div class="cart__amount">
          <div class="cart__amount-content">
            <span class="cart__amount-box"><i class="fa-solid fa-minus"></i></span>
            <span class="cart__amount-number">${qty}</span>
            <span class="cart__amount-box"><i class="fa-solid fa-plus"></i></span>
          </div>
        </div>
        <div class="cart__actions">
          <button class="cart__btn-remove">Supprimer</button>
        </div>
      </div>
    `;
    cartContainer?.appendChild(newCard);
    attachCardEvents(newCard);
  });

  // Mise à jour initiale au chargement
  updateCart();
});

// Gérer le mode contraste élevé
const contrastToggle = document.getElementById("toggle-contrast");
contrastToggle?.addEventListener("click", () => {
  document.body.classList.toggle("high-contrast");
  const pressed = contrastToggle.getAttribute("aria-pressed") === "true";
  contrastToggle.setAttribute("aria-pressed", String(!pressed));
});
