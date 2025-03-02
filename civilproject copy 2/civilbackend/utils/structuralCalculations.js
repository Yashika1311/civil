// Utility functions for structural calculations

// Calculate unit weight of steel bar
const calculateBarUnitWeight = (diameter, length) => {
    return (Math.pow(diameter, 2) / 162) * length;
};

// Calculate number of stirrups
const calculateStirrupCount = (length, spacing) => {
    return Math.floor(length / spacing) + 1;
};

// Beam calculations
const calculateBeam = (dimensions, reinforcement) => {
    // Concrete Volume Calculation
    const { length, width, depth } = dimensions;
    const concreteVolume = (length * width * depth) / 1000000000; // Convert mm³ to m³

    // Steel Calculations
    const mainBars = reinforcement.mainBars;
    const stirrups = reinforcement.stirrups;

    // Main Bars Calculation
    const unitWeightPerMeter = (mainBars.diameter * mainBars.diameter) / 162; // kg/m
    const mainBarLength = length - (2 * stirrups.cover); // Effective length considering cover
    const totalMainBarLength = mainBarLength * mainBars.count / 1000; // Convert to meters
    const mainBarsWeight = unitWeightPerMeter * totalMainBarLength;

    // Stirrups Calculation
    const numberOfStirrups = Math.floor(length / stirrups.spacing) + 1;
    const stirrupPerimeter = 2 * (width - 2 * stirrups.cover) + 2 * (depth - 2 * stirrups.cover);
    const totalStirrupLength = (numberOfStirrups * stirrupPerimeter) / 1000; // Convert to meters
    const stirrupUnitWeight = (stirrups.diameter * stirrups.diameter) / 162; // kg/m
    const stirrupsWeight = stirrupUnitWeight * totalStirrupLength;

    // Total Steel Weight
    const totalSteelWeight = mainBarsWeight + stirrupsWeight;
    const steelPercentage = (totalSteelWeight / (concreteVolume * 2400)) * 100; // Assuming concrete density = 2400 kg/m³

    return {
        concrete: {
            volume: concreteVolume,
            unit: 'm³'
        },
        steel: {
            mainBars: {
                count: mainBars.count,
                diameter: mainBars.diameter,
                totalLength: mainBarLength,
                weight: mainBarsWeight,
                unitWeight: unitWeightPerMeter
            },
            stirrups: {
                count: numberOfStirrups,
                diameter: stirrups.diameter,
                spacing: stirrups.spacing,
                perimeter: stirrupPerimeter,
                totalLength: totalStirrupLength * 1000, // Convert back to mm for display
                weight: stirrupsWeight
            },
            totalWeight: totalSteelWeight,
            percentage: steelPercentage,
            unit: 'kg'
        }
    };
};

// Column calculations
const calculateColumn = (dimensions, reinforcement) => {
    const { length, width, height } = dimensions;
    const { mainBars, ties } = reinforcement;

    // Concrete volume in m³
    const concreteVolume = (length * width * height) / 1000000000;

    // Main bars calculation
    const mainBarLength = height + 50; // Adding 50mm for development length
    const mainBarWeight = calculateBarUnitWeight(mainBars.diameter, mainBarLength);
    const totalMainBarWeight = mainBarWeight * mainBars.count;

    // Ties calculation
    const tieCount = calculateStirrupCount(height, ties.spacing);
    const tiePerimeter = 2 * (length + width - 4 * ties.cover);
    const totalTieLength = tieCount * tiePerimeter;
    const tieWeight = calculateBarUnitWeight(ties.diameter, totalTieLength);

    // Total steel weight
    const totalSteelWeight = totalMainBarWeight + tieWeight;

    // Steel percentage
    const steelPercentage = (totalSteelWeight / (concreteVolume * 7850)) * 100;

    return {
        concrete: {
            volume: concreteVolume,
            unit: 'm³'
        },
        steel: {
            mainBars: {
                weight: totalMainBarWeight,
                length: mainBarLength,
                count: mainBars.count
            },
            ties: {
                count: tieCount,
                totalLength: totalTieLength,
                weight: tieWeight
            },
            totalWeight: totalSteelWeight,
            unit: 'kg',
            percentage: steelPercentage
        }
    };
};

// Footing calculations
const calculateFooting = (dimensions, reinforcement, type = 'rectangular') => {
    const { length, width, depth, topLength, topWidth } = dimensions;
    const { mainBars } = reinforcement;

    let concreteVolume;
    if (type === 'rectangular') {
        concreteVolume = (length * width * depth) / 1000000000;
    } else if (type === 'trapezoidal') {
        const A1 = length * width;
        const A2 = topLength * topWidth;
        concreteVolume = (depth * (A1 + A2 + Math.sqrt(A1 * A2))) / (3 * 1000000000);
    }

    // Main bars calculation (in both directions)
    const barsLengthDirection = Math.floor(width / mainBars.spacing) + 1;
    const barsWidthDirection = Math.floor(length / mainBars.spacing) + 1;
    
    const totalBarLength = (barsLengthDirection * length) + (barsWidthDirection * width);
    const mainBarWeight = calculateBarUnitWeight(mainBars.diameter, totalBarLength);

    // Steel percentage
    const steelPercentage = (mainBarWeight / (concreteVolume * 7850)) * 100;

    return {
        concrete: {
            volume: concreteVolume,
            unit: 'm³'
        },
        steel: {
            mainBars: {
                lengthDirection: barsLengthDirection,
                widthDirection: barsWidthDirection,
                totalLength: totalBarLength,
                weight: mainBarWeight
            },
            totalWeight: mainBarWeight,
            unit: 'kg',
            percentage: steelPercentage
        }
    };
};

// Slab calculations
const calculateSlab = (dimensions, reinforcement) => {
    const { length, width, depth } = dimensions;
    const { mainBars, distributionBars } = reinforcement;

    // Concrete volume
    const concreteVolume = (length * width * depth) / 1000000000;

    // Main bars calculation
    const mainBarCount = Math.floor(width / mainBars.spacing) + 1;
    const mainBarTotalLength = mainBarCount * length;
    const mainBarWeight = calculateBarUnitWeight(mainBars.diameter, mainBarTotalLength);

    // Distribution bars calculation
    const distBarCount = Math.floor(length / distributionBars.spacing) + 1;
    const distBarTotalLength = distBarCount * width;
    const distBarWeight = calculateBarUnitWeight(distributionBars.diameter, distBarTotalLength);

    // Total steel weight
    const totalSteelWeight = mainBarWeight + distBarWeight;

    // Steel percentage
    const steelPercentage = (totalSteelWeight / (concreteVolume * 7850)) * 100;

    return {
        concrete: {
            volume: concreteVolume,
            unit: 'm³'
        },
        steel: {
            mainBars: {
                count: mainBarCount,
                totalLength: mainBarTotalLength,
                weight: mainBarWeight
            },
            distributionBars: {
                count: distBarCount,
                totalLength: distBarTotalLength,
                weight: distBarWeight
            },
            totalWeight: totalSteelWeight,
            unit: 'kg',
            percentage: steelPercentage
        }
    };
};

module.exports = {
    calculateBeam,
    calculateColumn,
    calculateFooting,
    calculateSlab,
    calculateBarUnitWeight,
    calculateStirrupCount
};
