/**
 * World Ballets - Main JavaScript
 * 
 * This is the main entry point for the World Ballets homepage.
 * It initializes the UI and loads the data for the homepage.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI
    UIController.init();
    
    // Load banner slider data
    DataService.getAllCurrentPerformances()
        .then(performances => {
            // Use the first 5 performances for the banner slider
            const bannerSlides = performances.slice(0, 5);
            UIController.initBannerSlider(bannerSlides, 'bannerSlider');
        })
        .catch(error => {
            console.error('Error loading banner data:', error);
            document.getElementById('bannerSlider').innerHTML = '<p>Error loading performances. Please try again later.</p>';
        });
    
    // Load featured performances
    DataService.getFeaturedPerformances(3)
        .then(performances => {
            UIController.renderPerformanceCards(performances, 'featuredPerformances');
        })
        .catch(error => {
            console.error('Error loading featured performances:', error);
            document.getElementById('featuredPerformances').innerHTML = '<p>Error loading performances. Please try again later.</p>';
        });
    
    // Load upcoming performances timeline
    DataService.getAllCurrentPerformances()
        .then(performances => {
            // Use the first 8 performances for the timeline
            const timelinePerformances = performances.slice(0, 8);
            UIController.renderPerformanceTimeline(timelinePerformances, 'performanceTimeline');
        })
        .catch(error => {
            console.error('Error loading timeline performances:', error);
            document.getElementById('performanceTimeline').innerHTML = '<p>Error loading performances. Please try again later.</p>';
        });
});
