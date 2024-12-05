function changeLanguage(language) {
    fetch('language.json')
      .then(response => response.json())
      .then(data => {
        const translations = data[language]; // Get the specific language translations
        
        // Loop through all elements with an id attribute
        const elements = document.querySelectorAll('[id]');
        
        elements.forEach((element) => {
          const key = element.id;
          
          // If translation exists for the key, update the text content
          if (translations[key]) {
            element.textContent = translations[key];
          }
          
          // Handle nested translation (e.g., text inside 'content-kamar')
          if (typeof translations[key] === 'object') {
            for (let subKey in translations[key]) {
              const subElement = document.querySelector(`#${key}-${subKey}`);
              if (subElement) {
                subElement.textContent = translations[key][subKey];
              }
            }
          }
        });
      })
      .catch(error => console.error('Error loading language:', error));
  }
  