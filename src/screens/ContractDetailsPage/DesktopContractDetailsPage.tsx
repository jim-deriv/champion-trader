import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMainLayoutStore } from "@/stores/mainLayoutStore";
import { WrappedContractDetailsChart } from "@/components/ContractDetailsChart";
import { useContractDetails } from "@/hooks/contract/useContract";
import { X } from "lucide-react";
import { ContractSummary, OrderDetails, EntryExitDetails } from "./components";
import { useTradeStore } from "@/stores/tradeStore";
import { useTradeActions } from "@/hooks/useTradeActions";

const DesktopContractDetailsPage: React.FC = () => {
    const { setSideNavVisible, theme } = useMainLayoutStore();
    const navigate = useNavigate();
    const { contract_id } = useParams<{ contract_id: string }>();
    const { contract, loading, error } = useContractDetails(contract_id || "");
    const contractDetails = useTradeStore((state) => state.contractDetails);
    const tradeActions = useTradeActions();
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Hide SideNav when component mounts
        setSideNavVisible(false);

        // Show SideNav when component unmounts
        return () => setSideNavVisible(true);
    }, [setSideNavVisible]);

    const handleCloseContract = async () => {
        if (!contractDetails?.contract_id) return;

        try {
            await tradeActions.sell_contract(contractDetails.contract_id, contractDetails, {
                setLoading: setIsClosing,
            });
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    return (
        <div
            className="flex flex-col bg-theme-secondary w-full"
            data-testid="desktop-contract-details"
        >
            <div className="flex justify-between items-center p-4 bg-theme">
                <h1 className="text-xl font-bold mx-auto">Contract details</h1>
                <button onClick={() => navigate(-1)} className="text-theme-muted">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden relative m-4">
                <div className="w-[320px] flex flex-col" data-testid="left-panel">
                    <div
                        className="flex-1 overflow-y-auto pb-20 space-y-4 bg-theme-secondary scrollbar-thin"
                        data-testid="content-area"
                    >
                        {loading ? (
                            <div className="space-y-4">
                                <div className="h-[104px] w-full p-4 bg-theme rounded-lg border-b border-theme flex items-center justify-center">
                                    <p>Loading contract details...</p>
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
                                <OrderDetails contract={contract} />
                                <EntryExitDetails contract={contract} />
                            </>
                        )}
                    </div>
                    {/* Close Button - Only shown if contract is not sold/expired */}
                    {!loading &&
                        contract &&
                        !contract.details.is_sold &&
                        !contract.details.is_expired && (
                            <div
                                className="absolute bottom-0 left-0 right-0 m-4 w-[290px] b-[55px]"
                                data-testid="close-button-container"
                            >
                                <div className="max-w-[1200px] mx-auto">
                                    <button
                                        onClick={handleCloseContract}
                                        className="w-full bg-action-button text-action-button py-3 rounded-lg disabled:opacity-50"
                                    >
                                        {isClosing
                                            ? "Closing..."
                                            : `Close ${contractDetails?.bid_price || ""} ${contractDetails?.bid_price_currency || ""}`}
                                    </button>
                                </div>
                            </div>
                        )}
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="ml-4 h-full">
                        <WrappedContractDetailsChart
                            contractId={undefined}
                            isReplay={true}
                            is_dark_theme={theme === "dark"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopContractDetailsPage;
