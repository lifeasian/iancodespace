// DOM Elements
const infoForm = document.getElementById("info-form");
const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone-number");
const countryCodeSelect = document.getElementById("country-code");
const addressInput = document.getElementById("address");
const submitBtn = document.getElementById("submit-btn");
const formProgress = document.getElementById("form-progress");
const container = document.querySelector('.container');

// Form validation patterns for different countries
const phonePatterns = {
    '+1': /^(\d{3})[\s.-]?(\d{3})[\s.-]?(\d{4})$/, // US/Canada
    '+44': /^(\d{4})[\s.-]?(\d{3})[\s.-]?(\d{3})$/, // UK
    '+91': /^(\d{5})[\s.-]?(\d{5})$/, // India
    '+86': /^(\d{3})[\s.-]?(\d{4})[\s.-]?(\d{4})$/, // China
    '+81': /^(\d{2})[\s.-]?(\d{4})[\s.-]?(\d{4})$/, // Japan
    '+49': /^(\d{3})[\s.-]?(\d{3})[\s.-]?(\d{4})$/, // Germany
    '+33': /^(\d{1})[\s.-]?(\d{2})[\s.-]?(\d{2})[\s.-]?(\d{2})[\s.-]?(\d{2})$/, // France
    '+39': /^(\d{3})[\s.-]?(\d{3})[\s.-]?(\d{4})$/, // Italy
    '+34': /^(\d{3})[\s.-]?(\d{3})[\s.-]?(\d{3})$/, // Spain
    '+7': /^(\d{3})[\s.-]?(\d{3})[\s.-]?(\d{2})[\s.-]?(\d{2})$/, // Russia
    '+55': /^(\d{2})[\s.-]?(\d{4})[\s.-]?(\d{4})$/, // Brazil
    '+61': /^(\d{1})[\s.-]?(\d{4})[\s.-]?(\d{4})$/, // Australia
    '+27': /^(\d{2})[\s.-]?(\d{3})[\s.-]?(\d{4})$/, // South Africa
    '+234': /^(\d{3})[\s.-]?(\d{3})[\s.-]?(\d{4})$/, // Nigeria
    '+254': /^(\d{3})[\s.-]?(\d{3})[\s.-]?(\d{3})$/, // Kenya
    '+233': /^(\d{3})[\s.-]?(\d{3})[\s.-]?(\d{3})$/, // Ghana
};

const patterns = {
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
};

// Track form completion
let formFields = [
    { element: firstNameInput, isValid: false },
    { element: lastNameInput, isValid: false },
    { element: emailInput, isValid: false },
    { element: phoneInput, isValid: false },
    { element: addressInput, isValid: false }
];

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 3D Mouse Tracking for Container (more subtle)
function handleMouseMove(e) {
    if (prefersReducedMotion) return;
    
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // More subtle rotation values
    const rotateX = (y - centerY) / 40;
    const rotateY = (centerX - x) / 40;
    
    container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(3px)`;
}

function handleMouseLeave() {
    if (prefersReducedMotion) return;
    container.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
}

// Add 3D mouse tracking (only if motion is preferred)
if (!prefersReducedMotion) {
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
}

// Update progress bar with subtle 3D effect
function updateProgress() {
    const validFields = formFields.filter(field => field.isValid).length;
    const progressPercentage = (validFields / formFields.length) * 100;
    
    // Add smooth transition for progress bar
    formProgress.style.transition = 'width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    formProgress.style.width = `${progressPercentage}%`;
    
    // Add subtle 3D effect to progress bar
    if (progressPercentage > 0 && !prefersReducedMotion) {
        formProgress.style.transform = 'translateZ(2px)';
    }
}

// Phone number validation with country code
function validatePhoneNumber(phoneNumber, countryCode) {
    const pattern = phonePatterns[countryCode];
    if (!pattern) return false;
    
    // Remove all non-digit characters for validation
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Check if the pattern matches
    return pattern.test(phoneNumber) && cleanNumber.length >= 7;
}

// Get phone number format hint
function getPhoneFormatHint(countryCode) {
    const hints = {
        '+1': 'Format: (123) 456-7890',
        '+44': 'Format: 1234 567 890',
        '+91': 'Format: 12345 67890',
        '+86': 'Format: 123 4567 8901',
        '+81': 'Format: 12 3456 7890',
        '+49': 'Format: 123 456 7890',
        '+33': 'Format: 1 23 45 67 89',
        '+39': 'Format: 123 456 7890',
        '+34': 'Format: 123 456 789',
        '+7': 'Format: 123 456 78 90',
        '+55': 'Format: 12 3456 7890',
        '+61': 'Format: 1 2345 6789',
        '+27': 'Format: 12 345 6789',
        '+234': 'Format: 123 456 7890',
        '+254': 'Format: 123 456 789',
        '+233': 'Format: 123 456 789',
    };
    return hints[countryCode] || 'Enter your phone number';
}

// Update phone placeholder when country changes
function updatePhonePlaceholder() {
    const countryCode = countryCodeSelect.value;
    const hint = getPhoneFormatHint(countryCode);
    phoneInput.placeholder = hint;
    
    // Update helper text
    const helperText = phoneInput.parentElement.parentElement.querySelector('.helper-text');
    if (helperText) {
        helperText.textContent = `Select your country code and enter your phone number (${hint})`;
    }
}

// Validate single field with subtle 3D feedback
function validateField(input, message, validationFn) {
    const validationMessage = document.getElementById(`${input.id}-validation`);
    const isValid = validationFn(input.value);
    
    // Update validation UI with subtle 3D effects
    if (input.value.trim() === '') {
        validationMessage.textContent = '';
        input.classList.remove('valid-input', 'invalid-input');
        if (!prefersReducedMotion) {
            input.style.transform = 'translateZ(0px)';
        }
        
        // Update field status in tracking array
        const fieldIndex = formFields.findIndex(field => field.element === input);
        if (fieldIndex !== -1) {
            formFields[fieldIndex].isValid = false;
        }
    } else if (isValid) {
        validationMessage.textContent = '';
        input.classList.add('valid-input');
        input.classList.remove('invalid-input');
        if (!prefersReducedMotion) {
            input.style.transform = 'translateZ(2px)';
        }
        
        // Update field status in tracking array
        const fieldIndex = formFields.findIndex(field => field.element === input);
        if (fieldIndex !== -1) {
            formFields[fieldIndex].isValid = true;
        }
    } else {
        validationMessage.textContent = message;
        input.classList.add('invalid-input');
        input.classList.remove('valid-input');
        if (!prefersReducedMotion) {
            input.style.transform = 'translateZ(1px)';
        }
        
        // Update field status in tracking array
        const fieldIndex = formFields.findIndex(field => field.element === input);
        if (fieldIndex !== -1) {
            formFields[fieldIndex].isValid = false;
        }
    }
    
    updateProgress();
}

// Set up input event listeners with subtle 3D feedback
firstNameInput.addEventListener('input', () => {
    validateField(
        firstNameInput, 
        'Name must be at least 2 characters', 
        value => value.trim().length >= 2
    );
});

lastNameInput.addEventListener('input', () => {
    validateField(
        lastNameInput, 
        'Surname must be at least 2 characters', 
        value => value.trim().length >= 2
    );
});

emailInput.addEventListener('input', () => {
    validateField(
        emailInput, 
        'Please enter a valid email address', 
        value => patterns.email.test(value)
    );
});

phoneInput.addEventListener('input', () => {
    const countryCode = countryCodeSelect.value;
    validateField(
        phoneInput, 
        `Please enter a valid phone number for ${countryCode}`, 
        value => validatePhoneNumber(value, countryCode)
    );
});

// Country code change handler
countryCodeSelect.addEventListener('change', () => {
    updatePhonePlaceholder();
    // Re-validate phone number with new country code
    if (phoneInput.value.trim()) {
        validateField(
            phoneInput, 
            `Please enter a valid phone number for ${countryCodeSelect.value}`, 
            value => validatePhoneNumber(value, countryCodeSelect.value)
        );
    }
});

addressInput.addEventListener('input', () => {
    validateField(
        addressInput, 
        'Address must be at least 10 characters', 
        value => value.trim().length >= 10
    );
});

// Enhanced form submission with subtle 3D animations
infoForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Validate all fields before submission
    validateField(
        firstNameInput, 
        'Name must be at least 2 characters', 
        value => value.trim().length >= 2
    );
    
    validateField(
        lastNameInput, 
        'Surname must be at least 2 characters', 
        value => value.trim().length >= 2
    );
    
    validateField(
        emailInput, 
        'Please enter a valid email address', 
        value => patterns.email.test(value)
    );
    
    validateField(
        phoneInput, 
        `Please enter a valid phone number for ${countryCodeSelect.value}`, 
        value => validatePhoneNumber(value, countryCodeSelect.value)
    );
    
    validateField(
        addressInput, 
        'Address must be at least 10 characters', 
        value => value.trim().length >= 10
    );
    
    // Check if all fields are valid
    const allValid = formFields.every(field => field.isValid);
    
    if (allValid) {
        // Show loading state with subtle 3D effect
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing...</span><i class="fas fa-spinner fa-spin"></i>';
        if (!prefersReducedMotion) {
            submitBtn.style.transform = 'translateY(-1px) translateZ(3px) scale(0.99)';
        }
        
        // Simulate form submission with enhanced 3D success animation
        setTimeout(() => {
            // Display success message with subtle 3D effects
            container.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h2>Thank You!</h2>
                    <p>Your information has been submitted successfully.</p>
                    <button id="reset-btn" class="btn-primary">
                        <span>Submit Another Response</span>
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
            `;
            
            // Add subtle 3D hover effect to reset button
            const resetBtn = document.getElementById('reset-btn');
            if (!prefersReducedMotion) {
                resetBtn.addEventListener('mouseenter', () => {
                    resetBtn.style.transform = 'translateY(-2px) translateZ(5px)';
                });
                
                resetBtn.addEventListener('mouseleave', () => {
                    resetBtn.style.transform = 'translateY(0px) translateZ(0px)';
                });
            }
            
            // Add event listener to reset button
            resetBtn.addEventListener('click', () => {
                location.reload();
            });
        }, 1500);
    }
});

// Add subtle 3D hover effects to form controls
document.querySelectorAll('.form-control').forEach(input => {
    if (!prefersReducedMotion) {
        input.addEventListener('mouseenter', () => {
            if (!input.classList.contains('valid-input') && !input.classList.contains('invalid-input')) {
                input.style.transform = 'translateY(-1px) translateZ(1px)';
            }
        });
        
        input.addEventListener('mouseleave', () => {
            if (!input.classList.contains('valid-input') && !input.classList.contains('invalid-input')) {
                input.style.transform = 'translateZ(0px)';
            }
        });
    }
});

// Initialize phone placeholder and progress bar
updatePhonePlaceholder();
updateProgress();