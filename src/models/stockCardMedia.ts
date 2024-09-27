import mongoose, { Schema, Document } from 'mongoose';

export interface IStockCardImage extends Document {
  stockCardId: string;
  imageUrl: string;
  isDefault: boolean;
}

export interface IStockCardVideo extends Document {
  stockCardId: string;
  videoUrl: string;
}

const StockCardImageSchema: Schema = new Schema({
  stockCardId: { type: String, required: true, index: true },
  imageUrl: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

const StockCardVideoSchema: Schema = new Schema({
  stockCardId: { type: String, required: true, index: true },
  videoUrl: { type: String, required: true }
}, { timestamps: true });

export const StockCardImage = mongoose.model<IStockCardImage>('StockCardImage', StockCardImageSchema);
export const StockCardVideo = mongoose.model<IStockCardVideo>('StockCardVideo', StockCardVideoSchema);