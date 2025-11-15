"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

import { lookupAction } from "@/app/actions";
import { LookupForm } from "@/components/lookup-form";
import { ResultsTable } from "@/components/results-table";
import { ResultsSkeleton } from "@/components/results-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Database } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(lookupAction, {
    data: null,
    error: null,
    loading: false,
  });

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-4 sm:p-8 bg-background relative overflow-hidden">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-background to-secondary/30 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        <motion.div 
            className="w-full max-w-4xl space-y-8 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center">
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight gradient-text">
                    PAKOSINT INTEL
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Pakistan Phone number and CNIC details lookup
                </p>
            </div>

            <LookupForm formAction={formAction} />

            <motion.div 
                className="min-h-[300px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
            {state.loading ? (
                <ResultsSkeleton />
            ) : state.data ? (
                <>
                {state.data.results.length > 0 ? (
                    <ResultsTable results={state.data.results} />
                ) : (
                    <Alert className="bg-card/50 backdrop-blur-sm">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>No Results</AlertTitle>
                    <AlertDescription>
                        Your query for "{state.data.query}" did not return any results.
                    </AlertDescription>
                    </Alert>
                )}
                <p className="text-center text-sm text-muted-foreground mt-4">
                    {state.data.copyright}
                </p>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full pt-10 text-center">
                    <Database className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">Enter a query to see results.</p>
                    <p className="text-sm text-muted-foreground/80">Your search results will appear here.</p>
                </div>
            )}
            </motion.div>
      </motion.div>
    </main>
  );
}
