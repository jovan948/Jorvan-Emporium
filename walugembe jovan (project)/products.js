// Sample Product Data - Added ratings, review counts, more tags
    let products = [ // Use let to allow adding/deleting in simulation
      {
        id: 1,
        name: "Floral Print Midi Dress",
        category: "women",
        price: 85000,
        discountPrice: 65000,
        imageUrl: "https://images.unsplash.com/photo-1595777457583-45e18c6c9548?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGZsb3JhbCUyMGRyZXNzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        description: "A beautiful midi dress perfect for summer days. Lightweight fabric with adjustable straps.",
        tags: ["new", "trending", "women", "dresses", "summer", "floral", "sale"],
        inStock: true,
        rating: 4.5,
        reviewCount: 112
      },
      {
        id: 2,
        name: "Basic Cotton T-Shirt",
        category: "men",
        price: 40000,
        discountPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dCUyMHNoaXJ0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        description: "Comfortable and versatile 100% cotton t-shirt. Available in multiple colors.",
        tags: ["men", "tops", "basics", "t-shirt", "cotton"],
        inStock: true,
        rating: 4.2,
        reviewCount: 250
      },
      {
        id: 3,
        name: "Kids Graphic Print Hoodie",
        category: "kids",
        price: 55000,
        discountPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1612833603922-169d3da3ade1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8a2lkcyUyMGhvb2RpZXxlbnwwfHwwfHw%3D%3D&auto=format&fit=crop&w=300&q=80",
        description: "Warm and fun hoodie with a cool graphic print. Soft fleece lining.",
        tags: ["kids", "new", "hoodie", "graphic", "winter"],
        inStock: false, // Out of stock example
        rating: 4.8,
        reviewCount: 85
      },
      {
        id: 4,
        name: "Statement Gold Chain Necklace",
        category: "accessories",
        price: 30000,
        discountPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z29sZCUyMG5lY2tsYWNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        description: "Add a pop to your outfit with this bold gold-tone chain necklace.",
        tags: ["accessories", "women", "trending", "jewelry", "necklace", "gold"],
        inStock: true,
        rating: 4.0,
        reviewCount: 45
      },
       {
        id: 5,
        name: "Boho Tufted Throw Pillow Cover",
        category: "home",
        price: 45000,
        discountPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1617364945999-88c815643451?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9obyUyMHBpbGxvd3xlbnwwfHwwfHw%3D%3D&auto=format&fit=crop&w=300&q=80",
        description: "Cozy addition to your living space with textured tufted details. Cover only.",
        tags: ["home", "decor", "pillow", "boho", "living-room", "new"],
        inStock: true,
        rating: 4.6,
        reviewCount: 98
      },
       {
        id: 6,
        name: "Organic Rosehip Face Serum",
        category: "beauty",
        price: 70000,
        discountPrice: 60000,
        imageUrl: "https://images.unsplash.com/photo-1629198726-4cd3a5aa1cbd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZmFjZSUyMHNlcnVtfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        description: "Nourishing serum for radiant skin, made with organic rosehip oil.",
        tags: ["beauty", "sale", "skincare", "serum", "organic", "face"],
        inStock: true,
        rating: 4.9,
        reviewCount: 150
      },
       {
        id: 7,
        name: "Plus Size Flowy Maxi Skirt",
        category: "women",
        price: 75000,
        discountPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1591129841117-3851fe5a66a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGx1cyUyMHNpemUlMjBmYXNoaW9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        description: "Flowy and comfortable maxi skirt in extended sizes. Elastic waistband.",
        tags: ["women", "plus-size", "new", "skirts", "maxi", "summer"],
        inStock: true,
        rating: 4.4,
        reviewCount: 67
      },
       {
        id: 8,
        name: "Men's Suede Casual Loafers",
        category: "men",
        price: 110000,
        discountPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWVucyUyMHNob2VzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        description: "Stylish suede loafers for everyday smart-casual wear. Comfortable fit.",
        tags: ["men", "shoes", "trending", "loafers", "suede", "casual"],
        inStock: true,
        rating: 4.7,
        reviewCount: 105
      },
      {
        id: 9,
        name: "High-Waisted Skinny Jeans",
        category: "women",
        price: 95000,
        discountPrice: 75000,
        imageUrl: "https://images.unsplash.com/photo-1604176354204-926873782855?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amVhbnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=80",
        description: "Classic high-waisted skinny jeans with stretch for comfort.",
        tags: ["women", "jeans", "denim", "skinny", "high-waist", "sale", "trending"],
        inStock: true,
        rating: 4.3,
        reviewCount: 180
      },
      {
        id: 10,
        name: "Men's Checkered Flannel Shirt",
        category: "men",
        price: 65000,
        discountPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zmxhbm5lbCUyMHNoaXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=80",
        description: "Soft cotton flannel shirt with a classic checkered pattern.",
        tags: ["men", "tops", "shirts", "flannel", "checkered", "casual", "new"],
        inStock: true,
        rating: 4.6,
        reviewCount: 92
      },
       {
        id: 11,
        name: "Ceramic Coffee Mug Set (4 pcs)",
        category: "home",
        price: 50000,
        discountPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1586197104760-d4c898440695?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29mZmVlJTIwbXVnc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=300&q=80",
        description: "Set of four durable ceramic mugs, perfect for your morning coffee.",
        tags: ["home", "kitchen", "mugs", "ceramic", "set"],
        inStock: true,
        rating: 4.7,
        reviewCount: 75
      },
       {
        id: 12,
        name: "Waterproof Liquid Eyeliner",
        category: "beauty",
        price: 25000,
        discountPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1599948128015-4b4977693f69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXllbGluZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=80",
        description: "Long-lasting, smudge-proof liquid eyeliner with a precision tip.",
        tags: ["beauty", "makeup", "eyes", "eyeliner", "waterproof", "trending"],
        inStock: true,
        rating: 4.1,
        reviewCount: 210
      }
    ];

    // Function to format currency
    function formatCurrency(amount) {
      if (amount === null || typeof amount === 'undefined') {
        return '';
      }
      return `UGX ${amount.toLocaleString('en-US')}`;
    }

    // Function to generate star rating HTML (simulation)
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
        if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < emptyStars; i++) starsHTML += '<i class="far fa-star"></i>';
        return starsHTML;
    }
