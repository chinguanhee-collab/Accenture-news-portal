// Fetch the data from your local JSON file
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const newsGrid = document.getElementById('news-grid');
        
        // Loop through each article in the JSON array
        data.forEach(article => {
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
            
            // NEW LOGIC: Make the card clickable to open the modal
            card.onclick = () => {
                document.getElementById('modal-image').src = article.image;
                document.getElementById('modal-category').innerText = article.category;
                document.getElementById('modal-title').innerText = article.title;
                document.getElementById('modal-date').innerText = article.date;
                
                // This checks if you have a full "content" paragraph in your JSON, otherwise it uses the short summary
                document.getElementById('modal-content').innerText = article.content || article.summary;
                
                // Un-hide the modal
                document.getElementById('article-modal').classList.remove('hidden');
            };
            
            newsGrid.appendChild(card);
        });
    })
    .catch(error => console.error('Error loading news data:', error));

// NEW LOGIC: Close the modal when the 'X' is clicked
document.getElementById('close-modal').onclick = () => {
    document.getElementById('article-modal').classList.add('hidden');
};