import { model, Schema, models } from "mongoose";

// Category model
const CategorySchema = new Schema({
    name: {type: String, required: true},
});

export const Category = models?.Category || model('Category', CategorySchema);