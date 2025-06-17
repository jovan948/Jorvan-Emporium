document.addEventListener('DOMContentLoaded', () => {
        // --- DOM Elements ---
        const loginSection = document.getElementById('admin-login');
        const dashboardSection = document.getElementById('admin-dashboard');
        const loginForm = document.getElementById('login-form');
        const logoutButton = document.getElementById('logout-button');
        const loginError = document.getElementById('login-error');
        const adminSidebarLinks = document.querySelectorAll('.admin-nav-link');
        const adminSections = document.querySelectorAll('.admin-section');
        const adminSectionTitle = document.getElementById('admin-section-title');

        // Add/Edit Item Form Elements
        const addItemForm = document.getElementById('add-item-form');
        const addItemStatus = document.getElementById('add-item-status'); // Renamed from success
        const addEditProductTitle = document.getElementById('add-edit-product-title');
        const editingItemIdInput = document.getElementById('editing-item-id');
        const saveItemBtn = document.getElementById('save-item-btn');
        const cancelEditBtn = document.getElementById('cancel-edit-btn');
        const adminAddNewProductBtn = document.getElementById('admin-add-new-product-btn');

        // Product List Elements
        const adminItemListBody = document.getElementById('admin-item-tbody');
        const adminSearchInput = document.getElementById('admin-search-product');
        const adminCategoryFilter = document.getElementById('admin-filter-category');

        // Chart Elements
        const revenueChartCanvas = document.getElementById('revenueChart');
        const categoryChartCanvas = document.getElementById('categoryChart');
        let revenueChartInstance = null;
        let categoryChartInstance = null;

        // --- Simulated Admin Data ---
        const ADMIN_USERNAME = 'admin';
        const ADMIN_PASSWORD = 'admin2025';

        // --- Check Login Status ---
        if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
            showDashboard();
        } else {
            showLogin();
        }

        // --- Login/Logout Logic ---
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (document.getElementById('username').value === ADMIN_USERNAME && document.getElementById('password').value === ADMIN_PASSWORD) {
                    sessionStorage.setItem('isAdminLoggedIn', 'true');
                    showDashboard();
                    loginError.style.display = 'none';
                } else {
                    loginError.textContent = 'Invalid username or password.';
                    loginError.style.display = 'block';
                    sessionStorage.removeItem('isAdminLoggedIn');
                }
            });
        }
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                sessionStorage.removeItem('isAdminLoggedIn');
                if (revenueChartInstance) revenueChartInstance.destroy();
                if (categoryChartInstance) categoryChartInstance.destroy();
                showLogin();
            });
        }

        // --- Show/Hide Sections ---
        function showLogin() { if (loginSection) loginSection.style.display = 'block'; if (dashboardSection) dashboardSection.style.display = 'none'; }
        function showDashboard() { if (loginSection) loginSection.style.display = 'none'; if (dashboardSection) dashboardSection.style.display = 'flex'; setupAdminNavigation(); loadAdminData(); populateCategoryFilter(); }

        // --- Admin Navigation ---
        function setupAdminNavigation() {
            adminSidebarLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigateToSection(link.dataset.section);
                });
            });
            // Activate the default section or persisted section
            const defaultSection = sessionStorage.getItem('adminActiveSection') || 'overview';
            navigateToSection(defaultSection, true); // true to prevent saving again
        }

        function navigateToSection(sectionId, skipSave = false) {
             const targetSectionId = `admin-section-${sectionId}`;
             const targetSection = document.getElementById(targetSectionId);
             const activeLink = document.querySelector(`.admin-nav-link[data-section="${sectionId}"]`);

             if (!targetSection || !activeLink) return; // Section doesn't exist

             // Update active link
             adminSidebarLinks.forEach(l => l.classList.remove('active'));
             activeLink.classList.add('active');

             // Show target section, hide others
             adminSections.forEach(section => section.classList.remove('active'));
             targetSection.classList.add('active');

             // Update header title
             if (adminSectionTitle) adminSectionTitle.textContent = activeLink.querySelector('span')?.textContent || sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

             // Save active section
             if (!skipSave) sessionStorage.setItem('adminActiveSection', sectionId);

             // Specific actions for sections
             if (sectionId === 'overview') createCharts();
             if (sectionId === 'products') displayAdminItems();
             if (sectionId === 'add-product' && !editingItemIdInput.value) resetAddItemForm(); // Reset if navigating directly to add

        }

        // Button to navigate to Add Product section
        if (adminAddNewProductBtn) {
            adminAddNewProductBtn.addEventListener('click', () => navigateToSection('add-product'));
        }


        // --- Load Dashboard Data ---
        function loadAdminData() {
            document.getElementById('total-visits').textContent = '1,482';
            document.getElementById('total-revenue').textContent = formatCurrency(6105300);
            document.getElementById('estimated-profit').textContent = formatCurrency(1350200);
            document.getElementById('items-sold').textContent = '615';
            if (document.getElementById('admin-section-overview')?.classList.contains('active')) createCharts();
            displayAdminItems();
        }

        // --- Chart Creation ---
        function createCharts() {
             if (!Chart) return; // Chart.js not loaded
             if (revenueChartInstance) revenueChartInstance.destroy();
             if (categoryChartInstance) categoryChartInstance.destroy();

            const revenueCtx = revenueChartCanvas?.getContext('2d');
            if (revenueCtx) {
                revenueChartInstance = new Chart(revenueCtx, {
                    type: 'line',
                    data: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'Revenue (UGX)', data: [500, 750, 600, 900, 850, 1100].map(v => v * 1000), borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.1)', fill: true, tension: 0.3 }] },
                    options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { callback: value => formatCurrency(value) } } } }
                });
            }
            const categoryCtx = categoryChartCanvas?.getContext('2d');
             if (categoryCtx) {
                 const categorySales = products.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + (Math.random() * 50); return acc; }, {});
                 categoryChartInstance = new Chart(categoryCtx, {
                     type: 'doughnut',
                     data: { labels: Object.keys(categorySales), datasets: [{ label: 'Sales', data: Object.values(categorySales), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'], hoverOffset: 4 }] },
                     options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
                 });
             }
        }

        // --- Product Management ---
         function populateCategoryFilter() {
             if (!adminCategoryFilter) return;
             const categories = [...new Set(products.map(p => p.category))];
             const currentVal = adminCategoryFilter.value; // Preserve selection if possible
             adminCategoryFilter.innerHTML = '<option value="">All Categories</option>';
             categories.sort().forEach(cat => {
                 const option = document.createElement('option');
                 option.value = cat;
                 option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
                 adminCategoryFilter.appendChild(option);
             });
             adminCategoryFilter.value = currentVal; // Restore selection
         }

        function displayAdminItems() {
             if (!adminItemListBody) return;
             const searchTerm = adminSearchInput ? adminSearchInput.value.toLowerCase() : '';
             const selectedCategory = adminCategoryFilter ? adminCategoryFilter.value : '';
             const filteredProducts = products.filter(p => (p.name.toLowerCase().includes(searchTerm)) && (!selectedCategory || p.category === selectedCategory));

             adminItemListBody.innerHTML = '';
             if (filteredProducts.length === 0) { adminItemListBody.innerHTML = '<tr><td colspan="6">No products found.</td></tr>'; return; }

             filteredProducts.forEach(product => {
                 const row = document.createElement('tr');
                 row.classList.add(product.inStock ? 'in-stock-row' : 'out-of-stock-row');
                 let priceHTML = formatCurrency(product.price);
                 if (product.discountPrice) priceHTML = `${formatCurrency(product.discountPrice)} <span class="admin-original-price">${formatCurrency(product.price)}</span>`;
                 const stockStatusHTML = product.inStock ? '<span class="status-badge in-stock">In Stock</span>' : '<span class="status-badge out-of-stock">Out of Stock</span>';
                 row.innerHTML = `
                     <td><img src="${product.imageUrl}" alt="" class="admin-item-image"></td>
                     <td>${product.name}</td>
                     <td>${product.category}</td>
                     <td>${priceHTML}</td>
                     <td>${stockStatusHTML}</td>
                     <td>
                         <button class="admin-button icon-button edit-btn" data-id="${product.id}" title="Edit"><i class="fas fa-edit"></i></button>
                         <button class="admin-button icon-button delete-btn" data-id="${product.id}" title="Delete"><i class="fas fa-trash"></i></button>
                     </td>
                 `;
                 adminItemListBody.appendChild(row);
             });
             addAdminTableActionListeners();
        }

        function addAdminTableActionListeners() {
             adminItemListBody.querySelectorAll('.delete-btn, .edit-btn').forEach(button => button.replaceWith(button.cloneNode(true))); // Prevent duplicates
             adminItemListBody.querySelectorAll('.delete-btn').forEach(button => button.addEventListener('click', (e) => { if (confirm('Delete this item?')) deleteAdminItem(parseInt(e.currentTarget.dataset.id, 10)); }));
             adminItemListBody.querySelectorAll('.edit-btn').forEach(button => button.addEventListener('click', (e) => populateEditForm(parseInt(e.currentTarget.dataset.id, 10))));
         }

         function deleteAdminItem(itemId) {
             const itemIndex = products.findIndex(p => p.id === itemId);
             if (itemIndex > -1) {
                 products.splice(itemIndex, 1);
                 displayAdminItems();
                 showAdminStatus('Item deleted.', 'info');
             }
         }

         function populateEditForm(itemId) {
             const product = products.find(p => p.id === itemId);
             if (!product || !addItemForm) return;
             resetAddItemForm(); // Clear previous state first
             navigateToSection('add-product');
             addEditProductTitle.textContent = 'Edit Item';
             editingItemIdInput.value = itemId; // Set hidden input
             document.getElementById('item-name').value = product.name;
             document.getElementById('item-category').value = product.category;
             document.getElementById('item-price').value = product.price;
             document.getElementById('item-discount-price').value = product.discountPrice || '';
             document.getElementById('item-image').value = product.imageUrl;
             document.getElementById('item-stock').value = product.inStock ? 'true' : 'false';
             document.getElementById('item-description').value = product.description || '';
             document.getElementById('item-tags').value = product.tags ? product.tags.join(', ') : '';
             document.getElementById('item-rating').value = product.rating || '';
             document.getElementById('item-review-count').value = product.reviewCount || '';
             saveItemBtn.textContent = 'Update Item';
             cancelEditBtn.style.display = 'inline-block'; // Show cancel button
             addItemForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
         }

         function handleSaveItem(e) {
             e.preventDefault();
             const editingId = parseInt(editingItemIdInput.value, 10);
             const isUpdating = !!editingId;

             const updatedData = {
                 id: isUpdating ? editingId : Date.now(),
                 name: document.getElementById('item-name').value,
                 category: document.getElementById('item-category').value,
                 price: parseFloat(document.getElementById('item-price').value),
                 discountPrice: parseFloat(document.getElementById('item-discount-price').value) || null,
                 imageUrl: document.getElementById('item-image').value,
                 description: document.getElementById('item-description').value,
                 tags: document.getElementById('item-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
                 inStock: document.getElementById('item-stock').value === 'true',
                 rating: parseFloat(document.getElementById('item-rating').value) || null,
                 reviewCount: parseInt(document.getElementById('item-review-count').value, 10) || 0
             };

             if (isUpdating) {
                 const itemIndex = products.findIndex(p => p.id === editingId);
                 if (itemIndex > -1) products[itemIndex] = updatedData;
             } else {
                 products.push(updatedData);
             }

             showAdminStatus(`Item ${isUpdating ? 'updated' : 'added'} successfully!`, 'success');
             resetAddItemForm();
             displayAdminItems();
             populateCategoryFilter();
             navigateToSection('products'); // Go back to product list
         }

         function resetAddItemForm() {
             if (!addItemForm) return;
             addItemForm.reset();
             addEditProductTitle.textContent = 'Add New Item';
             editingItemIdInput.value = '';
             saveItemBtn.textContent = 'Save Item';
             cancelEditBtn.style.display = 'none';
             addItemStatus.textContent = '';
             addItemStatus.className = 'status-message'; // Reset status class
         }

         function showAdminStatus(message, type = 'info') { // success, error, info
             if (!addItemStatus) return;
             addItemStatus.textContent = message;
             addItemStatus.className = `status-message ${type}`; // Add type class
             setTimeout(() => {
                 addItemStatus.textContent = '';
                 addItemStatus.className = 'status-message';
             }, 4000);
         }

         // --- Event Listeners ---
         if (addItemForm) addItemForm.addEventListener('submit', handleSaveItem);
         if (cancelEditBtn) cancelEditBtn.addEventListener('click', resetAddItemForm);
         if (adminSearchInput) adminSearchInput.addEventListener('input', displayAdminItems);
         if (adminCategoryFilter) adminCategoryFilter.addEventListener('change', displayAdminItems);

         // --- Initial Setup ---
         setupAdminNavigation(); // Call again to ensure correct section is shown on potential reload

    });
