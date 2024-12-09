var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    for (var j = 0; j < acc.length; j++) {
      if (acc[j] !== this) {
        acc[j].classList.remove("active");
        acc[j].nextElementSibling.style.display = "none";
      }
    }

    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
    const accordionCountForm = document.getElementById('accordion-count-form');
    const midlSection = document.querySelector('.midl-section');
    const createAllAccordionsButton = document.getElementById('create-all-accordions');

    if (accordionCountForm) {
        accordionCountForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const accordionCount = parseInt(document.getElementById('accordion-count').value);
            if (Number.isInteger(accordionCount) && accordionCount > 0) {
                midlSection.innerHTML = ''; // Clear the midl-section content

                for (let i = 0; i < accordionCount; i++) {
                    const formHTML = `
                        <form class="accordion-form">
                            <label for="accordion-title-${i}">Accordion Title:</label>
                            <input type="text" id="accordion-title-${i}" name="accordion-title-${i}" required>
                            <label for="accordion-content-${i}">Accordion Content:</label>
                            <textarea id="accordion-content-${i}" name="accordion-content-${i}" required></textarea>
                        </form>
                    `;
                    midlSection.insertAdjacentHTML('beforeend', formHTML);
                }

                const saveAccordionsButtonHTML = `
                <button id="create-all-accordions">Create All Accordions</button>
                `;

                midlSection.insertAdjacentHTML('beforeend', saveAccordionsButtonHTML);

                if (createAllAccordionsButton) {
                    createAllAccordionsButton.style.display = 'block';
                }
            } else {
                alert('Please enter a valid number of accordions.');
            }
        });
    }

    if (createAllAccordionsButton) {
        createAllAccordionsButton.addEventListener('click', function() {
            const accordionForms = document.querySelectorAll('.accordion-form');
            const accordionsData = [];

            accordionForms.forEach((_, index) => {
                const title = document.getElementById(`accordion-title-${index}`).value;
                const content = document.getElementById(`accordion-content-${index}`).value;
                accordionsData.push({ title, content });
            });

            fetch('http://localhost:5093/Accordion/save-accordions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ accordions: accordionsData })
            })
            .then(response => response.json())
            .then(data => {
                alert('Accordions saved successfully!');
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    }

    // Function to create an accordion element
    function createAccordion(title, content) {
        const accordionHTML = `
            <button class="accordion">${title}</button>
            <div class="panel">
                <p>${content}</p>
            </div>
        `;
        midlSection.insertAdjacentHTML('beforeend', accordionHTML);
    }

    // Fetch accordions from the endpoint
    fetch('http://localhost:5093/Accordion/get-accordions')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(accordion => {
                createAccordion(accordion.title, accordion.content);
            });

            // Attach event listeners to the newly created accordions
            const accordions = document.getElementsByClassName('accordion');
            for (let i = 0; i < accordions.length; i++) {
                accordions[i].addEventListener('click', function() {
                    const panels = document.getElementsByClassName('panel');
                    for (let j = 0; j < panels.length; j++) {
                        if (panels[j].previousElementSibling !== this) {
                            panels[j].style.display = 'none';
                            panels[j].previousElementSibling.classList.remove('active');
                        }
                    }

                    this.classList.toggle('active');
                    const panel = this.nextElementSibling;
                    if (panel.style.display === 'block') {
                        panel.style.display = 'none';
                    } else {
                        panel.style.display = 'block';
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error fetching accordions:', error);
        });
});