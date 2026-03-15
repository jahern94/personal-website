import { Recipe } from "@/lib/lemonade/types";
import { calculateQuality, calculateCostPerCup, formatMoney } from "@/lib/lemonade/engine";

interface RecipeEditorProps {
  recipe: Recipe;
  onChange: (recipe: Recipe) => void;
}

const RECIPE_FIELDS: {
  key: keyof Pick<Recipe, "lemonsPerPitcher" | "sugarPerPitcher" | "icePerCup">;
  label: string;
  min: number;
  max: number;
  ideal: number;
  unit: string;
}[] = [
  { key: "lemonsPerPitcher", label: "Lemons", min: 1, max: 8, ideal: 4, unit: "per pitcher" },
  { key: "sugarPerPitcher", label: "Sugar", min: 1, max: 6, ideal: 3, unit: "cups per pitcher" },
  { key: "icePerCup", label: "Ice", min: 1, max: 5, ideal: 3, unit: "cubes per cup" },
];

export default function RecipeEditor({ recipe, onChange }: RecipeEditorProps) {
  const quality = calculateQuality(recipe);
  const costPerCup = calculateCostPerCup(recipe);

  function adjust(key: keyof Recipe, delta: number) {
    const field = RECIPE_FIELDS.find((f) => f.key === key);
    if (!field) return;
    const newVal = Math.max(field.min, Math.min(field.max, recipe[key] + delta));
    onChange({ ...recipe, [key]: newVal });
  }

  const qualityColor =
    quality >= 80
      ? "text-green-600 dark:text-green-400"
      : quality >= 50
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">
        Recipe
      </h3>
      <div className="space-y-3">
        {RECIPE_FIELDS.map((field) => (
          <div key={field.key} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {field.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{field.unit}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjust(field.key, -1)}
                disabled={recipe[field.key] <= field.min}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold text-gray-900 dark:text-gray-100">
                {recipe[field.key]}
              </span>
              <button
                onClick={() => adjust(field.key, 1)}
                disabled={recipe[field.key] >= field.max}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quality and cost summary */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Quality</p>
          <p className={`font-bold ${qualityColor}`}>{quality}/100</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 dark:text-gray-400">Cost per Cup</p>
          <p className="font-bold text-gray-900 dark:text-gray-100">
            {formatMoney(costPerCup)}
          </p>
        </div>
      </div>
    </div>
  );
}
