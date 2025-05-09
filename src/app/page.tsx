"use client";

import React from "react";

import { loglib } from "@loglib/tracker";
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
    loglib.track("copy-portfolio-link-button-clicked");
    navigator.clipboard.writeText(portfolioLinks[currentPortfolioIndex] ?? "");
    setCopiedLink(portfolioLinks[currentPortfolioIndex] ?? null);

    setTimeout(() => {
      setCopiedLink(null);
    }, 2000);
  }

  function handleRandom() {
    loglib.track("random-portfolio-button-clicked");
    setIsLoading(true);
    setCurrentPortfolioIndex(Math.floor(Math.random() * portfolioLinks.length));
  }

  const isCopied =
    currentPortfolioIndex &&
    copiedLink === portfolioLinks[currentPortfolioIndex];

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between pt-4 px-4 md:px-8">
        <div className="flex items-center gap-2 text-neutral-300">
          <Icons.logo className="w-6 h-6" />
          <span className="text-lg font-semibold">XPortfolio Explorer</span>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <Button
            variant="outline"
            className="h-7 text-neutral-400 px-2"
            onClick={handleRandom}
          >
            <DicesIcon className="!w-3" />
            Random
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 text-neutral-400"
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
              className="h-7 w-20 text-center text-sm"
            />
            <span className="text-neutral-400 text-sm">
              of {portfolioLinks.length}
            </span>
          </div>
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
          <TwitterShareButton
            url={portfolioLinks[currentPortfolioIndex] ?? ""}
            title="Check out this amazing portfolio"
          >
            <Button variant="outline" className="h-7 text-neutral-400 px-2">
              <ShareIcon className="!w-3" />
              Share on X
            </Button>
          </TwitterShareButton>
        </div>
        <div></div>
      </header>
      <div className="w-full flex-1 p-4">
        <div className="border-[3px] border-dashed w-full h-full rounded-lg overflow-hidden relative">
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
