document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after everything is loaded
    setTimeout(function() {
        document.getElementById('loading').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('loading').style.display = 'none';
        }, 500);
    }, 1500);

    // Initialize audio elements
    const citySound = document.getElementById('city-sound');
    const templeSound = document.getElementById('temple-sound');
    const natureSound = document.getElementById('nature-sound');
    const marketSound = document.getElementById('market-sound');
    
    // Set initial volume
    [citySound, templeSound, natureSound, marketSound].forEach(sound => {
        sound.volume = 0.3;
    });

    // Sound buttons functionality
    const soundButtons = document.querySelectorAll('.sound-btn');
    soundButtons.forEach(button => {
        button.addEventListener('click', function() {
            const soundType = this.getAttribute('data-sound');
            
            // Stop all sounds
            citySound.pause();
            templeSound.pause();
            natureSound.pause();
            marketSound.pause();
            
            // Remove active class from all buttons
            soundButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Play selected sound
            if (soundType === 'city') {
                citySound.currentTime = 0;
                citySound.play();
            } else if (soundType === 'temple') {
                templeSound.currentTime = 0;
                templeSound.play();
            } else if (soundType === 'nature') {
                natureSound.currentTime = 0;
                natureSound.play();
            } else if (soundType === 'market') {
                marketSound.currentTime = 0;
                marketSound.play();
            }
        });
    });

    // Activate first sound button by default
    document.querySelector('.sound-btn').click();

    // Initialize GSAP animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Landmark modal functionality
    const landmarkModal = new bootstrap.Modal(document.getElementById('landmarkModal'));
    const landmarkButtons = document.querySelectorAll('.landmark-btn');
    
    // Landmark data for Sri Lanka
    const landmarks = {
        "tooth-temple": {
            name: "Temple of the Sacred Tooth Relic",
            image: "images/landmarks/temple-of-tooth.jpg",
            description: "The Temple of the Sacred Tooth Relic is a Buddhist temple in Kandy that houses the relic of the tooth of the Buddha. It is one of the most sacred places of worship in the Buddhist world and a UNESCO World Heritage Site. The temple is part of the royal palace complex and is visited by thousands of devotees daily.",
            facts: [
                "Location: Kandy",
                "Built: 16th century",
                "Significance: Houses Buddha's tooth relic",
                "UNESCO World Heritage Site since 1988"
            ],
            location: [7.2936, 80.6413],
            sound: "temple"
        },
        "sigiriya": {
            name: "Sigiriya Rock Fortress",
            image: "images/landmarks/sigiriya-rock.jpg",
            description: "Sigiriya is an ancient rock fortress and palace ruin located in central Sri Lanka, surrounded by the remains of an extensive network of gardens, reservoirs, and other structures. The site is renowned for its frescoes and the 'Lion's Paw' entrance. It's one of the best-preserved examples of ancient urban planning.",
            facts: [
                "Height: 200 meters (660 ft)",
                "Built: 5th century by King Kashyapa",
                "UNESCO World Heritage Site since 1982",
                "Known as the 'Eighth Wonder of the World'"
            ],
            location: [7.9570, 80.7603],
            sound: "nature"
        },
        "galle-fort": {
            name: "Galle Fort",
            image: "images/landmarks/galle-fort.jpg",
            description: "Galle Fort is a UNESCO World Heritage Site, originally built by the Portuguese in the 16th century and then extensively fortified by the Dutch during the 17th century. It's a historical, archaeological and architectural heritage monument, which even after more than 400 years maintains a polished appearance, thanks to extensive reconstruction work done by Archaeological Department of Sri Lanka.",
            facts: [
                "Location: Galle",
                "Built: 1588 by Portuguese",
                "Expanded: 17th century by Dutch",
                "UNESCO World Heritage Site since 1988"
            ],
            location: [6.0259, 80.2167],
            sound: "city"
        }
    };

    landmarkButtons.forEach(button => {
        button.addEventListener('click', function() {
            const landmarkId = this.getAttribute('data-landmark');
            const landmark = landmarks[landmarkId];
            
            if (landmark) {
                // Set modal content
                document.getElementById('landmarkModalTitle').textContent = landmark.name;
                document.getElementById('landmarkModalName').textContent = landmark.name;
                document.getElementById('landmarkModalImage').src = landmark.image;
                document.getElementById('landmarkModalDescription').textContent = landmark.description;
                
                // Set facts
                const factsList = document.getElementById('landmarkModalFacts');
                factsList.innerHTML = '';
                landmark.facts.forEach(fact => {
                    const li = document.createElement('li');
                    li.textContent = fact;
                    factsList.appendChild(li);
                });
                
                // Initialize mini map
                initMiniMap('landmarkMiniMap', landmark.location, landmark.name);
                
                // Set sound button
                const soundBtn = document.getElementById('landmarkSoundBtn');
                soundBtn.onclick = function() {
                    // Stop all sounds
                    [citySound, templeSound, natureSound, marketSound].forEach(sound => sound.pause());
                    
                    // Play appropriate sound
                    if (landmark.sound === 'city') {
                        citySound.currentTime = 0;
                        citySound.play();
                    } else if (landmark.sound === 'temple') {
                        templeSound.currentTime = 0;
                        templeSound.play();
                    } else if (landmark.sound === 'nature') {
                        natureSound.currentTime = 0;
                        natureSound.play();
                    } else if (landmark.sound === 'market') {
                        marketSound.currentTime = 0;
                        marketSound.play();
                    }
                };
                
                // Show modal
                landmarkModal.show();
            }
        });
    });

    // Add to itinerary button
    document.getElementById('addToItineraryBtn').addEventListener('click', function() {
        const landmarkName = document.getElementById('landmarkModalName').textContent;
        showToast('Added to Itinerary', `${landmarkName} has been added to your virtual travel itinerary.`, 'success');
        landmarkModal.hide();
    });

    // Show toast notification
    function showToast(title, message, type) {
        const toast = new bootstrap.Toast(document.createElement('div'));
        toast._element.classList.add('toast', 'align-items-center', 'text-white', 'bg-' + type, 'border-0');
        toast._element.setAttribute('role', 'alert');
        toast._element.setAttribute('aria-live', 'assertive');
        toast._element.setAttribute('aria-atomic', 'true');
        
        toast._element.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <strong>${title}</strong><br>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        document.body.appendChild(toast._element);
        toast.show();
        
        // Remove toast after it hides
        toast._element.addEventListener('hidden.bs.toast', function() {
            document.body.removeChild(toast._element);
        });
    }

    // Initialize the main travel map (from map.js)
    initTravelMap();
});