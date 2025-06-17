document.addEventListener('DOMContentLoaded', () => {
        // --- DOM Elements ---
        const cartItemsTableContainer = document.getElementById('cart-items-table');
        const summarySubtotal = document.getElementById('summary-subtotal');
        const summaryItemCount = document.getElementById('summary-item-count');
        const finalSummarySubtotal = document.getElementById('final-summary-subtotal');
        const finalSummaryItemCount = document.getElementById('final-summary-item-count');
        const summaryDeliveryCost = document.getElementById('summary-delivery-cost');
        const finalSummaryDelivery = document.getElementById('final-summary-delivery');
        const summaryTotal = document.getElementById('final-summary-total');
        const deliveryLocationSelect = document.getElementById('delivery-location');
        const proceedToDeliveryBtn = document.getElementById('proceed-to-delivery-btn');
        const placeOrderBtn = document.getElementById('place-order-btn');
        const backToCartBtn = document.getElementById('back-to-cart-btn');
        const emptyCartMessagePage = document.getElementById('empty-cart-message-page');
        const cartLayout = document.querySelector('.cart-layout');
        const cartReviewStep = document.getElementById('cart-review-step');
        const deliveryPaymentStep = document.getElementById('delivery-payment-step');
        const confirmationStep = document.getElementById('confirmation-step');
        const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
        const paymentDetailsSections = document.querySelectorAll('.payment-details');
        const paypalButtonSim = document.getElementById('paypal-button');
        const confirmOrderNumber = document.getElementById('confirm-order-number');
        const deliveryForm = document.getElementById('delivery-form');
        const momoAmountSpan = document.querySelector('.momo-amount');

        // --- State ---
        let cart = JSON.parse(sessionStorage.getItem('radianceCart')) || [];
        let deliveryCost = 0;
        let selectedLocation = '';

        // --- Delivery Locations and Costs ---
        const deliveryOptions = {
            "Kampala Central": 5000, "Makindye": 6000, "Nakawa": 6000, "Rubaga": 6500, "Kawempe": 7000,
            "Wakiso (Kira, Nansana)": 8000, "Wakiso (Gayaza, Kakiri)": 10000,
            "Mukono Town": 10000, "Seeta": 9000,
            "Entebbe Town": 12000, "Kitoro": 13000,
            "Jinja City": 15000, "Mbarara City": 25000, "Gulu City": 30000, "Arua City": 35000,
            "Masaka City": 18000, "Fort Portal City": 28000, "Mbale City": 22000,
            "Soroti City": 26000, "Lira City": 28000,
            "Pickup Station (Kampala)": 3000, "Pickup Station (Upcountry)": 5000
        };

        // --- Functions ---
        function populateDeliveryLocations() {
            if (!deliveryLocationSelect) return;
            deliveryLocationSelect.innerHTML = '<option value="">-- Select Location --</option>';
            for (const location in deliveryOptions) {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = `${location} (+${formatCurrency(deliveryOptions[location])})`;
                deliveryLocationSelect.appendChild(option);
            }
        }

        function updateDeliveryCost() {
            selectedLocation = deliveryLocationSelect.value;
            deliveryCost = deliveryOptions[selectedLocation] || 0;
            summaryDeliveryCost.textContent = formatCurrency(deliveryCost);
            finalSummaryDelivery.textContent = formatCurrency(deliveryCost);
            updateSummary();
        }

        function calculateSubtotal() { return cart.reduce((sum, item) => { const product = products.find(p => p.id === item.id); return sum + (product ? (product.discountPrice || product.price) * item.quantity : 0); }, 0); }
        function calculateTotalItems() { return cart.reduce((sum, item) => sum + item.quantity, 0); }

        function updateSummary() {
            const subtotal = calculateSubtotal();
            const totalItems = calculateTotalItems();
            const total = subtotal + deliveryCost;

            summaryItemCount.textContent = totalItems;
            summarySubtotal.textContent = formatCurrency(subtotal);
            finalSummaryItemCount.textContent = totalItems;
            finalSummarySubtotal.textContent = formatCurrency(subtotal);
            finalSummaryDelivery.textContent = formatCurrency(deliveryCost);
            summaryTotal.textContent = formatCurrency(total);
            if (momoAmountSpan) momoAmountSpan.textContent = formatCurrency(total);

            proceedToDeliveryBtn.disabled = cart.length === 0;
            placeOrderBtn.disabled = cart.length === 0 || !selectedLocation || !isDeliveryFormValid();
        }

        function isDeliveryFormValid() {
            const name = document.getElementById('delivery-name')?.value.trim();
            const phone = document.getElementById('delivery-phone')?.value.trim();
            const phoneRegex = /^(07[0-9]{8})$/; // Basic Ugandan format
            return name && phone && phoneRegex.test(phone) && selectedLocation;
        }

        function displayCartItems() {
            if (!cartItemsTableContainer) return;
            cartItemsTableContainer.innerHTML = '';

            if (cart.length === 0) {
                 if (cartLayout) cartLayout.style.display = 'none';
                 if (emptyCartMessagePage) emptyCartMessagePage.style.display = 'flex';
                 showStep('cart-review-step');
                 updateSummary();
                 return;
            }

             if (cartLayout) cartLayout.style.display = 'grid';
             if (emptyCartMessagePage) emptyCartMessagePage.style.display = 'none';

            const table = document.createElement('table');
            table.innerHTML = `<thead><tr><th colspan="2">Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th>Remove</th></tr></thead><tbody></tbody>`;
            const tbody = table.querySelector('tbody');

            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (!product) return;
                const row = document.createElement('tr');
                row.classList.add('cart-page-item');
                const currentPrice = product.discountPrice || product.price;
                const itemSubtotal = currentPrice * item.quantity;
                row.innerHTML = `
                    <td><img src="${product.imageUrl}" alt="${product.name}" class="cart-page-item-image"></td>
                    <td> <p class="cart-page-item-name">${product.name}</p> <p class="cart-page-item-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}">${product.inStock ? 'In Stock' : 'Out of Stock'}</p> </td>
                    <td>${formatCurrency(currentPrice)}</td>
                    <td> <div class="cart-item-quantity"> <button class="quantity-btn decrease-qty" data-id="${product.id}" ${item.quantity <= 1 ? 'disabled' : ''} title="Decrease">-</button> <span>${item.quantity}</span> <button class="quantity-btn increase-qty" data-id="${product.id}" title="Increase">+</button> </div> </td>
                    <td><strong>${formatCurrency(itemSubtotal)}</strong></td>
                    <td> <button class="remove-item-btn page-remove-btn" data-id="${product.id}" title="Remove"><i class="fas fa-trash-alt"></i></button> </td>`;
                tbody.appendChild(row);
            });

            cartItemsTableContainer.appendChild(table);
            addCartPageEventListeners();
            updateSummary();
        }

        function saveCartToSession() {
            sessionStorage.setItem('radianceCart', JSON.stringify(cart));
             const totalItems = calculateTotalItems();
             try { window.parent.document.querySelector('.cart-count').textContent = totalItems; }
             catch (e) { document.querySelector('.cart-count')?.textContent = totalItems; }
        }

        function updateQuantity(productId, change) {
            const itemIndex = cart.findIndex(item => item.id === productId);
            if (itemIndex > -1) {
                cart[itemIndex].quantity += change;
                if (cart[itemIndex].quantity <= 0) cart.splice(itemIndex, 1);
                saveCartToSession();
                displayCartItems();
            }
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            saveCartToSession();
            displayCartItems();
        }

        function addCartPageEventListeners() {
            // Use event delegation on the table body for better performance
            const tbody = cartItemsTableContainer.querySelector('tbody');
            if (!tbody) return;

            // Remove previous listeners if any (simple approach)
            tbody.replaceWith(tbody.cloneNode(true)); // Clone to remove listeners
            const newTbody = cartItemsTableContainer.querySelector('tbody'); // Get the new tbody

            newTbody.addEventListener('click', (event) => {
                const target = event.target;
                const decreaseBtn = target.closest('.decrease-qty');
                const increaseBtn = target.closest('.increase-qty');
                const removeBtn = target.closest('.page-remove-btn');

                if (decreaseBtn && !decreaseBtn.disabled) {
                    updateQuantity(parseInt(decreaseBtn.dataset.id, 10), -1);
                } else if (increaseBtn) {
                    updateQuantity(parseInt(increaseBtn.dataset.id, 10), 1);
                } else if (removeBtn) {
                    removeFromCart(parseInt(removeBtn.dataset.id, 10));
                }
            });
        }


        function showStep(stepId) {
            document.querySelectorAll('.cart-step').forEach(step => step.classList.remove('active'));
            document.getElementById(stepId)?.classList.add('active');
            document.querySelectorAll('.cart-header-steps .step').forEach((step, index) => {
                 step.classList.remove('active');
                 if ((stepId === 'cart-review-step' && index === 0) || (stepId === 'delivery-payment-step' && index <= 1) || (stepId === 'confirmation-step' && index <= 2)) {
                     step.classList.add('active');
                 }
             });
             window.scrollTo(0, 0);
        }

        function handlePlaceOrder() {
             if (!isDeliveryFormValid()) {
                 alert("Please fill Name, Phone, and select Location.");
                 // Visual feedback for invalid fields
                 document.getElementById('delivery-name')?.classList.toggle('invalid', !document.getElementById('delivery-name')?.value.trim());
                 document.getElementById('delivery-phone')?.classList.toggle('invalid', !/^(07[0-9]{8})$/.test(document.getElementById('delivery-phone')?.value.trim()));
                 deliveryLocationSelect?.classList.toggle('invalid', !selectedLocation);
                 return;
             }
             if (cart.length === 0) { alert("Cart is empty."); return; }

             const orderNumber = `RV-${Date.now().toString().slice(-6)}`;
             confirmOrderNumber.textContent = orderNumber;
             cart = [];
             saveCartToSession();
             showStep('confirmation-step');
        }

        // --- Event Listeners ---
        if (deliveryLocationSelect) deliveryLocationSelect.addEventListener('change', updateDeliveryCost);
        if (proceedToDeliveryBtn) proceedToDeliveryBtn.addEventListener('click', () => showStep('delivery-payment-step'));
        if (backToCartBtn) backToCartBtn.addEventListener('click', () => showStep('cart-review-step'));
        if (placeOrderBtn) placeOrderBtn.addEventListener('click', handlePlaceOrder);
        if (deliveryForm) deliveryForm.addEventListener('input', updateSummary); // Re-check button state

        paymentOptions.forEach(radio => radio.addEventListener('change', () => {
            paymentDetailsSections.forEach(section => section.style.display = 'none');
            const detailsSection = document.querySelector('.' + radio.value + '-details');
            if (detailsSection) detailsSection.style.display = 'block';
        }));
        document.querySelector('input[name="payment-method"]:checked')?.dispatchEvent(new Event('change'));

        if (paypalButtonSim) paypalButtonSim.addEventListener('click', () => alert("Redirecting to PayPal..."));

        // --- Initial Load ---
        populateDeliveryLocations();
        displayCartItems();
        showStep('cart-review-step');

    });
