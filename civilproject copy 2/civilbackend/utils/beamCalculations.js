// Utility functions for beam calculations

const calculateBeam = (dimensions, reinforcement) => {
    // Concrete Volume Calculation: V = L × B × D
    const { length, width, depth } = dimensions;
    const concreteVolume = (length * width * depth) / 1000000000; // Convert mm³ to m³

    // Steel Calculations
    const mainBars = reinforcement.mainBars;
    const stirrups = reinforcement.stirrups;

    // Main Bars Calculation
    // Unit Weight of Bar Formula: W = (d² / 162) × L, where d is diameter in mm
    const unitWeightPerMeter = (mainBars.diameter * mainBars.diameter) / 162; // kg/m
    const mainBarLength = length - (2 * stirrups.cover); // Effective length considering cover
    const totalMainBarLength = mainBarLength * mainBars.count / 1000; // Convert to meters
    const mainBarsWeight = unitWeightPerMeter * totalMainBarLength;

    // Stirrups Calculation
    // Number of Stirrups = (Beam Length / Spacing) + 1
    const numberOfStirrups = Math.floor(length / stirrups.spacing) + 1;
    // Stirrup perimeter = 2(width + depth - 4 × cover)
    const stirrupPerimeter = 2 * (width - 2 * stirrups.cover) + 2 * (depth - 2 * stirrups.cover);
    const totalStirrupLength = (numberOfStirrups * stirrupPerimeter) / 1000; // Convert to meters
    const stirrupUnitWeight = (stirrups.diameter * stirrups.diameter) / 162; // kg/m
    const stirrupsWeight = stirrupUnitWeight * totalStirrupLength;

    // Total Steel Weight
    const totalSteelWeight = mainBarsWeight + stirrupsWeight;
    // Steel percentage = (Steel Weight / (Concrete Volume × Concrete Density)) × 100
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

module.exports = {
    calculateBeam
};
