// math-jhs.js - Complete Integrated Solution
document.addEventListener("DOMContentLoaded", function() {
    // ========== RECENTLY VIEWED SYSTEM ==========
    const RECENT_ITEMS_KEY = 'recentlyViewedSubtopic';
    const MAX_RECENT_ITEMS = 5;
    
    function saveRecentlyViewed(subtopic) {
        let recentItems = JSON.parse(localStorage.getItem(RECENT_ITEMS_KEY)) || [];
        
        // Remove if already exists
        recentItems = recentItems.filter(item => 
            item.url !== subtopic.url || item.topic !== subtopic.topic
        );
        
        // Add to beginning
        recentItems.unshift({
            name: subtopic.name,
            url: subtopic.url,
            topic: subtopic.topic,
            level: subtopic.level,
            timestamp: new Date().getTime()
        });
        
        // Limit to max items
        if (recentItems.length > MAX_RECENT_ITEMS) {
            recentItems = recentItems.slice(0, MAX_RECENT_ITEMS);
        }
        
        localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(recentItems));
    }
    
    function getRecentlyViewed() {
        return JSON.parse(localStorage.getItem(RECENT_ITEMS_KEY)) || [];
    }

    // ========== TAB SYSTEM FUNCTIONALITY ==========
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Show first tab by default
    if (tabContents.length > 0) {
        tabContents[0].style.display = 'block';
        tabButtons[0].classList.add('active');
    }

    function openClass(evt, classId) {
        // Hide all tab content
        tabContents.forEach(content => {
            content.style.display = 'none';
        });

        // Remove active class from all buttons
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });

        // Show the current tab and mark button as active
        document.getElementById(classId).style.display = 'block';
        evt.currentTarget.classList.add('active');

        // Save the active tab to localStorage
        localStorage.setItem('lastActiveTab', classId);
    }

    // Add click event to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const classId = this.textContent.toLowerCase().replace(' ', '');
            openClass(e, classId);
        });
    });

    // Check for saved tab preference
    const lastActiveTab = localStorage.getItem('lastActiveTab');
    if (lastActiveTab) {
        const tabToActivate = document.getElementById(lastActiveTab);
        const buttonToActivate = Array.from(tabButtons).find(button => 
            button.textContent.toLowerCase().replace(' ', '') === lastActiveTab
        );
        
        if (tabToActivate && buttonToActivate) {
            tabContents.forEach(content => content.style.display = 'none');
            tabButtons.forEach(button => button.classList.remove('active'));
            
            tabToActivate.style.display = 'block';
            buttonToActivate.classList.add('active');
        }
    }

    // ========== SUBTOPIC SYSTEM ==========
    /*New for the subtopics*/
    /*
    const subtopicsData = {
        "jhs1": {
            "Number & Numeration System": [
                { name: "Modelling Numbers", url: "./math-jhs/jhs1/number/number-and-numeration-system/modelling-numbers.html" },
                { name: "Comparing Numbers", url: "./math-jhs/jhs1/number/number-and-numeration-system/comparing-numbers.html" },
                { name: "Rounding Whole Numbers", url: "./math-jhs/jhs1/number/number-and-numeration-system/rounding-whole-numbers.html" },
                { name: "Rounding Decimals", url: "./math-jhs/jhs1/number/number-and-numeration-system/rounding-decimals.html" }
            ],
            "Number Operations": [
                { name: "Multiplying By Powers of 10", url: "./math-jhs/jhs1/number/number-operations/multiplying-by-powers-of-10.html" },
                { name: "Using Number Properties", url: "./math-jhs/jhs1/number/number-operations/using-number-properties.html" },
                { name: "Operations (Word Problems)", url: "./math-jhs/jhs1/number/number-operations/operations-word-problems.html" },
                { name: "Addition & Subtraction", url: "./math-jhs/jhs1/number/number-operations/addition-and-subtraction.html" },
                { name: "Multiplication & Division", url: "./math-jhs/jhs1/number/number-operations/multiplication-and-division.html" },
                { name: "Decimals (Word Problems)", url: "./math-jhs/jhs1/number/number-operations/decimals-word-problems.html" },
                { name: "Repeated Factors", url: "./math-jhs/jhs1/number/number-operations/repeated-factors.html" },
                { name: "Products and Powers (Indices)", url: "./math-jhs/jhs1/number/number-operations/products-and-powers-indices.html" },
                { name: "The Zero Index (Exponent)", url: "./math-jhs/jhs1/number/number-operations/the-zero-index.html" },
                { name: "Value of Numbers in Index Form", url: "./math-jhs/jhs1/number/number-operations/value-of-indexed-numbers.html" },
                { name: "H.C.F & L.C.M", url: "./math-jhs/jhs1/number/number-operations/hcf-and-lcm.html" }
            ],
            "Fractions, Decimals & Percentages": [
                { name: "Fractions", url: "./math-jhs/jhs1/number/fractions-decimals-and-percentages/fractions.html" },
                { name: "Comparing & Ordering Fractions", url: "./math-jhs/jhs1/number/fractions-decimals-and-percentages/comparing-and-ordering-fractions.html" },
                { name: "Addition & Subtraction of Fractions", url: "./math-jhs/jhs1/number/fractions-decimals-and-percentages/addition-and-subtraction-fraction.html" },
                { name: "Word Problems of Fractions", url: "./math-jhs/jhs1/number/fractions-decimals-and-percentages/word-problems-fractions.html" },
                { name: "Multiplication of Fractions", url: "./math-jhs/jhs1/number/fractions-decimals-and-percentages/multiplication-of-fractions.html" },
                { name: "Finding Fractions of Given Quantities", url: "./math-jhs/jhs1/number/fractions-decimals-and-percentages/finding-fractions-of-quantities.html" },
                { name: "Division of Fractions", url: "./math-jhs/jhs1/number/fractions-decimals-and-percentages/division-of-fractions.html" },
                { name: "Dividing Given Quantities by a Fraction", url: "./math-jhs/jhs1/number/fractions-decimals-and-percentages/dividing-by-a-fraction.html" }
            ],
            "Ratios and Proportion": [
                { name: "Ratios Between Two Quantities", url: "./math-jhs/jhs1/number/ratios-and-proportion/ratios-between-two-quantities.html" },
                { name: "Unit Rate", url: "./math-jhs/jhs1/number/ratios-and-proportion/unit-rate.html" },
                { name: "Tables of Equivalent Ratios", url: "./math-jhs/jhs1/number/ratios-and-proportion/tables-of-equivalent-ratios.html" },
                { name: "Proportional Reasoning", url: "./math-jhs/jhs1/number/ratios-and-proportion/proportional-reasoning.html" },
                { name: "Percentage As A Rate", url: "./math-jhs/jhs1/number/ratios-and-proportion/percentage-as-rate.html" }
            ],
            "Patterns and Relations": [
                { name: "Extending Given Relations", url: "./math-jhs/jhs1/algebra/patterns-and-relations/extending-given-relations.html" },
                { name: "Rule Of A Relation", url: "./math-jhs/jhs1/algebra/patterns-and-relations/rule-of-a-relation.html" },
                { name: "Predicting Subsequent Elements", url: "./math-jhs/jhs1/algebra/patterns-and-relations/predicting-subsequent-elements.html" },
                { name: "Graphs of Given Relations", url: "./math-jhs/jhs1/algebra/patterns-and-relations/graphs-of-given-relations.html" }
            ],
            "Algebraic Expressions": [
                { name: "Creating Algebraic Expressions", url: "./math-jhs/jhs1/algebra/algebraic-expressions/creating-algebraic-expressions.html" },
                { name: "Addition & Subtraction (Algebra)", url: "./math-jhs/jhs1/algebra/algebraic-expressions/addition-and-subtraction-algebra.html" },
                { name: "Multiplication & Division (Algebra)", url: "./math-jhs/jhs1/algebra/algebraic-expressions/multiplication-and-division-algebra.html" },
                { name: "Substitution Of Values", url: "./math-jhs/jhs1/algebra/algebraic-expressions/substitution-of-values.html" },
                { name: "Operations On Algebraic Expressions", url: "./math-jhs/jhs1/algebra/algebraic-expressions/operations-on-algebraic-expressions.html" }
            ],
            "Variables and Equations": [
                { name: "Linear Equations", url: "./math-jhs/jhs1/algebra/variables-and-equations/linear-equations.html" },
                { name: "Modelling Using Concrete Materials", url: "./math-jhs/jhs1/algebra/variables-and-equations/modelling-using-concrete-materials.html" },
                { name: "Modelling Using Algebraic Tiles", url: "./math-jhs/jhs1/algebra/variables-and-equations/modelling-using-algebraic-tiles.html" },
                { name: "Linear Equations in One (1) Variable", url: "./math-jhs/jhs1/algebra/variables-and-equations/linear-equations-one-variable.html" }
            ],
            "Shapes and Space": [
                { name: "Measuring and Classifying Angles", url: "./math-jhs/jhs1/geometry/shapes-and-space/measure-and-classify-angles.html" },
                { name: "Complementary and Supplementary Angles", url: "./math-jhs/jhs1/geometry/shapes-and-space/complementary-supplementary-angles.html" },
                { name: "Adjacent & Vertically Opposite Angles", url: "./math-jhs/jhs1/geometry/shapes-and-space/adjacent-vertically-opposite-angles.html" },
                { name: "Construction Perpendicular Line Segment", url: "./math-jhs/jhs1/geometry/shapes-and-space/construction-perpendicular-line.html" },
                { name: "Construction Perpendicular Bisector", url: "./math-jhs/jhs1/geometry/shapes-and-space/construction-perpendicular-bisector.html" },
                { name: "Copy & Bisect Angles", url: "./math-jhs/jhs1/geometry/shapes-and-space/copy-and-bisect-angles.html" },
                { name: "Construction of Angle 90&deg; and 45&deg; ", url: "./math-jhs/jhs1/geometry/shapes-and-space/construction-angle90-angle45.html" },
                { name: "Construction of Angle 60&deg; and 30&deg;", url: "./math-jhs/jhs1/geometry/shapes-and-space/construction-angle60-angle30.html" },
                { name: "Construction of Angle 75&deg; and 15&deg;", url: "./math-jhs/jhs1/geometry/shapes-and-space/construction-angle75-angle15.html" },
                { name: "Real Life Examples of Bisectors", url: "./math-jhs/jhs1/geometry/shapes-and-space/real-life-bisectors.html" }
            ],
            "Measurements": [
                { name: "Perimeter of Given Shapes", url: "./math-jhs/jhs1/geometry/measurement/perimeter-of-given-shapes.html" },
                { name: "Circle: Diameter & Circumference", url: "./math-jhs/jhs1/geometry/measurement/circle-diameter-circumference.html" },
                { name: "Triangles & Rectangles in Square Grid", url: "./math-jhs/jhs1/geometry/measurement/triangles-rectangles-in-square-grid.html" },
                { name: "Deducing the Formula for the Area of a Triangle", url: "./math-jhs/jhs1/geometry/measurement/deducing-formula-area-of-triangles.html" },
                { name: "Area of a Triangle", url: "./math-jhs/jhs1/geometry/measurement/area-of-triangles.html" },
                { name: "Bearings", url: "./math-jhs/jhs1/geometry/measurement/bearings.html" },
                { name: "Back Bearings", url: "./math-jhs/jhs1/geometry/measurement/back-bearings.html" },
                { name: "Scalar & Vector Quantities", url: "./math-jhs/jhs1/geometry/measurement/scalar-vector-quantities.html" },
                { name: "Magnitude & Direction of Vectors", url: "./math-jhs/jhs1/geometry/measurement/magnitude-direction-of-vectors.html" },
                { name: "Converting Between the Forms of Vectors", url: "./math-jhs/jhs1/geometry/measurement/converting-vector-forms.html" }
            ],
            "Position and Transformation": [
                { name: "Reflectional Symmetry", url: "./math-jhs/jhs1/geometry/position-and-transformation/reflectional-symmetry.html" },
                { name: "Reflection In A Given Line", url: "./math-jhs/jhs1/geometry/position-and-transformation/reflection-in-a-given-line.html" },
                { name: "Translation By A Given Vector", url: "./math-jhs/jhs1/geometry/position-and-transformation/translation-by-a-vector.html" },
                { name: "Congruent And Similar Shapes", url: "./math-jhs/jhs1/geometry/position-and-transformation/congruence.html" }
            ],
            "Data": [
                { name: "Methods Of Collecting Data", url: "./math-jhs/jhs1/handling-data/data/method-of-collecting-data.html" },
                { name: "Designing Question Forms", url: "./math-jhs/jhs1/handling-data/data/designing-question-forms.html" },
                { name: "Organising And Presenting Data", url: "./math-jhs/jhs1/handling-data/data/organising-and-presenting-data.html" },
                { name: "Mean Of Ungrouped Data", url: "./math-jhs/jhs1/handling-data/data/mean-of-ungrouped-data.html" },
                { name: "Median Of Ungrouped Data", url: "./math-jhs/jhs1/handling-data/data/median-of-ungrouped-data.html" }
            ],
            "Chance or Probability": [
                { name: "The Likelihood of an Event", url: "./math-jhs/jhs1/handling-data/chance-or-probability/likelihood-of-an-event.html" },
                { name: "The Likelihood of a Single Outcome", url: "./math-jhs/jhs1/handling-data/chance-or-probability/likelihood-of-single-outcomes.html" },
                { name: "Probability as Fractions & Percentages", url: "./math-jhs/jhs1/handling-data/chance-or-probability/probability-as-fractions-percentages.html" }
            ]
        },
        "jhs2": {
            "Number & Numeration System": [
                { name: "Read & Write Numbers", url: "./math-jhs/jhs2/number/number-and-numeration-system/read-write-numbers.html" },
                { name: "Skip Counting", url: "./math-jhs/jhs2/number/number-and-numeration-system/skip-counting.html" },
                { name: "Comparing & Ordering Numbers", url: "./math-jhs/jhs2/number/number-and-numeration-system/comparing-ordering-numbers.html" },
                { name: "Standard Form", url: "./math-jhs/jhs2/number/number-and-numeration-system/standard-form.html" },
                { name: "Significant Figures & Decimal Places", url: "./math-jhs/jhs2/number/number-and-numeration-system/significant-decimal.html" },
                { name: "Place Value (Word Problems)", url: "./math-jhs/jhs2/number/number-and-numeration-system/place-value-word-problems.html" },
                { name: "Square Roots & Square Numbers", url: "./math-jhs/jhs2/number/number-and-numeration-system/square-root-square-number.html" },
                { name: "Factors", url: "./math-jhs/jhs2/number/number-and-numeration-system/factors.html" }
            ],
            "Number Operations": [
                { name: "Multiply & Divide By Powers of 10", url: "./math-jhs/jhs2/number/number-operations/multiply-and-divide-by-powers-of-10.html" },
                { name: "Halving & Doubling Technique", url: "./math-jhs/jhs2/number/number-operations/halving-and-doubling.html" },
                { name: "Products (Word Problems)", url: "./math-jhs/jhs2/number/number-operations/products-word-problems.html" },
                { name: "Addition & Subtraction", url: "./math-jhs/jhs2/number/number-operations/addition-and-subtraction.html" },
                { name: "Multiplication & Division", url: "./math-jhs/jhs2/number/number-operations/multiplication-and-division.html" },
                { name: "Operations (Word Problems)", url: "./math-jhs/jhs2/number/number-operations/operations-word-problems.html" },
                { name: "Laws of Indices", url: "./math-jhs/jhs2/number/number-operations/laws-of-indices.html" },
                { name: "Application (Indices)", url: "./math-jhs/jhs2/number/number-operations/application-indices.html" },
                { name: "Exponential Equations", url: "./math-jhs/jhs2/number/number-operations/exponential-equations.html" },
                { name: "Word Problems (Indices)", url: "./math-jhs/jhs2/number/number-operations/word-problems-indices.html" }
            ],
            "Fractions, Decimals & Percentages": [
                { name: "Operations on Fractions", url: "./math-jhs/jhs2/number/fractions-decimals-and-percentages/operations-on-fractions.html" },
                { name: "BODMAS on Fractions", url: "./math-jhs/jhs2/number/fractions-decimals-and-percentages/bodmas-fractions.html" },
                { name: "Word Problems on Fractions", url: "./math-jhs/jhs2/number/fractions-decimals-and-percentages/word-problems-on-fraction.html" }
            ],
            "Ratios and Proportion": [
                { name: "Conversion of Measurement Units", url: "./math-jhs/jhs2/number/ratios-and-proportion/conversion-measurement-units.html" },
                { name: "Unit Rate", url: "./math-jhs/jhs2/number/ratios-and-proportion/unit-rate.html" },
                { name: "Distance-Time Graph (Travel Graph)", url: "./math-jhs/jhs2/number/ratios-and-proportion/distance-time-graph.html" },
                { name: "Proportional Relations", url: "./math-jhs/jhs2/number/ratios-and-proportion/proportional-relations.html" },
                { name: "Constant of Proportionality", url: "./math-jhs/jhs2/number/ratios-and-proportion/constant-of-proportionality.html" }
            ],
            "Patterns and Relations": [
                { name: "Gradient & Equation Of A Line", url: "./math-jhs/jhs2/algebra/patterns-and-relations/gradient-and-equation-of-line.html" },
                { name: "Graphs Of Linear Relations ", url: "./math-jhs/jhs2/algebra/patterns-and-relations/graphs-linear-relations.html" },
                { name: "Word Problems (Graphs)", url: "./math-jhs/jhs2/algebra/patterns-and-relations/word-problems-graphs.html" }
            ],
            "Algebraic Expressions": [
                { name: "Distributive Property", url: "./math-jhs/jhs2/algebra/algebraic-expressions/distributive-property.html" },
                { name: "Operations on Algebraic Expressions", url: "./math-jhs/jhs2/algebra/algebraic-expressions/operations-on-algebra.html" },
                { name: "Substitution Of Values", url: "./math-jhs/jhs2/algebra/algebraic-expressions/substitution-of-values.html" },
                { name: "Factorisation", url: "./math-jhs/jhs2/algebra/algebraic-expressions/factorisation.html" }
            ],
            "Variables and Equations": [
                { name: "Word Problems & Linear Inequalities", url: "./math-jhs/jhs2/algebra/variables-and-equations/word-problems-linear-inequalities.html" },
                { name: "Simple Linear Inequalities", url: "./math-jhs/jhs2/algebra/variables-and-equations/simple-linear-inequalities.html" },
                { name: "Solution Set of Linear Inequalities", url: "./math-jhs/jhs2/algebra/variables-and-equations/solution-set.html" }
            ],
            "Shapes and Space": [
                { name: "Alternate & Corresponding Angles", url: "./math-jhs/jhs2/geometry/shapes-and-space/alternate-corresponding-angles.html" },
                { name: "Total Angles in a Triangle ", url: "./math-jhs/jhs2/geometry/shapes-and-space/total-angles-triangles.html" },
                { name: "Construction & Bisection 120&deg;, 105&deg;, 135&deg; and 150&deg;", url: "./math-jhs/jhs2/geometry/shapes-and-space/construct-bisect-angles" },
                { name: "Construct Triangles", url: "./math-jhs/jhs2/geometry/shapes-and-space/construction-triangles.html" },
                { name: "Loci", url: "./math-jhs/jhs2/geometry/shapes-and-space/loci.html" }
            ],
            "Measurements": [
                { name: "Area of Circles", url: "./math-jhs/jhs2/geometry/measurement/area-circles.html" },
                { name: "Right-Angled Triangles", url: "./math-jhs/jhs2/geometry/measurement/right-angled-triangles.html" },
                { name: "The Pythagoras Theorem", url: "./math-jhs/jhs2/geometry/measurement/the-pythagora-theorem.html" },
                { name: "Word Problems (Pythagoras Theorem)", url: "./math-jhs/jhs2/geometry/measurement/word-problems-pythagoras-theorem.html" },
                { name: "Trigonometric Ratios (sine, cosine tangent)", url: "./math-jhs/jhs2/geometry/measurement/trigonometric-ratios.html" },
                { name: "Vectors", url: "./math-jhs/jhs2/geometry/measurement/vectors.html" },
                { name: "Vector Equality", url: "./math-jhs/jhs2/geometry/measurement/vector-equality.html" }
            ],
            "Position and Transformation": [
                { name: "Rotation", url: "./math-jhs/jhs2/geometry/position-and-transformation/rotation.html" },
                { name: "Rotations in a Coordinate Plane", url: "./math-jhs/jhs2/geometry/position-and-transformation/rotation-coordinate-plane.html" },
                { name: "Congruent Shapes", url: "./math-jhs/jhs2/geometry/position-and-transformation/congruent-shapes.html" }
            ],
            "Data": [
                { name: "Types of Data", url: "./math-jhs/jhs2/handling-data/data/types-of-data.html" },
                { name: "Methods of Collecting Data", url: "./math-jhs/jhs2/handling-data/data/methods-of-collecting-data.html" },
                { name: "Organising And Analysing Data", url: "./math-jhs/jhs2/handling-data/data/organising-and-analysing-data.html" },
                { name: "Measures of Central Tendency", url: "./math-jhs/jhs2/handling-data/data/measures-of-central-tendency.html" },
                { name: "Justification of a Chosen Measure of Central Tendency", url: "./math-jhs/jhs2/handling-data/data/justification.html" }
            ],
            "Chance or Probability": [
                { name: "Independent Events", url: "./math-jhs/jhs2/handling-data/chance-or-probability/independent-events.html" },
                { name: "Probability as Fractions, Decimals & Percentages", url: "./math-jhs/jhs2/handling-data/chance-or-probability/probability-as-fractions-percentages.html" }
            ]
        },
        "jhs3": {
            "Number & Numeration System": [
                { name: "Significant Figures and Decimal Places", url: "./math-jhs/jhs3/number/number-and-numeration-system/significant-decimal-places.html" },
                { name: "Place Value (Word Problems)", url: "./math-jhs/jhs3/number/number-and-numeration-system/place-value-word-problems.html" },
                { name: "Union & Intersection of Sets (Venn Diagram)", url: "./math-jhs/jhs3/number/number-and-numeration-system/union-intersection-sets.html" },
                { name: "Two Set Problems", url: "./math-jhs/jhs3/number/number-and-numeration-system/two-set-problems.html" }
            ],
            "Number Operations": [
                { name: "Multiply & Divide By Powers of 10", url: "./math-jhs/jhs3/number/number-operations/multiply-and-divide-by-powers-of-10.html" },
                { name: "Commutative Property", url: "./math-jhs/jhs3/number/number-operations/commutative-property.html" },
                { name: "Associative Property", url: "./math-jhs/jhs3/number/number-operations/associative-property.html" },
                { name: "Distributive Property", url: "./math-jhs/jhs3/number/number-operations/distributive-property.html" },
                { name: "Number Operations (Word Problems)", url: "./math-jhs/jhs3/number/number-operations/number-operations-word-problems.html" },
                { name: "Rounding Solutions to Word Problems", url: "./math-jhs/jhs3/number/number-operations/rounding-solutions-word-problems.html" },
                { name: "Surds", url: "./math-jhs/jhs3/number/number-operations/surds.html" },
                { name: "Rules of Surds", url: "./math-jhs/jhs3/number/number-operations/rules-of-surds.html" },
                { name: "Simplifying Surds", url: "./math-jhs/jhs3/number/number-operations/simplifying-surds.html" },
                { name: "Approximating Square Roots of Non-Perfect Squares", url: "./math-jhs/jhs3/number/number-operations/approximating-square-roots.html" }
            ],
            "Fractions, Decimals & Percentages": [
                { name: "Operations on Fractions", url: "./math-jhs/jhs3/number/fractions-decimals-and-percentages/operations-on-fractions.html" },
                { name: "Applying BODMAS & PEDMAS", url: "./math-jhs/jhs3/number/fractions-decimals-and-percentages/bodmas-and-pedmas-fractions.html" },
                { name: "Word Problems on Fractions", url: "./math-jhs/jhs3/number/fractions-decimals-and-percentages/word-problems-on-fraction.html" }
            ],
            "Ratios and Proportion": [
                { name: "Proportional Relations", url: "./math-jhs/jhs3/number/ratios-and-proportion/proportional-relations.html" },
                { name: "Interest, Discount, VAT, NHIL, Depreciation & Insurance", url: "./math-jhs/jhs3/number/ratios-and-proportion/interest-discounts.html" },
                { name: "SSNIT Benefits & Contributions ", url: "./math-jhs/jhs3/number/ratios-and-proportion/ssnit.html" },
                { name: "Graph of Proportional Relations", url: "./math-jhs/jhs3/number/ratios-and-proportion/graph-proportion.html" }
            ],
            "Patterns and Relations": [
                { name: "Table & Graph of Two Linear Relations", url: "./math-jhs/jhs3/algebra/patterns-and-relations/two-linear-relations.html" },
                { name: "Using Graphs to Determine Missing Elements in Ordered Pairs", url: "./math-jhs/jhs3/algebra/patterns-and-relations/extrapolation.html" },
                { name: "Using Graphs to Solve Two Linear Equations", url: "./math-jhs/jhs3/algebra/patterns-and-relations/using-graph-two-linear-equations.html" }
            ],
            "Algebraic Expressions": [
                { name: "Change of Subject", url: "./math-jhs/jhs3/algebra/algebraic-expressions/change-of-subject.html" },
                { name: "Substitution Of Values", url: "./math-jhs/jhs3/algebra/algebraic-expressions/substitution-of-values.html" },
                { name: "Factorisation", url: "./math-jhs/jhs3/algebra/algebraic-expressions/factorisation.html" },
                { name: "Word Problems on Factorisation", url: "./math-jhs/jhs3/algebra/algebraic-expressions/word-problems-factorisation.html" }
            ],
            "Variables and Equations": [
                { name: "Single Variable Linear Inequalities", url: "./math-jhs/jhs3/algebra/variables-and-equations/single-variable-linear-inequalities.html" },
                { name: "Solution Set of Linear Inequalities", url: "./math-jhs/jhs3/algebra/variables-and-equations/solution-set.html" },
                { name: "Word Problems on Linear Inequalities", url: "./math-jhs/jhs3/algebra/variables-and-equations/word-problems-linear-inequalities.html" }
            ],
            "Shapes and Space": [
                { name: "Sum of Angles in a Polygon", url: "./math-jhs/jhs3/geometry/shapes-and-space/sum-of-angles-polygon.html" },
                { name: "Similar and Congruent Triangles ", url: "./math-jhs/jhs3/geometry/shapes-and-space/similar-congruent-triangles.html" },
                { name: "Inscribed & Circumscribed Circles of Triangles", url: "./math-jhs/jhs3/geometry/shapes-and-space/inscribed-circumscribed.html" },
                { name: "Constructions of Parallelograms", url: "./math-jhs/jhs3/geometry/shapes-and-space/construction-parallelogram.html" }
            ],
            "Measurements": [
                { name: "Nets of Cuboids & Triangular Prisms", url: "./math-jhs/jhs3/geometry/measurement/nets-cuboids-triangular-prisms.html" },
                { name: "Surface Area of Cuboids", url: "./math-jhs/jhs3/geometry/measurement/surface-area-cuboids.html" },
                { name: "Surface Area of Triangular Prisms", url: "./math-jhs/jhs3/geometry/measurement/surface-area-triangular-prisms.html" },
                { name: "Expressing Points as Position Vectors", url: "./math-jhs/jhs3/geometry/measurement/points-as-position-vectors.html" },
                { name: "Parallel Vectors & Perpendicular Vectors", url: "./math-jhs/jhs3/geometry/measurement/parallel-perpendicular-vectors.html" },
                { name: "Resolution of Vectors", url: "./math-jhs/jhs3/geometry/measurement/resolution-of-vectors.html" }
            ],
            "Position and Transformation": [
                { name: "Enlargement", url: "./math-jhs/jhs3/geometry/position-and-transformation/enlargement.html" },
                { name: "Enlargement & Identifying Real Life Situations", url: "./math-jhs/jhs3/geometry/position-and-transformation/enlargement-real-life.html" },
                { name: "Congruent & Similar Shapes", url: "./math-jhs/jhs3/geometry/position-and-transformation/congruent-similar-shapes.html" }
            ],
            "Data": [
                { name: "Methods of Collecting Data", url: "./math-jhs/jhs3/handling-data/data/methods-of-collecting-data.html" },
                { name: "Organising Data", url: "./math-jhs/jhs3/handling-data/data/organising-data.html" },
                { name: "Histogram", url: "./math-jhs/jhs3/handling-data/data/histogram.html" },
                { name: "Data & Bias", url: "./math-jhs/jhs3/handling-data/data/data-and-bias.html" },
                { name: "Using Descriptive Statistics", url: "./math-jhs/jhs3/handling-data/data/using-descriptive-statistics.html" },
                { name: "Mean, Median and Mode & Extreme Data in Data Set", url: "./math-jhs/jhs3/handling-data/data/measures-and-extreme-data.html" }
            ],
            "Chance or Probability": [
                { name: "Two Dependent Events", url: "./math-jhs/jhs3/handling-data/chance-or-probability/two-dependent-events.html" },
                { name: "Probability as Fractions, Percentages &/or Ratios", url: "./math-jhs/jhs3/handling-data/chance-or-probability/probability-as-fractions-percentages.html" }
            ]
        }
    }; */

    /*In case I want to test a functionality */
    const subtopicsData = {
        "jhs": {
            "Grammar": [
                { name: "Parts of Speech", url: "./english-jhs/jhs/grammar/parts-of-speech" },
                { name: "Tenses", url: "./english-jhs/jhs/grammar/tenses" },
                { name: "Subject-Verb Agreement", url: "./english-jhs/jhs/grammar/subject-verb-agreement.html" },
                { name: "Active and Passive Voice", url: "./english-jhs/jhs/grammar/active-passive-voice.html" },
                { name: "Direct and Indirect Speech", url: "./english-jhs/jhs/grammar/direct-indirect-speech.html" },
                { name: "Punctuation", url: "./english-jhs/jhs/grammar/punctuation.html" }
            ],
            "Essays": [
                { name: "Descriptive Essay", url: "./english-jhs/jhs/essays/descriptive-essay.html" },
                { name: "Narrative Essay", url: "./english-jhs/jhs/essays/narrative-essay.html" },
                { name: "Argumentative Essay", url: "./english-jhs/jhs/essays/argumentative-essay.html" },
                { name: "Expository Essay", url: "./english-jhs/jhs/essays/expository-essay.html" },
                { name: "Letter Writing", url: "./english-jhs/jhs/essays/letter-writing.html" },
                { name: "Speech Writing", url: "./english-jhs/jhs/essays/speech-writing.html" },
                { name: "Article Writing", url: "./english-jhs/jhs/essays/article-writing.html" },
                { name: "Report Writing", url: "./english-jhs/jhs/essays/report-writing.html" },
                { name: "Story Writing", url: "./english-jhs/jhs/essays/story-writing.html" },
                { name: "Assessment Task", url: "./english-jhs/jhs/essays/assessment-task.html" }
            ],
            "Reading": [
                { name: "Comprehension", url: "./english-jhs/jhs/reading/comprehension.html" },
                { name: "Summary", url: "./english-jhs/jhs/reading/summary.html" },
                { name: "Literature", url: "./english-jhs/jhs/reading/literature.html" },
                { name: "Poetry", url: "./english-jhs/jhs/reading/poetry.html" },
                { name: "Drama", url: "./english-jhs/jhs/reading/drama.html" },
                { name: "Prose", url: "./english-jhs/jhs/reading/prose.html" }
            ],
            "Orals": [
                { name: "Listening Comprehension", url: "./english-jhs/jhs/orals/listening-comprehension.html" },
                { name: "Phonetics", url: "./english-jhs/jhs/orals/phonetics.html" },
                { name: "Stress and Intonation", url: "./english-jhs/jhs/orals/stress-intonation.html" },
                { name: "Oral Presentation", url: "./english-jhs/jhs/orals/oral-presentation.html" },
                { name: "Debate", url: "./english-jhs/jhs/orals/debate.html" }
            ]
        }
    };

    // Get modal elements
    const subtopicModal = document.getElementById('subtopicModal');
    const modalTopicTitle = document.getElementById('modalTopicTitle');
    const subtopicList = document.getElementById('subtopicList');
    const recentSubtopicList = document.getElementById('recentSubtopicList');
    const modalLevelIndicator = document.getElementById('modalLevelIndicator');
    const recentListContainer = document.querySelector('.recently-viewed-container');

    function openSubtopicModal(topicName) {
        const activeTab = document.querySelector('.tab-button.active');
        const currentLevel = activeTab ? activeTab.textContent.toLowerCase().replace(' ', '') : 'jhs1';
        
        const levelSubtopics = subtopicsData[currentLevel] || {};
        const subtopics = levelSubtopics[topicName] || [];
        
        if (subtopics.length === 0) {
            window.location.href = `./${currentLevel}/${encodeURIComponent(topicName.toLowerCase().replace(/ /g, '-'))}`;
            return;
        }
        
        // Set modal title with level context
        modalTopicTitle.innerHTML = `${currentLevel.toUpperCase()}: ${topicName} <br><span class="subtopic-subheader">Select Subtopic</span>`;
        modalLevelIndicator.textContent = currentLevel.toUpperCase();
        
        // Clear previous subtopics
        subtopicList.innerHTML = '';
        
        // Add subtopics to modal
        subtopics.forEach(subtopic => {
            const li = document.createElement('li');
            li.className = 'subtopic-item';
            li.innerHTML = `
                <a href="${subtopic.url}" class="subtopic-link" 
                   data-topic="${topicName}" 
                   data-level="${currentLevel}">
                    <i class="fas fa-book-open"></i> ${subtopic.name}
                </a>
            `;
            subtopicList.appendChild(li);
        });
        
        // Load and display recently viewed items
        displayRecentlyViewed();
        
        // Show modal
        subtopicModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function displayRecentlyViewed() {
        const recentItems = getRecentlyViewed();
        
        if (recentItems.length === 0) {
            recentListContainer.style.display = 'none';
            return;
        }
        
        recentListContainer.style.display = 'block';
        recentSubtopicList.innerHTML = '';
        
        recentItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'subtopic-item recent-item';
            li.style.animationDelay = `${index * 0.1}s`;
            li.innerHTML = `
                <a href="${item.url}" class="subtopic-link" 
                   data-topic="${item.topic}" 
                   data-level="${item.level}">
                    <i class="fas fa-history"></i> 
                    <span class="recent-item-name">${item.name}</span>
                    <span class="recent-item-meta">${item.level.toUpperCase()} • ${item.topic}</span>
                </a>
            `;
            recentSubtopicList.appendChild(li);
        });
    }

    // Track clicks on subtopic links
    document.addEventListener('click', function(e) {
        const subtopicLink = e.target.closest('.subtopic-link');
        if (subtopicLink) {
            const topic = subtopicLink.getAttribute('data-topic');
            const level = subtopicLink.getAttribute('data-level');
            const name = subtopicLink.querySelector('.recent-item-name')?.textContent || 
                         subtopicLink.textContent.trim();
            const url = subtopicLink.getAttribute('href');
            
            if (topic && level) {
                saveRecentlyViewed({ name, url, topic, level });
            }
        }
    });

    // Close modal when clicking X
    document.querySelector('.close-modal').addEventListener('click', () => {
        subtopicModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === subtopicModal) {
            subtopicModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Update all topic links to open modal instead
    document.querySelectorAll('.topic-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const topicName = this.closest('.topic-card').querySelector('.topic-header h3').textContent;
            openSubtopicModal(topicName);
        });
    });

    // ========== ANIMATIONS ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.topic-card, .resource-card, .exam-card').forEach(card => {
        observer.observe(card);
    });

    // Initialize recently viewed display
    displayRecentlyViewed();
});