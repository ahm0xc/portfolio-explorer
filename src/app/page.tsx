"use client";

import React from "react";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import useLocalStorage from "use-local-storage";

import { Button } from "~/components/ui/button";
import { portfolioLinks } from "~/data/portfolios";

export default function HomePage() {
  const [view, setView] = React.useState<"all">("all");
  const [filteredPortfolioLinks, setFilteredPortfolioLinks] =
    React.useState<typeof portfolioLinks>(portfolioLinks);

  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useLocalStorage<
    number | null
  >("current-portfolio-index", null);

  function handleBack() {
    if (currentPortfolioIndex !== null && currentPortfolioIndex > 0) {
      setCurrentPortfolioIndex(currentPortfolioIndex - 1);
    }
  }

  function handleForward() {
    if (
      currentPortfolioIndex !== null &&
      currentPortfolioIndex < filteredPortfolioLinks.length - 1
    ) {
      setCurrentPortfolioIndex(currentPortfolioIndex + 1);
    }
  }

  React.useEffect(() => {
    setFilteredPortfolioLinks(portfolioLinks);

    if (filteredPortfolioLinks.length > 0) {
      setCurrentPortfolioIndex(0);
    } else {
      setCurrentPortfolioIndex(null);
    }
  }, [view]);

  React.useEffect(() => {
    if (
      currentPortfolioIndex !== null &&
      currentPortfolioIndex >= filteredPortfolioLinks.length
    ) {
      setCurrentPortfolioIndex(filteredPortfolioLinks.length > 0 ? 0 : null);
    }
  }, [filteredPortfolioLinks, currentPortfolioIndex]);

  return (
    <div className="h-screen flex flex-col gap-2">
      <header className="flex items-center justify-center pt-4 flex-col">
        <div className="flex items-center gap-2 w-full justify-center">
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 text-neutral-400"
            onClick={handleBack}
          >
            <ArrowLeftIcon className="w-2 h-2" />
          </Button>
          <p className="text-neutral-400 text-sm">
            {currentPortfolioIndex !== null ? currentPortfolioIndex + 1 : 0} of{" "}
            {filteredPortfolioLinks.length}
          </p>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 text-neutral-400"
            onClick={handleForward}
          >
            <ArrowRightIcon className="w-2 h-2" />
          </Button>
        </div>
      </header>
      <div className="w-full flex-1 p-4 pt-0">
        <div className="border w-full h-full rounded-lg overflow-hidden">
          {currentPortfolioIndex !== null && (
            <iframe
              src={filteredPortfolioLinks[currentPortfolioIndex]}
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
