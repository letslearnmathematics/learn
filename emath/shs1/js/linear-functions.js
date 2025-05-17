// Linear Functions and Graphs
    // Graph plotting functions
    function plotLinearGraphs() {
        // Graph 1: y = 2x + 1
        const ctx1 = document.getElementById('linearGraph1').getContext('2d');
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: [-2, -1, 0, 1, 2],
                datasets: [{
                    label: 'y = 2x + 1',
                    data: [-3, -1, 1, 3, 5],
                    borderColor: '#3498db',
                    borderWidth: 2,
                    fill: false,
                    tension: 0
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'x-axis' },
                        grid: { color: 'rgba(0,0,0,0.1)' }
                    },
                    y: {
                        title: { display: true, text: 'y-axis' },
                        grid: { color: 'rgba(0,0,0,0.1)' }
                    }
                },
                plugins: {
                    legend: { display: true }
                }
            }
        });

        // Graph 2: Line through (0,-2) and (2,2)
        const ctx2 = document.getElementById('linearGraph2').getContext('2d');
        new Chart(ctx2, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Line through (0,-2) and (2,2)',
                    data: [{x: 0, y: -2}, {x: 2, y: 2}],
                    borderColor: '#e74c3c',
                    backgroundColor: '#e74c3c',
                    borderWidth: 2,
                    showLine: true,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        min: -1, max: 3,
                        title: { display: true, text: 'x-axis' }
                    },
                    y: {
                        min: -3, max: 3,
                        title: { display: true, text: 'y-axis' }
                    }
                }
            }
        });

        // Area Enclosed by Lines Graph
        const ctxArea = document.getElementById('areaGraph').getContext('2d');
        new Chart(ctxArea, {
            type: 'line',
            data: {
                labels: [0, 1, 2, 3, 4, 5, 6],
                datasets: [
                    {
                        label: 'y = 2x',
                        data: [0, 2, 4, 6, 8, 10, 12],
                        borderColor: '#3498db',
                        borderWidth: 2,
                        fill: false,
                        tension: 0
                    },
                    {
                        label: 'y = -x + 6',
                        data: [6, 5, 4, 3, 2, 1, 0],
                        borderColor: '#e74c3c',
                        borderWidth: 2,
                        fill: false,
                        tension: 0
                    },
                    {
                        label: 'x-axis',
                        data: [0, 0, 0, 0, 0, 0, 0],
                        borderColor: '#2ecc71',
                        borderWidth: 1,
                        fill: {
                            target: '-1',
                            above: 'rgba(75, 192, 192, 0.2)',
                            below: 'rgba(75, 192, 192, 0.2)'
                        },
                        pointRadius: 0,
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'x-axis' },
                        min: 0,
                        max: 6
                    },
                    y: {
                        title: { display: true, text: 'y-axis' },
                        min: 0,
                        max: 12
                    }
                },
                plugins: {
                    annotation: {
                        annotations: {
                            box1: {
                                type: 'box',
                                xMin: 0,
                                xMax: 2,
                                yMin: 0,
                                yMax: 4,
                                backgroundColor: 'rgba(255, 99, 132, 0.25)',
                                borderColor: 'rgba(255, 99, 132, 0.5)',
                                borderWidth: 1,
                                label: {
                                    content: 'Enclosed Area',
                                    enabled: true,
                                    position: 'center',
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)'
                                }
                            },
                            point1: {
                                type: 'point',
                                xValue: 2,
                                yValue: 4,
                                radius: 5,
                                backgroundColor: 'rgba(155, 89, 182, 1)',
                                label: {
                                    content: 'Intersection (2,4)',
                                    enabled: true,
                                    position: 'top'
                                }
                            }
                        }
                    }
                }
            }
        });

        // Parallel Lines (y = x + 1 and y = x - 1)
        const ctxParallel = document.getElementById('parallelLines').getContext('2d');
        new Chart(ctxParallel, {
            type: 'line',
            data: {
                labels: [-2, -1, 0, 1, 2],
                datasets: [
                    {
                        label: 'y = x + 1',
                        data: [-1, 0, 1, 2, 3],
                        borderColor: '#2ecc71',
                        borderWidth: 2,
                        fill: false,
                        tension: 0
                    },
                    {
                        label: 'y = x - 1',
                        data: [-3, -2, -1, 0, 1],
                        borderColor: '#3498db',
                        borderWidth: 2,
                        fill: false,
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'x-axis' } },
                    y: { title: { display: true, text: 'y-axis' } }
                }
            }
        });

        // Perpendicular Lines (y = x and y = -x)
        const ctxPerpendicular = document.getElementById('perpendicularLines').getContext('2d');
        new Chart(ctxPerpendicular, {
            type: 'line',
            data: {
                labels: [-2, -1, 0, 1, 2],
                datasets: [
                    {
                        label: 'y = x',
                        data: [-2, -1, 0, 1, 2],
                        borderColor: '#9b59b6',
                        borderWidth: 2,
                        fill: false,
                        tension: 0
                    },
                    {
                        label: 'y = -x',
                        data: [2, 1, 0, -1, -2],
                        borderColor: '#e67e22',
                        borderWidth: 2,
                        fill: false,
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'x-axis' } },
                    y: { title: { display: true, text: 'y-axis' } }
                }
            }
        });

        // Break-Even Analysis Graph
        const ctxBreakEven = document.getElementById('breakEvenGraph').getContext('2d');
        new Chart(ctxBreakEven, {
            type: 'line',
            data: {
                labels: [0, 10, 20, 30, 40, 50],
                datasets: [
                    {
                        label: 'Cost (GH₵)',
                        data: [100, 200, 300, 400, 500, 600],
                        borderColor: '#e74c3c',
                        borderWidth: 2,
                        fill: false,
                        tension: 0
                    },
                    {
                        label: 'Revenue (GH₵)',
                        data: [0, 150, 300, 450, 600, 750],
                        borderColor: '#2ecc71',
                        borderWidth: 2,
                        fill: false,
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Quantity' },
                        grid: { color: 'rgba(0,0,0,0.1)' }
                    },
                    y: {
                        title: { display: true, text: 'Amount (GH₵)' },
                        grid: { color: 'rgba(0,0,0,0.1)' }
                    }
                },
                plugins: {
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                yMin: 300,
                                yMax: 300,
                                borderColor: 'rgb(255, 99, 132)',
                                borderWidth: 2,
                                borderDash: [6, 6],
                                label: {
                                    content: 'Break-even point',
                                    enabled: true,
                                    position: 'center'
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    // Initialize graphs when page loads
    window.addEventListener('load', plotLinearGraphs);