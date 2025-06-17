document.addEventListener('DOMContentLoaded', () => {
        // --- DOM Elements ---
        const productDisplayArea = document.getElementById('product-display-area');
        const productDisplayTitle = document.getElementById('product-display-title');
        const noResultsMessage = document.getElementById('no-results-message');
        const clearFiltersBtn = document.getElementById('clear-filters-btn');
        const mainCategoryLinks = document.querySelectorAll('.main-category-link');
        const subCategoryLinks = document.querySelectorAll('.sub-category-link');
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const cartCountSpan = document.querySelector('.cart-count');
        const wishlistCountSpan = document.querySelector('.wishlist-count');
        const quickViewModal = document.getElementById('quick-view-modal');
        const quickViewContent = document.getElementById('quick-view-content');
        const closeQuickViewBtn = document.getElementById('close-quick-view');
        const modalOverlay = document.getElementById('modal-overlay');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenuClose = document.getElementById('mobile-menu-close');
        const mainNavigation = document.getElementById('main-navigation');
        const heroBanner = document.getElementById('hero-banner');
        const toastContainer = document.getElementById('toast-container');

        // Auth Elements
        const authModal = document.getElementById('auth-modal');
        const closeAuthModalBtn = document.getElementById('close-auth-modal');
        const loginTrigger = document.getElementById('login-trigger');
        const userActionsArea = document.getElementById('user-actions-area');
        const userLoggedInState = document.getElementById('user-logged-in');
        const welcomeUserSpan = userLoggedInState?.querySelector('.welcome-user');
        const logoutButton = document.getElementById('logout-button');
        const authTabs = document.querySelectorAll('.auth-tab-link');
        const authTabContents = document.querySelectorAll('.auth-tab-content');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const loginErrorMsg = document.getElementById('login-error-msg');
        const signupErrorMsg = document.getElementById('signup-error-msg');
        const signupSuccessMsg = document.getElementById('signup-success-msg');
        const switchToSignupLink = document.querySelector('.switch-to-signup');
        const switchToLoginLink = document.querySelector('.switch-to-login');

        // --- State Variables ---
        let currentFilter = { type: 'all', value: '' };
        let cart = JSON.parse(sessionStorage.getItem('radianceCart')) || [];
        let wishlist = JSON.parse(localStorage.getItem('radianceWishlist')) || [];
        let isLoggedIn = sessionStorage.getItem('radianceLoggedIn') === 'true';
        let loggedInUserName = sessionStorage.getItem('radianceUserName') || 'User';

        // --- Initial UI Setup ---
        function updateLoginStateUI() {
            const loggedOutState = userActionsArea?.querySelector('#login-trigger');
            if (!userActionsArea || !loggedOutState || !userLoggedInState) return; // Ensure elements exist

            if (isLoggedIn) {
                loggedOutState.style.display = 'none';
                userLoggedInState.style.display = 'flex';
                if (welcomeUserSpan) welcomeUserSpan.textContent = `Hi, ${loggedInUserName}!`;
                // Attach logout listener if it's not already attached or if element was hidden
                if (logoutButton && !logoutButton.hasClickListener) {
                     logoutButton.addEventListener('click', handleLogout);
                     logoutButton.hasClickListener = true; // Mark as attached
                }
            } else {
                 loggedOutState.style.display = 'flex';
                 userLoggedInState.style.display = 'none';
            }
        }

        // --- Mobile Menu ---
        if (mobileMenuToggle && mainNavigation && mobileMenuClose) {
            mobileMenuToggle.addEventListener('click', () => mainNavigation.classList.add('active'));
            mobileMenuClose.addEventListener('click', () => mainNavigation.classList.remove('active'));
            mainNavigation.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => mainNavigation.classList.remove('active'));
            });
        }

        // --- Product Display Logic ---
         function displayProducts(filter = { type: 'all', value: '' }) {
            if (!productDisplayArea) return;
            productDisplayArea.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
            noResultsMessage.style.display = 'none';

            // Use setTimeout to allow spinner to render before blocking for filtering
            setTimeout(() => {
                productDisplayArea.innerHTML = '';
                let filteredProducts = [];
                let title = "Featured Products";

                // Filtering logic (same as before)
                switch (filter.type) {
                    case 'category': filteredProducts = products.filter(p => p.category === filter.value); title = filter.value.charAt(0).toUpperCase() + filter.value.slice(1); break;
                    case 'tag': filteredProducts = products.filter(p => p.tags?.includes(filter.value)); const linkText = document.querySelector(`.sub-category-link[data-tag="${filter.value}"]`)?.textContent; title = linkText || (filter.value.charAt(0).toUpperCase() + filter.value.slice(1)); break;
                    case 'search': const searchTerm = filter.value.toLowerCase(); filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm) || p.description?.toLowerCase().includes(searchTerm) || p.tags?.some(tag => tag.toLowerCase().includes(searchTerm))); title = `Search Results for "${filter.value}"`; break;
                    case 'sale': filteredProducts = products.filter(p => p.discountPrice && p.discountPrice < p.price); title = "On Sale"; break;
                    default: filteredProducts = products.filter(p => p.tags?.includes('trending') || p.tags?.includes('new')).slice(0, 16); if (filteredProducts.length < 8) filteredProducts = products.slice(0,16); break;
                }

                productDisplayTitle.textContent = title;
                if (heroBanner) heroBanner.style.display = (filter.type !== 'all') ? 'none' : 'block';

                if (filteredProducts.length === 0) {
                    noResultsMessage.style.display = 'flex';
                } else {
                    filteredProducts.forEach(product => productDisplayArea.appendChild(createProductElement(product)));
                    addEventListenersToProductButtons(); // Re-attach listeners AFTER adding elements
                }
            }, 50); // Short delay
        }

        function createProductElement(product) {
             const productElement = document.createElement('div');
             productElement.classList.add('product-item');
             if (!product.inStock) productElement.classList.add('out-of-stock');

             let priceHTML = `<span class="price">${formatCurrency(product.price)}</span>`;
             if (product.discountPrice) priceHTML = `<span class="discount-price">${formatCurrency(product.discountPrice)}</span> <span class="original-price">${formatCurrency(product.price)}</span>`;

             const isWishlisted = wishlist.some(item => item.id === product.id);
             const wishlistIconClass = isWishlisted ? 'fas fa-heart added' : 'far fa-heart';
             const ratingHTML = product.rating ? `<div class="product-rating">${generateStarRating(product.rating)}<span class="review-count">(${product.reviewCount || 0})</span></div>` : '<div class="product-rating no-rating"></div>';

             productElement.innerHTML = `
                 <div class="product-image-container">
                     <a href="#product-detail/${product.id}" class="product-link-overlay"> <img src="${product.imageUrl}" alt="${product.name}" loading="lazy"> </a>
                     <div class="product-actions">
                         <button class="action-btn wishlist-btn" data-id="${product.id}" title="Add to Wishlist"><i class="${wishlistIconClass}"></i></button>
                         <button class="action-btn quick-view-btn" data-id="${product.id}" title="Quick View"><i class="fas fa-search-plus"></i></button>
                     </div>
                      ${product.discountPrice ? '<span class="sale-badge">SALE</span>' : ''}
                      ${!product.inStock ? '<span class="stock-badge">OUT OF STOCK</span>' : ''}
                 </div>
                 <div class="product-info">
                     <h3 class="product-name"><a href="#product-detail/${product.id}" class="product-link">${product.name}</a></h3>
                     ${ratingHTML}
                     <div class="product-price"> ${priceHTML} </div>
                     <button class="cta-button primary add-to-cart-btn" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                         ${product.inStock ? '<i class="fas fa-cart-plus"></i> Add to Cart' : 'Out of Stock'}
                     </button>
                 </div>`;

             productElement.querySelectorAll('.product-link-overlay, .product-link').forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); alert(`View details for: ${product.name}`); }));
             return productElement;
        }


        // --- Cart Functionality ---
        function updateCartCount() { const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); if (cartCountSpan) cartCountSpan.textContent = totalItems; }
        function saveCart() { sessionStorage.setItem('radianceCart', JSON.stringify(cart)); updateCartCount(); }
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product || !product.inStock) return;
            const existingItemIndex = cart.findIndex(item => item.id === productId);
            if (existingItemIndex > -1) cart[existingItemIndex].quantity++;
            else cart.push({ id: productId, quantity: 1 });
            saveCart();
            showToastNotification(`${product.name} added to cart!`, 'success');
        }

        // --- Wishlist Functionality ---
        function updateWishlistCount() { if (wishlistCountSpan) wishlistCountSpan.textContent = wishlist.length; }
        function saveWishlist() { localStorage.setItem('radianceWishlist', JSON.stringify(wishlist)); updateWishlistCount(); }
        function toggleWishlist(productId, buttonElement) {
            const productIndex = wishlist.findIndex(item => item.id === productId);
            const icon = buttonElement?.querySelector('i'); // Use optional chaining
            const product = products.find(p => p.id === productId);
            if (!product || !icon) return;

            if (productIndex > -1) {
                wishlist.splice(productIndex, 1);
                icon.classList.remove('fas', 'added'); icon.classList.add('far');
                showToastNotification(`${product.name} removed from wishlist.`, 'info');
            } else {
                wishlist.push({ id: productId });
                icon.classList.remove('far'); icon.classList.add('fas', 'added');
                showToastNotification(`${product.name} added to wishlist!`, 'success');
            }
            saveWishlist();
        }

        // --- Quick View Modal ---
         function openQuickView(productId) {
            const product = products.find(p => p.id === productId);
            if (!product || !quickViewContent) return;

            let priceHTML = `<span class="price">${formatCurrency(product.price)}</span>`;
            if (product.discountPrice) priceHTML = `<span class="discount-price">${formatCurrency(product.discountPrice)}</span> <span class="original-price">${formatCurrency(product.price)}</span>`;
            const ratingHTML = product.rating ? `<div class="product-rating qv-rating">${generateStarRating(product.rating)}<span class="review-count">(${product.reviewCount || 0} reviews)</span></div>` : '';
            const isWishlisted = wishlist.some(item => item.id === product.id);

            quickViewContent.innerHTML = `
                <div class="quick-view-layout">
                    <div class="quick-view-image"> <img src="${product.imageUrl}" alt="${product.name}"> </div>
                    <div class="quick-view-details">
                        <h2>${product.name}</h2> ${ratingHTML}
                        <div class="product-price qv-price">${priceHTML}</div>
                        <p class="qv-stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}"><i class="fas ${product.inStock ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${product.inStock ? 'In Stock' : 'Out of Stock'}</p>
                        <p class="qv-description">${product.description || 'No description.'}</p>
                        <button class="cta-button primary qv-add-btn" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}><i class="fas fa-cart-plus"></i> ${product.inStock ? 'Add to Cart' : 'Out of Stock'}</button>
                        <button class="cta-button secondary qv-wishlist-btn" data-id="${product.id}"><i class="${isWishlisted ? 'fas fa-heart added' : 'far fa-heart'}"></i> Add to Wishlist</button>
                    </div>
                </div>`;
            quickViewModal.classList.add('active');
            modalOverlay.classList.add('active');
            addEventListenersToModalButtons(product.id);
        }
        function closeQuickView() { if(quickViewModal) quickViewModal.classList.remove('active'); if(modalOverlay) modalOverlay.classList.remove('active'); if(quickViewContent) quickViewContent.innerHTML = ''; }


        // --- Authentication ---
        function openAuthModal(defaultTab = 'login') {
            if (!authModal || !modalOverlay) return;
            loginForm?.reset(); signupForm?.reset();
            loginErrorMsg.style.display = 'none'; signupErrorMsg.style.display = 'none'; signupSuccessMsg.style.display = 'none';
            switchTab(defaultTab);
            authModal.classList.add('active');
            modalOverlay.classList.add('active');
        }
        function closeAuthModal() { if (authModal) authModal.classList.remove('active'); if (modalOverlay) modalOverlay.classList.remove('active'); }
        function switchTab(tabId) {
            authTabContents.forEach(content => content.classList.remove('active'));
            authTabs.forEach(tab => tab.classList.remove('active'));
            document.getElementById(`${tabId}-tab`)?.classList.add('active');
            document.querySelector(`.auth-tab-link[data-tab="${tabId}"]`)?.classList.add('active');
        }
        function handleLogin(event) {
            event.preventDefault();
            const emailOrPhone = document.getElementById('login-email')?.value;
            const password = document.getElementById('login-password')?.value;
            if (emailOrPhone && password) {
                isLoggedIn = true;
                // Simulate getting name - prioritize name from signup if available, else use email/phone part
                const simulatedName = sessionStorage.getItem(`userNameFor_${emailOrPhone}`) || emailOrPhone.split('@')[0] || 'User';
                loggedInUserName = simulatedName;
                sessionStorage.setItem('radianceLoggedIn', 'true');
                sessionStorage.setItem('radianceUserName', loggedInUserName);
                updateLoginStateUI();
                closeAuthModal();
                showToastNotification(`Welcome back, ${loggedInUserName}!`, 'success');
                loginErrorMsg.style.display = 'none';
            } else {
                loginErrorMsg.textContent = 'Invalid credentials.';
                loginErrorMsg.style.display = 'block';
            }
        }
        function handleSignup(event) {
             event.preventDefault();
             const name = document.getElementById('signup-name')?.value;
             const email = document.getElementById('signup-email')?.value;
             const password = document.getElementById('signup-password')?.value;
             if (name && email && password) {
                 // Simulate storing name associated with email for login welcome message
                 sessionStorage.setItem(`userNameFor_${email}`, name);
                 signupSuccessMsg.textContent = 'Account created! Please log in.';
                 signupSuccessMsg.style.display = 'block';
                 signupErrorMsg.style.display = 'none';
                 signupForm.reset();
                 setTimeout(() => { switchTab('login'); signupSuccessMsg.style.display = 'none'; }, 2000);
             } else {
                 signupErrorMsg.textContent = 'Please fill all required fields.';
                 signupErrorMsg.style.display = 'block';
                 signupSuccessMsg.style.display = 'none';
             }
        }
        function handleLogout(event) {
            event?.preventDefault(); // Prevent default if called from a link
            isLoggedIn = false; loggedInUserName = 'User';
            sessionStorage.removeItem('radianceLoggedIn'); sessionStorage.removeItem('radianceUserName');
            // Optionally clear simulated user names too:
            // Object.keys(sessionStorage).filter(k => k.startsWith('userNameFor_')).forEach(k => sessionStorage.removeItem(k));
            updateLoginStateUI();
            showToastNotification('You have been logged out.', 'info');
        }

        // --- Event Listeners ---
        // Use event delegation for product buttons for robustness
        if (productDisplayArea) {
            productDisplayArea.addEventListener('click', (event) => {
                const target = event.target;
                const cartButton = target.closest('.add-to-cart-btn');
                const wishlistButton = target.closest('.wishlist-btn');
                const quickViewButton = target.closest('.quick-view-btn');

                if (cartButton && !cartButton.disabled) {
                    addToCart(parseInt(cartButton.dataset.id, 10));
                } else if (wishlistButton) {
                    toggleWishlist(parseInt(wishlistButton.dataset.id, 10), wishlistButton);
                } else if (quickViewButton) {
                    openQuickView(parseInt(quickViewButton.dataset.id, 10));
                }
            });
        }

         function addEventListenersToModalButtons(productId) {
             // Use specific selectors within the modal content
             const qvAddBtn = quickViewContent?.querySelector('.qv-add-btn');
             const qvWishlistBtn = quickViewContent?.querySelector('.qv-wishlist-btn');

             if (qvAddBtn) {
                 // Remove previous listener before adding new one
                 qvAddBtn.replaceWith(qvAddBtn.cloneNode(true));
                 quickViewContent.querySelector('.qv-add-btn').addEventListener('click', () => { addToCart(productId); closeQuickView(); });
             }
             if(qvWishlistBtn) {
                  qvWishlistBtn.replaceWith(qvWishlistBtn.cloneNode(true));
                 quickViewContent.querySelector('.qv-wishlist-btn').addEventListener('click', (e) => toggleWishlist(productId, e.currentTarget));
             }
         }

        // Navigation
        mainCategoryLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); const category = link.dataset.category; currentFilter = (category === 'sale') ? { type: 'sale', value: 'sale' } : { type: 'category', value: category }; displayProducts(currentFilter); mainCategoryLinks.forEach(l => l.classList.remove('active')); subCategoryLinks.forEach(l => l.classList.remove('active')); link.classList.add('active'); }));
        subCategoryLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); const tag = link.dataset.tag; currentFilter = { type: 'tag', value: tag }; displayProducts(currentFilter); subCategoryLinks.forEach(l => l.classList.remove('active')); mainCategoryLinks.forEach(l => l.classList.remove('active')); link.classList.add('active'); }));

        // Search
        function performSearch() { const searchTerm = searchInput.value.trim(); if (searchTerm) { currentFilter = { type: 'search', value: searchTerm }; displayProducts(currentFilter); mainCategoryLinks.forEach(l => l.classList.remove('active')); subCategoryLinks.forEach(l => l.classList.remove('active')); } }
        if(searchButton) searchButton.addEventListener('click', performSearch);
        if(searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
        if(clearFiltersBtn) clearFiltersBtn.addEventListener('click', () => { currentFilter = { type: 'all', value: '' }; displayProducts(currentFilter); if(searchInput) searchInput.value = ''; mainCategoryLinks.forEach(l => l.classList.remove('active')); subCategoryLinks.forEach(l => l.classList.remove('active')); });

        // Modals & Auth
        if (loginTrigger) loginTrigger.addEventListener('click', (e) => { e.preventDefault(); openAuthModal('login'); });
        if (closeAuthModalBtn) closeAuthModalBtn.addEventListener('click', closeAuthModal);
        if (closeQuickViewBtn) closeQuickViewBtn.addEventListener('click', closeQuickView);
        if (modalOverlay) modalOverlay.addEventListener('click', () => { closeAuthModal(); closeQuickView(); });
        // Logout listener attached in updateLoginStateUI to ensure it exists

        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        if (signupForm) signupForm.addEventListener('submit', handleSignup);
        authTabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
        if (switchToSignupLink) switchToSignupLink.addEventListener('click', (e) => { e.preventDefault(); switchTab('signup'); });
        if (switchToLoginLink) switchToLoginLink.addEventListener('click', (e) => { e.preventDefault(); switchTab('login'); });

        // Newsletter
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) newsletterForm.addEventListener('submit', (e) => { e.preventDefault(); showToastNotification('Thank you for subscribing!', 'success'); newsletterForm.reset(); });

        // --- Toast Notification ---
        function showToastNotification(message, type = 'info') {
            if (!toastContainer) return;
            const toast = document.createElement('div');
            toast.className = `toast-notification ${type}`;
            toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`; // Changed error icon
            toastContainer.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 500);
            }, 3500);
        }

        // --- Initial Load ---
        updateLoginStateUI();
        displayProducts();
        updateCartCount();
        updateWishlistCount();
    });
