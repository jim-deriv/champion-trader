import React from "react";
import { useOrientationStore } from "@/stores/orientationStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";

export interface TradeButtonProps {
    title: string;
    label: string;
    value: string;
    title_position?: "left" | "right";
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    error?: Event | { error: string } | null;
}

export const TradeButton: React.FC<TradeButtonProps> = ({
    title,
    label,
    value,
    title_position = "left",
    className,
    onClick,
    disabled,
    loading,
    error,
}) => {
    const { isLandscape } = useOrientationStore();

    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Button
                        className={cn(
                            "flex-1 flex flex-col gap-1 text-white rounded-full h-14 px-6 py-2 [&>div]:px-2 [&_span]:text-md",
                            className
                        )}
                        variant="default"
                        onClick={onClick}
                        disabled={disabled || loading}
                    >
                        <div
                            className={cn(
                                "flex items-center w-full px-3",
                                !isLandscape
                                    ? title_position === "right"
                                        ? "justify-end"
                                        : "justify-between"
                                    : "justify-between"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <span className={cn("font-semibold", "text-base")}>{title}</span>
                                {loading && (
                                    <div
                                        data-testid="loading-spinner"
                                        className="animate-spin w-4 h-4"
                                    >
                                        <svg className="w-full h-full" viewBox="0 0 24 24">
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div
                            className={cn(
                                "flex items-center w-full px-3",
                                !isLandscape
                                    ? title_position === "left"
                                        ? "justify-between"
                                        : "justify-between flex-row-reverse"
                                    : "justify-between"
                            )}
                        >
                            <span className="text-[12px]">{value}</span>
                            <span className="text-[12px]">{label}</span>
                        </div>
                    </Button>
                </Tooltip.Trigger>
                {error && (
                    <Tooltip.Portal>
                        <Tooltip.Content
                            className="bg-black/90 shadow-lg text-white px-3 py-2 rounded text-xs max-w-[200px] z-[999] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                            side="bottom"
                            sideOffset={8}
                            align="center"
                        >
                            {error instanceof Event
                                ? "Failed to get price"
                                : error?.error || "Failed to get price"}
                            <Tooltip.Arrow className="fill-black/90" />
                        </Tooltip.Content>
                    </Tooltip.Portal>
                )}
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};
