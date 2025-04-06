// Game configuration
const config = {
    levels: 7,
    questionsPerLevel: 20,
    passingScore: 85, // 17 * 5 points per question
    timePerQuestion: 60, // seconds
    pointsPerQuestion: 5
  };
  
  // All questions with LaTeX support
  const allQuestions = {
    1: [
      {
        text: "If 1 rod = 10 \\(cm^2\\), what is the value of 3 rods?",
        answers: ["3 \\(cm^2\\)", "30 \\(cm^2\\)", "300 \\(cm^2\\)", "3,000 \\(cm^2\\)"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "How many rods make 1 flat?",
        answers: ["1", "10", "100", "1,000"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "What is the value of 2 flats + 5 rods + 7 cubes?",
        answers: ["275", "2,057", "257", "2570"],
        correctIndex: 2,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "How many cubes are in 1 block?",
        answers: ["10", "100", "1,000", "10,000"],
        correctIndex: 2,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "If you have 6 blocks, how many flats is that?",
        answers: ["6", "60", "600", "6,000"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "Convert 8 rods + 9 cubes to total cubes.",
        answers: ["17", "69", "89", "98"],
        correctIndex: 2,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "How many rods are in 2 flats?",
        answers: ["2", "20", "200", "2,000"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "What is 1 block - 3 flats in cubes?",
        answers: ["7", "70", "700", "7,000"],
        correctIndex: 2,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "If you have 60 cubes, how many rods can you make?",
        answers: ["6", "60", "600", "6,000"],
        correctIndex: 0,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "How many cubes are in 1 flat + 2 rods?",
        answers: ["12", "102", "120", "1,200"],
        correctIndex: 2,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "Which equals 250 cubes?",
        answers: ["2 flats + 5 rods", "2 rods + 5 flats", "2 blocks + 5 cubes", "2 blocks + 5 rods"],
        correctIndex: 0,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "Subtract: 1 flat - 4 rods. Result in cubes?",
        answers: ["6", "60", "96", "600"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "How many full flats can you make from 325 cubes?",
        answers: ["3", "32", "325", "3,250"],
        correctIndex: 0,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "Add: 3 rods + 7 rods. Total cubes?",
        answers: ["10", "37", "100", "370"],
        correctIndex: 2,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "If 1 block = 10 flats, how many flats are in 5 blocks?",
        answers: ["5", "50", "500", "5,000"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "How many cubes are in 4 rods + 9 cubes?",
        answers: ["49", "409", "94", "490"],
        correctIndex: 0,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "If you combine 2 flats + 0 rods + 3 cubes, what is the total?",
        answers: ["23", "203", "230", "2,003"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "How many rods are needed to make 1 block?",
        answers: ["10", "100", "1,000", "10,000"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "What is 5 flats - 2 rods in cubes?",
        answers: ["3", "48", "480", "498"],
        correctIndex: 2,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      },
      {
        text: "If you have 120 cubes, how many flats can you make?",
        answers: ["1", "12", "120", "1,200"],
        correctIndex: 1,
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
      }
    ],
    2: [
      // Level 2 questions would go here
      // Follow same format as level 1
      {
        text: "How many cubes are in 7 rods + 2 cubes?",
        answers: ["27", "72", "702", "720"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "What is the value of 1 flat + 0 rods + 5 cubes?",
        answers: ["15", "105", "150", "1,005"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many rods make 5 flats?",
        answers: ["5", "50", "500", "5,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Subtract: 3 flats - 4 rods. Result in cubes?",
        answers: ["26", "260", "296", "2,600"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "If you have 15 rods, how many cubes is that?",
        answers: ["15", "150", "1,500", "15,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many full rods can you make from 84 cubes?",
        answers: ["8", "84", "840", "8,400"],
        correctIndex: 0, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "What is 1 block + 2 flats + 3 rods + 4 cubes?",
        answers: ["123", "1,234", "12,340", "123,400"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Convert 9 rods + 9 cubes to total cubes.",
        answers: ["18", "99", "909", "999"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many cubes are in half a flat?",
        answers: ["5", "50", "500", "5,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "If 1 block = 10 flats, how many cubes are in 0.5 blocks?",
        answers: ["5", "50", "500", "5,000"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Add: 1 rod + 1 flat + 1 block. Total cubes?",
        answers: ["111", "1,110", "11,100", "111,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many flats are in 2 blocks + 5 flats?",
        answers: ["7", "25", "250", "2,500"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "What is 3 rods \\(\\times\\) 4 in cubes?",
        answers: ["12", "120", "1,200", "12,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Divide: 1 block \\(\\div\\) 2 rods. Result?",
        answers: ["5", "50", "500", "5,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "If you have 250 cubes, how many full flats can you make?",
        answers: ["2", "25", "250", "2,500"],
        correctIndex: 0, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many cubes are in 0.1 blocks?",
        answers: ["1", "10", "100", "1,000"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Combine: 4 flats + 9 rods + 6 cubes. Total cubes?",
        answers: ["4.096", "469", "496", "964"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "What is 1 flat - 1 rod - 1 cube, in cubes?",
        answers: ["89", "98", "109", "189"],
        correctIndex: 0, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "If 20 rods = _____ cubes, the missing value is:",
        answers: ["20", "200", "2,000", "20,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many cubes are in 0.25 flats?",
        answers: ["25", "250", "2.5", "2,500"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    ],
    3: [
      // Level 3 questions would go here
      // Follow same format as level 1
    {
        text: "Add: 3 rods + 5 rods. Total cubes?",
        answers: ["8", "80", "800", "8,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Subtract: 1 flat - 2 rods. Remaining cubes?",
        answers: ["8", "80", "98", "800"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Multiply: 4 rods \\(\\times\\) 3. Total cubes?",
        answers: ["12", "120", "1,200", "12,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Divide: 1 block \\(\\div\\) 5 rods. Result?",
        answers: ["2", "20", "200", "2,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "What is 2 flats + 7 rods + 4 cubes?",
        answers: ["2,074", "247", "274", "724"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "If you have 5 rods \\(\\times\\) 4, how many cubes total?",
        answers: ["20", "200", "2,000", "20,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Solve: 1 block - 3 flats + 2 rods.",
        answers: ["720", "702", "270", "1,320"],
        correctIndex: 0, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many cubes are in 0.5 flats + 2 rods?",
        answers: ["25", "45", "70", "700"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "What is 3 rods \\(\\times\\) 2 rods?",
        answers: ["6 cubes", "60 cubes", "600 cubes", "6,000 cubes"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Divide: 2 blocks \\(\\div\\) 4 flats. Result?",
        answers: ["5", "50", "500", "5,000"],
        correctIndex: 0, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Subtract: 10 rods - 25 cubes.",
        answers: ["7.5 cubes", "75 cubes", "750 cubes", "7,500 cubes"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Add: 0.3 blocks + 4 rods. Total cubes?",
        answers: ["34", "340", "430", "3,040"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Multiply: 1 flat \\(\\times\\) 1 rod.",
        answers: ["10 cubes", "100 cubes", "1,000 cubes", "10,000 cubes"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "If 1 rod = 10 cubes, what is 7 rods ÷ 2?",
        answers: ["3.5 cubes", "35 cubes", "350 cubes", "3,500 cubes"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Solve: 5 flats - 3 rods + 1 block.",
        answers: ["1,270", "1,470", "1,700", "15,300"],
        correctIndex: 0, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "How many cubes are in 0.2 blocks + 0.5 flats?",
        answers: ["25", "250", "2,500", "25,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "What is 12 rods \\(\\times\\) 5?",
        answers: ["60 cubes", "600 cubes", "6,000 cubes", "60,000 cubes"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Divide: 3 blocks \\(\\div\\) 6 rods.",
        answers: ["5", "50", "500", "5,000"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Add: 0.7 flats + 8 cubes.",
        answers: ["15", "78", "708", "780"],
        correctIndex: 1, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    {
        text: "Subtract: 1 block - 0.5 blocks.",
        answers: ["5 cubes", "50 cubes", "500 cubes", "5,000 cubes"],
        correctIndex: 2, // Index of correct answer (0-3)
        videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
    },
    ], 
    4: [
        // Level 4 questions would go here
      // Follow same format as level 1
        {
            text: "Solve: (2 flats \\(\\times\\) 3) + (5 rods \\(\\times\\) 4).",
            answers: ["800", "1,100", "1,600", "2,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 rod = 10 cubes, what is 1 flat \\(\\div\\) 2 rods?",
            answers: ["5", "50", "500", "5,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "What is 0.4 blocks + 3 flats - 2 rods?",
            answers: ["420", "480", "4,200", "4,800"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Multiply: 0.5 blocks \\(\\times\\) 10 rods.",
            answers: ["50 cubes", "500 cubes", "5,000 cubes", "50,000 cubes"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "1,000 cubes ÷ 25 cubes",
            answers: ["2 rods", "4 rods", "40 rods", "400 rods"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A builder uses 3 flats + 8 rods of material. How many cubes is this?",
            answers: ["38", "308", "380", "3,080"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Subtract: 1.5 blocks - 7 flats. Result in cubes?",
            answers: ["80", "800", "8,000", "80,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Multiply: 6 rods \\(\\times\\) 0.5 flats. (Hint: 0.5 flat = 50 cubes)",
            answers: ["30 cubes", "300 cubes", "3,000 cubes", "30,000 cubes"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A shop sells 2 rods + 5 cubes of ribbon per customer. How much ribbon for 4 customers?",
            answers: ["25 cubes", "100 cubes", "250 cubes", "1,000 cubes"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Divide: 9 flats \\(\\div\\) 3 rods.",
            answers: ["3", "30", "300", "3,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Solve: (1 block - 2 rods) + (3 flats \\(\\times\\) 2).",
            answers: ["1,160", "1,600", "2,600", "3,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 rod = 10 cubes, what is \\frac{1}{4} block + \\frac{1}{2} flat?",
            answers: ["250 cubes", "300 cubes", "350 cubes", "400 cubes"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A recipe requires 2 rods + 7 cubes of sugar. Double the recipe.",
            answers: ["27 cubes", "54 cubes", "270 cubes", "540 cubes"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "How many full rods can you make from 365 cubes?",
            answers: ["3", "36", "360", "3,650"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "What is 0.2 blocks + 30 rods - 1 flat?",
            answers: ["10 cubes", "100 cubes", "1,000 cubes", "10,000 cubes"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A classroom has 4 blocks + 5 flats of paper. How many sheets if 1 cube = 1 sheet?",
            answers: ["45", "450", "4,500", "45,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 5 rods = 50 cubes, what is 5 rods \\(\\times\\) 5 rods?",
            answers: ["25 cubes", "250 cubes", "2,500 cubes", "25,000 cubes"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A tank has 2 blocks - 5 flats of water. How many cubes remain?",
            answers: ["500", "1,500", "2,500", "5,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Combine: 0.3 flats + 4 rods + 0.7 blocks.",
            answers: ["740 cubes", "804 cubes", "840 cubes", "8,040 cubes"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A factory produces 1 block + 2 flats daily. Weekly production?",
            answers: ["1,200 cubes", "8,400 cubes", "12,000 cubes", "84,000 cubes"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
    ], 
    5: [
        // Level 5 questions would go here
      // Follow same format as level 1
        {
            text: "Emma buys a toy for 2 flats + 3 rods + 5 cubes. How much does she spend (in cubes)?",
            answers: ["235", "253", "352", "325"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A book costs 1 block - 2 flats. What's the price in cubes?",
            answers: ["800", "1,200", "8,000", "12,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 rod = Gh₵10.00, how much is 5 flats + 4 rods?",
            answers: ["Gh₵54.00", "Gh₵540.00", "Gh₵5,400.00", "Gh₵54,000.00"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A wall is built with 3 blocks + 5 flats of bricks. How many bricks are used?",
            answers: ["305", "3,050", "3,500", "35,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A rope is 4 rods + 7 cubes long. How many cubes is that?",
            answers: ["407", "470", "4,007", "47"],
            correctIndex: 3, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A tank holds 2 blocks of water. If you remove 5 flats, how much remains?",
            answers: ["500", "1,500", "2,500", "5,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A machine makes 1 flat of widgets every hour. How many widgets does it make in 8 hours?",
            answers: ["8", "80", "800", "8,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A worker packs 2 rods of boxes daily. How many cubes does he pack in 5 days?",
            answers: ["10", "100", "500", "1,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Half a block + a quarter flat = ___ cubes.",
            answers: ["250", "525", "600", "1,025"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "0.3 blocks + 0.7 flats = ___ cubes.",
            answers: ["37", "3,070", "3,700", "370"],
            correctIndex: 3, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A store has 5 blocks of stock. It sells 3 flats + 2 rods daily. How many cubes remain after 2 days?",
            answers: ["4,360", "4,600", "4,960", "5,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "You have 2 blocks. You give away 1 flat + 5 rods + 3 cubes. How much is left?",
            answers: ["847", "1,847", "2,153", "2,847"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A pizza is cut into 1 flat + 2 rods slices. How many slices is that?",
            answers: ["12", "102", "120", "1,020"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A school orders 4 blocks + 5 rods of pencils. How many pencils is that?",
            answers: ["405", "4,500", "45,000", "4,050"],
            correctIndex: 3, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A car travels 1 rod km per minute. How far in 1 flat minutes?",
            answers: ["10 km", "100 km", "0.1 km", "1,000 km"],
            correctIndex: 3, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Combine: 0.5 blocks + 25 rods - 3 flats.",
            answers: ["0 cubes", "200 cubes", "450 cubes", "700 cubes"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 block = 1,000 marbles, how many marbles are in 2.5 blocks?",
            answers: ["25", "250", "2,500", "25,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A box weighs 1 block - 5 rods. What's its weight in cubes?",
            answers: ["50", "500", "950", "995"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A recipe needs 3 rods + 2 cubes of flour. What is triple the recipe.",
            answers: ["96", "15", "9", "32"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A garden has 2 blocks of plants. If 1 flat + 2 rods die, how many survive?",
            answers: ["1,880", "1,808", "1,280", "1,082"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
    ], 
    6: [
        // Level 6 questions would go here
      // Follow same format as level 1
        {
            text: "A store has 3 blocks + 7 flats of product. They sell 1 block + 2 flats + 5 rods in a day. How much inventory remains?",
            answers: ["1,450 cubes", "2,450 cubes", "1,550 cubes", "2,550 cubes"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A factory produces 4 rods + 3 cubes of goods every hour. How many cubes are made in an 8-hour shift?",
            answers: ["344 cubes", "434 cubes", "3,440 cubes", "4,340 cubes"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Sarah saves 2 flats + 5 rods weekly. How many cubes does she save in 4 weeks?",
            answers: ["100", "250", "1,000", "10,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A wall is 0.5 blocks + 2 flats tall. How many cubes is the height?",
            answers: ["520", "700", "1,200", "7,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A Gh₵1,000.00 phone is discounted by 3 rods + 2 cubes. What's the new price in cubes?",
            answers: ["Gh₵968.00", "Gh₵986.00", "Gh₵698.00", "Gh₵896.00"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A farmer harvests 5 blocks + 4 flats of corn. If 1 flat spoils, how much remains?",
            answers: ["5,500", "530", "5,400", "5,300"],
            correctIndex: 3, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A truck carries 2 blocks + 5 rods of sand per trip. How many cubes can it transport in 3 trips?",
            answers: ["2,500", "2,050", "615", "6,150"],
            correctIndex: 3, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Water boils at 1 flat °C. If it cools by 3 rods °C, what's the new temperature?",
            answers: ["30°C", "70°C", "130°C", "170°C"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A runner completes 1 block + 2 flats meters in a race. How many meters is that?",
            answers: ["1,002", "1,020", "1,200", "12,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A cake requires 3 rods + 4 cubes of flour. How much flour is needed for 5 cakes?",
            answers: ["170", "107", "1,700", "17,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 3 blocks + \\(x\\) rods = 3,200 cubes, find the value of \\(x\\)?",
            answers: ["2", "20", "200", "2,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "What is \\(\\dfrac{1}{2}\\) block + \\(\\dfrac{1}{4}\\) flat in cubes?",
            answers: ["525", "600", "1,025", "1,250"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If \\(x\\) rods = 1 flat, what is \\(x\\)?",
            answers: ["15", "5", "20", "10"],
            correctIndex: 3, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A store has 5 blocks of inventory. It sells 2 blocks + 3 flats + 4 rods on Monday. How much remains?",
            answers: ["2,660", "2,340", "4,340", "1,640"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Which is greater: 0.6 blocks or 7 flats?",
            answers: ["0.6 blocks", "7 flats", "They are equal", "Not enough information"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 rod = 10 cubes, how many flats are in 50 rods?",
            answers: ["0.5", "5", "50", "500"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A tank has 4,500 cubes of water. How many full blocks + flats is this?",
            answers: ["4 blocks + 5 flats", "5 blocks + 4 flats", "3 blocks + 15 flats", "2 blocks + 25 flats"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "What is 0.3 blocks - 15 rods?",
            answers: ["150", "15", "1,500", "0"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 block = 10 flats, and 1 flat = 10 rods, how many rods are in 2 blocks?",
            answers: ["20", "200", "2,000", "20,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A construction project needs 12,000 cubes of concrete. How many full blocks are required?",
            answers: ["12", "120", "1,200", "1.2"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
    ], 
    7: [
        // Level 7 questions would go here
      // Follow same format as level 1
        {
            text: "If 5 rods + \\(x\\) cubes = 1 flat, what is the value of \\(x\\)?",
            answers: ["40", "50", "60", "100"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "What is \\(\\dfrac{3}{4}\\) block - 2 rods in cubes?",
            answers: ["550", "650", "730", "800"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A truck carries 2 blocks + 3 flats of sand. It drops off 5 rods + 7 cubes. How much sand remains?",
            answers: ["2,243", "2,343", "2,443", "2,543"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Which is greater: 0.7 blocks or 6 flats + 5 rods?",
            answers: ["0.7 blocks", "6 flats + 5 rods", "Equal", "Not comparable"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 150 rods = _____ blocks, what fills the blank?",
            answers: ["0.15", "1.5", "15", "150"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A box weighs 3,050 cubes. How many full blocks + flats + rods is this?",
            answers: ["3 blocks + 0 flats + 5 rods", "3 blocks + 5 flats + 0 rods", "30 blocks + 5 rods", "305 flats"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 block = 5 flats, 1 flat = 2 rods, and 1 rod = 10 cubes, how many cubes are in 2 blocks?",
            answers: ["100", "200", "1,000", "2,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A bakery uses 2 flats + 8 rods of flour daily. How much flour is used in 5 days?",
            answers: ["1,400", "2,800", "14,000", "28,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "What is 0.4 blocks \\(\\times\\) 5 rods? (Assume rod = 10 cubes)",
            answers: ["20", "200", "2,000", "20,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If A = \\(\\dfrac{1}{4}\\) block, B = 3 rods, and C = 0.2 flats, which is smallest?",
            answers: ["A", "B", "C", "All equal"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A container holds 2.5 blocks of water. How many flats is this equivalent to?",
            answers: ["2.5", "25", "250", "2,500"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 block = \\(x\\) rods, what is the value of \\(x\\)?",
            answers: ["10", "100", "1,000", "10,000"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A factory produces 3 blocks + 5 flats of goods daily. How many cubes are produced in 4 days?",
            answers: ["1,400", "3,500", "14,000", "35,000"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "What is \\(\\dfrac{3}{4}\\) block + \\(\\dfrac{1}{5}\\) flat in cubes?",
            answers: ["755", "770", "800", "850"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Which quantity is largest?",
            answers: ["0.6 blocks", "7 flats", "65 rods", "600 cubes"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A machine makes 2 rods + 5 cubes every minute. How much does it produce in 30 minutes?",
            answers: ["75", "250", "750", "7500"],
            correctIndex: 2, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "If 1 cube = 1 gram, how many kilograms is 1 block?",
            answers: ["1", "10", "100", "1,000"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "A shipment contains 4,200 cubes. How many full blocks and flats is this?",
            answers: ["4 blocks + 2 flats", "2 blocks + 4 flats", "42 flats", "420 rods"],
            correctIndex: 0, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "35% of a block equals how many rods?",
            answers: ["3.5", "35", "350", "3,500"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
        {
            text: "Boxes hold 1 flat (100 cubes) each. How many boxes are needed for 3 blocks + 2 rods?",
            answers: ["30", "31", "32", "40"],
            correctIndex: 1, // Index of correct answer (0-3)
            videoSolution: "https://www.youtube.com/embed/6YzeRmEr3IU"
        },
    ]
  };
  
  // Game state
  let gameState = {
    currentLevel: 1,
    currentQuestion: 0,
    score: 0,
    timer: null,
    timeLeft: 0,
    questions: [],
    selectedAnswer: null,
    correctAnswer: null,
    videoSolutionUrl: null
  };
  
  // Create game HTML structure
  function createGameStructure() {
    const gameContainer = document.getElementById('game-container');
    
    gameContainer.innerHTML = `
      <div id="start-screen" class="game-screen">
        <h1>Math Challenge</h1>
        <p>Test your skills across 7 levels of increasing difficulty!</p>
        <p>Each level has 20 questions. You need 17 correct answers to advance.</p>
        <button id="start-btn">Begin Challenge</button>
      </div>
      
      <div id="game-screen" class="game-screen hidden">
        <div class="game-header">
          <span id="level-display">Level: 1</span>
          <span id="score-display">Score: 0/100</span>
          <span id="timer-display">Time: 1:00</span>
        </div>
        
        <div id="question-container">
          <p id="question-text">Loading question...</p>
          <div id="options-container" class="options-grid"></div>
        </div>
        
        <div id="progress-container">
          <div id="progress-bar"></div>
          <span id="progress-text">Question 1 of 20</span>
        </div>
      </div>
      
      <div id="result-screen" class="game-screen hidden">
        <h2 id="result-title">Level Complete!</h2>
        <p id="result-message">You scored 85/100 and advanced to level 2!</p>
        <div id="solution-video" class="hidden video-container"></div>
        <button id="next-level-btn" class="hidden">Continue to Level 2</button>
        <button id="retry-btn">Try Again</button>
      </div>
      
      <div id="final-screen" class="game-screen hidden">
        <h1>Congratulations! 🎉</h1>
        <p>You've completed all 7 levels of this math challenge!</p>
        <p>Your final score: <span id="final-score">350</span>/700</p>
        <p>We hope you enjoyed this learning experience.</p>
        <button id="other-lessons-btn">Explore Other Lessons</button>
      </div>
    `;
    
    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
      .topic-game {
        font-family: 'Arial', sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      .game-screen {
        text-align: center;
        padding: 20px;
      }
      .game-screen h1 {
        font-size: 2em;
      }
      .hidden {
        display: none;
      }
      .game-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        font-weight: bold;
      }
      #question-text {
        font-size: 1.5em;
        margin-bottom: 30px;
      }
      .options-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 30px;
      }
      .option-btn {
        padding: 15px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1.1em;
        transition: background-color 0.3s;
      }
      .option-btn:hover {
        background-color: #45a049;
      }
      .option-btn.correct {
        background-color: #2e7d32;
      }
      .option-btn.wrong {
        background-color: #c62828;
      }
      #progress-container {
        margin-top: 20px;
      }
      #progress-bar {
        height: 10px;
        background-color: #ddd;
        border-radius: 5px;
        margin-bottom: 10px;
      }
      #progress-bar::after {
        content: '';
        display: block;
        height: 100%;
        width: 5%;
        background-color: #4CAF50;
        border-radius: 5px;
        transition: width 0.3s;
      }
      #solution-video {
        margin: 20px 0;
      }
      .video-container {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        height: 0;
        overflow: hidden;
      }
      .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      button {
        padding: 12px 25px;
        margin: 10px;
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1em;
        transition: background-color 0.3s;
      }
      button:hover {
        background-color: #0b7dda;
      }
      #final-screen {
        background-color: #e8f5e9;
        border-radius: 10px;
      }
      #final-screen h1 {
        color: #2e7d32;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Show screens
  function showStartScreen() {
    hideAllScreens();
    document.getElementById('start-screen').classList.remove('hidden');
  }
  
  function showGameScreen() {
    hideAllScreens();
    document.getElementById('game-screen').classList.remove('hidden');
    
    // Load questions for current level
    gameState.questions = allQuestions[gameState.currentLevel];
    gameState.currentQuestion = 0;
    gameState.score = 0;
    
    updateGameDisplay();
    loadQuestion();
  }
  
  function showResultScreen(passed) {
    hideAllScreens();
    const resultScreen = document.getElementById('result-screen');
    resultScreen.classList.remove('hidden');
    
    if (passed) {
      document.getElementById('result-title').textContent = `Level ${gameState.currentLevel} Complete!`;
      document.getElementById('result-message').textContent = `You scored ${gameState.score}/${config.questionsPerLevel * config.pointsPerQuestion} and advanced to level ${gameState.currentLevel + 1}!`;
      document.getElementById('next-level-btn').textContent = `Continue to Level ${gameState.currentLevel + 1}`;
      document.getElementById('next-level-btn').classList.remove('hidden');
    } else {
      document.getElementById('result-title').textContent = `Level ${gameState.currentLevel} Failed`;
      document.getElementById('result-message').textContent = `You scored ${gameState.score}/${config.questionsPerLevel * config.pointsPerQuestion}. You need at least ${config.passingScore} points to pass.`;
      document.getElementById('next-level-btn').classList.add('hidden');
    }
    
    // Show video solution if available
    if (gameState.videoSolutionUrl) {
      const videoContainer = document.getElementById('solution-video');
      videoContainer.classList.remove('hidden');
      videoContainer.innerHTML = `
        <p>Here's a solution to the last question:</p>
        <iframe src="${gameState.videoSolutionUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      `;
    }
  }
  
  function showFinalScreen() {
    hideAllScreens();
    const finalScreen = document.getElementById('final-screen');
    finalScreen.classList.remove('hidden');
    document.getElementById('final-score').textContent = gameState.score;
  }
  
  function hideAllScreens() {
    const screens = document.querySelectorAll('.game-screen');
    screens.forEach(screen => screen.classList.add('hidden'));
  }
  
  // Game functions
  function loadQuestion() {
    if (gameState.currentQuestion >= config.questionsPerLevel) {
      endLevel();
      return;
    }
    
    const question = gameState.questions[gameState.currentQuestion];
    const questionTextElement = document.getElementById('question-text');
    
    // Use innerHTML to preserve LaTeX
    questionTextElement.innerHTML = question.text;
    
    // Clear previous options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    // Add new options
    question.answers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.className = 'option-btn';
      button.innerHTML = answer; // Use innerHTML for answers that might contain LaTeX
      button.dataset.index = index;
      button.addEventListener('click', selectAnswer);
      optionsContainer.appendChild(button);
    });
    
    // Update progress
    updateProgress();
    
    // Start timer
    startTimer();
    
    // Tell MathJax to typeset the new content
    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  }
  
  function startTimer() {
    clearInterval(gameState.timer);
    gameState.timeLeft = config.timePerQuestion;
    updateTimerDisplay();
    
    gameState.timer = setInterval(() => {
      gameState.timeLeft--;
      updateTimerDisplay();
      
      if (gameState.timeLeft <= 0) {
        clearInterval(gameState.timer);
        timeUp();
      }
    }, 1000);
  }
  
  function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    document.getElementById('timer-display').textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  
  function timeUp() {
    // Mark as wrong answer
    const question = gameState.questions[gameState.currentQuestion];
    gameState.videoSolutionUrl = question.videoSolution;
    
    // Highlight correct answer
    const options = document.querySelectorAll('.option-btn');
    options[question.correctIndex].classList.add('correct');
    
    // Move to next question after delay
    setTimeout(() => {
      gameState.currentQuestion++;
      loadQuestion();
    }, 1500);
  }
  
  function selectAnswer(e) {
    clearInterval(gameState.timer);
    
    const selectedIndex = parseInt(e.target.dataset.index);
    const question = gameState.questions[gameState.currentQuestion];
    
    // Store for result screen
    gameState.selectedAnswer = selectedIndex;
    gameState.correctAnswer = question.correctIndex;
    gameState.videoSolutionUrl = question.videoSolution;
    
    // Highlight selected answer
    const options = document.querySelectorAll('.option-btn');
    options.forEach(opt => opt.disabled = true);
    
    if (selectedIndex === question.correctIndex) {
      e.target.classList.add('correct');
      gameState.score += config.pointsPerQuestion;
      updateScoreDisplay();
    } else {
      e.target.classList.add('wrong');
      options[question.correctIndex].classList.add('correct');
    }
    
    // Move to next question after delay
    setTimeout(() => {
      gameState.currentQuestion++;
      loadQuestion();
    }, 1500);
  }
  
  function updateGameDisplay() {
    document.getElementById('level-display').textContent = `Level: ${gameState.currentLevel}`;
    updateScoreDisplay();
  }
  
  function updateScoreDisplay() {
    document.getElementById('score-display').textContent = `Score: ${gameState.score}/${config.questionsPerLevel * config.pointsPerQuestion}`;
  }
  
  function updateProgress() {
    const progress = (gameState.currentQuestion / config.questionsPerLevel) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `Question ${gameState.currentQuestion + 1} of ${config.questionsPerLevel}`;
  }
  
  function endLevel() {
    const passed = gameState.score >= config.passingScore;
    
    if (passed && gameState.currentLevel === config.levels) {
      showFinalScreen();
    } else {
      showResultScreen(passed);
    }
  }
  
  // Initialize the game
  function initGame() {
    createGameStructure();
    gameState.currentLevel = 1;
    gameState.score = 0;
    showStartScreen();
    
    // Set up event listeners
    document.getElementById('start-btn').addEventListener('click', showGameScreen);
    document.getElementById('next-level-btn').addEventListener('click', () => {
      gameState.currentLevel++;
      showGameScreen();
    });
    document.getElementById('retry-btn').addEventListener('click', showGameScreen);
    document.getElementById('other-lessons-btn').addEventListener('click', () => {
      alert('Redirecting to other lessons...');
    });
  }
  
  // Start the game when the page loads
  window.addEventListener('DOMContentLoaded', initGame);