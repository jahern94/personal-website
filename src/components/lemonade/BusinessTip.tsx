import { BusinessTip as BusinessTipType } from "@/lib/lemonade/types";

interface BusinessTipProps {
  tip: BusinessTipType;
}

export default function BusinessTip({ tip }: BusinessTipProps) {
  return (
    <div className="bg-amber-50 dark:bg-amber-950 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{"\u{1F4A1}"}</span>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-200">
              {tip.title}
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-xs font-medium text-amber-700 dark:text-amber-300">
              {tip.concept}
            </span>
          </div>
          <p className="text-sm text-amber-900 dark:text-amber-100">{tip.message}</p>
        </div>
      </div>
    </div>
  );
}
