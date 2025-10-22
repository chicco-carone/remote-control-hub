"use client";

// CategoryNotFound.tsx

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

/**
 * Shown when the category is not found or has no devices.
 */
interface CategoryNotFoundProps {
  categoryName: string;
}

const CategoryNotFound: React.FC<CategoryNotFoundProps> = ({
  categoryName,
}) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div
              onClick={() => router.push("/")}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push("/");
              }}
            >
              <Button variant="ghost" size="sm">
                <span className="mr-2">&#8592;</span>
                Back
              </Button>
            </div>
            <h1 className="text-2xl font-bold">Category Not Found</h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">
            Category &quot;{categoryName}&quot; not found
          </h2>
          <p className="text-muted-foreground mb-4">
            This category doesn&apos;t exist or has no devices yet.
          </p>
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push("/");
            }}
          >
            <Button>Browse All Categories</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryNotFound;
