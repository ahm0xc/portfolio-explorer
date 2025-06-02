"use client";

import React from "react";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  DicesIcon,
  LoaderIcon,
  ShareIcon,
} from "lucide-react";
import { TwitterShareButton } from "react-share";
import useLocalStorage from "use-local-storage";

import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { portfolioLinks } from "~/data/portfolios";

export default function HomePage() {
  const [view, setView] = React.useState<"all">("all");
  const [copiedLink, setCopiedLink] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [inputValue, setInputValue] = React.useState("");

  const [currentPortfolioIndex, setCurrentPortfolioIndex] =
    useLocalStorage<number>("current-portfolio-index", 0);

  React.useEffect(() => {
    setInputValue(String(currentPortfolioIndex + 1));
  }, [currentPortfolioIndex]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const newIndex = parseInt(inputValue) - 1;
      if (
        !isNaN(newIndex) &&
        newIndex >= 0 &&
        newIndex < portfolioLinks.length
      ) {
        setIsLoading(true);
        setCurrentPortfolioIndex(newIndex);
      } else {
        setInputValue(String(currentPortfolioIndex + 1));
      }
    }
  }

  function handleInputBlur() {
    setInputValue(String(currentPortfolioIndex + 1));
  }

  function handleBack() {
    if (currentPortfolioIndex !== null && currentPortfolioIndex > 0) {
      setIsLoading(true);
      setCurrentPortfolioIndex(currentPortfolioIndex - 1);
    }
  }

  function handleForward() {
    if (currentPortfolioIndex < portfolioLinks.length - 1) {
      setIsLoading(true);
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

  function handleRandom() {
    setIsLoading(true);
    setCurrentPortfolioIndex(Math.floor(Math.random() * portfolioLinks.length));
  }

  const isCopied =
    currentPortfolioIndex &&
    copiedLink === portfolioLinks[currentPortfolioIndex];

  return (
    <div className="h-screen flex flex-col">
      <header className="pt-4 px-4 md:px-8 space-y-3 md:space-y-0">
        {/* Logo row */}
        <div className="flex items-center justify-center md:justify-start">
          <div className="flex items-center gap-2 text-neutral-300">
            <Icons.logo className="w-6 h-6" />
            <span className="text-lg font-semibold">XPortfolio Explorer</span>
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-center">
          {/* Top row on mobile: Random + Navigation */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              className="h-8 md:h-7 text-neutral-400 px-3 text-xs md:text-sm"
              onClick={handleRandom}
            >
              <DicesIcon className="!w-3" />
              <span className="hidden sm:inline ml-1">Random</span>
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 md:h-7 md:w-7 text-neutral-400"
              onClick={handleBack}
            >
              <ArrowLeftIcon className="!w-3" />
            </Button>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min={1}
                max={portfolioLinks.length}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onBlur={handleInputBlur}
                className="h-8 md:h-7 w-16 md:w-20 text-center text-xs md:text-sm"
              />
              <span className="text-neutral-400 text-xs md:text-sm whitespace-nowrap">
                of {portfolioLinks.length}
              </span>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 md:h-7 md:w-7 text-neutral-400"
              onClick={handleForward}
            >
              <ArrowRightIcon className="!w-3" />
            </Button>
          </div>

          {/* Bottom row on mobile: Action buttons */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              className="h-8 md:h-7 text-neutral-400 px-3 text-xs md:text-sm flex-1 sm:flex-none"
              onClick={handleCopyLink}
            >
              {isCopied ? (
                <CheckIcon className="!w-3" />
              ) : (
                <CopyIcon className="!w-3" />
              )}
              <span className="ml-1">Copy</span>
            </Button>
            <TwitterShareButton
              url={portfolioLinks[currentPortfolioIndex] ?? ""}
              title="Check out this amazing portfolio"
            >
              <Button
                variant="outline"
                className="h-8 md:h-7 text-neutral-400 px-3 text-xs md:text-sm flex-1 sm:flex-none"
              >
                <ShareIcon className="!w-3" />
                <span className="ml-1">Share</span>
              </Button>
            </TwitterShareButton>
          </div>
        </div>
      </header>
      <div className="w-full flex-1 p-2 md:p-4">
        <div className="border-[2px] md:border-[3px] border-dashed w-full h-full rounded-lg overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <LoaderIcon className="animate-spin text-neutral-400 w-8" />
            </div>
          )}
          <iframe
            src={portfolioLinks[currentPortfolioIndex]}
            className="w-full h-full"
            onLoad={(e) => {
              const iframe = e.target as HTMLIFrameElement;
              try {
                // Access the iframe's document to check if it's loaded
                if (iframe.contentDocument?.readyState === "complete") {
                  setIsLoading(false);
                } else {
                  iframe.contentWindow?.addEventListener("load", () => {
                    setIsLoading(false);
                  });
                }
              } catch (error) {
                // If we can't access the iframe content (due to same-origin policy),
                // just hide the loading state
                setIsLoading(false);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
