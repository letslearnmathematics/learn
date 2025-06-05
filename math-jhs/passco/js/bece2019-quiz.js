
const questionBank = [
    {
        level: 1,
        question: "What is the general definition of wildlife?",
        options: [
            { text: "All domesticated animals and plants", correct: false },
            { text: "All non-domesticated, uncultivated organisms", correct: true },
            { text: "Only animals that live in forests", correct: false },
            { text: "Pets and farm animals", correct: false }
        ]
    },
    {
        level: 1,
        question: "Which component of biodiversity refers to the variety within species?",
        options: [
            { text: "Species diversity", correct: false },
            { text: "Genetic diversity", correct: true },
            { text: "Ecosystem diversity", correct: false },
            { text: "Habitat diversity", correct: false }
        ]
    },
    {
        level: 1,
        question: "What is the correct format for naming organisms scientifically?",
        options: [
            { text: "Species first, then genus, all uppercase", correct: false },
            { text: "Genus capitalized, species lowercase, both italicized", correct: true },
            { text: "Only genus in bold letters", correct: false },
            { text: "Any format as long as it's in Latin", correct: false }
        ]
    },
    {
        level: 1,
        question: "Which of the following is a use of wildlife in the cosmetic industry?",
        options: [
            { text: "Feathers for clothes", correct: false },
            { text: "Glands for perfumes", correct: true },
            { text: "Teeth for ornaments", correct: false },
            { text: "Meat for soap production", correct: false }
        ]
    },
    {
        level: 1,
        question: "Which wildlife product is traditionally used as a dye in some African cultures?",
        options: [
            { text: "Fruit bat wings", correct: false },
            { text: "Tree bark extracts", correct: true },
            { text: "Animal fat", correct: false },
            { text: "Elephant tusks", correct: false }
        ]
    },
    {
        level: 1,
        question: "Which plant used in medicine is derived from wildlife-associated habitats?",
        options: [
            { text: "Vincristine from Cantharanthus roseus", correct: true },
            { text: "Cocoa plant", correct: false },
            { text: "Yam", correct: false },
            { text: "Tomato", correct: false }
        ]
    },
    {
        level: 1,
        question: "Which of the following is considered a minor forest product?",
        options: [
            { text: "Mahogany timber", correct: false },
            { text: "Wild honey", correct: true },
            { text: "Teak logs", correct: false },
            { text: "Palm wood", correct: false }
        ]
    },
    {
        level: 1,
        question: "Which of the following is one of the actors in Ghana’s bushmeat trade chain?",
        options: [
            { text: "Tourists", correct: false },
            { text: "Chop bar operators", correct: true },
            { text: "Forest rangers", correct: false },
            { text: "Librarians", correct: false }
        ]
    },
    {
        level: 1,
        question: "What type of forest area is commonly used for bushmeat harvesting?",
        options: [
            { text: "National parks", correct: false },
            { text: "Abandoned farms and clan lands", correct: true },
            { text: "Urban parks", correct: false },
            { text: "City squares", correct: false }
        ]
    },
    {
        level: 1,
        question: "Which of the following is a **non-consumptive** use of wildlife?",
        options: [
            { text: "Hunting with rifles", correct: false },
            { text: "Game viewing and photography", correct: true },
            { text: "Snaring and trapping", correct: false },
            { text: "Bushmeat trading", correct: false }
        ]
    },
    {
        level: 1,
        question: "Which of these species is used in traditional rituals and clothing?",
        options: [
            { text: "Blue duiker", correct: true },
            { text: "Tilapia", correct: false },
            { text: "Python", correct: false },
            { text: "Fowl", correct: false }
        ]
    },
    {
        level: 1,
        question: "Why is binomial nomenclature used in science?",
        options: [
            { text: "To confuse common people", correct: false },
            { text: "To standardize naming worldwide", correct: true },
            { text: "To make books longer", correct: false },
            { text: "To avoid using local names", correct: false }
        ]
    },
    {
        level: 1,
        question: "Which of these is an example of a traditional wildlife use in West Africa?",
        options: [
            { text: "Plastic hunting nets", correct: false },
            { text: "Charms made with animal parts", correct: true },
            { text: "GPS tagging of animals", correct: false },
            { text: "Drone monitoring", correct: false }
        ]
    },
    {
        level: 1,
        question: "What does species richness measure?",
        options: [
            { text: "The tallest trees", correct: false },
            { text: "The number of different species", correct: true },
            { text: "Weight of animals", correct: false },
            { text: "Length of rivers", correct: false }
        ]
    },
    {
        level: 1,
        question: "Which habitat type is NOT commonly associated with wildlife in Ghana?",
        options: [
            { text: "Savanna", correct: false },
            { text: "Rainforest", correct: false },
            { text: "Industrial zones", correct: true },
            { text: "Swamps", correct: false }
        ]
    },
    {
        level: 1,
        question: "Which human activity has the greatest **negative** effect on biodiversity?",
        options: [
            { text: "Eco-tourism", correct: false },
            { text: "Scientific research", correct: false },
            { text: "Land conversion for agriculture", correct: true },
            { text: "Tree planting", correct: false }
        ]
    },
    {
        level: 1,
        question: "Which of these is a spiritual belief linked to hunting in some Ghanaian communities?",
        options: [
            { text: "Use of sacred songs", correct: false },
            { text: "Use of charms for invisibility", correct: true },
            { text: "Use of binoculars", correct: false },
            { text: "Use of mobile apps", correct: false }
        ]
    },
    {
        level: 1,
        question: "What is the **simplest** way to describe biodiversity?",
        options: [
            { text: "The variety of all life forms", correct: true },
            { text: "Only trees in a forest", correct: false },
            { text: "Only animal species", correct: false },
            { text: "Amount of rainfall", correct: false }
        ]
    },
    {
        level: 1,
        question: "Which forest product is commonly used to make traditional tools like mortars?",
        options: [
            { text: "Snake skin", correct: false },
            { text: "Hardwood logs", correct: true },
            { text: "Bird feathers", correct: false },
            { text: "Dry leaves", correct: false }
        ]
    },
    {
        level: 1,
        question: "What does ecosystem diversity refer to?",
        options: [
            { text: "The number of genes in a cell", correct: false },
            { text: "The variety of habitats and ecological interactions", correct: true },
            { text: "Color of plants", correct: false },
            { text: "Animal skin patterns", correct: false }
        ]
    },

    // Levels 2-7 questions would continue here with increasing difficulty
        // Level 2: Wildlife Conservation & Protected Areas
    {
        level: 2,
        question: "What was the primary reason for establishing the Wildlife Division as a separate entity from the Forestry Department in Ghana?",
        options: [
            { text: "To focus specifically on wildlife issues and conservation", correct: true },
            { text: "To reduce government expenditure", correct: false },
            { text: "To promote agricultural expansion", correct: false },
            { text: "To increase timber production", correct: false }
        ]
    },
    {
        level: 2,
        question: "Which of these is NOT a type of Wildlife Protected Area (WPA) in Ghana?",
        options: [
            { text: "National Parks", correct: false },
            { text: "Game Production Reserves", correct: false },
            { text: "Timber Concessions", correct: true },
            { text: "Wildlife Sanctuaries", correct: false }
        ]
    },
    {
        level: 2,
        question: "What is the primary purpose of a Strict Nature Reserve in Ghana?",
        options: [
            { text: "Tourism and recreation", correct: false },
            { text: "Scientific research only", correct: true },
            { text: "Controlled hunting", correct: false },
            { text: "Community resource use", correct: false }
        ]
    },
    {
        level: 2,
        question: "Which Ghanaian national park is famous for its rainforest canopy walkway?",
        options: [
            { text: "Mole National Park", correct: false },
            { text: "Kakum National Park", correct: true },
            { text: "Bui National Park", correct: false },
            { text: "Digya National Park", correct: false }
        ]
    },
    {
        level: 2,
        question: "What is the main threat posed by 'Empty Forest Syndrome'?",
        options: [
            { text: "Loss of tree diversity", correct: false },
            { text: "Disappearance of fauna impacting forest ecosystems", correct: true },
            { text: "Increased soil erosion", correct: false },
            { text: "Spread of invasive plant species", correct: false }
        ]
    },
    {
        level: 2,
        question: "Which international convention was adopted to regulate whaling activities worldwide?",
        options: [
            { text: "CITES (Convention on International Trade in Endangered Species)", correct: false },
            { text: "International Convention for the Regulation of Whaling (1946)", correct: true },
            { text: "Ramsar Convention", correct: false },
            { text: "Convention on Biological Diversity", correct: false }
        ]
    },
    {
        level: 2,
        question: "What percentage of the Earth's primary productivity do humans currently use?",
        options: [
            { text: "1-5%", correct: false },
            { text: "10-20%", correct: true },
            { text: "30-40%", correct: false },
            { text: "50-60%", correct: false }
        ]
    },
    {
        level: 2,
        question: "Which of these animals is a key seed disperser in African forests?",
        options: [
            { text: "African elephant", correct: true },
            { text: "African lion", correct: false },
            { text: "Nile crocodile", correct: false },
            { text: "Grasscutter", correct: false }
        ]
    },
    {
        level: 2,
        question: "What is the primary diet of duikers in the wild?",
        options: [
            { text: "Grasses only", correct: false },
            { text: "Fruits and seeds, supplemented by leaves", correct: true },
            { text: "Small mammals and insects", correct: false },
            { text: "Aquatic plants", correct: false }
        ]
    },
    {
        level: 2,
        question: "Which Ghanaian wildlife reserve was originally established as a Meat Production Reserve?",
        options: [
            { text: "Kalakpa Resource Reserve", correct: true },
            { text: "Mole National Park", correct: false },
            { text: "Ankasa Conservation Area", correct: false },
            { text: "Shai Hills Resource Reserve", correct: false }
        ]
    },
    {
        level: 2,
        question: "What is the estimated annual loss of tropical rainforest globally?",
        options: [
            { text: "10,000–30,000 km²", correct: false },
            { text: "70,000–170,000 km²", correct: true },
            { text: "200,000–300,000 km²", correct: false },
            { text: "500,000–1,000,000 km²", correct: false }
        ]
    },
    {
        level: 2,
        question: "Which of these is a characteristic feature of duikers?",
        options: [
            { text: "Long necks for browsing tall trees", correct: false },
            { text: "Short front legs and arched backs", correct: true },
            { text: "Webbed feet for swimming", correct: false },
            { text: "Brightly colored stripes", correct: false }
        ]
    },
    {
        level: 2,
        question: "What is the primary reason for the bushmeat trade in West Africa?",
        options: [
            { text: "Protein source and income generation", correct: true },
            { text: "Sport and recreation", correct: false },
            { text: "Export to European markets", correct: false },
            { text: "Traditional medicine only", correct: false }
        ]
    },
    {
        level: 2,
        question: "Which animal is the most preferred bushmeat species in Ghana?",
        options: [
            { text: "African buffalo", correct: false },
            { text: "Grasscutter (cane rat)", correct: true },
            { text: "Royal antelope", correct: false },
            { text: "Bushpig", correct: false }
        ]
    },
    {
        level: 2,
        question: "What is the gestation period for duikers?",
        options: [
            { text: "2-3 months", correct: false },
            { text: "7-8 months", correct: true },
            { text: "12-14 months", correct: false },
            { text: "18-20 months", correct: false }
        ]
    },
    {
        level: 2,
        question: "Which of these is a prohibited hunting method in Ghana?",
        options: [
            { text: "Using artificial light at night", correct: true },
            { text: "Bow and arrow", correct: false },
            { text: "Snares for small rodents", correct: false },
            { text: "Traditional traps", correct: false }
        ]
    },
    {
        level: 2,
        question: "What is the main purpose of the closed hunting season (August 1–December 1) in Ghana?",
        options: [
            { text: "To allow animal populations to breed and recover", correct: true },
            { text: "To reduce competition among hunters", correct: false },
            { text: "To align with agricultural cycles", correct: false },
            { text: "To promote tourism during this period", correct: false }
        ]
    },
    {
        level: 2,
        question: "Which of these animals is classified as a micro-livestock candidate in Africa?",
        options: [
            { text: "African elephant", correct: false },
            { text: "Blue duiker", correct: true },
            { text: "Nile crocodile", correct: false },
            { text: "African rock python", correct: false }
        ]
    },
    {
        level: 2,
        question: "What is the primary role of pollinators in forest ecosystems?",
        options: [
            { text: "Seed dispersal", correct: false },
            { text: "Maintaining plant reproduction and genetic diversity", correct: true },
            { text: "Controlling pest populations", correct: false },
            { text: "Decomposing organic matter", correct: false }
        ]
    },
    {
        level: 2,
        question: "Which Ghanaian festival involves the capture of bushbuck (Tragelaphus scriptus) with bare hands?",
        options: [
            { text: "Aboakyer Festival (Winneba)", correct: true },
            { text: "Hogbetsotso Festival", correct: false },
            { text: "Kundum Festival", correct: false },
            { text: "Fetu Afahye", correct: false }
        ]
    },

    //level 3
    // Level 3: Wildlife Utilization and Biodiversity Conservation
    {
        level: 3,
        question: "What is the main reason bushmeat is a critical source of protein in many African communities?",
        options: [
            { text: "It is cheaper than plant protein", correct: false },
            { text: "It is widely available in urban supermarkets", correct: false },
            { text: "Limited access to alternative animal protein sources", correct: true },
            { text: "It is required in all school meals", correct: false }
        ]
    },
    {
        level: 3,
        question: "Which species of duiker is commonly considered a candidate for micro-livestock in Africa?",
        options: [
            { text: "Black duiker", correct: false },
            { text: "Red-flanked duiker", correct: false },
            { text: "Blue duiker", correct: true },
            { text: "Bay duiker", correct: false }
        ]
    },
    {
        level: 3,
        question: "Which of the following is a key ecological role of large fruit bats in African forests?",
        options: [
            { text: "Pest control", correct: false },
            { text: "Seed dispersal", correct: true },
            { text: "Predator suppression", correct: false },
            { text: "Soil aeration", correct: false }
        ]
    },
    {
        level: 3,
        question: "What is one major drawback of commercial hunting in West Africa?",
        options: [
            { text: "It improves wildlife diversity", correct: false },
            { text: "It provides conservation education", correct: false },
            { text: "It leads to unsustainable wildlife trade", correct: true },
            { text: "It reduces market prices for meat", correct: false }
        ]
    },
    {
        level: 3,
        question: "What is 'Empty Forest Syndrome' characterized by?",
        options: [
            { text: "Forests dominated by invasive species", correct: false },
            { text: "Forests with trees but severely depleted wildlife", correct: true },
            { text: "Forests lacking plant species", correct: false },
            { text: "Completely deforested areas", correct: false }
        ]
    },
    {
        level: 3,
        question: "Which of the following is a **non-consumptive** use of wildlife?",
        options: [
            { text: "Safari hunting", correct: false },
            { text: "Culling", correct: false },
            { text: "Game viewing", correct: true },
            { text: "Bushmeat trading", correct: false }
        ]
    },
    {
        level: 3,
        question: "Which international treaty aims to ensure fair sharing of benefits from genetic resources?",
        options: [
            { text: "CITES", correct: false },
            { text: "Ramsar Convention", correct: false },
            { text: "Convention on Biological Diversity", correct: true },
            { text: "Montreal Protocol", correct: false }
        ]
    },
    {
        level: 3,
        question: "Which animal's scent glands are used to mark territory in the wild?",
        options: [
            { text: "African buffalo", correct: false },
            { text: "Blue duiker", correct: true },
            { text: "Warthog", correct: false },
            { text: "Python", correct: false }
        ]
    },
    {
        level: 3,
        question: "What is the main source of bushmeat in Ghana?",
        options: [
            { text: "Marine reserves", correct: false },
            { text: "Government-controlled parks", correct: false },
            { text: "Savanna woodlands and thickets", correct: true },
            { text: "Urban farms", correct: false }
        ]
    },
    {
        level: 3,
        question: "What is the scientific name for the African buffalo?",
        options: [
            { text: "Panthera leo", correct: false },
            { text: "Cephalophus niger", correct: false },
            { text: "Syncerus caffer", correct: true },
            { text: "Thryonomys swinderianus", correct: false }
        ]
    },
    {
        level: 3,
        question: "Which group is identified as the most crucial actor in the bushmeat trade chain?",
        options: [
            { text: "Consumers", correct: false },
            { text: "Market traders", correct: false },
            { text: "Chop bar operators", correct: false },
            { text: "Commercial hunters", correct: true }
        ]
    },
    {
        level: 3,
        question: "What type of tourism includes photographic safaris and game viewing?",
        options: [
            { text: "Commercial tourism", correct: false },
            { text: "Consumptive tourism", correct: false },
            { text: "Non-consumptive tourism", correct: true },
            { text: "Exploitative tourism", correct: false }
        ]
    },
    {
        level: 3,
        question: "Which wildlife festival in Ghana is deeply rooted in traditional hunting practices?",
        options: [
            { text: "Akwasidae Festival", correct: false },
            { text: "Aboakyer Festival", correct: true },
            { text: "Homowo Festival", correct: false },
            { text: "Asafotufiam Festival", correct: false }
        ]
    },
    {
        level: 3,
        question: "Why are duikers considered suitable for domestication experiments?",
        options: [
            { text: "They are herbivores", correct: false },
            { text: "They are naturally sociable", correct: false },
            { text: "They need less space and food", correct: true },
            { text: "They are resistant to diseases", correct: false }
        ]
    },
    {
        level: 3,
        question: "Which organ is commonly used to mark duiker territory?",
        options: [
            { text: "Nasal gland", correct: false },
            { text: "Tail", correct: false },
            { text: "Eye gland", correct: true },
            { text: "Hoof pad", correct: false }
        ]
    },
    {
        level: 3,
        question: "Which human activity is NOT a direct threat to biodiversity?",
        options: [
            { text: "Climate change", correct: false },
            { text: "Alien species introduction", correct: false },
            { text: "Solar panel installation", correct: true },
            { text: "Conversion of forests to agriculture", correct: false }
        ]
    },
    {
        level: 3,
        question: "Which of the following is an example of a minor forest product?",
        options: [
            { text: "Mahogany timber", correct: false },
            { text: "Wild mushrooms", correct: true },
            { text: "Teak logs", correct: false },
            { text: "Charcoal", correct: false }
        ]
    },
    {
        level: 3,
        question: "How are species typically named in scientific classification?",
        options: [
            { text: "Genus-species in uppercase", correct: false },
            { text: "Species-genus in italics", correct: false },
            { text: "Genus (capitalized) followed by species (lowercase), italicized", correct: true },
            { text: "Random two-word system", correct: false }
        ]
    },
    {
        level: 3,
        question: "Which wildlife species is often used in the traditional dress called karosses in Nigeria?",
        options: [
            { text: "Royal antelope", correct: false },
            { text: "Blue duiker", correct: true },
            { text: "African buffalo", correct: false },
            { text: "Monitor lizard", correct: false }
        ]
    },
    {
        level: 3,
        question: "What conservation term describes maintaining biodiversity without exhausting its potential for future generations?",
        options: [
            { text: "Biodiversity richness", correct: false },
            { text: "Endangered species listing", correct: false },
            { text: "Sustainable use", correct: true },
            { text: "Ecosystem productivity", correct: false }
        ]
    },

    //level 4

    // Level 4: Advanced Wildlife Utilization, Policy & Research
    {
        level: 4,
        question: "Which international summit laid the groundwork for the Convention on Biological Diversity?",
        options: [
            { text: "Kyoto Protocol Summit", correct: false },
            { text: "Rio Earth Summit (1992)", correct: true },
            { text: "Paris Agreement", correct: false },
            { text: "Doha Climate Conference", correct: false }
        ]
    },
    {
        level: 4,
        question: "Which two major biomes dominate Ghana's natural ecology?",
        options: [
            { text: "Savanna and Desert", correct: false },
            { text: "Rainforest and Montane", correct: false },
            { text: "Tropical High Forest and Savanna", correct: true },
            { text: "Mangroves and Temperate Forests", correct: false }
        ]
    },
    {
        level: 4,
        question: "What does the term 'non-timber forest resources' (NTFRs) refer to?",
        options: [
            { text: "All forest trees used for furniture", correct: false },
            { text: "Forest products excluding timber, like fruits and medicinal plants", correct: true },
            { text: "Charcoal and firewood", correct: false },
            { text: "Only plant-based wild food items", correct: false }
        ]
    },
    {
        level: 4,
        question: "Which component is NOT typically monitored when assessing ecosystem diversity?",
        options: [
            { text: "Abiotic interaction", correct: false },
            { text: "Structure and composition", correct: false },
            { text: "Product packaging", correct: true },
            { text: "Function", correct: false }
        ]
    },
    {
        level: 4,
        question: "What is the key difference between biodiversity and wildlife?",
        options: [
            { text: "Biodiversity includes domesticated species", correct: true },
            { text: "Wildlife includes plants and biodiversity does not", correct: false },
            { text: "Biodiversity only refers to rare species", correct: false },
            { text: "Wildlife focuses on microorganisms", correct: false }
        ]
    },
    {
        level: 4,
        question: "What is a common trait among forest duiker species in terms of behavior?",
        options: [
            { text: "Nocturnal and shy", correct: true },
            { text: "Highly social and diurnal", correct: false },
            { text: "Non-territorial grazers", correct: false },
            { text: "Aquatic feeders", correct: false }
        ]
    },
    {
        level: 4,
        question: "Which species has a life expectancy of over 10 years and is known to 'freeze' when startled?",
        options: [
            { text: "African lion", correct: false },
            { text: "Monitor lizard", correct: false },
            { text: "Duiker", correct: true },
            { text: "Grasscutter", correct: false }
        ]
    },
    {
        level: 4,
        question: "How do duikers use their horns in communication?",
        options: [
            { text: "To groom each other", correct: false },
            { text: "To scratch trees for nutrients", correct: false },
            { text: "To rub tree trunks for territorial marking", correct: true },
            { text: "To dig for food", correct: false }
        ]
    },
    {
        level: 4,
        question: "Which of the following is a **prohibited** area for hunting under Ghana’s wildlife laws?",
        options: [
            { text: "Forest reserves", correct: false },
            { text: "Abandoned farmlands", correct: false },
            { text: "National parks", correct: true },
            { text: "Savanna woodlands", correct: false }
        ]
    },
    {
        level: 4,
        question: "Which indicator best reflects species richness in a forest ecosystem?",
        options: [
            { text: "The average lifespan of species", correct: false },
            { text: "The number of different species present", correct: true },
            { text: "The water availability", correct: false },
            { text: "The color of leaves", correct: false }
        ]
    },
    {
        level: 4,
        question: "In terms of diet, which of the following would duikers in captivity sometimes consume?",
        options: [
            { text: "Banana and cassava leaves", correct: true },
            { text: "Only dry grasses", correct: false },
            { text: "Strictly insects and frogs", correct: false },
            { text: "Aquatic plants", correct: false }
        ]
    },
    {
        level: 4,
        question: "What is the main ecological consequence of removing seed dispersers from a forest ecosystem?",
        options: [
            { text: "Reduced canopy height", correct: false },
            { text: "Decreased tree regeneration", correct: true },
            { text: "Increased herbivore numbers", correct: false },
            { text: "Improved air quality", correct: false }
        ]
    },
    {
        level: 4,
        question: "Which African country reported up to 25% of meat in urban butcheries being bushmeat?",
        options: [
            { text: "Zambia", correct: false },
            { text: "Gabon", correct: false },
            { text: "Kenya", correct: true },
            { text: "Tanzania", correct: false }
        ]
    },
    {
        level: 4,
        question: "Which group is **most at risk** from the health hazards associated with bushmeat harvesting?",
        options: [
            { text: "Urban consumers", correct: false },
            { text: "Commercial traders", correct: false },
            { text: "Hunters and processors", correct: true },
            { text: "Tourists", correct: false }
        ]
    },
    {
        level: 4,
        question: "Which of these animals contributes to bushmeat income and is also used in traditional rituals?",
        options: [
            { text: "African elephant", correct: false },
            { text: "Royal antelope", correct: false },
            { text: "Grasscutter", correct: false },
            { text: "Bushbuck", correct: true }
        ]
    },
    {
        level: 4,
        question: "Why is the blue duiker a suitable animal for dietary experiments?",
        options: [
            { text: "It mimics sheep digestion", correct: true },
            { text: "It eats only processed feeds", correct: false },
            { text: "It survives entirely on salt licks", correct: false },
            { text: "It stores fat like camels", correct: false }
        ]
    },
    {
        level: 4,
        question: "What makes wild animal products appealing to the perfumery industry?",
        options: [
            { text: "Their colorful appearance", correct: false },
            { text: "Secretions from scent glands", correct: true },
            { text: "Blood as dye", correct: false },
            { text: "Wool texture", correct: false }
        ]
    },
    {
        level: 4,
        question: "Which of these practices is recognized as a traditional means of wildlife domestication?",
        options: [
            { text: "Circus training", correct: false },
            { text: "Falconry", correct: true },
            { text: "Hunting festivals", correct: false },
            { text: "Safari tourism", correct: false }
        ]
    },
    {
        level: 4,
        question: "What is one major challenge in enforcing closed hunting seasons in Ghana?",
        options: [
            { text: "Lack of wildlife", correct: false },
            { text: "Low demand for meat", correct: false },
            { text: "Ignorance among law enforcement officers", correct: true },
            { text: "No legal support", correct: false }
        ]
    },
    {
        level: 4,
        question: "Which of the following most strongly influences hunting success in rural Ghanaian communities?",
        options: [
            { text: "Proximity to highways", correct: false },
            { text: "Modern firearms only", correct: false },
            { text: "Stalking skills and species behavior knowledge", correct: true },
            { text: "Hunting licenses", correct: false }
        ]
    },

    // level 5
    // Level 5: Critical Thinking in Wildlife Policy, Sustainability & Conservation
    {
        level: 5,
        question: "Why is the unsustainable bushmeat trade considered a threat to forest ecosystems?",
        options: [
            { text: "It introduces invasive plant species", correct: false },
            { text: "It causes overgrowth of predator populations", correct: false },
            { text: "It disrupts ecological roles such as seed dispersal and pollination", correct: true },
            { text: "It prevents logging companies from accessing forests", correct: false }
        ]
    },
    {
        level: 5,
        question: "Which of the following BEST reflects the aim of Article 2 of the Convention on Biological Diversity?",
        options: [
            { text: "To maximize the export of wildlife products", correct: false },
            { text: "To ensure biodiversity is used sustainably for present and future generations", correct: true },
            { text: "To stop all hunting activities globally", correct: false },
            { text: "To create uniform policies for agriculture", correct: false }
        ]
    },
    {
        level: 5,
        question: "What is the ecological implication of removing top predators from an ecosystem?",
        options: [
            { text: "Increased biodiversity", correct: false },
            { text: "Improved photosynthesis rates", correct: false },
            { text: "Trophic cascade effects and imbalance", correct: true },
            { text: "Reduction in rainfall", correct: false }
        ]
    },
    {
        level: 5,
        question: "Which strategy would be MOST effective in combating the illegal bushmeat trade in Ghana?",
        options: [
            { text: "Banning all wildlife trade globally", correct: false },
            { text: "Allowing open hunting seasons", correct: false },
            { text: "Strengthening enforcement of wildlife regulations and community engagement", correct: true },
            { text: "Introducing large-scale industrial logging", correct: false }
        ]
    },
    {
        level: 5,
        question: "What is a significant limitation of using protected areas alone for wildlife conservation?",
        options: [
            { text: "They allow too much tourism", correct: false },
            { text: "They do not address threats outside their boundaries", correct: true },
            { text: "They reduce ecosystem diversity", correct: false },
            { text: "They increase local employment", correct: false }
        ]
    },
    {
        level: 5,
        question: "Which of the following best describes ‘organismal diversity’?",
        options: [
            { text: "The number of animal species in one forest", correct: false },
            { text: "The variety of distinct units of life grouped into species", correct: true },
            { text: "The total number of trees in an area", correct: false },
            { text: "The altitude range of a habitat", correct: false }
        ]
    },
    {
        level: 5,
        question: "How does climate change contribute to biodiversity loss?",
        options: [
            { text: "By increasing invasive species growth only", correct: false },
            { text: "By promoting monoculture agriculture", correct: false },
            { text: "By altering habitat conditions beyond species’ tolerance levels", correct: true },
            { text: "By improving rainfall distribution", correct: false }
        ]
    },
    {
        level: 5,
        question: "What cultural role does wildlife play in Ghanaian society?",
        options: [
            { text: "Source of fertilizers", correct: false },
            { text: "Symbolism, rituals, and festivals", correct: true },
            { text: "Currency standard", correct: false },
            { text: "Construction material", correct: false }
        ]
    },
    {
        level: 5,
        question: "Why is the domestication of wild species like grasscutter promoted?",
        options: [
            { text: "To train animals for zoos", correct: false },
            { text: "To reduce pressure on wild populations", correct: true },
            { text: "To provide pets for export", correct: false },
            { text: "To increase forest cover", correct: false }
        ]
    },
    {
        level: 5,
        question: "Which of the following is a key **socio-economic** driver of bushmeat exploitation?",
        options: [
            { text: "Over-fertilization", correct: false },
            { text: "Poverty and lack of protein alternatives", correct: true },
            { text: "Tourism restrictions", correct: false },
            { text: "Access to clean water", correct: false }
        ]
    },
    {
        level: 5,
        question: "Which of the following is NOT a direct impact of bushmeat overharvesting?",
        options: [
            { text: "Loss of animal protein source", correct: false },
            { text: "Collapse of wildlife populations", correct: false },
            { text: "Decline in predator-prey dynamics", correct: false },
            { text: "Increase in soil fertility", correct: true }
        ]
    },
    {
        level: 5,
        question: "Why are traditional hunting beliefs and practices important in wildlife management?",
        options: [
            { text: "They are more accurate than science", correct: false },
            { text: "They serve as informal regulations and cultural conservation tools", correct: true },
            { text: "They encourage bushfires", correct: false },
            { text: "They focus on trapping only small animals", correct: false }
        ]
    },
    {
        level: 5,
        question: "Which component is **least likely** to influence species distribution in an ecosystem?",
        options: [
            { text: "Altitude", correct: false },
            { text: "Edaphic (soil) factors", correct: false },
            { text: "Human activity", correct: false },
            { text: "Color of species' skin", correct: true }
        ]
    },
    {
        level: 5,
        question: "Which is the most appropriate conservation strategy for forest-dependent communities?",
        options: [
            { text: "Ban all forest use", correct: false },
            { text: "Introduce alien plant species", correct: false },
            { text: "Promote sustainable harvesting and community-based conservation", correct: true },
            { text: "Encourage bush burning", correct: false }
        ]
    },
    {
        level: 5,
        question: "Why are duikers considered ecologically significant in forest ecosystems?",
        options: [
            { text: "They are top carnivores", correct: false },
            { text: "They serve as primary pollinators", correct: false },
            { text: "They aid in seed dispersal and are prey for predators", correct: true },
            { text: "They control insect populations", correct: false }
        ]
    },
    {
        level: 5,
        question: "What is one major reason the blue duiker is considered for micro-livestock?",
        options: [
            { text: "It can be trained to do tricks", correct: false },
            { text: "It produces high-quality milk", correct: false },
            { text: "It is small, docile, and feeds efficiently", correct: true },
            { text: "It grows into a large grazing animal", correct: false }
        ]
    },
    {
        level: 5,
        question: "Which aspect of ecosystem biodiversity includes the physical interactions of biotic and abiotic factors?",
        options: [
            { text: "Species richness", correct: false },
            { text: "Ecosystem structure", correct: false },
            { text: "Community diversity", correct: true },
            { text: "Genetic variability", correct: false }
        ]
    },
    {
        level: 5,
        question: "How can biodiversity loss affect future medical discoveries?",
        options: [
            { text: "By causing global warming", correct: false },
            { text: "By reducing the number of potential medicinal species", correct: true },
            { text: "By promoting new vaccines", correct: false },
            { text: "By increasing access to fungi", correct: false }
        ]
    },
    {
        level: 5,
        question: "Which is a scientifically accepted reason for legal hunting in some countries?",
        options: [
            { text: "To sell trophies illegally", correct: false },
            { text: "To collect animals for scientific research", correct: true },
            { text: "To entertain tourists", correct: false },
            { text: "To reduce tourism traffic", correct: false }
        ]
    },
    {
        level: 5,
        question: "What is the significance of integrating wildlife conservation into national development plans?",
        options: [
            { text: "To increase zoo visitors", correct: false },
            { text: "To preserve species while achieving economic sustainability", correct: true },
            { text: "To replace farming with hunting", correct: false },
            { text: "To shift focus from forests to oceans", correct: false }
        ]
    },


    // level 6
    // Level 6: Evaluation, Policy Design, and Ethics in Wildlife Conservation
    {
        level: 6,
        question: "Which of the following is the most effective **long-term solution** to combat illegal wildlife trade in Ghana?",
        options: [
            { text: "Increase hunting quotas", correct: false },
            { text: "Invest in education, community development, and alternative livelihoods", correct: true },
            { text: "Allow unregulated commercial hunting", correct: false },
            { text: "Restrict all access to forest areas", correct: false }
        ]
    },
    {
        level: 6,
        question: "Why is it **ethically problematic** to ignore traditional beliefs in wildlife management plans?",
        options: [
            { text: "Traditional beliefs often hinder conservation", correct: false },
            { text: "Ignoring them can marginalize communities and reduce effectiveness", correct: true },
            { text: "Most traditional knowledge is unscientific", correct: false },
            { text: "Beliefs have no real ecological impact", correct: false }
        ]
    },
    {
        level: 6,
        question: "If a country bans bushmeat without offering alternatives, what is the most likely **social impact**?",
        options: [
            { text: "Increased ecotourism", correct: false },
            { text: "Improved urban diets", correct: false },
            { text: "Loss of livelihood and increased illegal hunting", correct: true },
            { text: "Decline in local agriculture", correct: false }
        ]
    },
    {
        level: 6,
        question: "Which of the following **best illustrates** the principle of sustainable wildlife utilization?",
        options: [
            { text: "Harvesting species faster than their reproduction rate", correct: false },
            { text: "Trading endangered species under strict regulation", correct: false },
            { text: "Using wildlife resources at a rate that allows natural regeneration", correct: true },
            { text: "Banning all use of wildlife", correct: false }
        ]
    },
    {
        level: 6,
        question: "If duiker populations drastically decline, what would be the most probable **ecological consequence**?",
        options: [
            { text: "Improved forest seedling recruitment", correct: false },
            { text: "Disruption in seed dispersal and forest regeneration", correct: true },
            { text: "Increased fruit bat numbers", correct: false },
            { text: "Stronger predator populations", correct: false }
        ]
    },
    {
        level: 6,
        question: "A conservation NGO wants to introduce blue duikers as livestock. Which **risk** must they assess first?",
        options: [
            { text: "Cost of duiker meat in markets", correct: false },
            { text: "Likelihood of human-wildlife conflict in forests", correct: false },
            { text: "Disease transmission and genetic bottlenecks in captivity", correct: true },
            { text: "Time of day duikers feed", correct: false }
        ]
    },
    {
        level: 6,
        question: "Which approach would BEST integrate conservation goals with community needs?",
        options: [
            { text: "Exclude locals from protected areas", correct: false },
            { text: "Establish buffer zones with controlled use and benefit-sharing", correct: true },
            { text: "Allow total access to all forest areas", correct: false },
            { text: "Introduce exotic species to boost biodiversity", correct: false }
        ]
    },
    {
        level: 6,
        question: "If a species is culturally sacred but ecologically harmful, what should a conservationist prioritize?",
        options: [
            { text: "Remove the species immediately", correct: false },
            { text: "Ignore the ecological harm to respect culture", correct: false },
            { text: "Engage with communities to find balanced, informed solutions", correct: true },
            { text: "Report the community to the government", correct: false }
        ]
    },
    {
        level: 6,
        question: "What is the best **rationale** for supporting research into traditional bushmeat substitutes?",
        options: [
            { text: "They are easier to export", correct: false },
            { text: "They can help reduce pressure on wild populations", correct: true },
            { text: "They are more affordable to produce", correct: false },
            { text: "They are promoted by tourism companies", correct: false }
        ]
    },
    {
        level: 6,
        question: "What is the **ethical dilemma** associated with trophy hunting in conservation areas?",
        options: [
            { text: "It provides funding but may send mixed messages about species value", correct: true },
            { text: "It never generates revenue", correct: false },
            { text: "It targets only pests", correct: false },
            { text: "It increases population of endangered species", correct: false }
        ]
    },
    {
        level: 6,
        question: "Which of the following policies would likely be the **most sustainable** in managing wildlife reserves?",
        options: [
            { text: "Privatize all reserves", correct: false },
            { text: "Outsource all decisions to foreign NGOs", correct: false },
            { text: "Implement participatory management with local stakeholders", correct: true },
            { text: "Convert reserves into farmland", correct: false }
        ]
    },
    {
        level: 6,
        question: "What would be the most appropriate **response** to a sudden outbreak of zoonotic disease linked to bushmeat?",
        options: [
            { text: "Ban all meat products", correct: false },
            { text: "Promote safe handling, targeted bans, and public education", correct: true },
            { text: "Shut down all forest access permanently", correct: false },
            { text: "Increase wildlife farming immediately", correct: false }
        ]
    },
    {
        level: 6,
        question: "What is one **policy risk** of promoting only a few species for wildlife domestication?",
        options: [
            { text: "Low tourist interest", correct: false },
            { text: "Increased genetic diversity", correct: false },
            { text: "Overdependence and vulnerability to disease outbreaks", correct: true },
            { text: "Rise in predator populations", correct: false }
        ]
    },
    {
        level: 6,
        question: "Why is community-based wildlife management increasingly recommended by conservationists?",
        options: [
            { text: "It eliminates government responsibility", correct: false },
            { text: "It reduces wildlife numbers", correct: false },
            { text: "It encourages local stewardship and sustainable practices", correct: true },
            { text: "It supports trophy hunting only", correct: false }
        ]
    },
    {
        level: 6,
        question: "How could deforestation indirectly contribute to increased bushmeat hunting?",
        options: [
            { text: "By planting more fruit trees", correct: false },
            { text: "By providing easier access to wildlife habitats", correct: true },
            { text: "By increasing the number of tourists", correct: false },
            { text: "By reducing human-wildlife conflict", correct: false }
        ]
    },
    {
        level: 6,
        question: "Which of the following is a likely **economic consequence** of unsustainable bushmeat exploitation?",
        options: [
            { text: "Stable rural economies", correct: false },
            { text: "Decreased protein shortages", correct: false },
            { text: "Loss of income over time due to species depletion", correct: true },
            { text: "Increased supply of medicinal herbs", correct: false }
        ]
    },
    {
        level: 6,
        question: "A wildlife project focuses solely on mammals. Which biodiversity principle does it overlook?",
        options: [
            { text: "Species interdependence", correct: true },
            { text: "Habitat restoration", correct: false },
            { text: "Carbon cycling", correct: false },
            { text: "Climate resilience", correct: false }
        ]
    },
    {
        level: 6,
        question: "Which is a **valid criticism** of the 'fortress conservation' model?",
        options: [
            { text: "It makes forests grow faster", correct: false },
            { text: "It often excludes local people and ignores traditional knowledge", correct: true },
            { text: "It encourages biodiversity", correct: false },
            { text: "It reduces species richness", correct: false }
        ]
    },
    {
        level: 6,
        question: "Which of the following best describes a **feedback loop** resulting from wildlife decline?",
        options: [
            { text: "More species leads to more forests", correct: false },
            { text: "Less wildlife causes habitat degradation, further reducing wildlife", correct: true },
            { text: "Pollinators increase seed dispersers", correct: false },
            { text: "High biodiversity causes more rainfall", correct: false }
        ]
    },
    {
        level: 6,
        question: "Which of the following would be MOST useful in developing future wildlife conservation policy?",
        options: [
            { text: "Public opinion polls only", correct: false },
            { text: "Integration of ecological data, social science, and economics", correct: true },
            { text: "Global media trends", correct: false },
            { text: "Forest patrol logs", correct: false }
        ]
    },

    // level 7
    // Level 7: Strategic Thinking, Global Policy, and Wildlife Innovation
    {
        level: 7,
        question: "What is the most critical factor when designing wildlife policy in a rapidly urbanizing African country?",
        options: [
            { text: "Number of species in national parks", correct: false },
            { text: "Availability of export markets", correct: false },
            { text: "Balancing ecological integrity with human development needs", correct: true },
            { text: "Public access to zoos", correct: false }
        ]
    },
    {
        level: 7,
        question: "Which of the following best reflects the **precautionary principle** in wildlife management?",
        options: [
            { text: "Allowing all uses until negative effects are proven", correct: false },
            { text: "Prohibiting a practice when there's risk of harm, even if evidence is incomplete", correct: true },
            { text: "Using species until extinction", correct: false },
            { text: "Avoiding all human interaction with wildlife", correct: false }
        ]
    },
    {
        level: 7,
        question: "How can wildlife conservation **contribute directly** to poverty alleviation?",
        options: [
            { text: "By restricting forest access", correct: false },
            { text: "By promoting high-value eco-tourism and sustainable resource use", correct: true },
            { text: "By banning all hunting activities", correct: false },
            { text: "By fencing off communities", correct: false }
        ]
    },
    {
        level: 7,
        question: "A conservation policy based solely on scientific data may fail because it...",
        options: [
            { text: "Underestimates ecological processes", correct: false },
            { text: "Does not align with traditional or local values", correct: true },
            { text: "Relies too heavily on laws", correct: false },
            { text: "Does not include tourists", correct: false }
        ]
    },
    {
        level: 7,
        question: "What is the **best justification** for involving women in community wildlife programs?",
        options: [
            { text: "They are more interested in tourism", correct: false },
            { text: "They handle more domestic tasks", correct: false },
            { text: "They play key roles in natural resource use and decision-making", correct: true },
            { text: "They hunt more than men", correct: false }
        ]
    },
    {
        level: 7,
        question: "What is a **key challenge** in applying global conservation treaties at the national level?",
        options: [
            { text: "Language differences", correct: false },
            { text: "Too much funding", correct: false },
            { text: "Mismatch between treaty goals and local realities", correct: true },
            { text: "Excessive biodiversity", correct: false }
        ]
    },
    {
        level: 7,
        question: "What is a major **limitation** of relying solely on protected areas to conserve biodiversity?",
        options: [
            { text: "They cannot host migratory or wide-ranging species effectively", correct: true },
            { text: "They are not legally recognized", correct: false },
            { text: "They contain no flora", correct: false },
            { text: "They are located only in deserts", correct: false }
        ]
    },
    {
        level: 7,
        question: "Which of these is the most **ethically balanced** approach to resolving human-wildlife conflict?",
        options: [
            { text: "Relocate all people", correct: false },
            { text: "Use lethal control immediately", correct: false },
            { text: "Use non-lethal deterrents while compensating losses and educating communities", correct: true },
            { text: "Allow communities to kill animals freely", correct: false }
        ]
    },
    {
        level: 7,
        question: "What is the most **strategic benefit** of integrating biodiversity conservation into national development plans?",
        options: [
            { text: "It ensures tourism is expanded", correct: false },
            { text: "It limits international loans", correct: false },
            { text: "It enhances resilience to environmental and economic shocks", correct: true },
            { text: "It reduces population growth", correct: false }
        ]
    },
    {
        level: 7,
        question: "If blue duikers were widely adopted as micro-livestock, what **genetic challenge** might arise?",
        options: [
            { text: "Loss of appetite", correct: false },
            { text: "Domestication reversal", correct: false },
            { text: "Inbreeding and reduced genetic fitness", correct: true },
            { text: "Extreme aggression", correct: false }
        ]
    },
    {
        level: 7,
        question: "Why must wildlife data be disaggregated by **gender, age, and location**?",
        options: [
            { text: "For tourist planning", correct: false },
            { text: "To improve equity and policy targeting", correct: true },
            { text: "To promote urban migration", correct: false },
            { text: "To reduce sampling error", correct: false }
        ]
    },
    {
        level: 7,
        question: "What is a **practical consequence** of species loss for forest-dependent communities?",
        options: [
            { text: "More open farmland", correct: false },
            { text: "Loss of traditional medicine, food, and cultural identity", correct: true },
            { text: "Increase in rainfall", correct: false },
            { text: "Reduced cost of living", correct: false }
        ]
    },
    {
        level: 7,
        question: "How does wildlife conservation relate to **climate change mitigation**?",
        options: [
            { text: "By increasing greenhouse gases", correct: false },
            { text: "Through preserving forests that act as carbon sinks", correct: true },
            { text: "By promoting fossil fuel use", correct: false },
            { text: "By encouraging open burning", correct: false }
        ]
    },
    {
        level: 7,
        question: "Which scenario best illustrates a **conflict between conservation and development**?",
        options: [
            { text: "Opening a mine in a wildlife corridor", correct: true },
            { text: "Planting trees in urban parks", correct: false },
            { text: "Creating a new forest reserve", correct: false },
            { text: "Tagging wildlife for research", correct: false }
        ]
    },
    {
        level: 7,
        question: "Which stakeholder group is often **underrepresented** in national wildlife policy formulation?",
        options: [
            { text: "Traditional rulers", correct: false },
            { text: "Tour operators", correct: false },
            { text: "Local communities and indigenous people", correct: true },
            { text: "Foreign donors", correct: false }
        ]
    },
    {
        level: 7,
        question: "Which indicator would best measure **sustainable use** of wildlife?",
        options: [
            { text: "Number of animals sold", correct: false },
            { text: "Rate of population recovery and habitat regeneration", correct: true },
            { text: "Volume of exports", correct: false },
            { text: "Number of tourists per year", correct: false }
        ]
    },
    {
        level: 7,
        question: "In policy advocacy for wildlife, why is **multisector collaboration** essential?",
        options: [
            { text: "It spreads political risk", correct: false },
            { text: "It includes diverse expertise and addresses complex challenges", correct: true },
            { text: "It increases tax revenue", correct: false },
            { text: "It reduces forest size", correct: false }
        ]
    },
    {
        level: 7,
        question: "What is the **core reason** for conserving even unpopular or dangerous species like snakes?",
        options: [
            { text: "They are edible", correct: false },
            { text: "They regulate ecosystems and maintain balance", correct: true },
            { text: "They are easier to trap", correct: false },
            { text: "They are symbols in folklore", correct: false }
        ]
    },
    {
        level: 7,
        question: "How does **scientific naming (binomial nomenclature)** support global wildlife conservation?",
        options: [
            { text: "It helps hunters know what to avoid", correct: false },
            { text: "It ensures consistent species identification across languages", correct: true },
            { text: "It makes animals more attractive for trade", correct: false },
            { text: "It improves zoo labeling", correct: false }
        ]
    },
    {
        level: 7,
        question: "Why might a government prioritize community-based conservation over state-controlled models?",
        options: [
            { text: "To reduce taxes", correct: false },
            { text: "To decentralize power and improve stewardship", correct: true },
            { text: "To promote hunting", correct: false },
            { text: "To increase land sales", correct: false }
        ]
    }


    // Each level would have 20 questions
];

// Note: In a complete implementation, there would be 140 questions (20 per level x 7 levels)
// The questions would increase in difficulty with each level, covering more specific
// aspects of wildlife utilization, conservation strategies, biodiversity measurements,
// international conventions, and case studies from the provided course materials.