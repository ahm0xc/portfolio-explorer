"use client";

import React from "react";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
} from "lucide-react";
import useLocalStorage from "use-local-storage";

import { Button } from "~/components/ui/button";
import { portfolioLinks } from "~/data/portfolios";

export default function HomePage() {
  const [view, setView] = React.useState<"all">("all");
  const [copiedLink, setCopiedLink] = React.useState<string | null>(null);

  const [currentPortfolioIndex, setCurrentPortfolioIndex] =
    useLocalStorage<number>("current-portfolio-index", 0);

  function handleBack() {
    if (currentPortfolioIndex !== null && currentPortfolioIndex > 0) {
      setCurrentPortfolioIndex(currentPortfolioIndex - 1);
    }
  }

  function handleForward() {
    if (currentPortfolioIndex < portfolioLinks.length - 1) {
      setCurrentPortfolioIndex(currentPortfolioIndex + 1);
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(portfolioLinks[currentPortfolioIndex] ?? "");
    setCopiedLink(portfolioLinks[currentPortfolioIndex] ?? null);

    setTimeout(() => {
      setCopiedLink(null);
    }, 2000);
  }

  const isCopied =
    currentPortfolioIndex &&
    copiedLink === portfolioLinks[currentPortfolioIndex];

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-center pt-4 flex-col">
        <div className="flex items-center gap-2 w-full justify-center">
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 text-neutral-400"
            onClick={handleBack}
          >
            <ArrowLeftIcon className="!w-3" />
          </Button>
          <p className="text-neutral-400 text-sm">
            {currentPortfolioIndex !== null ? currentPortfolioIndex + 1 : 0} of{" "}
            {portfolioLinks.length}
          </p>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 text-neutral-400"
            onClick={handleForward}
          >
            <ArrowRightIcon className="!w-3" />
          </Button>
          <Button
            variant="outline"
            className="h-7 text-neutral-400 px-2"
            onClick={handleCopyLink}
          >
            {isCopied ? (
              <CheckIcon className="!w-3" />
            ) : (
              <CopyIcon className="!w-3" />
            )}
            Copy Link
          </Button>
        </div>
      </header>
      <div className="w-full flex-1 p-4">
        <div className="border w-full h-full rounded-lg overflow-hidden">
          {currentPortfolioIndex !== null && (
            <iframe
              src={portfolioLinks[currentPortfolioIndex]}
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
