const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');

let cart = [];

// Charger depuis le localStorage
document.addEventListener('DOMContentLoaded', () => {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cart = JSON.parse(storedCart);
    updateCartDisplay();
  }
});

// Ajouter au panier
function addToCart(productName, price) {
  cart.push({ name: productName, price: price });
  saveCart();
  updateCartDisplay();
}

// Mettre à jour l'affichage
function updateCartDisplay() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - ${item.price} €`;
    cartItems.appendChild(li);
    total += item.price;
  });
  cartCount.textContent = cart.length;
  cartTotal.textContent = `${total.toFixed(2)} €`;
}

// Sauvegarde locale
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Vider le panier
function clearCart() {
  cart = [];
  localStorage.removeItem('cart');
  updateCartDisplay();
}

// Toggle menu hamburger
function toggleMenu() {
  const menu = document.getElementById('nav-menu');
  menu.classList.toggle('show');
}

// Toggle panier
document.getElementById('toggle-cart').addEventListener('click', () => {
  const cartBox = document.querySelector('.cart');
  cartBox.classList.toggle('hidden');
});
// ----------- Authentification utilisateur -----------

let isLoginMode = true;

const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubmit = document.getElementById('auth-submit');
const switchAuth = document.getElementById('switch-auth');
const userInfo = document.getElementById('user-info');
const usernameDisplay = document.getElementById('username-display');

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    showUser(currentUser);
  }
});

authForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (isLoginMode) {
    login(username, password);
  } else {
    register(username, password);
  }
});

function toggleAuthMode() {
  isLoginMode = !isLoginMode;
  authTitle.textContent = isLoginMode ? "Connexion" : "Inscription";
  authSubmit.textContent = isLoginMode ? "Se connecter" : "S'inscrire";
  switchAuth.innerHTML = isLoginMode
    ? `Pas de compte ? <a href="#" onclick="toggleAuthMode()">Inscrivez-vous ici</a>`
    : `Déjà un compte ? <a href="#" onclick="toggleAuthMode()">Connectez-vous ici</a>`;
}

function register(username, password) {
  const users = JSON.parse(localStorage.getItem('users')) || {};
  if (users[username]) {
    alert("Nom d'utilisateur déjà utilisé !");
    return;
  }
  users[username] = password;
  localStorage.setItem('users', JSON.stringify(users));
  alert("Inscription réussie !");
  isLoginMode = true;
  toggleAuthMode();
}

function login(username, password) {
  const users = JSON.parse(localStorage.getItem('users')) || {};
  if (users[username] && users[username] === password) {
    localStorage.setItem('currentUser', username);
    showUser(username);
  } else {
    alert("Nom d'utilisateur ou mot de passe incorrect.");
  }
}

function showUser(username) {
  document.getElementById('auth-form').style.display = "none";
  switchAuth.style.display = "none";
  authTitle.textContent = "Bienvenue !";
  userInfo.style.display = "block";
  usernameDisplay.textContent = username;
}

function logout() {
  localStorage.removeItem('currentUser');
  location.reload();
}
