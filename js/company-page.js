/**
 * World Ballets - Company Page JavaScript
 * 
 * This script handles the functionality for the individual ballet company pages.
 * It loads company information and performances, and renders them on the page.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI
    UIController.init();
    
    // Get company ID from the current URL
    // Example: /companies/nbc.html -> nbc
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    const companyId = filename.replace('.html', '');
    
    if (!companyId) {
        console.error('Company ID not found in URL');
        return;
    }
    
    // Load company information
    DataService.getCompanyInfo(companyId)
        .then(company => {
            // Update page title
            document.title = `${company.name} - World Ballets`;
            
            // Update company logo
            const logoImg = document.querySelector('.company-logo-img');
            if (logoImg) {
                logoImg.src = company.logo;
                logoImg.alt = `${company.name} Logo`;
            }
            
            // Update company name and description
            const companyNameElement = document.querySelector('.company-info h1');
            const companyDescriptionElement = document.querySelector('.company-description');
            
            if (companyNameElement) {
                companyNameElement.textContent = company.name.toUpperCase();
            }
            
            if (companyDescriptionElement) {
                companyDescriptionElement.textContent = company.description;
            }
        })
        .catch(error => {
            console.error('Error loading company information:', error);
        });
    
    // Load company performances
    DataService.getCompanyPerformances(companyId)
        .then(performances => {
            // Process performances to identify current and next shows
            const currentDate = new Date();
            
            // Sort performances by date
            performances.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            
            // Mark current and next performances
            performances.forEach((performance, index) => {
                // Check if performance is current (happening now or within 30 days)
                performance.isCurrent = DataService.isCurrentPerformance(performance);
                
                // Check if performance is the next upcoming one
                performance.isNext = DataService.isNextPerformance(performances, performance);
            });
            
            // Render current and upcoming performances
            const currentPerformances = performances.filter(p => !p.isPast);
            UIController.renderCompanyPerformances(currentPerformances, 'currentPerformances');
            
            // Render past performances
            const pastPerformances = performances.filter(p => p.isPast);
            UIController.renderCompanyPerformances(pastPerformances, 'pastPerformances', true);
            
            // Initialize past performances toggle
            UIController.initPastPerformancesToggle('togglePastBtn', 'pastPerformances');
        })
        .catch(error => {
            console.error('Error loading company performances:', error);
            document.getElementById('currentPerformances').innerHTML = '<p>Error loading performances. Please try again later.</p>';
        });
});
