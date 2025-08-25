// Salary evolution data
const salaryData = {
	2020: { EN: 69841, MI: 91871, SE: 138649, EX: 179958 },
	2021: { EN: 63463, MI: 86818, SE: 125990, EX: 186128 },
	2022: { EN: 79464, MI: 102746, SE: 147715, EX: 184798 },
	2023: { EN: 90915, MI: 123774, SE: 165421, EX: 190393 },
	2024: { EN: 103413, MI: 145668, SE: 175703, EX: 201625 },
	2025: { EN: 96141, MI: 141753, SE: 171969, EX: 201188 }
};

// Job title salary data with your updated values
const jobTitleData = {
	2020: {
		'Analyst': 0,
		'Data Analyst': 60911,
		'Data Engineer': 85301,
		'Data Scientist': 108943,
		'Engineer': 0,
		'ML Engineer': 119917,
		'Manager': 0,
		'Product Manager': 0,
		'Research Scientist': 246000,
		'Software Engineer': 0
	},
	2021: {
		'Analyst': 0,
		'Data Analyst': 78259,
		'Data Engineer': 96143,
		'Data Scientist': 94721,
		'Engineer': 0,
		'ML Engineer': 91367,
		'Manager': 0,
		'Product Manager': 0,
		'Research Scientist': 83004,
		'Software Engineer': 0
	},
	2022: {
		'Analyst': 0,
		'Data Analyst': 108658,
		'Data Engineer': 139590,
		'Data Scientist': 139645,
		'Engineer': 0,
		'ML Engineer': 151182,
		'Manager': 0,
		'Product Manager': 0,
		'Research Scientist': 142189,
		'Software Engineer': 0
	},
	2023: {
		'Analyst': 0,
		'Data Analyst': 108731,
		'Data Engineer': 150096,
		'Data Scientist': 163855,
		'Engineer': 0,
		'ML Engineer': 192100,
		'Manager': 0,
		'Product Manager': 0,
		'Research Scientist': 188847,
		'Software Engineer': 0
	},
	2024: {
		'Data Scientist': 158541,
		'ML Engineer': 200046,
		'Research Scientist': 199002,
		'Data Engineer': 149072,
		'Data Analyst': 106404,
		'Analyst': 109823,
		'Engineer': 170878,
		'Manager': 166370,
		'Product Manager': 190467,
		'Software Engineer': 189651
	},
	2025: {
		'Data Scientist': 154779,
		'ML Engineer': 201788,
		'Research Scientist': 198729,
		'Data Engineer': 146003,
		'Data Analyst': 103366,
		'Analyst': 113777,
		'Engineer': 170549,
		'Manager': 166529,
		'Product Manager': 188915,
		'Software Engineer': 190518
	}
};

let chart;
let currentChart = 'evolution';
let selectedJobFilter = 'all';

// Initialize chart when page loads
document.addEventListener('DOMContentLoaded', function() {
	const ctx = document.getElementById('salaryChart').getContext('2d');
	
	chart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: Object.keys(salaryData),
			datasets: [{
				data: Object.values(salaryData).map(year => year['EN']),
				backgroundColor: '#9bf1ff',
				borderRadius: 2,
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { display: false },
				tooltip: {
					backgroundColor: '#2e3440',
					titleColor: '#d8dee9',
					bodyColor: '#9bf1ff',
					borderColor: 'rgba(212, 212, 255, 0.3)',
					borderWidth: 1,
					callbacks: {
						label: function(context) {
							return 'Salary: $' + context.parsed.y.toLocaleString();
						}
					}
				}
			},
			scales: {
				x: {
					grid: { color: 'rgba(212, 212, 255, 0.2)' },
					ticks: { color: '#d8dee9', font: { size: 12 } }
				},
				y: {
					grid: { color: 'rgba(212, 212, 255, 0.2)' },
					ticks: {
						color: '#d8dee9',
						font: { size: 12 },
						callback: value => '$' + value.toLocaleString()
					}
				}
			}
		}
	});

	// Add event listeners for experience level buttons
	document.querySelectorAll('.experience-btn').forEach(button => {
		button.addEventListener('click', function() {
			if (currentChart === 'evolution') {
				document.querySelectorAll('.experience-btn').forEach(btn => btn.classList.remove('active'));
				this.classList.add('active');
				const level = this.getAttribute('data-level');
				updateEvolutionChart(level);
			}
		});
	});
});

// Switch between charts
function switchChart(chartType, button) {
	// Update button states
	document.querySelectorAll('.chart-toggle-btn').forEach(btn => btn.classList.remove('active'));
	button.classList.add('active');
	
	currentChart = chartType;
	
	if (chartType === 'evolution') {
		document.getElementById('evolution-controls').style.display = 'flex';
		document.getElementById('jobtitle-controls').style.display = 'none';
		document.getElementById('chartTitle').textContent = 'AI/ML Salary Evolution by Experience Level (2020-2025)';
		
		const activeLevel = document.querySelector('.experience-btn.active').getAttribute('data-level');
		updateEvolutionChart(activeLevel);
	} else {
		document.getElementById('evolution-controls').style.display = 'none';
		document.getElementById('jobtitle-controls').style.display = 'block';
		updateJobTitleChart();
	}
}

// Update evolution chart
function updateEvolutionChart(level) {
	chart.data.labels = Object.keys(salaryData);
	chart.data.datasets[0].data = Object.values(salaryData).map(year => year[level]);
	chart.update();
}

// Update job title chart
function updateJobTitleChart() {
	if (selectedJobFilter === 'all') {
		// Show all jobs for selected year, filtered and sorted
		const selectedYear = document.getElementById('yearSelect').value;
		const yearData = jobTitleData[selectedYear];
		
		// Filter out jobs with 0 salary and sort from least to greatest
		const filteredJobs = Object.entries(yearData)
			.filter(([job, salary]) => salary > 0)
			.sort((a, b) => a[1] - b[1]);
		
		const jobTitles = filteredJobs.map(([job, salary]) => job);
		const salaries = filteredJobs.map(([job, salary]) => salary);
		
		chart.data.labels = jobTitles;
		chart.data.datasets[0].data = salaries;
		
		document.getElementById('chartTitle').textContent = `AI/ML Salaries by Job Title (${selectedYear}) - Sorted Lowest to Highest`;
	} else {
		// Show selected job across all years (2020-2025)
		const years = Object.keys(jobTitleData);
		const jobSalariesByYear = years.map(year => {
			const salary = jobTitleData[year][selectedJobFilter];
			return salary > 0 ? salary : null; // Use null for missing data points
		});
		
		chart.data.labels = years;
		chart.data.datasets[0].data = jobSalariesByYear;
		
		document.getElementById('chartTitle').textContent = `${selectedJobFilter} Salary Evolution (2020-2025)`;
	}
	
	chart.update();
}

// Filter by job title from dropdown
function filterJobTitleFromSelect() {
	const selectedJob = document.getElementById('jobSelect').value;
	selectedJobFilter = selectedJob;
	
	if (selectedJob === 'all') {
		// Show year selector when "All Jobs" is selected
		document.getElementById('yearSelect').parentElement.style.display = 'block';
	} else {
		// Hide year selector when specific job is selected (showing evolution across years)
		document.getElementById('yearSelect').parentElement.style.display = 'none';
	}
	
	updateJobTitleChart();
}

// Location salary data for Chart 2
const locationData = {
	'Entry': {
		'GB': 56632,
		'FR': 65624,
		'CA': 90016,
		'AU': 100470,
		'US': 110584
	},
	'Mid': {
		'GB': 89027,
		'DE': 104747,
		'AU': 117373,
		'CA': 121827,
		'US': 150959
	},
	'Senior': {
		'FR': 108677,
		'DE': 138937,
		'CA': 148313,
		'AU': 148952,
		'US': 179945
	}
};

// Country name mapping
const countryNames = {
	'AU': 'Australia',
	'CA': 'Canada', 
	'DE': 'Germany',
	'FR': 'France',
	'GB': 'United Kingdom',
	'US': 'United States'
};

let locationChart;
let currentLocationLevel = 'Entry';

// Initialize location chart
function initLocationChart() {
	const ctx = document.getElementById('locationChart').getContext('2d');
	
	// Get initial data sorted from lowest to highest
	const levelData = locationData[currentLocationLevel];
	const sortedEntries = Object.entries(levelData).sort((a, b) => a[1] - b[1]);
	const countryLabels = sortedEntries.map(([code, salary]) => countryNames[code]);
	const salaries = sortedEntries.map(([code, salary]) => salary);
	
	locationChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: countryLabels,
			datasets: [{
				data: salaries,
				backgroundColor: '#9bf1ff',
				borderRadius: 2,
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { display: false },
				tooltip: {
					backgroundColor: '#2e3440',
					titleColor: '#d8dee9',
					bodyColor: '#9bf1ff',
					borderColor: 'rgba(212, 212, 255, 0.3)',
					borderWidth: 1,
					callbacks: {
						label: function(context) {
							return 'Salary: $' + context.parsed.y.toLocaleString();
						}
					}
				}
			},
			scales: {
				x: {
					grid: { color: 'rgba(212, 212, 255, 0.2)' },
					ticks: { 
						color: '#d8dee9', 
						font: { size: 12 },
						maxRotation: 45,
						minRotation: 0
					}
				},
				y: {
					grid: { color: 'rgba(212, 212, 255, 0.2)' },
					ticks: {
						color: '#d8dee9',
						font: { size: 12 },
						callback: value => '$' + value.toLocaleString()
					}
				}
			}
		}
	});
}

// Update location chart for different experience levels
function updateLocationChart(level, button) {
	// Update button states
	const locationButtons = document.querySelectorAll('#location-chart-container .experience-btn');
	locationButtons.forEach(btn => btn.classList.remove('active'));
	button.classList.add('active');
	
	currentLocationLevel = level;
	
	// Get data for selected level and sort from lowest to highest
	const levelData = locationData[level];
	const sortedEntries = Object.entries(levelData).sort((a, b) => a[1] - b[1]);
	const countryLabels = sortedEntries.map(([code, salary]) => countryNames[code]);
	const salaries = sortedEntries.map(([code, salary]) => salary);
	
	// Update chart
	locationChart.data.labels = countryLabels;
	locationChart.data.datasets[0].data = salaries;
	locationChart.update();
	
	// Update title
	document.getElementById('locationChartTitle').textContent = 
		`${level} Level AI/ML Salaries by Country (2024) - Sorted Lowest to Highest`;
}

// Update the DOMContentLoaded event listener to initialize both charts
document.addEventListener('DOMContentLoaded', function() {
	const ctx = document.getElementById('salaryChart').getContext('2d');
	
	// Initialize location chart if it exists
	if (document.getElementById('locationChart')) {
		initLocationChart();
	}
});

// Remote work salary data for Chart 3
const remoteWorkData = {
    'Entry': {
        'Remote': 48770,
        'Hybrid': 91505, 
        'In-Person': 105431
    },
    'Mid': {
        'Remote': 77667,
        'Hybrid': 129517,
        'In-Person': 148739
    },
    'Senior': {
        'Remote': 115171,
        'Hybrid': 162935,
        'In-Person': 179346
    },
    'Exec': {
        'Remote': 260000,
        'Hybrid': 224249,
        'In-Person': 196604
    }
};

let remoteChart;
let currentRemoteLevel = 'All';

// Initialize chart when page loads
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('remoteChart').getContext('2d');
    
    // Get initial data for "All" - show all experience levels grouped by work type
    const experienceLevels = ['Entry', 'Mid', 'Senior', 'Exec'];
    const workTypes = ['Remote', 'Hybrid', 'In-Person'];
    
    // Create labels like "Remote - Entry", "Remote - Mid", etc.
    const labels = [];
    const data = [];
    const colors = [];
    
    workTypes.forEach((workType, workIndex) => {
        experienceLevels.forEach((level, levelIndex) => {
            labels.push(`${workType} - ${level}`);
            data.push(remoteWorkData[level][workType]);
            // Different shades for each work type
            const baseColors = [
                'rgba(155, 241, 255, 0.8)', // Remote
                'rgba(155, 241, 255, 0.6)', // Hybrid
                '#9bf1ff'                    // In-Person
            ];
            colors.push(baseColors[workIndex]);
        });
    });
    
    remoteChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#9bf1ff',
                borderWidth: 1,
                borderRadius: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#2e3440',
                    titleColor: '#d8dee9',
                    bodyColor: '#9bf1ff',
                    borderColor: 'rgba(212, 212, 255, 0.3)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return 'Salary: $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(212, 212, 255, 0.2)' },
                    ticks: { 
                        color: '#d8dee9', 
                        font: { size: 12 }
                    }
                },
                y: {
                    grid: { color: 'rgba(212, 212, 255, 0.2)' },
                    ticks: {
                        color: '#d8dee9',
                        font: { size: 12 },
                        callback: value => '$' + value.toLocaleString()
                    }
                }
            }
        }
    });
});

// Update chart for different experience levels
function updateRemoteChart(level, button) {
    // Update button states
    const remoteButtons = document.querySelectorAll('#remote-chart-container .experience-btn');
    remoteButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    currentRemoteLevel = level;
    
    let labels, data, colors, chartTitle;
    
    if (level === 'All') {
        // Show all experience levels grouped by work type
        const experienceLevels = ['Entry', 'Mid', 'Senior', 'Exec'];
        const workTypes = ['Remote', 'Hybrid', 'In-Person'];
        
        labels = [];
        data = [];
        colors = [];
        
        workTypes.forEach((workType, workIndex) => {
            experienceLevels.forEach((expLevel, levelIndex) => {
                labels.push(`${workType} - ${expLevel}`);
                data.push(remoteWorkData[expLevel][workType]);
                // Different shades for each work type
                const baseColors = [
                    'rgba(155, 241, 255, 0.8)', // Remote
                    'rgba(155, 241, 255, 0.6)', // Hybrid
                    '#9bf1ff'                    // In-Person
                ];
                colors.push(baseColors[workIndex]);
            });
        });
        
        chartTitle = 'AI/ML Salaries by Work Type - All Experience Levels (2024)';
    } else {
        // Show single experience level
        const levelData = remoteWorkData[level];
        labels = Object.keys(levelData);
        data = Object.values(levelData);
        colors = [
            'rgba(155, 241, 255, 0.8)', // Remote
            'rgba(155, 241, 255, 0.6)', // Hybrid
            '#9bf1ff'                    // In-Person
        ];
        chartTitle = `${level} Level AI/ML Salaries by Work Type (2024)`;
    }
    
    // Update chart
    remoteChart.data.labels = labels;
    remoteChart.data.datasets[0].data = data;
    remoteChart.data.datasets[0].backgroundColor = colors;
    
    // Adjust x-axis ticks based on number of labels
    if (level === 'All') {
        remoteChart.options.scales.x.ticks.maxRotation = 45;
        remoteChart.options.scales.x.ticks.minRotation = 45;
        remoteChart.options.scales.x.ticks.font.size = 10;
    } else {
        remoteChart.options.scales.x.ticks.maxRotation = 0;
        remoteChart.options.scales.x.ticks.minRotation = 0;
        remoteChart.options.scales.x.ticks.font.size = 12;
    }
    
    remoteChart.update();
    
    // Update title
    document.getElementById('remoteChartTitle').textContent = chartTitle;
}

// Company size salary data for Chart 4
const companySizeData = {
    'Small (1-50 employees)': 132172,
    'Medium (51-500 employees)': 200923,
    'Large (501+ employees)': 160113
};

let companySizeChart;

// Initialize company size chart
function initCompanySizeChart() {
    const ctx = document.getElementById('companySizeChart').getContext('2d');
    
    // Sort data from lowest to highest for better visualization
    const sortedData = Object.entries(companySizeData).sort((a, b) => a[1] - b[1]);
    const sortedLabels = sortedData.map(([label, salary]) => label);
    const sortedSalaries = sortedData.map(([label, salary]) => salary);
    
    companySizeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedLabels,
            datasets: [{
                data: sortedSalaries,
                backgroundColor: [
                    'rgba(155, 241, 255, 0.7)', // Small - lighter
                    '#9bf1ff',                   // Medium - solid (highest)
                    'rgba(155, 241, 255, 0.8)'  // Large - medium
                ],
                borderColor: '#9bf1ff',
                borderWidth: 1,
                borderRadius: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#2e3440',
                    titleColor: '#d8dee9',
                    bodyColor: '#9bf1ff',
                    borderColor: 'rgba(212, 212, 255, 0.3)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return 'Average Salary: $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(212, 212, 255, 0.2)' },
                    ticks: { 
                        color: '#d8dee9', 
                        font: { size: 11 },
                        maxRotation: 45,
                        minRotation: 0
                    }
                },
                y: {
                    grid: { color: 'rgba(212, 212, 255, 0.2)' },
                    ticks: {
                        color: '#d8dee9',
                        font: { size: 12 },
                        callback: value => '$' + value.toLocaleString()
                    }
                }
            }
        }
    });
}

// Update your existing DOMContentLoaded event listener to include:
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize company size chart if it exists
    if (document.getElementById('companySizeChart')) {
        initCompanySizeChart();
    }
    
});