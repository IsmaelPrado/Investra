import { Asset } from "../../../models/Simulation/assetModel";
import { BuyAsset } from "../../../models/Simulation/buyAssetsModel";

export interface PriceUpdateStrategy {
    updatePrice(asset: Asset): Promise<Asset>;
}

export interface InvestmentUpdateStrategy {
    updateInvestments(asset: Asset, newPrice: number, timestamp: Date): Promise<BuyAsset[]>;
}