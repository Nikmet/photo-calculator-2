import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type CalculatorLoadingProps = {
  inputRows: number;
  resultRows: number;
};

export function CalculatorLoading({ inputRows, resultRows }: CalculatorLoadingProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="space-y-4 lg:col-span-2">
        <Skeleton className="h-5 w-44" />
        <div className="grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 md:grid-cols-2">
          {Array.from({ length: inputRows }).map((_, index) => (
            <div key={`input-skeleton-${index}`} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <Skeleton className="h-5 w-28" />
        {Array.from({ length: resultRows }).map((_, index) => (
          <Skeleton key={`result-skeleton-${index}`} className="h-[52px] w-full" />
        ))}
      </Card>
    </div>
  );
}
