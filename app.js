// We will store the original data here so we can filter it later
let allNewsData = [];

// Fetch the data from your local JSON file
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        allNewsData = data; // Save the fetched data
        renderGrid(allNewsData); // Show all articles initially
        setupCategoryFilters();  // Turn on the navigation links
    })
    .catch(error => console.error('Error loading news data:', error));

// Function to draw the articles on the screen
function renderGrid(articles) {
    const newsGrid = document.getElementById('news-grid');
    
    // Clear the grid completely before drawing new items
    newsGrid.innerHTML = ''; 
    
    // Loop through the provided articles and create a card for each
    articles.forEach(article => {
        const card = document.createElement('div');
        
        // ADDED ACCESSIBILITY: Added focus rings, tabindex, and ARIA roles
        card.className = 'bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col h-full focus:outline-none focus:ring-4 focus:ring-red-600';
        card.setAttribute('tabindex', '0'); // Makes the card reachable via the 'Tab' key
        card.setAttribute('role', 'button'); // Tells screen readers this acts like a button
        card.setAttribute('aria-label', `Read article: ${article.title}`);
        
        card.innerHTML = `
            <img src="${article.image}" alt="Image for ${article.title}" class="w-full h-48 object-cover">
            <div class="p-4 flex flex-col flex-grow">
                <span class="text-red-600 text-xs font-bold uppercase mb-2 block">${article.category}</span>
                <h4 class="text-lg font-bold mb-2 leading-tight">${article.title}</h4>
                <p class="text-gray-600 text-sm mb-4 flex-grow">${article.summary}</p>
                <span class="text-gray-400 text-xs block">${article.date}</span>
            </div>
        `;
        
        // Function to open the modal
        const openModal = () => {
            document.getElementById('modal-image').src = article.image;
            document.getElementById('modal-category').innerText = article.category;
            document.getElementById('modal-title').innerText = article.title;
            document.getElementById('modal-date').innerText = article.date;
            document.getElementById('modal-content').innerText = article.content || article.summary;
            document.getElementById('article-modal').classList.remove('hidden');
            
            // ACCESSIBILITY: Automatically shift the user's keyboard focus to the close button
            document.getElementById('close-modal').focus();
        };
        
        // Trigger modal on mouse click OR 'Enter' key press
        card.onclick = openModal;
        card.onkeydown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                openModal();
            }
        };
        
        newsGrid.appendChild(card);
    });
}

// Function to make the navigation links work
function setupCategoryFilters() {
    // Find all the list items inside the navigation bar
    const navLinks = document.querySelectorAll('nav ul li');
    
    navLinks.forEach(link => {
        link.onclick = () => {
            const selectedCategory = link.innerText.trim().toLowerCase();
            
            // If they click "All News", show everything
            if (selectedCategory === 'all news') {
                renderGrid(allNewsData);
            } else {
                // Otherwise, filter the saved data for articles that match the clicked category
                const filteredArticles = allNewsData.filter(article => 
                    article.category.toLowerCase() === selectedCategory
                );
                
                // Redraw the grid with only the matching articles
                renderGrid(filteredArticles);
            }
        };
    });
}

// Close the modal when the 'X' is clicked
document.getElementById('close-modal').onclick = () => {
    document.getElementById('article-modal').classList.add('hidden');
};

// NEW LOGIC: Real-time Search functionality
document.getElementById('search-bar').addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    // Filter the saved data for articles containing the search term in their title or summary
    const searchedArticles = allNewsData.filter(article => 
        article.title.toLowerCase().includes(searchTerm) || 
        article.summary.toLowerCase().includes(searchTerm)
    );
    
    // Redraw the grid with only the matching articles
    renderGrid(searchedArticles);
});

// ACCESSIBILITY: Close modal on 'Escape' key press
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        document.getElementById('article-modal').classList.add('hidden');
    }
});