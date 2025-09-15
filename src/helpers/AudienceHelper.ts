import { DemographicInsights } from '@/models/dtos/InstagramInsights';

export default function calculateGenderPercentages(
  data: DemographicInsights[] | null | undefined,
  femaleCode = 'F',
  maleCode = 'M'
) {
  let totalFemales = 0;
  let totalMales = 0;

  data?.forEach((entry) => {
    entry.total_value.breakdowns.forEach((breakdown) => {
      breakdown.results.forEach((result) => {
        // Check if the gender matches the female or male code and add the value to the respective total
        if (result.dimension_values[1] === femaleCode) {
          totalFemales += result.value;
        } else if (result.dimension_values[1] === maleCode) {
          totalMales += result.value;
        }
      });
    });
  });

  const total = totalFemales + totalMales;
  const femalePercentage = ((totalFemales / total) * 100).toFixed(2);
  const malePercentage = ((totalMales / total) * 100).toFixed(2);

  return { femalePercentage, malePercentage };
}
