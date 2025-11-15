import { ResultsSkeleton } from "@/components/results-skeleton";

export default function Loading() {
    return (
        <main className="flex min-h-full flex-col items-center justify-center p-4 sm:p-8 bg-background">
            <div className="w-full max-w-4xl space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-primary font-headline">
                        PAKOSINT INTEL
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Pakistan Phone number and CNIC details lookup
                    </p>
                </div>
                <div className="h-10 bg-muted rounded-md animate-pulse"></div>
                <ResultsSkeleton />
            </div>
        </main>
    );
}
