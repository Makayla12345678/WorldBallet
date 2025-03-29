/**
 * World Ballets - Data Service
 * 
 * This module handles data fetching, processing, and management for the World Ballets website.
 * It uses the Scraper module to fetch real data from ballet company websites,
 * with fallback to mock data if scraping fails.
 */

const DataService = (() => {
    // Mock data for demonstration purposes
    // In a real implementation, this would be replaced with actual web scraping
    const mockData = {
        companies: {
            abt: {
                name: "American Ballet Theatre",
                shortName: "ABT",
                logo: "https://via.placeholder.com/150x150.png?text=ABT+Logo",
                description: "Founded in 1940, American Ballet Theatre is recognized as one of the world's leading classical ballet companies. Based in New York City, ABT annually tours the United States and around the world.",
                website: "https://www.abt.org"
            },
            pob: {
                name: "Paris Opera Ballet",
                shortName: "POB",
                logo: "https://via.placeholder.com/150x150.png?text=POB+Logo",
                description: "The Paris Opera Ballet is the oldest national ballet company in the world, founded in 1669. It is the ballet company of the Paris Opera and is one of the most prestigious ballet companies in the world.",
                website: "https://www.operadeparis.fr/en/artists/ballet"
            },
            bolshoi: {
                name: "Bolshoi Ballet",
                shortName: "BOLSHOI",
                logo: "https://via.placeholder.com/150x150.png?text=BOLSHOI+Logo",
                description: "The Bolshoi Ballet is an internationally renowned classical ballet company, based at the Bolshoi Theatre in Moscow, Russia. Founded in 1776, the Bolshoi is among the world's oldest and most prestigious ballet companies.",
                website: "https://www.bolshoi.ru/en/"
            },
            royal: {
                name: "The Royal Ballet",
                shortName: "ROYAL",
                logo: "https://via.placeholder.com/150x150.png?text=ROYAL+Logo",
                description: "The Royal Ballet is an internationally renowned classical ballet company, based at the Royal Opera House in Covent Garden, London, England. Founded in 1931, it is one of the world's greatest ballet companies.",
                website: "https://www.roh.org.uk/about/the-royal-ballet"
            },
            stuttgart: {
                name: "Stuttgart Ballet",
                shortName: "STUTTGART",
                logo: "https://via.placeholder.com/150x150.png?text=STUTTGART+Logo",
                description: "The Stuttgart Ballet is a leading German ballet company based in Stuttgart, Germany. Known for its innovative choreography and technical excellence, it has been a major influence in the ballet world since the 1960s.",
                website: "https://www.stuttgart-ballet.de/en/"
            },
            boston: {
                name: "Boston Ballet",
                shortName: "BOSTON",
                logo: "https://via.placeholder.com/150x150.png?text=BOSTON+Logo",
                description: "Founded in 1963, Boston Ballet is one of the leading dance companies in North America. The company maintains an internationally acclaimed repertoire and the largest ballet school in North America.",
                website: "https://www.bostonballet.org"
            },
            nbc: {
                name: "National Ballet of Canada",
                shortName: "NBC",
                logo: "https://via.placeholder.com/150x150.png?text=NBC+Logo",
                description: "Founded in 1951, the National Ballet of Canada is one of the premier dance companies in North America. Based in Toronto, the company performs a traditional and contemporary repertoire of the highest caliber.",
                website: "https://national.ballet.ca"
            }
        },
        performances: {
            nbc: [
                {
                    id: "nbc-1",
                    title: "Romeo and Juliet",
                    company: "nbc",
                    startDate: "2025-03-20",
                    endDate: "2025-04-10",
                    description: "Alexei Ratmansky's passionate reimagining of Shakespeare's tragic love story set to Prokofiev's powerful score. This innovative production brings fresh perspective to the classic tale of star-crossed lovers, featuring breathtaking choreography that highlights the technical brilliance of the company's dancers. Ratmansky's interpretation balances dramatic storytelling with pure classical dance, creating a Romeo and Juliet for today's audiences while honoring the ballet's rich tradition.",
                    image: "https://via.placeholder.com/800x400.png?text=Romeo+and+Juliet",
                    videoUrl: "https://www.youtube.com/embed/4fHw4GeW3EU",
                    isCurrent: true,
                    isNext: false
                },
                {
                    id: "nbc-2",
                    title: "Spring Mixed Program",
                    company: "nbc",
                    startDate: "2025-05-05",
                    endDate: "2025-05-15",
                    description: "A vibrant collection of contemporary works featuring Crystal Pite's 'Angels' Atlas' and Balanchine's 'Serenade'. This dynamic program showcases the versatility of the company with three distinct pieces that span the range of ballet today. Crystal Pite's 'Angels' Atlas' explores themes of mortality and navigation with her signature blend of ballet and contemporary movement. Balanchine's 'Serenade', set to Tchaikovsky's Serenade for Strings, was the choreographer's first original ballet created in America and remains a timeless masterpiece of neoclassical beauty.",
                    image: "https://via.placeholder.com/800x400.png?text=Spring+Mixed+Program",
                    videoUrl: "https://www.youtube.com/embed/Urz4v1JVXZQ",
                    isCurrent: false,
                    isNext: true
                },
                {
                    id: "nbc-3",
                    title: "Giselle",
                    company: "nbc",
                    startDate: "2025-06-10",
                    endDate: "2025-06-20",
                    description: "The romantic classic of love, betrayal, and forgiveness with ethereal choreography and Adolphe Adam's memorable score. One of the oldest continually performed ballets, Giselle tells the story of a peasant girl who dies of a broken heart after discovering her lover is betrothed to another. The Wilis, a group of supernatural women who dance men to death, summon Giselle from her grave. They target her lover for death, but Giselle's love frees him from their grasp. The National Ballet of Canada's production features exquisite costumes and sets that transport audiences to a world of romantic beauty and supernatural wonder.",
                    image: "https://via.placeholder.com/800x400.png?text=Giselle",
                    videoUrl: "https://www.youtube.com/embed/eSx_kqe6ox0",
                    isCurrent: false,
                    isNext: false
                },
                {
                    id: "nbc-4",
                    title: "The Nutcracker",
                    company: "nbc",
                    startDate: "2025-12-10",
                    endDate: "2025-12-31",
                    description: "The beloved holiday classic returns with Tchaikovsky's magical score and James Kudelka's enchanting choreography. This distinctly Canadian production follows Misha and Marie on a magical Christmas Eve adventure. After receiving a nutcracker from their Uncle Nikolai, they embark on a journey through the glittering Kingdom of Snow and the delicious Land of Sweets. Featuring over 200 performers and dazzling sets and costumes by Santo Loquasto, this Nutcracker has been a cherished holiday tradition since its premiere in 1995.",
                    image: "https://via.placeholder.com/800x400.png?text=The+Nutcracker",
                    videoUrl: "https://www.youtube.com/embed/YR5USHu6D6U",
                    isCurrent: false,
                    isNext: false
                },
                {
                    id: "nbc-5",
                    title: "Swan Lake",
                    company: "nbc",
                    startDate: "2026-03-05",
                    endDate: "2026-03-20",
                    description: "The timeless tale of love and deception featuring Tchaikovsky's iconic score and Karen Kain's breathtaking choreography. This production honors the classical legacy of Swan Lake while incorporating fresh perspectives that highlight the technical and artistic excellence of the company. The story follows Prince Siegfried as he falls in love with Odette, a princess transformed into a swan by the evil sorcerer Von Rothbart. The ballet's famous white acts, featuring the corps de ballet as a flock of swans, showcase some of the most beautiful and challenging choreography in the classical repertoire.",
                    image: "https://via.placeholder.com/800x400.png?text=Swan+Lake",
                    videoUrl: "https://www.youtube.com/embed/9rJoB7y6Ncs",
                    isCurrent: false,
                    isNext: false
                },
                {
                    id: "nbc-past-1",
                    title: "The Sleeping Beauty",
                    company: "nbc",
                    startDate: "2025-01-15",
                    endDate: "2025-01-25",
                    description: "Rudolf Nureyev's masterful interpretation of the classic fairy tale, featuring Tchaikovsky's enchanting score. This sumptuous production showcases the company's classical virtuosity with its demanding choreography and grand staging. The ballet tells the story of Princess Aurora, who falls into a deep sleep under the curse of the evil fairy Carabosse, only to be awakened by the kiss of a handsome prince. With its spectacular sets and costumes, The Sleeping Beauty represents the height of classical ballet's grandeur and technique.",
                    image: "https://via.placeholder.com/800x400.png?text=The+Sleeping+Beauty",
                    videoUrl: "https://www.youtube.com/embed/JFzCwYMO-1Y",
                    isPast: true
                },
                {
                    id: "nbc-past-2",
                    title: "Emergence",
                    company: "nbc",
                    startDate: "2024-11-10",
                    endDate: "2024-11-20",
                    description: "Crystal Pite's award-winning contemporary ballet exploring the mysterious world of insect societies. This dark, mesmerizing work draws parallels between human and insect social structures, featuring 38 dancers moving with hypnotic precision. Set to an original score by Owen Belton that incorporates buzzing sounds and Morse code, Emergence creates a haunting atmosphere that has captivated audiences worldwide since its premiere in 2009.",
                    image: "https://via.placeholder.com/800x400.png?text=Emergence",
                    videoUrl: "https://www.youtube.com/embed/FF3dHlZQHT0",
                    isPast: true
                }
            ],
            // Other companies' performances
            abt: [
                {
                    id: "abt-1",
                    title: "Swan Lake",
                    company: "abt",
                    startDate: "2025-03-25",
                    endDate: "2025-04-05",
                    description: "American Ballet Theatre's sumptuous production of Swan Lake, choreographed by Kevin McKenzie after Marius Petipa and Lev Ivanov, features Tchaikovsky's iconic score and exquisite costumes by Zack Brown. This beloved classic tells the story of Odette, a princess turned into a swan by an evil sorcerer's curse. Prince Siegfried's love for her breaks the spell, but the sorcerer's deception leads to tragedy. ABT's production showcases the company's extraordinary dancers in one of ballet's most technically and emotionally demanding works.",
                    image: "https://via.placeholder.com/800x400.png?text=ABT+Swan+Lake",
                    videoUrl: "https://www.youtube.com/embed/9rJoB7y6Ncs",
                    isCurrent: true,
                    isNext: false
                },
                {
                    id: "abt-2",
                    title: "Don Quixote",
                    company: "abt",
                    startDate: "2025-05-15",
                    endDate: "2025-05-25",
                    description: "ABT's vibrant production of Don Quixote, staged by Kevin McKenzie and Susan Jones, brings Ludwig Minkus's score and the colorful world of Cervantes's novel to life. This comedic ballet follows the adventures of the eccentric knight Don Quixote and his faithful squire Sancho Panza as they encounter the spirited Kitri and her lover Basilio. With its Spanish-inspired choreography, dazzling technique, and charismatic characters, Don Quixote is a joyous celebration of love, adventure, and the rich traditions of classical ballet.",
                    image: "https://via.placeholder.com/800x400.png?text=ABT+Don+Quixote",
                    videoUrl: "https://www.youtube.com/embed/IGzJiRrIBGk",
                    isCurrent: false,
                    isNext: true
                },
                {
                    id: "abt-3",
                    title: "Romeo and Juliet",
                    company: "abt",
                    startDate: "2025-06-20",
                    endDate: "2025-06-30",
                    description: "Kenneth MacMillan's masterful interpretation of Shakespeare's enduring romantic tragedy has become one of ABT's signature productions. Set to Prokofiev's magnificent score, this Romeo and Juliet features breathtaking choreography, sword fights, and passionate pas de deux that bring the star-crossed lovers' story to life. With Renaissance-inspired designs by Nicholas Georgiadis and emotional depth that resonates with audiences of all ages, this production showcases the dramatic and technical prowess of ABT's dancers.",
                    image: "https://via.placeholder.com/800x400.png?text=ABT+Romeo+and+Juliet",
                    videoUrl: "https://www.youtube.com/embed/4fHw4GeW3EU",
                    isCurrent: false,
                    isNext: false
                },
                {
                    id: "abt-4",
                    title: "Giselle",
                    company: "abt",
                    startDate: "2025-10-15",
                    endDate: "2025-10-25",
                    description: "ABT's production of Giselle, staged by Kevin McKenzie after Jean Coralli, Jules Perrot, and Marius Petipa, epitomizes the Romantic ballet tradition. This haunting tale of love, betrayal, and forgiveness follows a peasant girl who dies of a broken heart after discovering her beloved is betrothed to another. In the moonlit world of the Wilis—vengeful spirits of jilted brides—Giselle's enduring love protects her faithless lover from death. With its ethereal second act, demanding technical challenges, and profound emotional resonance, Giselle remains one of ballet's greatest achievements.",
                    image: "https://via.placeholder.com/800x400.png?text=ABT+Giselle",
                    videoUrl: "https://www.youtube.com/embed/eSx_kqe6ox0",
                    isCurrent: false,
                    isNext: false
                },
                {
                    id: "abt-5",
                    title: "The Nutcracker",
                    company: "abt",
                    startDate: "2025-12-12",
                    endDate: "2025-12-31",
                    description: "Alexei Ratmansky's enchanting production of The Nutcracker for American Ballet Theatre brings fresh perspective to this holiday classic. Set to Tchaikovsky's beloved score, the ballet follows young Clara's journey through a magical Christmas Eve adventure. From the festive party scene to the Land of Snow and the Kingdom of Sweets, Ratmansky's choreography combines classical precision with imaginative storytelling. With whimsical designs by Richard Hudson inspired by 19th-century art and literature, ABT's Nutcracker delights audiences of all ages with its charm, humor, and spectacular dancing.",
                    image: "https://via.placeholder.com/800x400.png?text=ABT+Nutcracker",
                    videoUrl: "https://www.youtube.com/embed/YR5USHu6D6U",
                    isCurrent: false,
                    isNext: false
                },
                {
                    id: "abt-past-1",
                    title: "La Bayadère",
                    company: "abt",
                    startDate: "2025-01-20",
                    endDate: "2025-01-30",
                    description: "Natalia Makarova's production of La Bayadère for ABT transports audiences to an exotic world of temple dancers, noble warriors, and vengeful gods in ancient India. This 19th-century classic tells the story of the temple dancer Nikiya, her lover Solor, and the jealous princess Gamzatti who plots Nikiya's demise. The ballet's famous 'Kingdom of the Shades' scene, with its corps of 24 women in white executing identical arabesques, is one of classical ballet's most iconic and challenging sequences. With opulent sets and costumes by Pier Luigi Samaritani and music by Ludwig Minkus, La Bayadère showcases ABT's artistic excellence and technical virtuosity.",
                    image: "https://via.placeholder.com/800x400.png?text=ABT+La+Bayadere",
                    videoUrl: "https://www.youtube.com/embed/ZNDzDUi0Yeo",
                    isPast: true
                },
                {
                    id: "abt-past-2",
                    title: "Whipped Cream",
                    company: "abt",
                    startDate: "2024-10-15",
                    endDate: "2024-10-25",
                    description: "Alexei Ratmansky's Whipped Cream is a delectable confection of dance and design. Set to Richard Strauss's 1924 score, this ballet follows a young boy who overindulges in sweets at a Viennese pastry shop and falls into a delirious dream world populated by fantastical characters. With wildly imaginative sets and costumes by pop-surrealist artist Mark Ryden, Whipped Cream is a visual feast that combines classical technique with contemporary whimsy. This production showcases ABT's versatility and commitment to expanding the ballet repertoire with works that appeal to audiences of all ages.",
                    image: "https://via.placeholder.com/800x400.png?text=ABT+Whipped+Cream",
                    videoUrl: "https://www.youtube.com/embed/nVnC4eS-Dbo",
                    isPast: true
                }
            ]
        }
    };

    /**
     * Gets mock company information (used as fallback)
     * @param {string} companyId - The ID of the company
     * @returns {Object} - Company data
     */
    const getMockCompanyInfo = (companyId) => {
        return mockData.companies[companyId] || null;
    };

    /**
     * Gets mock performances for a company (used as fallback)
     * @param {string} companyId - The ID of the company
     * @returns {Array} - Array of performance objects
     */
    const getMockPerformances = (companyId) => {
        return mockData.performances[companyId] || [];
    };

    /**
     * Fetches company information
     * @param {string} companyId - The ID of the company
     * @returns {Promise} - Resolves with company data
     */
    const getCompanyInfo = async (companyId) => {
        try {
            // Try to get real data from scraper
            return await Scraper.scrapeCompanyInfo(companyId);
        } catch (error) {
            console.warn(`Scraping failed for ${companyId}, using mock data:`, error);
            
            // Fall back to mock data
            const company = getMockCompanyInfo(companyId);
            if (company) {
                return company;
            } else {
                throw new Error(`Company with ID ${companyId} not found`);
            }
        }
    };

    /**
     * Fetches performances for a specific company
     * @param {string} companyId - The ID of the company
     * @returns {Promise} - Resolves with performances data
     */
    const getCompanyPerformances = async (companyId) => {
        try {
            let performances;
            
            // Use appropriate scraper based on company ID
            switch (companyId) {
                case 'nbc':
                    performances = await Scraper.scrapeNBC();
                    break;
                case 'abt':
                    performances = await Scraper.scrapeABT();
                    break;
                default:
                    // For companies without scrapers, use mock data
                    performances = getMockPerformances(companyId);
            }
            
            if (performances && performances.length > 0) {
                // Sort performances by date
                return [...performances].sort((a, b) => {
                    return new Date(a.startDate) - new Date(b.startDate);
                });
            } else {
                throw new Error(`No performances found for ${companyId}`);
            }
        } catch (error) {
            console.warn(`Error getting performances for ${companyId}:`, error);
            
            // Fall back to mock data
            const mockPerformances = getMockPerformances(companyId);
            if (mockPerformances && mockPerformances.length > 0) {
                return [...mockPerformances].sort((a, b) => {
                    return new Date(a.startDate) - new Date(b.startDate);
                });
            } else {
                throw new Error(`Performances for company ${companyId} not found`);
            }
        }
    };

    /**
     * Fetches all current performances across all companies
     * @returns {Promise} - Resolves with current performances data
     */
    const getAllCurrentPerformances = async () => {
        try {
            const currentPerformances = [];
            const companyIds = Object.keys(mockData.companies); // Use mock data keys to know which companies to fetch
            const currentDate = new Date();
            
            // Fetch performances for each company
            for (const companyId of companyIds) {
                try {
                    const companyInfo = await getCompanyInfo(companyId);
                    const performances = await getCompanyPerformances(companyId);
                    
                    performances.forEach(performance => {
                        const startDate = new Date(performance.startDate);
                        const endDate = new Date(performance.endDate);
                        
                        // Include performances that are currently running or starting within 30 days
                        if (
                            (currentDate >= startDate && currentDate <= endDate) || 
                            (startDate > currentDate && startDate <= new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000))
                        ) {
                            currentPerformances.push({
                                ...performance,
                                companyName: companyInfo.name,
                                companyShortName: companyInfo.shortName
                            });
                        }
                    });
                } catch (error) {
                    console.warn(`Error fetching performances for ${companyId}:`, error);
                    // Continue with other companies even if one fails
                }
            }
            
            // Sort by start date
            currentPerformances.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            
            return currentPerformances;
        } catch (error) {
            console.error('Error getting all current performances:', error);
            
            // Fall back to mock data approach
            const fallbackPerformances = [];
            
            Object.keys(mockData.performances).forEach(companyId => {
                const companyPerformances = mockData.performances[companyId];
                const currentDate = new Date();
                
                companyPerformances.forEach(performance => {
                    const startDate = new Date(performance.startDate);
                    const endDate = new Date(performance.endDate);
                    
                    // Include performances that are currently running or starting within 30 days
                    if (
                        (currentDate >= startDate && currentDate <= endDate) || 
                        (startDate > currentDate && startDate <= new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000))
                    ) {
                        fallbackPerformances.push({
                            ...performance,
                            companyName: mockData.companies[companyId].name,
                            companyShortName: mockData.companies[companyId].shortName
                        });
                    }
                });
            });
            
            // Sort by start date
            fallbackPerformances.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            
            return fallbackPerformances;
        }
    };

    /**
     * Fetches featured performances for the homepage
     * @param {number} count - Number of featured performances to return
     * @returns {Promise} - Resolves with featured performances data
     */
    const getFeaturedPerformances = (count = 3) => {
        return getAllCurrentPerformances()
            .then(performances => {
                // In a real implementation, we might have criteria for featuring performances
                // For now, just return the first few current performances
                return performances.slice(0, count);
            });
    };

    /**
     * Formats a date range for display
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {string} - Formatted date range
     */
    const formatDateRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const startFormatted = start.toLocaleDateString('en-US', options);
        const endFormatted = end.toLocaleDateString('en-US', options);
        
        return `${startFormatted} - ${endFormatted}`;
    };

    /**
     * Checks if a performance is current (happening now or within 30 days)
     * @param {Object} performance - Performance object with startDate and endDate
     * @returns {boolean} - True if performance is current
     */
    const isCurrentPerformance = (performance) => {
        const currentDate = new Date();
        const startDate = new Date(performance.startDate);
        const endDate = new Date(performance.endDate);
        
        return (currentDate >= startDate && currentDate <= endDate) || 
               (startDate > currentDate && startDate <= new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000));
    };

    /**
     * Checks if a performance is the next upcoming one
     * @param {Array} performances - Sorted array of performance objects
     * @param {Object} performance - Performance to check
     * @returns {boolean} - True if performance is the next upcoming one
     */
    const isNextPerformance = (performances, performance) => {
        const currentDate = new Date();
        
        // Find the first performance that hasn't started yet
        const upcomingPerformances = performances.filter(p => new Date(p.startDate) > currentDate);
        
        if (upcomingPerformances.length > 0) {
            return performance.id === upcomingPerformances[0].id;
        }
        
        return false;
    };

    // Public API
    return {
        getCompanyInfo,
        getCompanyPerformances,
        getAllCurrentPerformances,
        getFeaturedPerformances,
        formatDateRange,
        isCurrentPerformance,
        isNextPerformance,
        getMockCompanyInfo,
        getMockPerformances
    };
})();
