"use client";

import { useFormStatus } from "react-dom";
import { Search, Loader2, Smartphone, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type LookupFormProps = {
  formAction: (payload: FormData) => void;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Searching...
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" />
          Search
        </>
      )}
    </Button>
  );
}

export function LookupForm({ formAction }: LookupFormProps) {
    const { pending } = useFormStatus();
    return (
        <Card className="shadow-2xl shadow-primary/10 border-border/50 bg-card/50 backdrop-blur-lg">
        <CardHeader>
            <CardTitle>Enter Query</CardTitle>
            <CardDescription>
            Provide a 13-digit CNIC or a mobile number (e.g., 923001234567).
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form action={formAction} className="space-y-4">
            <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <span className="mx-1 text-muted-foreground">/</span>
                <Fingerprint className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                name="query"
                id="query"
                type="text"
                placeholder="e.g., 92300-xxxxxxx or 42101-xxxxxxx-x"
                required
                className="pl-16 text-lg bg-transparent flex-grow"
                disabled={pending}
                />
            </div>
            <div className="flex justify-end">
                <SubmitButton />
            </div>
            </form>
        </CardContent>
        </Card>
    );
}
