document.addEventListener('DOMContentLoaded', function () {
    const accordionCountForm = document.getElementById('accordion-count-form');
    const midlSection = document.querySelector('.midl-section');
    let createAllAccordionsButton;

    function validateForms() {
        const accordionForms = document.querySelectorAll('.accordion-form');
        let allFieldsFilled = true;

        accordionForms.forEach((form) => {
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach((input) => {
                if (!input.value.trim()) {
                    allFieldsFilled = false;
                }
            });
        });

        if (createAllAccordionsButton) {
            createAllAccordionsButton.style.display = allFieldsFilled ? 'block' : 'none';
        }
    }

    if (accordionCountForm) {
        accordionCountForm.addEventListener('submit', function (event) {
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

                if (!createAllAccordionsButton) {
                    createAllAccordionsButton = document.createElement('button');
                    createAllAccordionsButton.id = 'create-all-accordions';
                    createAllAccordionsButton.textContent = 'Create All Accordions';
                    createAllAccordionsButton.style.display = 'none'; // Hidden by default
                    midlSection.appendChild(createAllAccordionsButton);
                }

                document.querySelectorAll('.accordion-form input, .accordion-form textarea').forEach((input) => {
                    input.addEventListener('input', validateForms);
                });

                validateForms(); // Initial validation
            } else {
                alert('Please enter a valid number of accordions.');
            }
        });
    }

    document.body.addEventListener('click', function (event) {
        if (event.target.id === 'create-all-accordions') {
            const accordionForms = document.querySelectorAll('.accordion-form');
            const accordionsData = [];

            accordionForms.forEach((_, index) => {
                const title = document.getElementById(`accordion-title-${index}`).value.trim();
                const content = document.getElementById(`accordion-content-${index}`).value.trim();
                accordionsData.push({ Title: title, Content: content });
            });

            fetch('http://localhost:5093/Accordion/save-accordions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Accordions: accordionsData })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    alert('Accordions saved successfully!');
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    });
});
