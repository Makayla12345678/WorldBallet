/**
 * World Ballet - Calendar Functionality
 * 
 * This file handles the calendar functionality for the World Ballet website,
 * including generating the calendar grid, fetching performances for specific dates,
 * handling date selection, and filtering performances by company.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Calendar elements
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYearElement = document.getElementById('currentMonthYear');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const selectedDateElement = document.getElementById('selectedDate');
    const performancesList = document.getElementById('performancesList');
    
    // Company filter checkboxes
    const companyFilters = document.querySelectorAll('.company-filters input[type="checkbox"]');
    const allCompaniesCheckbox = document.querySelector('.company-filters input[value="all"]');
    
    // State variables
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = formatDateString(currentDate);
    let selectedDateObj = new Date(currentDate);
    let activeFilters = ['all']; // Default to all companies
    
    // Performance data cache
    const performanceCache = {};
    
    // Initialize calendar
    generateCalendar(currentMonth, currentYear);
    updateMonthYearDisplay();
    fetchPerformancesForMonth(currentMonth, currentYear);
    
    // Event listeners
    prevMonthButton.addEventListener('click', goToPreviousMonth);
    nextMonthButton.addEventListener('click', goToNextMonth);
    
    // Set up company filter event listeners
    companyFilters.forEach(checkbox => {
        checkbox.addEventListener('change', handleCompanyFilterChange);
    });
    
    /**
     * Generates the calendar grid for the specified month and year
     * @param {number} month - Month (0-11)
     * @param {number} year - Year (e.g., 2025)
     */
    function generateCalendar(month, year) {
        // Clear existing calendar
        calendarGrid.innerHTML = '';
        
        // Get first day of month and number of days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Get days from previous month to fill first row
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Add days from previous month
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayElement = createDayElement(daysInPrevMonth - i, true);
            calendarGrid.appendChild(dayElement);
        }
        
        // Add days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = createDayElement(day, false);
            
            // Check if this is today's date
            const currentDateObj = new Date();
            if (day === currentDateObj.getDate() && 
                month === currentDateObj.getMonth() && 
                year === currentDateObj.getFullYear()) {
                dayElement.classList.add('today');
            }
            
            // Check if this is the selected date
            const dateString = formatDateString(new Date(year, month, day));
            if (dateString === selectedDate) {
                dayElement.classList.add('selected');
            }
            
            // Add click event to select date
            dayElement.addEventListener('click', function() {
                selectDate(day, month, year);
            });
            
            calendarGrid.appendChild(dayElement);
        }
        
        // Calculate how many days from next month are needed to complete the grid
        const totalCells = 42; // 6 rows of 7 days
        const remainingCells = totalCells - (firstDay + daysInMonth);
        
        // Add days from next month
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = createDayElement(day, true);
            calendarGrid.appendChild(dayElement);
        }
    }
    
    /**
     * Creates a day element for the calendar grid
     * @param {number} day - Day of month
     * @param {boolean} isOtherMonth - Whether this day is from another month
     * @returns {HTMLElement} - The day element
     */
    function createDayElement(day, isOtherMonth) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }
        
        const dayNumber = document.createElement('div');
        dayNumber.classList.add('calendar-day-number');
        dayNumber.textContent = day;
        
        dayElement.appendChild(dayNumber);
        
        // Add container for performance entries
        const entriesContainer = document.createElement('div');
        entriesContainer.classList.add('performance-entries');
        dayElement.appendChild(entriesContainer);
        
        return dayElement;
    }
    
    /**
     * Updates the month and year display
     */
    function updateMonthYearDisplay() {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        currentMonthYearElement.textContent = `${months[currentMonth]} ${currentYear}`;
    }
    
    /**
     * Navigates to the previous month
     */
    function goToPreviousMonth() {
        currentMonth--;
        
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        
        generateCalendar(currentMonth, currentYear);
        updateMonthYearDisplay();
        fetchPerformancesForMonth(currentMonth, currentYear);
    }
    
    /**
     * Navigates to the next month
     */
    function goToNextMonth() {
        currentMonth++;
        
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        
        generateCalendar(currentMonth, currentYear);
        updateMonthYearDisplay();
        fetchPerformancesForMonth(currentMonth, currentYear);
    }
    
    /**
     * Selects a date and displays performances for that date
     * @param {number} day - Day of month
     * @param {number} month - Month (0-11)
     * @param {number} year - Year (e.g., 2025)
     */
    function selectDate(day, month, year) {
        console.log(`Selecting date: ${day}/${month + 1}/${year}`);
        
        // Remove selected class from previously selected date
        const previouslySelected = document.querySelector('.calendar-day.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        
        // Find the day element that was clicked
        const dayElements = document.querySelectorAll('.calendar-day');
        let selectedDayElement = null;
        
        for (let i = 0; i < dayElements.length; i++) {
            const dayNumber = parseInt(dayElements[i].querySelector('.calendar-day-number').textContent);
            const isOtherMonth = dayElements[i].classList.contains('other-month');
            
            // Check if this is the day we're looking for
            if (dayNumber === day && !isOtherMonth) {
                selectedDayElement = dayElements[i];
                break;
            }
        }
        
        // Add selected class to the clicked day
        if (selectedDayElement) {
            selectedDayElement.classList.add('selected');
        }
        
        // Update selected date
        selectedDate = formatDateString(new Date(year, month, day));
        selectedDateObj = new Date(year, month, day);
        
        // Update selected date display
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        selectedDateElement.textContent = selectedDateObj.toLocaleDateString('en-US', options);
        
        // Fetch and display performances for selected date
        fetchPerformancesForDate(selectedDate);
    }
    
    /**
     * Fetches performances for a specific date
     * @param {string} dateString - Date in YYYY-MM-DD format
     */
    async function fetchPerformancesForDate(dateString) {
        try {
            // Show loading state
            performancesList.innerHTML = '<div class="loading-message">Loading performances...</div>';
            
            // Check cache first
            if (performanceCache[dateString]) {
                displayPerformances(performanceCache[dateString], dateString);
                return;
            }
            
            // Fetch performances from API
            const performances = await DataService.getPerformancesByDate(dateString);
            
            // Cache the results
            performanceCache[dateString] = performances;
            
            // Display performances
            displayPerformances(performances, dateString);
        } catch (error) {
            console.error(`Error fetching performances for date ${dateString}:`, error);
            performancesList.innerHTML = '<div class="error-message">Error loading performances. Please try again later.</div>';
        }
    }
    
    /**
     * Fetches performances for an entire month
     * @param {number} month - Month (0-11)
     * @param {number} year - Year (e.g., 2025)
     */
    async function fetchPerformancesForMonth(month, year) {
        try {
            // Get first and last day of month
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            
            // Format dates
            const firstDayString = formatDateString(firstDay);
            const lastDayString = formatDateString(lastDay);
            
            // Fetch all performances for the month
            const allPerformances = await DataService.getAllCurrentPerformances();
            
            // Filter performances that fall within the month
            const monthPerformances = allPerformances.filter(performance => {
                const startDate = new Date(performance.startDate);
                const endDate = new Date(performance.endDate);
                
                return (
                    (startDate <= lastDay && endDate >= firstDay) || // Performance spans the month
                    (startDate >= firstDay && startDate <= lastDay) || // Performance starts in the month
                    (endDate >= firstDay && endDate <= lastDay) // Performance ends in the month
                );
            });
            
            // Mark days with performances
            markDaysWithPerformances(monthPerformances, month, year);
            
            // If the selected date is in this month, update the performances display
            if (selectedDateObj.getMonth() === month && selectedDateObj.getFullYear() === year) {
                fetchPerformancesForDate(selectedDate);
            }
        } catch (error) {
            console.error(`Error fetching performances for month ${month + 1}/${year}:`, error);
        }
    }
    
    /**
     * Marks days in the calendar that have performances
     * @param {Array} performances - Array of performance objects
     * @param {number} month - Month (0-11)
     * @param {number} year - Year (e.g., 2025)
     */
    function markDaysWithPerformances(performances, month, year) {
        // Create a map of dates with performances
        const performancesByDay = {};
        
        performances.forEach(performance => {
            const startDate = new Date(performance.startDate);
            const endDate = new Date(performance.endDate);
            
            // For each day in the performance range
            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                // Skip if not in current month
                if (date.getMonth() !== month || date.getFullYear() !== year) {
                    continue;
                }
                
                const day = date.getDate();
                
                // Initialize array if needed
                if (!performancesByDay[day]) {
                    performancesByDay[day] = [];
                }
                
                // Add performance to the day
                if (!performancesByDay[day].some(p => p.id === performance.id)) {
                    performancesByDay[day].push(performance);
                }
            }
        });
        
        // Mark days in the calendar
        const dayElements = document.querySelectorAll('.calendar-day:not(.other-month)');
        
        dayElements.forEach(dayElement => {
            const dayNumber = parseInt(dayElement.querySelector('.calendar-day-number').textContent);
            
            if (performancesByDay[dayNumber] && performancesByDay[dayNumber].length > 0) {
                dayElement.classList.add('has-performances');
                
                // Add performance entries
                const entriesContainer = dayElement.querySelector('.performance-entries');
                entriesContainer.innerHTML = ''; // Clear any existing entries
                
                // Display up to 3 performances
                const maxDisplayed = 3;
                const dayPerformances = performancesByDay[dayNumber];
                const displayCount = Math.min(maxDisplayed, dayPerformances.length);
                
                for (let i = 0; i < displayCount; i++) {
                    const performance = dayPerformances[i];
                    const entry = document.createElement('div');
                    entry.classList.add('performance-entry');
                    entry.textContent = `${performance.title} - ${performance.companyName || performance.company}`;
                    entriesContainer.appendChild(entry);
                }
                
                // Add "+X more" indicator if there are more than 3 performances
                if (dayPerformances.length > maxDisplayed) {
                    const moreIndicator = document.createElement('div');
                    moreIndicator.classList.add('more-performances');
                    moreIndicator.textContent = `+${dayPerformances.length - maxDisplayed} more`;
                    entriesContainer.appendChild(moreIndicator);
                }
            }
        });
    }
    
    /**
     * Displays performances for a specific date
     * @param {Array} performances - Array of performance objects
     * @param {string} dateString - Date in YYYY-MM-DD format
     */
    function displayPerformances(performances, dateString) {
        // Clear performances list
        performancesList.innerHTML = '';
        
        // Filter performances based on active company filters
        const filteredPerformances = filterPerformancesByCompany(performances);
        
        // If no performances, show message
        if (filteredPerformances.length === 0) {
            performancesList.innerHTML = '<div class="no-performances-message">No performances scheduled for this date</div>';
            return;
        }
        
        // Display each performance
        filteredPerformances.forEach(performance => {
            const performanceCard = createPerformanceCard(performance);
            performancesList.appendChild(performanceCard);
        });
    }
    
    /**
     * Creates a performance card element
     * @param {Object} performance - Performance object
     * @returns {HTMLElement} - The performance card element
     */
    function createPerformanceCard(performance) {
        const card = document.createElement('div');
        card.classList.add('performance-card');
        
        // Create header with company name
        const header = document.createElement('div');
        header.classList.add('performance-card-header');
        header.textContent = performance.companyName || performance.company;
        card.appendChild(header);
        
        // Create content
        const content = document.createElement('div');
        content.classList.add('performance-card-content');
        
        // Title
        const title = document.createElement('h3');
        title.textContent = performance.title;
        content.appendChild(title);
        
        // Dates
        const dates = document.createElement('div');
        dates.classList.add('dates');
        dates.textContent = DataService.formatDateRange(performance.startDate, performance.endDate);
        content.appendChild(dates);
        
        // Description
        const description = document.createElement('div');
        description.classList.add('description');
        description.textContent = performance.description;
        content.appendChild(description);
        
        // View details button
        const viewDetailsBtn = document.createElement('a');
        viewDetailsBtn.classList.add('view-details-btn');
        viewDetailsBtn.textContent = 'View Details';
        viewDetailsBtn.href = `companies/${performance.company}.html?performance=${performance.id}`;
        content.appendChild(viewDetailsBtn);
        
        card.appendChild(content);
        
        return card;
    }
    
    /**
     * Handles company filter checkbox changes
     * @param {Event} event - Change event
     */
    function handleCompanyFilterChange(event) {
        const checkbox = event.target;
        const company = checkbox.value;
        
        if (company === 'all') {
            // If "All Companies" is checked, check it and uncheck all others
            if (checkbox.checked) {
                activeFilters = ['all'];
                
                // Update checkbox states
                companyFilters.forEach(cb => {
                    if (cb.value !== 'all') {
                        cb.checked = false;
                    }
                });
            } else {
                // If "All Companies" is unchecked, check all others
                activeFilters = [];
                
                companyFilters.forEach(cb => {
                    if (cb.value !== 'all') {
                        cb.checked = true;
                        activeFilters.push(cb.value);
                    }
                });
            }
        } else {
            // If a specific company is checked/unchecked
            if (checkbox.checked) {
                // Add to active filters
                if (!activeFilters.includes(company)) {
                    activeFilters.push(company);
                }
                
                // Remove 'all' from active filters
                activeFilters = activeFilters.filter(filter => filter !== 'all');
                allCompaniesCheckbox.checked = false;
            } else {
                // Remove from active filters
                activeFilters = activeFilters.filter(filter => filter !== company);
                
                // If no filters are active, check 'all'
                if (activeFilters.length === 0) {
                    activeFilters = ['all'];
                    allCompaniesCheckbox.checked = true;
                }
            }
        }
        
        // Refresh performances display
        if (performanceCache[selectedDate]) {
            displayPerformances(performanceCache[selectedDate], selectedDate);
        }
    }
    
    /**
     * Filters performances by company based on active filters
     * @param {Array} performances - Array of performance objects
     * @returns {Array} - Filtered array of performance objects
     */
    function filterPerformancesByCompany(performances) {
        if (activeFilters.includes('all')) {
            return performances;
        }
        
        return performances.filter(performance => activeFilters.includes(performance.company));
    }
    
    /**
     * Formats a date object as YYYY-MM-DD string
     * @param {Date} date - Date object
     * @returns {string} - Formatted date string
     */
    function formatDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }
});
