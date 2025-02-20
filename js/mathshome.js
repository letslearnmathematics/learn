document.addEventListener("DOMContentLoaded", () => {
    // Hamburger menu code (keep your existing code here)
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));

    //--------The Game----------------
    const questions = [
        // Your existing questions here...
          //LEVEL 1:
          { // 1
            question: "If \\(P = \\{7, 9, 13\\}\\) and \\(Q = \\{1, 7, 13\\}\\), find \\(P \\cap Q\\)?",
            choices: [
                "\\(\\{1, 7, 13\\}\\)",
                "\\(\\{1, 9, 13\\}\\)",
                "\\(\\{7, 13\\}\\)",
                "\\(\\{7, 9, 13\\}\\)"
            ],
            correct: 2,
            video: "https://www.youtube.com/embed/video1"
        },
        { // 2
            question: "Given that \\((23 \\times 82) \\times 79 = 148994\\). Find the exact value of \\((2.3 \\times 82) \\times 7.9 \\)",
            choices: ["14.8994", "148.994", "1489.94", "14899.4"],
            correct: 2,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 3
            question: "Convert \\(25_{ten}\\) to a base two numeral.",
            choices: ["10001", "10011", "10101", "11001"],
            correct: 3,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 4
            question: "Write \\(1204_{five}\\) as a number in base 10.",
            choices: ["995", "179", "39", "35"],
            correct: 1,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 5
            question: "Multiply \\((2x + y)\\) by \\((2x - y)\\)",
            choices: [
                "\\(4x^2 - y^2\\)", 
                "\\(4x^2 + xy - y^2\\)", 
                "\\(4x^2 - xy - y^2\\)", 
                "\\(4x^2 + y^2\\)"
                ],
            correct: 0,
            video: "https://www.youtube.com/embed/video3"
        },
        { // 6
            question: "Solve for \\(x\\): \\(2x + 5 = 15\\)",
            choices: ["5", "10", "7.5", "20"],
            correct: 0,
            video: "https://www.youtube.com/embed/video4"
        },
        { // 7
            question: "What is the area of a rectangle with length 8 cm and width 5 cm?",
            choices: [
                "\\(40 cm\\)", 
                "\\(40 cm^2\\)", 
                "\\(30 cm\\)", 
                "\\(13 cm^2\\)"],
            correct: 1,
            video: "https://www.youtube.com/embed/video5"
        },
        { // 8
            question: "What is the square root of 144?",
            choices: ["10", "12", "14", "16"],
            correct: 1,
            video: "https://www.youtube.com/embed/video6"
        },
        { // 9
            question: "What is the value of \\(\\pi\\) (pi) rounded to two decimal places?",
            choices: ["3.14", "3.16", "3.12", "3.18"],
            correct: 0,
            video: "https://www.youtube.com/embed/video7"
        },
        { // 10
            question: "What is the perimeter of a square with side length 6?",
            choices: ["12", "18", "24", "36"],
            correct: 2,
            video: "https://www.youtube.com/embed/video8"
        },
        { // 11
            question: "What is the sum of the angles in a triangle?",
            choices: ["90°", "180°", "270°", "360°"],
            correct: 1,
            video: "https://www.youtube.com/embed/video9"
        },
        { // 12
            question: "What is the value of \\(\\frac{3}{4} + \\frac{1}{2}\\)?",
            choices: ["1", "1.25", "1.5", "1.75"],
            correct: 1,
            video: "https://www.youtube.com/embed/video10"
        },
        
        { // 13
            question: "What is the value of \\(\\sqrt{169}\\)?",
            choices: ["11", "12", "13", "14"],
            correct: 2,
            video: "https://www.youtube.com/embed/video15"
        },
        { // 14
            question: "If \\(21 : 2x = 7 : 10\\), find the value of \\(x\\)",
            choices: ["3", "\\(2\\dfrac{1}{2}\\)", "15", "30"],
            correct: 2,
            video: "https://www.youtube.com/embed/video12"
        },
        { // 15
            question: "A table which cost Gh₵2,400.00 to manufacture was sold for Gh₵ 3,000.00. Find the profit percent.",
            choices: ["\\(80\\%\\)", "\\(25\\%\\)", "\\(20\\%\\)", "\\(11\\%\\)"],
            correct: 1,
            video: "https://www.youtube.com/embed/video13"
        },
        { // 16
            question: "What is the value of \\(\\tan(45°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video14"
        },
        { // 17
            question: "If \\(\\dfrac{1}{x} = 1\\dfrac{1}{2}\\), find \\(x\\)",
            choices: ["3", "\\(\\dfrac{3}{2}\\)", "\\(\\dfrac{4}{3}\\)", "\\(\\dfrac{2}{3}\\)"],
            correct: 3,
            video: "https://www.youtube.com/embed/video11" 
        },
        { // 18
            question: "Calculate the size of an exterior angle of a regular pentagon.",
            choices: ["\\(72^{\circ}\\)", "\\(90^{\circ}\\)", "\\(108^{\circ}\\)", "\\(360^{\circ}\\)"],
            correct: 0,
            video: "https://www.youtube.com/embed/video16"
        },
        { // 19
            question: "What is the value of \\(\\dfrac{7}{12} - \\dfrac{1}{3}\\)?",
            choices: ["\\(\\dfrac{1}{4}\\)", "\\(\\dfrac{1}{3}\\)", "\\(\\dfrac{1}{2}\\)", "\\(\\dfrac{1}{6}\\)"],
            correct: 0,
            video: "https://www.youtube.com/embed/video17"
        },
        { // 20
            question: "What is the value of \\(\\dfrac{3}{5} \\div \\dfrac{2}{5}\\)?",
            choices: ["\\(\\dfrac{3}{2}\\)", "\\(\\dfrac{6}{5}\\)", "\\(\\dfrac{9}{10}\\)", "\\(\\dfrac{5}{10}\\)"],
            correct: 0,
            video: "https://www.youtube.com/embed/video18"
        },
        { // 21
            question: "What is the value of \\(2^5\\)?",
            choices: ["16", "32", "64", "128"],
            correct: 1,
            video: "https://www.youtube.com/embed/video19"
        },
        { // 22
            question: "What is the value of \\(\\sqrt{64}\\)?",
            choices: ["6", "7", "8", "9"],
            correct: 2,
            video: "https://www.youtube.com/embed/video20"
        },
        { // 23
            question: "What is the value of \\(\\frac{1}{2} + \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{4}", "\\frac{3}{4}", "\\frac{1}{2}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video21"
        },
        { // 24
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{1}{2}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{6}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video22"
        },
        { // 25
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video23"
        },
        { // 26
            question: "What is the value of \\(\\frac{4}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{2}{5}", "\\frac{4}{5}", "\\frac{8}{25}", "2"],
            correct: 3,
            video: "https://www.youtube.com/embed/video24"
        },
        { // 27
            question: "What is the value of \\(\\frac{3}{8} + \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video25"
        },
        { // 28
            question: "What is the value of \\(\\frac{7}{10} - \\frac{1}{5}\\)?",
            choices: ["\\frac{1}{10}", "\\frac{1}{5}", "\\frac{1}{2}", "\\frac{3}{10}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video26"
        },
        { // 29
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{4}{5}\\)?",
            choices: ["\\frac{6}{15}", "\\frac{8}{15}", "\\frac{10}{15}", "\\frac{12}{15}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video27"
        },
        { // 30
            question: "What is the value of \\(\\frac{5}{6} \\div \\frac{1}{2}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{5}{6}", "\\frac{10}{6}", "\\frac{5}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video28"
        },
        { // 31
            question: "What is the value of \\(\\frac{3}{4} + \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{7}", "\\frac{17}{12}", "\\frac{5}{12}", "\\frac{6}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video29"
        },
        { // 32
            question: "What is the value of \\(\\frac{7}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video30"
        },
        { // 33
            question: "What is the value of \\(\\frac{2}{5} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{6}{20}", "\\frac{5}{9}", "\\frac{6}{9}", "\\frac{5}{20}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video31"
        },
        { // 34
            question: "What is the value of \\(\\frac{3}{5} \\div \\frac{1}{5}\\)?",
            choices: ["\\frac{3}{25}", "\\frac{3}{5}", "3", "\\frac{15}{5}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video32"
        },
        { // 35
            question: "What is the value of \\(\\frac{4}{7} + \\frac{2}{7}\\)?",
            choices: ["\\frac{2}{7}", "\\frac{6}{7}", "\\frac{8}{7}", "\\frac{10}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video33"
        },
        { // 36
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{6}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{2}{3}", "\\frac{4}{6}", "\\frac{5}{6}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video34"
        },
        { // 37
            question: "What is the value of \\(\\frac{3}{8} \\times \\frac{2}{3}\\)?",
            choices: ["\\frac{6}{24}", "\\frac{5}{11}", "\\frac{6}{11}", "\\frac{5}{24}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video35"
        },
        { // 38
            question: "What is the value of \\(\\frac{7}{9} \\div \\frac{1}{3}\\)?",
            choices: ["\\frac{7}{27}", "\\frac{7}{9}", "\\frac{21}{9}", "\\frac{7}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video36"
        },
        { // 39
            question: "What is the value of \\(\\frac{2}{3} + \\frac{1}{6}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{5}{6}", "\\frac{7}{6}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video37"
        },
        { // 40
            question: "What is the value of \\(\\frac{5}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{3}{8}", "\\frac{5}{8}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video38"
        },
        { // 41
            question: "What is the value of \\(\\frac{3}{4} \\times \\frac{1}{2}\\)?",
            choices: ["\\frac{3}{8}", "\\frac{1}{4}", "\\frac{1}{2}", "\\frac{3}{4}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video39"
        },
        { // 42
            question: "What is the value of \\(\\frac{4}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{2}{5}", "\\frac{4}{5}", "\\frac{8}{25}", "2"],
            correct: 3,
            video: "https://www.youtube.com/embed/video40"
        },
        { // 43
            question: "What is the value of \\(\\frac{3}{7} + \\frac{2}{7}\\)?",
            choices: ["\\frac{1}{7}", "\\frac{5}{7}", "\\frac{6}{7}", "\\frac{9}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video41"
        },
        { // 44
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video42"
        },
        { // 45
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{1}{2}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{6}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video43"
        },
        { // 46
            question: "What is the value of \\(\\frac{5}{6} \\div \\frac{1}{2}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{5}{6}", "\\frac{10}{6}", "\\frac{5}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video44"
        },
        { // 47
            question: "What is the value of \\(\\frac{3}{4} + \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{7}", "\\frac{17}{12}", "\\frac{5}{12}", "\\frac{6}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video45"
        },
        { // 48
            question: "What is the value of \\(\\frac{7}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video46"
        },
        { // 49
            question: "What is the value of \\(3^4\\)?",
            choices: ["12", "27", "81", "64"],
            correct: 2,
            video: "https://www.youtube.com/embed/video3"
        },
        { // 50
            question: "Solve for \\(x\\): \\(2x + 5 = 15\\)",
            choices: ["5", "10", "7.5", "20"],
            correct: 0,
            video: "https://www.youtube.com/embed/video4"
        },

        //LEVEL 2
        { // 1
            question: "If \\(P = \\{7, 9, 13\\}\\) and \\(Q = \\{1, 7, 13\\}\\), find \\(P \\cap Q\\)?",
            choices: [
                "\\(\\{1, 7, 13\\}\\)",
                "\\(\\{1, 9, 13\\}\\)",
                "\\(\\{7, 13\\}\\)",
                "\\(\\{7, 9, 13\\}\\)"
            ],
            correct: 2,
            video: "https://www.youtube.com/embed/video1"
        },
        { // 2
            question: "Given that \\((23 \\times 82) \\times 79 = 148994\\). Find the exact value of \\((2.3 \\times 82) \\times 7.9 \\)",
            choices: ["14.8994", "148.994", "1489.94", "14899.4"],
            correct: 2,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 3
            question: "Convert \\(25_{ten}\\) to a base two numeral.",
            choices: ["10001", "10011", "10101", "11001"],
            correct: 3,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 4
            question: "Write \\(1204_{five}\\) as a number in base 10.",
            choices: ["995", "179", "39", "35"],
            correct: 1,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 5
            question: "Multiply \\((2x + y)\\) by \\(2x - y\\)",
            choices: [
                "\\(4x^2 - y^2\\)", 
                "\\(4x^2 + xy - y^2\\)", 
                "\\(4x^2 - xy - y^2\\)", 
                "\\(4x^2 + y^2\\)"
                ],
            correct: 0,
            video: "https://www.youtube.com/embed/video3"
        },
        { // 6
            question: "Solve for \\(x\\): \\(2x + 5 = 15\\)",
            choices: ["5", "10", "7.5", "20"],
            correct: 0,
            video: "https://www.youtube.com/embed/video4"
        },
        { // 7
            question: "What is the area of a rectangle with length 8 and width 5?",
            choices: ["13", "40", "30", "45"],
            correct: 1,
            video: "https://www.youtube.com/embed/video5"
        },
        { // 8
            question: "What is the square root of 144?",
            choices: ["10", "12", "14", "16"],
            correct: 1,
            video: "https://www.youtube.com/embed/video6"
        },
        { // 9
            question: "What is the value of \\(\\pi\\) (pi) rounded to two decimal places?",
            choices: ["3.14", "3.16", "3.12", "3.18"],
            correct: 0,
            video: "https://www.youtube.com/embed/video7"
        },
        { // 10
            question: "What is the perimeter of a square with side length 6?",
            choices: ["12", "18", "24", "36"],
            correct: 2,
            video: "https://www.youtube.com/embed/video8"
        },
        { // 11
            question: "What is the sum of the angles in a triangle?",
            choices: ["90°", "180°", "270°", "360°"],
            correct: 1,
            video: "https://www.youtube.com/embed/video9"
        },
        { // 12
            question: "What is the value of \\(\\frac{3}{4} + \\frac{1}{2}\\)?",
            choices: ["1", "1.25", "1.5", "1.75"],
            correct: 1,
            video: "https://www.youtube.com/embed/video10"
        },
        { // 13
            question: "What is the value of \\(\\log_{10} 100\\)?",
            choices: ["1", "2", "10", "100"],
            correct: 1,
            video: "https://www.youtube.com/embed/video11"
        },
        { // 14
            question: "What is the value of \\(\\sin(90°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video12"
        },
        { // 15
            question: "What is the value of \\(\\cos(0°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video13"
        },
        { // 16
            question: "What is the value of \\(\\tan(45°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video14"
        },
        { // 17
            question: "What is the value of \\(\\sqrt{169}\\)?",
            choices: ["11", "12", "13", "14"],
            correct: 2,
            video: "https://www.youtube.com/embed/video15"
        },
        { // 18
            question: "What is the value of \\(\\frac{5}{8} \\times \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{10}{24}", "\\frac{5}{24}", "\\frac{10}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video16"
        },
        { // 19
            question: "What is the value of \\(\\frac{7}{12} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{1}{6}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video17"
        },
        { // 20
            question: "What is the value of \\(\\frac{3}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{3}{2}", "\\frac{6}{5}", "\\frac{9}{10}", "\\frac{15}{10}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video18"
        },
        { // 21
            question: "What is the value of \\(2^5\\)?",
            choices: ["16", "32", "64", "128"],
            correct: 1,
            video: "https://www.youtube.com/embed/video19"
        },
        { // 22
            question: "What is the value of \\(\\sqrt{64}\\)?",
            choices: ["6", "7", "8", "9"],
            correct: 2,
            video: "https://www.youtube.com/embed/video20"
        },
        { // 23
            question: "What is the value of \\(\\frac{1}{2} + \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{4}", "\\frac{3}{4}", "\\frac{1}{2}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video21"
        },
        { // 24
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{1}{2}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{6}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video22"
        },
        { // 25
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video23"
        },
        { // 26
            question: "What is the value of \\(\\frac{4}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{2}{5}", "\\frac{4}{5}", "\\frac{8}{25}", "2"],
            correct: 3,
            video: "https://www.youtube.com/embed/video24"
        },
        { // 27
            question: "What is the value of \\(\\frac{3}{8} + \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video25"
        },
        { // 28
            question: "What is the value of \\(\\frac{7}{10} - \\frac{1}{5}\\)?",
            choices: ["\\frac{1}{10}", "\\frac{1}{5}", "\\frac{1}{2}", "\\frac{3}{10}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video26"
        },
        { // 29
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{4}{5}\\)?",
            choices: ["\\frac{6}{15}", "\\frac{8}{15}", "\\frac{10}{15}", "\\frac{12}{15}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video27"
        },
        { // 30
            question: "What is the value of \\(\\frac{5}{6} \\div \\frac{1}{2}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{5}{6}", "\\frac{10}{6}", "\\frac{5}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video28"
        },
        { // 31
            question: "What is the value of \\(\\frac{3}{4} + \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{7}", "\\frac{17}{12}", "\\frac{5}{12}", "\\frac{6}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video29"
        },
        { // 32
            question: "What is the value of \\(\\frac{7}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video30"
        },
        { // 33
            question: "What is the value of \\(\\frac{2}{5} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{6}{20}", "\\frac{5}{9}", "\\frac{6}{9}", "\\frac{5}{20}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video31"
        },
        { // 34
            question: "What is the value of \\(\\frac{3}{5} \\div \\frac{1}{5}\\)?",
            choices: ["\\frac{3}{25}", "\\frac{3}{5}", "3", "\\frac{15}{5}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video32"
        },
        { // 35
            question: "What is the value of \\(\\frac{4}{7} + \\frac{2}{7}\\)?",
            choices: ["\\frac{2}{7}", "\\frac{6}{7}", "\\frac{8}{7}", "\\frac{10}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video33"
        },
        { // 36
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{6}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{2}{3}", "\\frac{4}{6}", "\\frac{5}{6}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video34"
        },
        { // 37
            question: "What is the value of \\(\\frac{3}{8} \\times \\frac{2}{3}\\)?",
            choices: ["\\frac{6}{24}", "\\frac{5}{11}", "\\frac{6}{11}", "\\frac{5}{24}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video35"
        },
        { // 38
            question: "What is the value of \\(\\frac{7}{9} \\div \\frac{1}{3}\\)?",
            choices: ["\\frac{7}{27}", "\\frac{7}{9}", "\\frac{21}{9}", "\\frac{7}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video36"
        },
        { // 39
            question: "What is the value of \\(\\frac{2}{3} + \\frac{1}{6}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{5}{6}", "\\frac{7}{6}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video37"
        },
        { // 40
            question: "What is the value of \\(\\frac{5}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{3}{8}", "\\frac{5}{8}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video38"
        },
        { // 41
            question: "What is the value of \\(\\frac{3}{4} \\times \\frac{1}{2}\\)?",
            choices: ["\\frac{3}{8}", "\\frac{1}{4}", "\\frac{1}{2}", "\\frac{3}{4}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video39"
        },
        { // 42
            question: "What is the value of \\(\\frac{4}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{2}{5}", "\\frac{4}{5}", "\\frac{8}{25}", "2"],
            correct: 3,
            video: "https://www.youtube.com/embed/video40"
        },
        { // 43
            question: "What is the value of \\(\\frac{3}{7} + \\frac{2}{7}\\)?",
            choices: ["\\frac{1}{7}", "\\frac{5}{7}", "\\frac{6}{7}", "\\frac{9}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video41"
        },
        { // 44
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video42"
        },
        { // 45
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{1}{2}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{6}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video43"
        },
        { // 46
            question: "What is the value of \\(\\frac{5}{6} \\div \\frac{1}{2}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{5}{6}", "\\frac{10}{6}", "\\frac{5}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video44"
        },
        { // 47
            question: "What is the value of \\(\\frac{3}{4} + \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{7}", "\\frac{17}{12}", "\\frac{5}{12}", "\\frac{6}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video45"
        },
        { // 48
            question: "What is the value of \\(\\frac{7}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video46"
        },
        { // 49
            question: "What is the value of \\(3^4\\)?",
            choices: ["12", "27", "81", "64"],
            correct: 2,
            video: "https://www.youtube.com/embed/video3"
        },
        { // 50
            question: "Solve for \\(x\\): \\(2x + 5 = 15\\)",
            choices: ["5", "10", "7.5", "20"],
            correct: 0,
            video: "https://www.youtube.com/embed/video4"
        },

        //LEVEL 3:
        { // 1
            question: "If \\(P = \\{7, 9, 13\\}\\) and \\(Q = \\{1, 7, 13\\}\\), find \\(P \\cap Q\\)?",
            choices: [
                "\\(\\{1, 7, 13\\}\\)",
                "\\(\\{1, 9, 13\\}\\)",
                "\\(\\{7, 13\\}\\)",
                "\\(\\{7, 9, 13\\}\\)"
            ],
            correct: 2,
            video: "https://www.youtube.com/embed/video1"
        },
        { // 2
            question: "Given that \\((23 \\times 82) \\times 79 = 148994\\). Find the exact value of \\((2.3 \\times 82) \\times 7.9 \\)",
            choices: ["14.8994", "148.994", "1489.94", "14899.4"],
            correct: 2,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 3
            question: "Convert \\(25_{ten}\\) to a base two numeral.",
            choices: ["10001", "10011", "10101", "11001"],
            correct: 3,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 4
            question: "Write \\(1204_{five}\\) as a number in base 10.",
            choices: ["995", "179", "39", "35"],
            correct: 1,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 5
            question: "Multiply \\((2x + y)\\) by \\(2x - y\\)",
            choices: [
                "\\(4x^2 - y^2\\)", 
                "\\(4x^2 + xy - y^2\\)", 
                "\\(4x^2 - xy - y^2\\)", 
                "\\(4x^2 + y^2\\)"
                ],
            correct: 0,
            video: "https://www.youtube.com/embed/video3"
        },
        { // 6
            question: "Solve for \\(x\\): \\(2x + 5 = 15\\)",
            choices: ["5", "10", "7.5", "20"],
            correct: 0,
            video: "https://www.youtube.com/embed/video4"
        },
        { // 7
            question: "What is the area of a rectangle with length 8 and width 5?",
            choices: ["13", "40", "30", "45"],
            correct: 1,
            video: "https://www.youtube.com/embed/video5"
        },
        { // 8
            question: "What is the square root of 144?",
            choices: ["10", "12", "14", "16"],
            correct: 1,
            video: "https://www.youtube.com/embed/video6"
        },
        { // 9
            question: "What is the value of \\(\\pi\\) (pi) rounded to two decimal places?",
            choices: ["3.14", "3.16", "3.12", "3.18"],
            correct: 0,
            video: "https://www.youtube.com/embed/video7"
        },
        { // 10
            question: "What is the perimeter of a square with side length 6?",
            choices: ["12", "18", "24", "36"],
            correct: 2,
            video: "https://www.youtube.com/embed/video8"
        },
        { // 11
            question: "What is the sum of the angles in a triangle?",
            choices: ["90°", "180°", "270°", "360°"],
            correct: 1,
            video: "https://www.youtube.com/embed/video9"
        },
        { // 12
            question: "What is the value of \\(\\frac{3}{4} + \\frac{1}{2}\\)?",
            choices: ["1", "1.25", "1.5", "1.75"],
            correct: 1,
            video: "https://www.youtube.com/embed/video10"
        },
        { // 13
            question: "What is the value of \\(\\log_{10} 100\\)?",
            choices: ["1", "2", "10", "100"],
            correct: 1,
            video: "https://www.youtube.com/embed/video11"
        },
        { // 14
            question: "What is the value of \\(\\sin(90°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video12"
        },
        { // 15
            question: "What is the value of \\(\\cos(0°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video13"
        },
        { // 16
            question: "What is the value of \\(\\tan(45°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video14"
        },
        { // 17
            question: "What is the value of \\(\\sqrt{169}\\)?",
            choices: ["11", "12", "13", "14"],
            correct: 2,
            video: "https://www.youtube.com/embed/video15"
        },
        { // 18
            question: "What is the value of \\(\\frac{5}{8} \\times \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{10}{24}", "\\frac{5}{24}", "\\frac{10}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video16"
        },
        { // 19
            question: "What is the value of \\(\\frac{7}{12} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{1}{6}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video17"
        },
        { // 20
            question: "What is the value of \\(\\frac{3}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{3}{2}", "\\frac{6}{5}", "\\frac{9}{10}", "\\frac{15}{10}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video18"
        },
        { // 21
            question: "What is the value of \\(2^5\\)?",
            choices: ["16", "32", "64", "128"],
            correct: 1,
            video: "https://www.youtube.com/embed/video19"
        },
        { // 22
            question: "What is the value of \\(\\sqrt{64}\\)?",
            choices: ["6", "7", "8", "9"],
            correct: 2,
            video: "https://www.youtube.com/embed/video20"
        },
        { // 23
            question: "What is the value of \\(\\frac{1}{2} + \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{4}", "\\frac{3}{4}", "\\frac{1}{2}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video21"
        },
        { // 24
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{1}{2}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{6}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video22"
        },
        { // 25
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video23"
        },
        { // 26
            question: "What is the value of \\(\\frac{4}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{2}{5}", "\\frac{4}{5}", "\\frac{8}{25}", "2"],
            correct: 3,
            video: "https://www.youtube.com/embed/video24"
        },
        { // 27
            question: "What is the value of \\(\\frac{3}{8} + \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video25"
        },
        { // 28
            question: "What is the value of \\(\\frac{7}{10} - \\frac{1}{5}\\)?",
            choices: ["\\frac{1}{10}", "\\frac{1}{5}", "\\frac{1}{2}", "\\frac{3}{10}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video26"
        },
        { // 29
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{4}{5}\\)?",
            choices: ["\\frac{6}{15}", "\\frac{8}{15}", "\\frac{10}{15}", "\\frac{12}{15}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video27"
        },
        { // 30
            question: "What is the value of \\(\\frac{5}{6} \\div \\frac{1}{2}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{5}{6}", "\\frac{10}{6}", "\\frac{5}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video28"
        },
        { // 31
            question: "What is the value of \\(\\frac{3}{4} + \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{7}", "\\frac{17}{12}", "\\frac{5}{12}", "\\frac{6}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video29"
        },
        { // 32
            question: "What is the value of \\(\\frac{7}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video30"
        },
        { // 33
            question: "What is the value of \\(\\frac{2}{5} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{6}{20}", "\\frac{5}{9}", "\\frac{6}{9}", "\\frac{5}{20}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video31"
        },
        { // 34
            question: "What is the value of \\(\\frac{3}{5} \\div \\frac{1}{5}\\)?",
            choices: ["\\frac{3}{25}", "\\frac{3}{5}", "3", "\\frac{15}{5}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video32"
        },
        { // 35
            question: "What is the value of \\(\\frac{4}{7} + \\frac{2}{7}\\)?",
            choices: ["\\frac{2}{7}", "\\frac{6}{7}", "\\frac{8}{7}", "\\frac{10}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video33"
        },
        { // 36
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{6}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{2}{3}", "\\frac{4}{6}", "\\frac{5}{6}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video34"
        },
        { // 37
            question: "What is the value of \\(\\frac{3}{8} \\times \\frac{2}{3}\\)?",
            choices: ["\\frac{6}{24}", "\\frac{5}{11}", "\\frac{6}{11}", "\\frac{5}{24}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video35"
        },
        { // 38
            question: "What is the value of \\(\\frac{7}{9} \\div \\frac{1}{3}\\)?",
            choices: ["\\frac{7}{27}", "\\frac{7}{9}", "\\frac{21}{9}", "\\frac{7}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video36"
        },
        { // 39
            question: "What is the value of \\(\\frac{2}{3} + \\frac{1}{6}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{5}{6}", "\\frac{7}{6}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video37"
        },
        { // 40
            question: "What is the value of \\(\\frac{5}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{3}{8}", "\\frac{5}{8}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video38"
        },
        { // 41
            question: "What is the value of \\(\\frac{3}{4} \\times \\frac{1}{2}\\)?",
            choices: ["\\frac{3}{8}", "\\frac{1}{4}", "\\frac{1}{2}", "\\frac{3}{4}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video39"
        },
        { // 42
            question: "What is the value of \\(\\frac{4}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{2}{5}", "\\frac{4}{5}", "\\frac{8}{25}", "2"],
            correct: 3,
            video: "https://www.youtube.com/embed/video40"
        },
        { // 43
            question: "What is the value of \\(\\frac{3}{7} + \\frac{2}{7}\\)?",
            choices: ["\\frac{1}{7}", "\\frac{5}{7}", "\\frac{6}{7}", "\\frac{9}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video41"
        },
        { // 44
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video42"
        },
        { // 45
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{1}{2}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{6}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video43"
        },
        { // 46
            question: "What is the value of \\(\\frac{5}{6} \\div \\frac{1}{2}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{5}{6}", "\\frac{10}{6}", "\\frac{5}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video44"
        },
        { // 47
            question: "What is the value of \\(\\frac{3}{4} + \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{7}", "\\frac{17}{12}", "\\frac{5}{12}", "\\frac{6}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video45"
        },
        { // 48
            question: "What is the value of \\(\\frac{7}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video46"
        },
        { // 49
            question: "What is the value of \\(3^4\\)?",
            choices: ["12", "27", "81", "64"],
            correct: 2,
            video: "https://www.youtube.com/embed/video3"
        },
        { // 50
            question: "Solve for \\(x\\): \\(2x + 5 = 15\\)",
            choices: ["5", "10", "7.5", "20"],
            correct: 0,
            video: "https://www.youtube.com/embed/video4"
        },

        //LEVEL 4:
        { // 1
            question: "If \\(P = \\{7, 9, 13\\}\\) and \\(Q = \\{1, 7, 13\\}\\), find \\(P \\cap Q\\)?",
            choices: [
                "\\(\\{1, 7, 13\\}\\)",
                "\\(\\{1, 9, 13\\}\\)",
                "\\(\\{7, 13\\}\\)",
                "\\(\\{7, 9, 13\\}\\)"
            ],
            correct: 2,
            video: "https://www.youtube.com/embed/video1"
        },
        { // 2
            question: "Given that \\((23 \\times 82) \\times 79 = 148994\\). Find the exact value of \\((2.3 \\times 82) \\times 7.9 \\)",
            choices: ["14.8994", "148.994", "1489.94", "14899.4"],
            correct: 2,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 3
            question: "Convert \\(25_{ten}\\) to a base two numeral.",
            choices: ["10001", "10011", "10101", "11001"],
            correct: 3,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 4
            question: "Write \\(1204_{five}\\) as a number in base 10.",
            choices: ["995", "179", "39", "35"],
            correct: 1,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 5
            question: "Multiply \\((2x + y)\\) by \\(2x - y\\)",
            choices: [
                "\\(4x^2 - y^2\\)", 
                "\\(4x^2 + xy - y^2\\)", 
                "\\(4x^2 - xy - y^2\\)", 
                "\\(4x^2 + y^2\\)"
                ],
            correct: 0,
            video: "https://www.youtube.com/embed/video3"
        },
        { // 6
            question: "Solve for \\(x\\): \\(2x + 5 = 15\\)",
            choices: ["5", "10", "7.5", "20"],
            correct: 0,
            video: "https://www.youtube.com/embed/video4"
        },
        { // 7
            question: "What is the area of a rectangle with length 8 and width 5?",
            choices: ["13", "40", "30", "45"],
            correct: 1,
            video: "https://www.youtube.com/embed/video5"
        },
        { // 8
            question: "What is the square root of 144?",
            choices: ["10", "12", "14", "16"],
            correct: 1,
            video: "https://www.youtube.com/embed/video6"
        },
        { // 9
            question: "What is the value of \\(\\pi\\) (pi) rounded to two decimal places?",
            choices: ["3.14", "3.16", "3.12", "3.18"],
            correct: 0,
            video: "https://www.youtube.com/embed/video7"
        },
        { // 10
            question: "What is the perimeter of a square with side length 6?",
            choices: ["12", "18", "24", "36"],
            correct: 2,
            video: "https://www.youtube.com/embed/video8"
        },
        { // 11
            question: "What is the sum of the angles in a triangle?",
            choices: ["90°", "180°", "270°", "360°"],
            correct: 1,
            video: "https://www.youtube.com/embed/video9"
        },
        { // 12
            question: "What is the value of \\(\\frac{3}{4} + \\frac{1}{2}\\)?",
            choices: ["1", "1.25", "1.5", "1.75"],
            correct: 1,
            video: "https://www.youtube.com/embed/video10"
        },
        { // 13
            question: "What is the value of \\(\\log_{10} 100\\)?",
            choices: ["1", "2", "10", "100"],
            correct: 1,
            video: "https://www.youtube.com/embed/video11"
        },
        { // 14
            question: "What is the value of \\(\\sin(90°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video12"
        },
        { // 15
            question: "What is the value of \\(\\cos(0°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video13"
        },
        { // 16
            question: "What is the value of \\(\\tan(45°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video14"
        },
        { // 17
            question: "What is the value of \\(\\sqrt{169}\\)?",
            choices: ["11", "12", "13", "14"],
            correct: 2,
            video: "https://www.youtube.com/embed/video15"
        },
        { // 18
            question: "What is the value of \\(\\frac{5}{8} \\times \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{10}{24}", "\\frac{5}{24}", "\\frac{10}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video16"
        },
        { // 19
            question: "What is the value of \\(\\frac{7}{12} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{1}{6}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video17"
        },
        { // 20
            question: "What is the value of \\(\\frac{3}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{3}{2}", "\\frac{6}{5}", "\\frac{9}{10}", "\\frac{15}{10}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video18"
        },
        { // 21
            question: "What is the value of \\(2^5\\)?",
            choices: ["16", "32", "64", "128"],
            correct: 1,
            video: "https://www.youtube.com/embed/video19"
        },
        { // 22
            question: "What is the value of \\(\\sqrt{64}\\)?",
            choices: ["6", "7", "8", "9"],
            correct: 2,
            video: "https://www.youtube.com/embed/video20"
        },
        { // 23
            question: "What is the value of \\(\\frac{1}{2} + \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{4}", "\\frac{3}{4}", "\\frac{1}{2}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video21"
        },
        { // 24
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{1}{2}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{6}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video22"
        },
        { // 25
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video23"
        },
        { // 26
            question: "What is the value of \\(\\frac{4}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{2}{5}", "\\frac{4}{5}", "\\frac{8}{25}", "2"],
            correct: 3,
            video: "https://www.youtube.com/embed/video24"
        },
        { // 27
            question: "What is the value of \\(\\frac{3}{8} + \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video25"
        },
        { // 28
            question: "What is the value of \\(\\frac{7}{10} - \\frac{1}{5}\\)?",
            choices: ["\\frac{1}{10}", "\\frac{1}{5}", "\\frac{1}{2}", "\\frac{3}{10}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video26"
        },
        { // 29
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{4}{5}\\)?",
            choices: ["\\frac{6}{15}", "\\frac{8}{15}", "\\frac{10}{15}", "\\frac{12}{15}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video27"
        },
        { // 30
            question: "What is the value of \\(\\frac{5}{6} \\div \\frac{1}{2}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{5}{6}", "\\frac{10}{6}", "\\frac{5}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video28"
        },
        { // 31
            question: "What is the value of \\(\\frac{3}{4} + \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{7}", "\\frac{17}{12}", "\\frac{5}{12}", "\\frac{6}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video29"
        },
        { // 32
            question: "What is the value of \\(\\frac{7}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video30"
        },
        { // 33
            question: "What is the value of \\(\\frac{2}{5} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{6}{20}", "\\frac{5}{9}", "\\frac{6}{9}", "\\frac{5}{20}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video31"
        },
        { // 34
            question: "What is the value of \\(\\frac{3}{5} \\div \\frac{1}{5}\\)?",
            choices: ["\\frac{3}{25}", "\\frac{3}{5}", "3", "\\frac{15}{5}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video32"
        },
        { // 35
            question: "What is the value of \\(\\frac{4}{7} + \\frac{2}{7}\\)?",
            choices: ["\\frac{2}{7}", "\\frac{6}{7}", "\\frac{8}{7}", "\\frac{10}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video33"
        },
        { // 36
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{6}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{2}{3}", "\\frac{4}{6}", "\\frac{5}{6}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video34"
        },
        { // 37
            question: "What is the value of \\(\\frac{3}{8} \\times \\frac{2}{3}\\)?",
            choices: ["\\frac{6}{24}", "\\frac{5}{11}", "\\frac{6}{11}", "\\frac{5}{24}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video35"
        },
        { // 38
            question: "What is the value of \\(\\frac{7}{9} \\div \\frac{1}{3}\\)?",
            choices: ["\\frac{7}{27}", "\\frac{7}{9}", "\\frac{21}{9}", "\\frac{7}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video36"
        },
        { // 39
            question: "What is the value of \\(\\frac{2}{3} + \\frac{1}{6}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{5}{6}", "\\frac{7}{6}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video37"
        },
        { // 40
            question: "What is the value of \\(\\frac{5}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{3}{8}", "\\frac{5}{8}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video38"
        },
        { // 41
            question: "What is the value of \\(\\frac{3}{4} \\times \\frac{1}{2}\\)?",
            choices: ["\\frac{3}{8}", "\\frac{1}{4}", "\\frac{1}{2}", "\\frac{3}{4}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video39"
        },
        { // 42
            question: "What is the value of \\(\\frac{4}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{2}{5}", "\\frac{4}{5}", "\\frac{8}{25}", "2"],
            correct: 3,
            video: "https://www.youtube.com/embed/video40"
        },
        { // 43
            question: "What is the value of \\(\\frac{3}{7} + \\frac{2}{7}\\)?",
            choices: ["\\frac{1}{7}", "\\frac{5}{7}", "\\frac{6}{7}", "\\frac{9}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video41"
        },
        { // 44
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video42"
        },
        { // 45
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{1}{2}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{6}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video43"
        },
        { // 46
            question: "What is the value of \\(\\frac{5}{6} \\div \\frac{1}{2}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{5}{6}", "\\frac{10}{6}", "\\frac{5}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video44"
        },
        { // 47
            question: "What is the value of \\(\\frac{3}{4} + \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{7}", "\\frac{17}{12}", "\\frac{5}{12}", "\\frac{6}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video45"
        },
        { // 48
            question: "What is the value of \\(\\frac{7}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video46"
        },
        { // 49
            question: "What is the value of \\(3^4\\)?",
            choices: ["12", "27", "81", "64"],
            correct: 2,
            video: "https://www.youtube.com/embed/video3"
        },
        { // 50
            question: "Solve for \\(x\\): \\(2x + 5 = 15\\)",
            choices: ["5", "10", "7.5", "20"],
            correct: 0,
            video: "https://www.youtube.com/embed/video4"
        },

        //LEVEL 5:
        { // 1
            question: "If \\(P = \\{7, 9, 13\\}\\) and \\(Q = \\{1, 7, 13\\}\\), find \\(P \\cap Q\\)?",
            choices: [
                "\\(\\{1, 7, 13\\}\\)",
                "\\(\\{1, 9, 13\\}\\)",
                "\\(\\{7, 13\\}\\)",
                "\\(\\{7, 9, 13\\}\\)"
            ],
            correct: 2,
            video: "https://www.youtube.com/embed/video1"
        },
        { // 2
            question: "Given that \\((23 \\times 82) \\times 79 = 148994\\). Find the exact value of \\((2.3 \\times 82) \\times 7.9 \\)",
            choices: ["14.8994", "148.994", "1489.94", "14899.4"],
            correct: 2,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 3
            question: "Convert \\(25_{ten}\\) to a base two numeral.",
            choices: ["10001", "10011", "10101", "11001"],
            correct: 3,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 4
            question: "Write \\(1204_{five}\\) as a number in base 10.",
            choices: ["995", "179", "39", "35"],
            correct: 1,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 5
            question: "Multiply \\((2x + y)\\) by \\(2x - y\\)",
            choices: [
                "\\(4x^2 - y^2\\)", 
                "\\(4x^2 + xy - y^2\\)", 
                "\\(4x^2 - xy - y^2\\)", 
                "\\(4x^2 + y^2\\)"
                ],
            correct: 0,
            video: "https://www.youtube.com/embed/video3"
        },
        { // 6
            question: "Solve for \\(x\\): \\(2x + 5 = 15\\)",
            choices: ["5", "10", "7.5", "20"],
            correct: 0,
            video: "https://www.youtube.com/embed/video4"
        },
        { // 7
            question: "What is the area of a rectangle with length 8 and width 5?",
            choices: ["13", "40", "30", "45"],
            correct: 1,
            video: "https://www.youtube.com/embed/video5"
        },
        { // 8
            question: "What is the square root of 144?",
            choices: ["10", "12", "14", "16"],
            correct: 1,
            video: "https://www.youtube.com/embed/video6"
        },
        { // 9
            question: "What is the value of \\(\\pi\\) (pi) rounded to two decimal places?",
            choices: ["3.14", "3.16", "3.12", "3.18"],
            correct: 0,
            video: "https://www.youtube.com/embed/video7"
        },
        { // 10
            question: "What is the perimeter of a square with side length 6?",
            choices: ["12", "18", "24", "36"],
            correct: 2,
            video: "https://www.youtube.com/embed/video8"
        },
        { // 11
            question: "What is the sum of the angles in a triangle?",
            choices: ["90°", "180°", "270°", "360°"],
            correct: 1,
            video: "https://www.youtube.com/embed/video9"
        },
        { // 12
            question: "What is the value of \\(\\frac{3}{4} + \\frac{1}{2}\\)?",
            choices: ["1", "1.25", "1.5", "1.75"],
            correct: 1,
            video: "https://www.youtube.com/embed/video10"
        },
        { // 13
            question: "What is the value of \\(\\log_{10} 100\\)?",
            choices: ["1", "2", "10", "100"],
            correct: 1,
            video: "https://www.youtube.com/embed/video11"
        },
        { // 14
            question: "What is the value of \\(\\sin(90°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video12"
        },
        { // 15
            question: "What is the value of \\(\\cos(0°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video13"
        },
        { // 16
            question: "What is the value of \\(\\tan(45°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video14"
        },
        { // 17
            question: "What is the value of \\(\\sqrt{169}\\)?",
            choices: ["11", "12", "13", "14"],
            correct: 2,
            video: "https://www.youtube.com/embed/video15"
        },
        { // 18
            question: "What is the value of \\(\\frac{5}{8} \\times \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{10}{24}", "\\frac{5}{24}", "\\frac{10}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video16"
        },
        { // 19
            question: "What is the value of \\(\\frac{7}{12} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{1}{6}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video17"
        },
        { // 20
            question: "What is the value of \\(\\frac{3}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{3}{2}", "\\frac{6}{5}", "\\frac{9}{10}", "\\frac{15}{10}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video18"
        },
        { // 21
            question: "What is the value of \\(2^5\\)?",
            choices: ["16", "32", "64", "128"],
            correct: 1,
            video: "https://www.youtube.com/embed/video19"
        },
        { // 22
            question: "What is the value of \\(\\sqrt{64}\\)?",
            choices: ["6", "7", "8", "9"],
            correct: 2,
            video: "https://www.youtube.com/embed/video20"
        },
        { // 23
            question: "What is the value of \\(\\frac{1}{2} + \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{4}", "\\frac{3}{4}", "\\frac{1}{2}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video21"
        },
        { // 24
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{1}{2}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{6}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video22"
        },
        { // 25
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video23"
        },
        { // 26
            question: "What is the value of \\(\\frac{4}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{2}{5}", "\\frac{4}{5}", "\\frac{8}{25}", "2"],
            correct: 3,
            video: "https://www.youtube.com/embed/video24"
        },
        { // 27
            question: "What is the value of \\(\\frac{3}{8} + \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video25"
        },
        { // 28
            question: "What is the value of \\(\\frac{7}{10} - \\frac{1}{5}\\)?",
            choices: ["\\frac{1}{10}", "\\frac{1}{5}", "\\frac{1}{2}", "\\frac{3}{10}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video26"
        },
        { // 29
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{4}{5}\\)?",
            choices: ["\\frac{6}{15}", "\\frac{8}{15}", "\\frac{10}{15}", "\\frac{12}{15}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video27"
        },
        { // 30
            question: "What is the value of \\(\\frac{5}{6} \\div \\frac{1}{2}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{5}{6}", "\\frac{10}{6}", "\\frac{5}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video28"
        },
        { // 31
            question: "What is the value of \\(\\frac{3}{4} + \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{7}", "\\frac{17}{12}", "\\frac{5}{12}", "\\frac{6}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video29"
        },
        { // 32
            question: "What is the value of \\(\\frac{7}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video30"
        },
        { // 33
            question: "What is the value of \\(\\frac{2}{5} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{6}{20}", "\\frac{5}{9}", "\\frac{6}{9}", "\\frac{5}{20}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video31"
        },
        { // 34
            question: "What is the value of \\(\\frac{3}{5} \\div \\frac{1}{5}\\)?",
            choices: ["\\frac{3}{25}", "\\frac{3}{5}", "3", "\\frac{15}{5}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video32"
        },
        { // 35
            question: "What is the value of \\(\\frac{4}{7} + \\frac{2}{7}\\)?",
            choices: ["\\frac{2}{7}", "\\frac{6}{7}", "\\frac{8}{7}", "\\frac{10}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video33"
        },
        { // 36
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{6}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{2}{3}", "\\frac{4}{6}", "\\frac{5}{6}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video34"
        },
        { // 37
            question: "What is the value of \\(\\frac{3}{8} \\times \\frac{2}{3}\\)?",
            choices: ["\\frac{6}{24}", "\\frac{5}{11}", "\\frac{6}{11}", "\\frac{5}{24}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video35"
        },
        { // 38
            question: "What is the value of \\(\\frac{7}{9} \\div \\frac{1}{3}\\)?",
            choices: ["\\frac{7}{27}", "\\frac{7}{9}", "\\frac{21}{9}", "\\frac{7}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video36"
        },
        { // 39
            question: "What is the value of \\(\\frac{2}{3} + \\frac{1}{6}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{5}{6}", "\\frac{7}{6}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video37"
        },
        { // 40
            question: "What is the value of \\(\\frac{5}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{3}{8}", "\\frac{5}{8}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video38"
        },
        { // 41
            question: "What is the value of \\(\\frac{3}{4} \\times \\frac{1}{2}\\)?",
            choices: ["\\frac{3}{8}", "\\frac{1}{4}", "\\frac{1}{2}", "\\frac{3}{4}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video39"
        },
        { // 42
            question: "What is the value of \\(\\frac{4}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{2}{5}", "\\frac{4}{5}", "\\frac{8}{25}", "2"],
            correct: 3,
            video: "https://www.youtube.com/embed/video40"
        },
        { // 43
            question: "What is the value of \\(\\frac{3}{7} + \\frac{2}{7}\\)?",
            choices: ["\\frac{1}{7}", "\\frac{5}{7}", "\\frac{6}{7}", "\\frac{9}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video41"
        },
        { // 44
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video42"
        },
        { // 45
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{1}{2}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{6}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video43"
        },
        { // 46
            question: "What is the value of \\(\\frac{5}{6} \\div \\frac{1}{2}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{5}{6}", "\\frac{10}{6}", "\\frac{5}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video44"
        },
        { // 47
            question: "What is the value of \\(\\frac{3}{4} + \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{7}", "\\frac{17}{12}", "\\frac{5}{12}", "\\frac{6}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video45"
        },
        { // 48
            question: "What is the value of \\(\\frac{7}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video46"
        },
        { // 49
            question: "What is the value of \\(3^4\\)?",
            choices: ["12", "27", "81", "64"],
            correct: 2,
            video: "https://www.youtube.com/embed/video3"
        },
        { // 50
            question: "Solve for \\(x\\): \\(2x + 5 = 15\\)",
            choices: ["5", "10", "7.5", "20"],
            correct: 0,
            video: "https://www.youtube.com/embed/video4"
        },

        //LEVEL 6:
        { // 1
            question: "If \\(P = \\{7, 9, 13\\}\\) and \\(Q = \\{1, 7, 13\\}\\), find \\(P \\cap Q\\)?",
            choices: [
                "\\(\\{1, 7, 13\\}\\)",
                "\\(\\{1, 9, 13\\}\\)",
                "\\(\\{7, 13\\}\\)",
                "\\(\\{7, 9, 13\\}\\)"
            ],
            correct: 2,
            video: "https://www.youtube.com/embed/video1"
        },
        { // 2
            question: "Given that \\((23 \\times 82) \\times 79 = 148994\\). Find the exact value of \\((2.3 \\times 82) \\times 7.9 \\)",
            choices: ["14.8994", "148.994", "1489.94", "14899.4"],
            correct: 2,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 3
            question: "Convert \\(25_{ten}\\) to a base two numeral.",
            choices: ["10001", "10011", "10101", "11001"],
            correct: 3,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 4
            question: "Write \\(1204_{five}\\) as a number in base 10.",
            choices: ["995", "179", "39", "35"],
            correct: 1,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 5
            question: "Multiply \\((2x + y)\\) by \\(2x - y\\)",
            choices: [
                "\\(4x^2 - y^2\\)", 
                "\\(4x^2 + xy - y^2\\)", 
                "\\(4x^2 - xy - y^2\\)", 
                "\\(4x^2 + y^2\\)"
                ],
            correct: 0,
            video: "https://www.youtube.com/embed/video3"
        },
        { // 6
            question: "Solve for \\(x\\): \\(2x + 5 = 15\\)",
            choices: ["5", "10", "7.5", "20"],
            correct: 0,
            video: "https://www.youtube.com/embed/video4"
        },
        { // 7
            question: "What is the area of a rectangle with length 8 and width 5?",
            choices: ["13", "40", "30", "45"],
            correct: 1,
            video: "https://www.youtube.com/embed/video5"
        },
        { // 8
            question: "What is the square root of 144?",
            choices: ["10", "12", "14", "16"],
            correct: 1,
            video: "https://www.youtube.com/embed/video6"
        },
        { // 9
            question: "What is the value of \\(\\pi\\) (pi) rounded to two decimal places?",
            choices: ["3.14", "3.16", "3.12", "3.18"],
            correct: 0,
            video: "https://www.youtube.com/embed/video7"
        },
        { // 10
            question: "What is the perimeter of a square with side length 6?",
            choices: ["12", "18", "24", "36"],
            correct: 2,
            video: "https://www.youtube.com/embed/video8"
        },
        { // 11
            question: "What is the sum of the angles in a triangle?",
            choices: ["90°", "180°", "270°", "360°"],
            correct: 1,
            video: "https://www.youtube.com/embed/video9"
        },
        { // 12
            question: "What is the value of \\(\\frac{3}{4} + \\frac{1}{2}\\)?",
            choices: ["1", "1.25", "1.5", "1.75"],
            correct: 1,
            video: "https://www.youtube.com/embed/video10"
        },
        { // 13
            question: "What is the value of \\(\\log_{10} 100\\)?",
            choices: ["1", "2", "10", "100"],
            correct: 1,
            video: "https://www.youtube.com/embed/video11"
        },
        { // 14
            question: "What is the value of \\(\\sin(90°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video12"
        },
        { // 15
            question: "What is the value of \\(\\cos(0°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video13"
        },
        { // 16
            question: "What is the value of \\(\\tan(45°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video14"
        },
        { // 17
            question: "What is the value of \\(\\sqrt{169}\\)?",
            choices: ["11", "12", "13", "14"],
            correct: 2,
            video: "https://www.youtube.com/embed/video15"
        },
        { // 18
            question: "What is the value of \\(\\frac{5}{8} \\times \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{10}{24}", "\\frac{5}{24}", "\\frac{10}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video16"
        },
        { // 19
            question: "What is the value of \\(\\frac{7}{12} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{1}{6}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video17"
        },
        { // 20
            question: "What is the value of \\(\\frac{3}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{3}{2}", "\\frac{6}{5}", "\\frac{9}{10}", "\\frac{15}{10}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video18"
        },
        { // 21
            question: "What is the value of \\(2^5\\)?",
            choices: ["16", "32", "64", "128"],
            correct: 1,
            video: "https://www.youtube.com/embed/video19"
        },
        { // 22
            question: "What is the value of \\(\\sqrt{64}\\)?",
            choices: ["6", "7", "8", "9"],
            correct: 2,
            video: "https://www.youtube.com/embed/video20"
        },
        { // 23
            question: "What is the value of \\(\\frac{1}{2} + \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{4}", "\\frac{3}{4}", "\\frac{1}{2}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video21"
        },
        { // 24
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{1}{2}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{6}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video22"
        },
        { // 25
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video23"
        },
        { // 26
            question: "What is the value of \\(\\frac{4}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{2}{5}", "\\frac{4}{5}", "\\frac{8}{25}", "2"],
            correct: 3,
            video: "https://www.youtube.com/embed/video24"
        },
        { // 27
            question: "What is the value of \\(\\frac{3}{8} + \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video25"
        },
        { // 28
            question: "What is the value of \\(\\frac{7}{10} - \\frac{1}{5}\\)?",
            choices: ["\\frac{1}{10}", "\\frac{1}{5}", "\\frac{1}{2}", "\\frac{3}{10}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video26"
        },
        { // 29
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{4}{5}\\)?",
            choices: ["\\frac{6}{15}", "\\frac{8}{15}", "\\frac{10}{15}", "\\frac{12}{15}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video27"
        },
        { // 30
            question: "What is the value of \\(\\frac{5}{6} \\div \\frac{1}{2}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{5}{6}", "\\frac{10}{6}", "\\frac{5}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video28"
        },
        { // 31
            question: "What is the value of \\(\\frac{3}{4} + \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{7}", "\\frac{17}{12}", "\\frac{5}{12}", "\\frac{6}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video29"
        },
        { // 32
            question: "What is the value of \\(\\frac{7}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video30"
        },
        { // 33
            question: "What is the value of \\(\\frac{2}{5} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{6}{20}", "\\frac{5}{9}", "\\frac{6}{9}", "\\frac{5}{20}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video31"
        },
        { // 34
            question: "What is the value of \\(\\frac{3}{5} \\div \\frac{1}{5}\\)?",
            choices: ["\\frac{3}{25}", "\\frac{3}{5}", "3", "\\frac{15}{5}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video32"
        },
        { // 35
            question: "What is the value of \\(\\frac{4}{7} + \\frac{2}{7}\\)?",
            choices: ["\\frac{2}{7}", "\\frac{6}{7}", "\\frac{8}{7}", "\\frac{10}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video33"
        },
        { // 36
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{6}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{2}{3}", "\\frac{4}{6}", "\\frac{5}{6}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video34"
        },
        { // 37
            question: "What is the value of \\(\\frac{3}{8} \\times \\frac{2}{3}\\)?",
            choices: ["\\frac{6}{24}", "\\frac{5}{11}", "\\frac{6}{11}", "\\frac{5}{24}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video35"
        },
        { // 38
            question: "What is the value of \\(\\frac{7}{9} \\div \\frac{1}{3}\\)?",
            choices: ["\\frac{7}{27}", "\\frac{7}{9}", "\\frac{21}{9}", "\\frac{7}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video36"
        },
        { // 39
            question: "What is the value of \\(\\frac{2}{3} + \\frac{1}{6}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{5}{6}", "\\frac{7}{6}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video37"
        },
        { // 40
            question: "What is the value of \\(\\frac{5}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{3}{8}", "\\frac{5}{8}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video38"
        },
        { // 41
            question: "What is the value of \\(\\frac{3}{4} \\times \\frac{1}{2}\\)?",
            choices: ["\\frac{3}{8}", "\\frac{1}{4}", "\\frac{1}{2}", "\\frac{3}{4}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video39"
        },
        { // 42
            question: "What is the value of \\(\\frac{4}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{2}{5}", "\\frac{4}{5}", "\\frac{8}{25}", "2"],
            correct: 3,
            video: "https://www.youtube.com/embed/video40"
        },
        { // 43
            question: "What is the value of \\(\\frac{3}{7} + \\frac{2}{7}\\)?",
            choices: ["\\frac{1}{7}", "\\frac{5}{7}", "\\frac{6}{7}", "\\frac{9}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video41"
        },
        { // 44
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video42"
        },
        { // 45
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{1}{2}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{6}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video43"
        },
        { // 46
            question: "What is the value of \\(\\frac{5}{6} \\div \\frac{1}{2}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{5}{6}", "\\frac{10}{6}", "\\frac{5}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video44"
        },
        { // 47
            question: "What is the value of \\(\\frac{3}{4} + \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{7}", "\\frac{17}{12}", "\\frac{5}{12}", "\\frac{6}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video45"
        },
        { // 48
            question: "What is the value of \\(\\frac{7}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video46"
        },
        { // 49
            question: "What is the value of \\(3^4\\)?",
            choices: ["12", "27", "81", "64"],
            correct: 2,
            video: "https://www.youtube.com/embed/video3"
        },
        { // 50
            question: "Solve for \\(x\\): \\(2x + 5 = 15\\)",
            choices: ["5", "10", "7.5", "20"],
            correct: 0,
            video: "https://www.youtube.com/embed/video4"
        },

        //LEVEL 7:
        { // 1
            question: "If \\(P = \\{7, 9, 13\\}\\) and \\(Q = \\{1, 7, 13\\}\\), find \\(P \\cap Q\\)?",
            choices: [
                "\\(\\{1, 7, 13\\}\\)",
                "\\(\\{1, 9, 13\\}\\)",
                "\\(\\{7, 13\\}\\)",
                "\\(\\{7, 9, 13\\}\\)"
            ],
            correct: 2,
            video: "https://www.youtube.com/embed/video1"
        },
        { // 2
            question: "Given that \\((23 \\times 82) \\times 79 = 148994\\). Find the exact value of \\((2.3 \\times 82) \\times 7.9 \\)",
            choices: ["14.8994", "148.994", "1489.94", "14899.4"],
            correct: 2,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 3
            question: "Convert \\(25_{ten}\\) to a base two numeral.",
            choices: ["10001", "10011", "10101", "11001"],
            correct: 3,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 4
            question: "Write \\(1204_{five}\\) as a number in base 10.",
            choices: ["995", "179", "39", "35"],
            correct: 1,
            video: "https://www.youtube.com/embed/video2"
        },
        { // 5
            question: "Multiply \\((2x + y)\\) by \\(2x - y\\)",
            choices: [
                "\\(4x^2 - y^2\\)", 
                "\\(4x^2 + xy - y^2\\)", 
                "\\(4x^2 - xy - y^2\\)", 
                "\\(4x^2 + y^2\\)"
                ],
            correct: 0,
            video: "https://www.youtube.com/embed/video3"
        },
        { // 6
            question: "Solve for \\(x\\): \\(2x + 5 = 15\\)",
            choices: ["5", "10", "7.5", "20"],
            correct: 0,
            video: "https://www.youtube.com/embed/video4"
        },
        { // 7
            question: "What is the area of a rectangle with length 8 and width 5?",
            choices: ["13", "40", "30", "45"],
            correct: 1,
            video: "https://www.youtube.com/embed/video5"
        },
        { // 8
            question: "What is the square root of 144?",
            choices: ["10", "12", "14", "16"],
            correct: 1,
            video: "https://www.youtube.com/embed/video6"
        },
        { // 9
            question: "What is the value of \\(\\pi\\) (pi) rounded to two decimal places?",
            choices: ["3.14", "3.16", "3.12", "3.18"],
            correct: 0,
            video: "https://www.youtube.com/embed/video7"
        },
        { // 10
            question: "What is the perimeter of a square with side length 6?",
            choices: ["12", "18", "24", "36"],
            correct: 2,
            video: "https://www.youtube.com/embed/video8"
        },
        { // 11
            question: "What is the sum of the angles in a triangle?",
            choices: ["90°", "180°", "270°", "360°"],
            correct: 1,
            video: "https://www.youtube.com/embed/video9"
        },
        { // 12
            question: "What is the value of \\(\\frac{3}{4} + \\frac{1}{2}\\)?",
            choices: ["1", "1.25", "1.5", "1.75"],
            correct: 1,
            video: "https://www.youtube.com/embed/video10"
        },
        { // 13
            question: "What is the value of \\(\\log_{10} 100\\)?",
            choices: ["1", "2", "10", "100"],
            correct: 1,
            video: "https://www.youtube.com/embed/video11"
        },
        { // 14
            question: "What is the value of \\(\\sin(90°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video12"
        },
        { // 15
            question: "What is the value of \\(\\cos(0°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video13"
        },
        { // 16
            question: "What is the value of \\(\\tan(45°)\\)?",
            choices: ["0", "0.5", "1", "2"],
            correct: 2,
            video: "https://www.youtube.com/embed/video14"
        },
        { // 17
            question: "What is the value of \\(\\sqrt{169}\\)?",
            choices: ["11", "12", "13", "14"],
            correct: 2,
            video: "https://www.youtube.com/embed/video15"
        },
        { // 18
            question: "What is the value of \\(\\frac{5}{8} \\times \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{10}{24}", "\\frac{5}{24}", "\\frac{10}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video16"
        },
        { // 19
            question: "What is the value of \\(\\frac{7}{12} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{1}{6}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video17"
        },
        { // 20
            question: "What is the value of \\(\\frac{3}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{3}{2}", "\\frac{6}{5}", "\\frac{9}{10}", "\\frac{15}{10}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video18"
        },
        { // 21
            question: "What is the value of \\(2^5\\)?",
            choices: ["16", "32", "64", "128"],
            correct: 1,
            video: "https://www.youtube.com/embed/video19"
        },
        { // 22
            question: "What is the value of \\(\\sqrt{64}\\)?",
            choices: ["6", "7", "8", "9"],
            correct: 2,
            video: "https://www.youtube.com/embed/video20"
        },
        { // 23
            question: "What is the value of \\(\\frac{1}{2} + \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{4}", "\\frac{3}{4}", "\\frac{1}{2}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video21"
        },
        { // 24
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{1}{2}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{6}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video22"
        },
        { // 25
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video23"
        },
        { // 26
            question: "What is the value of \\(\\frac{4}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{2}{5}", "\\frac{4}{5}", "\\frac{8}{25}", "2"],
            correct: 3,
            video: "https://www.youtube.com/embed/video24"
        },
        { // 27
            question: "What is the value of \\(\\frac{3}{8} + \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video25"
        },
        { // 28
            question: "What is the value of \\(\\frac{7}{10} - \\frac{1}{5}\\)?",
            choices: ["\\frac{1}{10}", "\\frac{1}{5}", "\\frac{1}{2}", "\\frac{3}{10}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video26"
        },
        { // 29
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{4}{5}\\)?",
            choices: ["\\frac{6}{15}", "\\frac{8}{15}", "\\frac{10}{15}", "\\frac{12}{15}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video27"
        },
        { // 30
            question: "What is the value of \\(\\frac{5}{6} \\div \\frac{1}{2}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{5}{6}", "\\frac{10}{6}", "\\frac{5}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video28"
        },
        { // 31
            question: "What is the value of \\(\\frac{3}{4} + \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{7}", "\\frac{17}{12}", "\\frac{5}{12}", "\\frac{6}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video29"
        },
        { // 32
            question: "What is the value of \\(\\frac{7}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video30"
        },
        { // 33
            question: "What is the value of \\(\\frac{2}{5} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{6}{20}", "\\frac{5}{9}", "\\frac{6}{9}", "\\frac{5}{20}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video31"
        },
        { // 34
            question: "What is the value of \\(\\frac{3}{5} \\div \\frac{1}{5}\\)?",
            choices: ["\\frac{3}{25}", "\\frac{3}{5}", "3", "\\frac{15}{5}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video32"
        },
        { // 35
            question: "What is the value of \\(\\frac{4}{7} + \\frac{2}{7}\\)?",
            choices: ["\\frac{2}{7}", "\\frac{6}{7}", "\\frac{8}{7}", "\\frac{10}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video33"
        },
        { // 36
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{6}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{2}{3}", "\\frac{4}{6}", "\\frac{5}{6}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video34"
        },
        { // 37
            question: "What is the value of \\(\\frac{3}{8} \\times \\frac{2}{3}\\)?",
            choices: ["\\frac{6}{24}", "\\frac{5}{11}", "\\frac{6}{11}", "\\frac{5}{24}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video35"
        },
        { // 38
            question: "What is the value of \\(\\frac{7}{9} \\div \\frac{1}{3}\\)?",
            choices: ["\\frac{7}{27}", "\\frac{7}{9}", "\\frac{21}{9}", "\\frac{7}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video36"
        },
        { // 39
            question: "What is the value of \\(\\frac{2}{3} + \\frac{1}{6}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{5}{6}", "\\frac{7}{6}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video37"
        },
        { // 40
            question: "What is the value of \\(\\frac{5}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{3}{8}", "\\frac{5}{8}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video38"
        },
        { // 41
            question: "What is the value of \\(\\frac{3}{4} \\times \\frac{1}{2}\\)?",
            choices: ["\\frac{3}{8}", "\\frac{1}{4}", "\\frac{1}{2}", "\\frac{3}{4}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video39"
        },
        { // 42
            question: "What is the value of \\(\\frac{4}{5} \\div \\frac{2}{5}\\)?",
            choices: ["\\frac{2}{5}", "\\frac{4}{5}", "\\frac{8}{25}", "2"],
            correct: 3,
            video: "https://www.youtube.com/embed/video40"
        },
        { // 43
            question: "What is the value of \\(\\frac{3}{7} + \\frac{2}{7}\\)?",
            choices: ["\\frac{1}{7}", "\\frac{5}{7}", "\\frac{6}{7}", "\\frac{9}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video41"
        },
        { // 44
            question: "What is the value of \\(\\frac{5}{6} - \\frac{1}{3}\\)?",
            choices: ["\\frac{1}{6}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video42"
        },
        { // 45
            question: "What is the value of \\(\\frac{2}{3} \\times \\frac{3}{4}\\)?",
            choices: ["\\frac{1}{2}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{6}{12}"],
            correct: 0,
            video: "https://www.youtube.com/embed/video43"
        },
        { // 46
            question: "What is the value of \\(\\frac{5}{6} \\div \\frac{1}{2}\\)?",
            choices: ["\\frac{5}{12}", "\\frac{5}{6}", "\\frac{10}{6}", "\\frac{5}{3}"],
            correct: 3,
            video: "https://www.youtube.com/embed/video44"
        },
        { // 47
            question: "What is the value of \\(\\frac{3}{4} + \\frac{2}{3}\\)?",
            choices: ["\\frac{5}{7}", "\\frac{17}{12}", "\\frac{5}{12}", "\\frac{6}{7}"],
            correct: 1,
            video: "https://www.youtube.com/embed/video45"
        },
        { // 48
            question: "What is the value of \\(\\frac{7}{8} - \\frac{1}{4}\\)?",
            choices: ["\\frac{1}{8}", "\\frac{1}{4}", "\\frac{5}{8}", "\\frac{3}{4}"],
            correct: 2,
            video: "https://www.youtube.com/embed/video46"
        },
        { // 49
            question: "What is the value of \\(3^4\\)?",
            choices: ["12", "27", "81", "64"],
            correct: 2,
            video: "https://www.youtube.com/embed/video3"
        },
        { // 50
            question: "Solve for \\(x\\): \\(2x + 5 = 15\\)",
            choices: ["5", "10", "7.5", "20"],
            correct: 0,
            video: "https://www.youtube.com/embed/video4"
        },
    ];

    // Game Variables
    let currentLevel = 1;
    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let questionCount = 0;
    let score = 0;
    const questionsPerLevel = 20;
    const requiredCorrect = 15;
    const totalLevels = 7;
    let timer;
    let timeLeft = 60; // Set timer to 1 minute (60 seconds)
    let usedQuestions = []; // Track used questions to avoid repetition

    // DOM Elements
    const startButton = document.getElementById("start-btn");
    const gameContent = document.getElementById("game-content");
    const levelDisplay = document.getElementById("level");
    const questionElement = document.getElementById("question");
    const choicesElement = document.getElementById("choices");
    const feedbackElement = document.getElementById("feedback");
    const nextButton = document.getElementById("next-btn");
    const videoContainer = document.getElementById("video-container");
    const scoreDisplay = document.getElementById("score-value");
    const timerDisplay = document.getElementById("time");
    const restartLevelButton = document.getElementById("restart-level-btn");

    // Start Game Button
    startButton.addEventListener("click", () => {
        startButton.style.display = "none";
        gameContent.style.display = "block";
        shuffleArray(questions);
        loadQuestion();
    });

    // Shuffle Questions
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Load Question
    function loadQuestion() {
        stopTimer();
        feedbackElement.innerHTML = "";
        nextButton.style.display = "none";
        videoContainer.innerHTML = "";
        restartLevelButton.style.display = "none"; // Hide Restart Level button during questions

        if (questionCount >= questionsPerLevel) {
            checkLevelProgress();
            return;
        }

        const questionData = questions[currentQuestionIndex];
        questionElement.innerHTML = questionData.question; // Use innerHTML for LaTeX
        MathJax.typeset(); // Render LaTeX in the question

        choicesElement.innerHTML = "";
        questionData.choices.forEach((choice, index) => {
            const button = document.createElement("button");
            button.innerHTML = choice; // Use innerHTML for LaTeX in choices
            button.onclick = () => {
                stopTimer(); // Stop the timer when a choice is made
                checkAnswer(index, questionData.correct, questionData.video);
                disableChoices(); // Disable further choices
                highlightAnswer(button, index === questionData.correct); // Highlight the selected answer
            };
            choicesElement.appendChild(button);
        });

        questionCount++;
        startTimer(); // Start the timer for the new question

        // Update progress bar
        const progress = (questionCount / questionsPerLevel) * 100;
        document.getElementById("progress-bar").style.width = `${progress}%`;

        // Render LaTeX in choices
        MathJax.typeset();
    }

    // Check Answer
    function checkAnswer(selectedIndex, correctIndex, videoUrl) {
        if (selectedIndex === correctIndex) {
            feedbackElement.innerText = "Correct!";
            feedbackElement.className = "correct";
            correctAnswers++;
            score += 5; // Increase score by 5 for each correct answer
            scoreDisplay.innerText = score;
            nextButton.style.display = "block";
        } else {
            feedbackElement.innerHTML = "Wrong! Watch the video below for the solution.";
            feedbackElement.className = "wrong";
            videoContainer.innerHTML = `<iframe width="100%" height="200" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
            nextButton.style.display = "block";
        }
    }

    // Highlight Selected Answer
    function highlightAnswer(button, isCorrect) {
        if (isCorrect) {
            button.style.backgroundColor = "#4caf50"; // Green for correct answer
        } else {
            button.style.backgroundColor = "#f44336"; // Red for wrong answer
        }
    }

    // Disable Choices
    function disableChoices() {
        const buttons = choicesElement.querySelectorAll("button");
        buttons.forEach(button => {
            button.disabled = true; // Disable all choice buttons
        });
    }

    // Check Level Progress
    function checkLevelProgress() {
        const percentageScore = Math.round((correctAnswers / questionsPerLevel) * 100);
        if (correctAnswers >= requiredCorrect) {
            if (currentLevel < totalLevels) {
                alert(`🎉 Congratulations! You've passed Level ${currentLevel} with a score of ${percentageScore}%. Moving to Level ${currentLevel + 1}`);
                currentLevel++;
                correctAnswers = 0;
                questionCount = 0;
                score = 0; // Reset score for the next level
                scoreDisplay.innerText = score;
                usedQuestions = [];
                levelDisplay.innerText = `Level: ${currentLevel}`;
                shuffleArray(questions);
                loadQuestion();
            } else {
                alert(`🏆 You are the Champion of this Topic! Your final score is ${percentageScore}%.`);
                resetGame();
            }
        } else {
            alert(`😢 You did not pass Level ${currentLevel}. Your score is ${percentageScore}%. Try again.`);
            restartLevelButton.style.display = "block"; // Show Restart Level button
        }
    }

    // Reset Game
    function resetGame() {
        currentLevel = 1;
        correctAnswers = 0;
        questionCount = 0;
        score = 0;
        scoreDisplay.innerText = score;
        levelDisplay.innerText = `Level: ${currentLevel}`;
        usedQuestions = [];
        shuffleArray(questions);
        loadQuestion();
    }

    // Restart Level Button
    restartLevelButton.addEventListener("click", () => {
        correctAnswers = 0;
        questionCount = 0;
        score = 0;
        scoreDisplay.innerText = score;
        usedQuestions = [];
        loadQuestion();
    });

    // Next Button
    nextButton.addEventListener("click", () => {
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        loadQuestion();
    });

    // Timer Functions
    function startTimer() {
        timeLeft = 60; // Reset timer to 1 minute
        timerDisplay.innerText = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                feedbackElement.innerText = "Time's up!";
                feedbackElement.className = "wrong";
                videoContainer.innerHTML = `<iframe width="100%" height="200" src="${questions[currentQuestionIndex].video}" frameborder="0" allowfullscreen></iframe>`;
                nextButton.style.display = "block";
                disableChoices(); // Disable choices when time runs out
            }
        }, 1000); // Update every second
    }

    function stopTimer() {
        clearInterval(timer);
    }
});