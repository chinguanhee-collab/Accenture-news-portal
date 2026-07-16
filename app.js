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
        card.className = 'bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col h-full';
        
        card.innerHTML = `
            <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover">
            <div class="p-4 flex flex-col flex-grow">
                <span class="text-red-600 text-xs font-bold uppercase mb-2 block">${article.category}</span>
                <h4 class="text-lg font-bold mb-2 leading-tight">${article.title}</h4>
                <p class="text-gray-600 text-sm mb-4 flex-grow">${article.summary}</p>
                <span class="text-gray-400 text-xs block">${article.date}</span>
            </div>
        `;
        
        // Modal Pop-Up Logic
        card.onclick = () => {
            document.getElementById('modal-image').src = article.image;
            document.getElementById('modal-category').innerText = article.category;
            document.getElementById('modal-title').innerText = article.title;
            document.getElementById('modal-date').innerText = article.date;
            document.getElementById('modal-content').innerText = article.content || article.summary;
            document.getElementById('article-modal').classList.remove('hidden');
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
            const selectedCategory = link.innerText.trim();
            
            // Filter the saved data for articles that match the clicked category
            const filteredArticles = allNewsData.filter(article => 
                article.category.toLowerCase() === selectedCategory.toLowerCase()
            );
            
            // Redraw the grid with only the matching articles
            renderGrid(filteredArticles);
        };
    });
}

// Close the modal when the 'X' is clicked
document.getElementById('close-modal').onclick = () => {
    document.getElementById('article-modal').classList.add('hidden');
};