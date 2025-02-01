// script.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    let dishes = [];

    // 🔥 DEBUG: Track data loading state
    let dataLoaded = false;
    console.log('🟡 Initializing application...');

    // Load JSON data with error handling
    fetch('ming_moon_allergies.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ Data loaded successfully. First item:', data[0]);
            dishes = data;
            dataLoaded = true;
            console.log(`📊 Total dishes loaded: ${dishes.length}`);
        })
        .catch(error => {
            console.error('❌ Critical error loading data:', error);
            resultsDiv.innerHTML = `<div class="not-found">Error loading menu data. Please refresh the page.</div>`;
        });

    // Search functionality with enhanced debugging
    searchInput.addEventListener('input', (e) => {
        const rawInput = e.target.value;
        const searchTerm = rawInput.trim().toLowerCase();
        resultsDiv.innerHTML = '';

        console.group('🔍 New Search Operation');
        console.log('Raw input:', rawInput);
        console.log('Processed search term:', searchTerm);

        if (!dataLoaded) {
            console.warn('⚠️ Search attempted before data loaded');
            resultsDiv.innerHTML = '<div class="not-found">Menu data still loading... Please wait.</div>';
            return;
        }

        if (searchTerm.length === 0) {
            console.log('🔄 Empty search term - clearing results');
            return;
        }

        console.log('📜 All dish names:', dishes.map(d => d.English));

        const filteredDishes = dishes.filter(dish => {
            const dishName = dish.English.toLowerCase();
            const match = dishName.includes(searchTerm);
            
            // 🔥 DEBUG: Individual dish matching
            console.log(`   Comparing "${dishName}" to "${searchTerm}":`, 
                      match ? 'MATCH' : 'NO MATCH');
            
            return match;
        });

        console.log(`🎯 Found ${filteredDishes.length} matches`);

        if (filteredDishes.length === 0) {
            console.warn('⛔ No matches found');
            resultsDiv.innerHTML = '<div class="not-found">No matching dishes found</div>';
            return;
        }

        filteredDishes.forEach(dish => {
            const card = document.createElement('div');
            card.className = 'allergy-card';
            
            let html = `<h3>${dish.English}</h3>`;
            html += `<div class="category">${dish.Category}</div>`;
            
            // Add allergy information
            Object.entries(dish).forEach(([key, value]) => {
                if (!['Category', 'English'].includes(key)) {
                    const statusClass = value === 'Yes' ? 'warning' : 'safe';
                    html += `
                        <div class="allergy-item">
                            <span>${key}:</span>
                            <span class="${statusClass}">${value}</span>
                        </div>
                    `;
                }
            });

            card.innerHTML = html;
            resultsDiv.appendChild(card);
        });

        console.groupEnd();
    });
});