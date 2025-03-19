import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContractDetails } from "@/hooks/contract/useContract";
import { useHeaderStore } from "@/stores/headerStore";
import { useBottomNavStore } from "@/stores/bottomNavStore";
import DesktopContractDetailsPage from "./DesktopContractDetailsPage";
import { Header, ContractSummary, OrderDetails, EntryExitDetails } from "./components";
import { ContractDetailsChart } from "@/components/ContractDetailsChart/ContractDetailsChart";
import { useOrientationStore } from "@/stores/orientationStore";
import { useTradeStore } from "@/stores/tradeStore";
import { useTradeActions } from "@/hooks/useTradeActions";

const MobileContractDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { contract_id } = useParams<{ contract_id: string }>();
    const { contract, loading, error } = useContractDetails(contract_id || "");
    const setHeaderVisible = useHeaderStore((state) => state.setIsVisible);
    const setBottomNavVisible = useBottomNavStore((state) => state.setIsVisible);
    const contractDetails = useTradeStore((state) => state.contractDetails);
    const tradeActions = useTradeActions();
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        setHeaderVisible(false);
        setBottomNavVisible(false);
        return () => {
            setHeaderVisible(true);
            setBottomNavVisible(true);
        };
    }, [setHeaderVisible, setBottomNavVisible]);

    const handleCloseContract = async () => {
        if (!contractDetails?.contract_id) return;

        try {
            await tradeActions.sell_contract(contractDetails.contract_id, contractDetails, {
                setLoading: setIsClosing,
                onSuccess: () => navigate(-1),
                onError: (error: unknown) => console.error("Error closing contract:", error),
            });
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    return (
        <div className="w-full bg-theme-secondary h-screen flex flex-col">
            <Header />
            <div className="flex-1 overflow-y-auto w-full lg:w-3/5 mx-auto">
                <div className="p-2 pb-[72px]">
                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-[104px] w-full p-4 bg-theme rounded-lg border-b border-theme flex items-center justify-center">
                                <p>Loading contract details...</p>
                            </div>
                            <div className="min-h-[400px] mt-4 bg-theme rounded-lg">
                                <div className="h-full flex items-center justify-center">
                                    <p>Loading chart...</p>
                                </div>
                            </div>
                            <div className="mt-4 p-4 bg-theme rounded-lg border-b border-theme flex items-center justify-center">
                                <p>Loading order details...</p>
                            </div>
                            <div className="mt-4 p-4 bg-theme rounded-lg border-b border-theme flex items-center justify-center">
                                <p>Loading entry & exit details...</p>
                            </div>
                        </div>
                    ) : error || !contract ? (
                        <div className="space-y-4">
                            <div className="h-[104px] w-full p-4 bg-theme rounded-lg border-b border-theme flex items-center justify-center">
                                <p>Failed to load contract details</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <ContractSummary contract={contract} />
                            <div className="min-h-[400px] mt-4">
                                <ContractDetailsChart contract={contract} />
                            </div>
                            <OrderDetails contract={contract} />
                            <EntryExitDetails contract={contract} />
                        </>
                    )}
                </div>

                {/* Close Button */}
                <div className="fixed bottom-1 left-0 right-0 z-[60]">
                    <div className="mx-2 my-2 text-center">
                        <button
                            onClick={handleCloseContract}
                            disabled={
                                isClosing ||
                                !contractDetails?.contract_id ||
                                !contractDetails?.is_valid_to_sell ||
                                contractDetails?.is_sold
                            }
                            className="text-action-button bg-action-button max-w-[500px] mx-auto w-full p-3 px-8 text-center rounded-xl shadow-md disabled:text-theme-muted"
                        >
                            {isClosing
                                ? "Closing..."
                                : `Close ${contractDetails?.bid_price || ""} ${contractDetails?.bid_price_currency || ""}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContractDetailsPage: React.FC = () => {
    const { isLandscape } = useOrientationStore();
    return !isLandscape ? <MobileContractDetailsPage /> : <DesktopContractDetailsPage />;
};

export default ContractDetailsPage;
